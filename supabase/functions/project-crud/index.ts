// supabase/functions/project-crud/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { supabaseAdmin, createCorsHeaders, handleOptionsRequest, createSuccessResponse, createErrorResponse, getRequestId } from '../shared/supabase-client.ts'
import { getUserProfile, authorize, canUserPerform, logUserAction } from '../shared/iam.ts'
import { Project, ProjectQueueJob } from '../shared/types.ts'
import { ValidationError, NotFoundError, ConflictError } from '../shared/errors.ts'

serve(async (req) => {
  const requestId = getRequestId(req)
  
  if (req.method === 'OPTIONS') {
    return handleOptionsRequest()
  }

  try {
    const user = await getUserProfile(req)
    const { method } = req
    let body: any = {}

    if (req.method !== 'GET') {
      try {
        body = await req.json()
      } catch {
        throw new ValidationError('Invalid JSON in request body')
      }
    }

    switch (method) {
      case 'GET': {
        // Get projects with filtering and pagination
        const url = new URL(req.url)
        const page = parseInt(url.searchParams.get('page') || '1')
        const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100)
        const status = url.searchParams.get('status')
        const category = url.searchParams.get('category')
        const featured = url.searchParams.get('featured')
        const search = url.searchParams.get('search')
        const sortBy = url.searchParams.get('sortBy') || 'createdAt'
        const sortOrder = url.searchParams.get('sortOrder') || 'desc'

        let query = supabaseAdmin
          .from('projects')
          .select(`
            *,
            category:category_id (
              id,
              name,
              slug,
              color,
              icon
            ),
            images:image_metadata (
              id,
              image_path,
              alt_text,
              is_primary,
              sort_order
            )
          `)

        // Apply filters based on user role
        if (user.role === 'viewer') {
          query = query.eq('status', 'published')
        } else if (user.role === 'editor') {
          query = query.or(`status.eq.published,createdBy.eq.${user.id}`)
        }
        // Admins can see all projects (no filter)

        if (status) query = query.eq('status', status)
        if (category) query = query.eq('category_id', category)
        if (featured !== null) query = query.eq('featured', featured === 'true')
        if (search) {
          query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
        }

        // Apply sorting
        query = query.order(sortBy, { ascending: sortOrder === 'asc' })

        // Apply pagination
        const from = (page - 1) * limit
        const to = from + limit - 1
        query = query.range(from, to)

        const { data: projects, error, count } = await query

        if (error) throw error

        return createSuccessResponse({
          projects: projects || [],
          pagination: {
            page,
            limit,
            total: count || 0,
            pages: Math.ceil((count || 0) / limit)
          }
        }, 200, requestId)
      }

      case 'POST': {
        // Create a new project
        authorize(user, ['admin', 'editor'])

        const { title, description, techStack, categoryId, ...otherFields } = body

        if (!title || !description) {
          throw new ValidationError('Title and description are required')
        }

        if (techStack && !Array.isArray(techStack)) {
          throw new ValidationError('Tech stack must be an array')
        }

        // Validate category exists if provided
        if (categoryId) {
          const { data: category, error: categoryError } = await supabaseAdmin
            .from('project_categories')
            .select('id')
            .eq('id', categoryId)
            .eq('is_active', true)
            .single()

          if (categoryError || !category) {
            throw new ValidationError('Invalid category ID')
          }
        }

        const projectData = {
          title: title.trim(),
          description: description.trim(),
          techStack: techStack || [],
          categoryId: categoryId || null,
          createdBy: user.id,
          status: 'draft',
          queueStatus: 'none',
          viewCount: 0,
          likeCount: 0,
          ...otherFields
        }

        const { data: newProject, error: insertError } = await supabaseAdmin
          .from('projects')
          .insert(projectData)
          .select(`
            *,
            category:category_id (
              id,
              name,
              slug,
              color,
              icon
            )
          `)
          .single()

        if (insertError) {
          console.error('Project creation error:', insertError)
          throw new Error('Failed to create project')
        }

        // Add job to queue for processing
        const { error: queueError } = await supabaseAdmin
          .from('project_queue')
          .insert({
            project_id: newProject.id,
            job_type: 'new_project_processing',
            payload: { 
              message: `New project '${newProject.title}' created by ${user.id}`,
              projectTitle: newProject.title,
              createdBy: user.id
            }
          })

        if (queueError) {
          console.error('Queue insertion error:', queueError)
          // Don't fail the request if queue insertion fails
        }

        // Log the action
        await logUserAction(user.id, 'create', 'project', newProject.id, {
          title: newProject.title,
          status: newProject.status
        })

        return createSuccessResponse(newProject, 201, requestId)
      }

      case 'PUT': {
        // Update an existing project
        const { projectId, updates } = body

        if (!projectId) {
          throw new ValidationError('Project ID is required')
        }

        if (!updates || typeof updates !== 'object') {
          throw new ValidationError('Updates object is required')
        }

        // Get the existing project
        const { data: existingProject, error: fetchError } = await supabaseAdmin
          .from('projects')
          .select('id, createdBy, title, status')
          .eq('id', projectId)
          .single()

        if (fetchError || !existingProject) {
          throw new NotFoundError('Project not found')
        }

        // Check permissions
        if (!canUserPerform(user, 'edit', existingProject)) {
          throw new AuthorizationError('You can only edit your own projects')
        }

        // Validate category if being updated
        if (updates.categoryId) {
          const { data: category, error: categoryError } = await supabaseAdmin
            .from('project_categories')
            .select('id')
            .eq('id', updates.categoryId)
            .eq('is_active', true)
            .single()

          if (categoryError || !category) {
            throw new ValidationError('Invalid category ID')
          }
        }

        // Clean up updates
        const cleanUpdates = { ...updates }
        delete cleanUpdates.id
        delete cleanUpdates.createdBy
        delete cleanUpdates.createdAt

        if (cleanUpdates.title) cleanUpdates.title = cleanUpdates.title.trim()
        if (cleanUpdates.description) cleanUpdates.description = cleanUpdates.description.trim()
        if (cleanUpdates.techStack && !Array.isArray(cleanUpdates.techStack)) {
          throw new ValidationError('Tech stack must be an array')
        }

        const { data: updatedProject, error: updateError } = await supabaseAdmin
          .from('projects')
          .update(cleanUpdates)
          .eq('id', projectId)
          .select(`
            *,
            category:category_id (
              id,
              name,
              slug,
              color,
              icon
            )
          `)
          .single()

        if (updateError) {
          console.error('Project update error:', updateError)
          throw new Error('Failed to update project')
        }

        // Log the action
        await logUserAction(user.id, 'update', 'project', projectId, {
          title: updatedProject.title,
          changes: Object.keys(cleanUpdates)
        })

        return createSuccessResponse(updatedProject, 200, requestId)
      }

      case 'DELETE': {
        // Soft-delete a project (move to deleted_projects)
        const { projectId, reason } = body

        if (!projectId) {
          throw new ValidationError('Project ID is required')
        }

        // Get the full project data
        const { data: project, error: fetchError } = await supabaseAdmin
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single()

        if (fetchError || !project) {
          throw new NotFoundError('Project not found')
        }

        // Check permissions
        if (!canUserPerform(user, 'delete', project)) {
          throw new AuthorizationError('You can only delete your own projects')
        }

        // Archive the project data
        const { error: archiveError } = await supabaseAdmin
          .from('deleted_projects')
          .insert({
            id: project.id,
            original_data: project,
            deleted_by: user.id,
            reason: reason || 'Deleted via dashboard'
          })

        if (archiveError) {
          console.error('Project archiving error:', archiveError)
          throw new Error('Failed to archive project')
        }

        // Permanently delete the original project record
        const { error: deleteError } = await supabaseAdmin
          .from('projects')
          .delete()
          .eq('id', projectId)

        if (deleteError) {
          console.error('Project deletion error:', deleteError)
          throw new Error('Failed to delete project')
        }

        // Log the action
        await logUserAction(user.id, 'delete', 'project', projectId, {
          title: project.title,
          reason: reason
        })

        return createSuccessResponse(
          { message: 'Project deleted successfully', projectId },
          200,
          requestId
        )
      }

      default:
        return createErrorResponse(
          new Error('Method not allowed'),
          405,
          requestId
        )
    }
  } catch (error) {
    console.error(`Project CRUD error [${requestId}]:`, error)
    return createErrorResponse(error, undefined, requestId)
  }
})

