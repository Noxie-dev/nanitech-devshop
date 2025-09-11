// supabase/functions/image-management/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { supabaseAdmin, createCorsHeaders, handleOptionsRequest, createSuccessResponse, createErrorResponse, getRequestId } from '../shared/supabase-client.ts'
import { getUserProfile, authorize, canUserPerform, logUserAction } from '../shared/iam.ts'
import { ImageMetadata } from '../shared/types.ts'
import { ValidationError, NotFoundError } from '../shared/errors.ts'

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
        // Get images for a project
        const url = new URL(req.url)
        const projectId = url.searchParams.get('projectId')
        const imageId = url.searchParams.get('imageId')

        if (imageId) {
          // Get specific image
          const { data: image, error } = await supabaseAdmin
            .from('image_metadata')
            .select(`
              *,
              project:project_id (
                id,
                title,
                createdBy
              )
            `)
            .eq('id', imageId)
            .single()

          if (error || !image) {
            throw new NotFoundError('Image not found')
          }

          // Check if user can access this image
          if (!canUserPerform(user, 'read', image.project)) {
            throw new Error('Access denied')
          }

          return createSuccessResponse(image, 200, requestId)
        }

        if (!projectId) {
          throw new ValidationError('Project ID is required')
        }

        // Verify user can access the project
        const { data: project, error: projectError } = await supabaseAdmin
          .from('projects')
          .select('id, createdBy, title')
          .eq('id', projectId)
          .single()

        if (projectError || !project) {
          throw new NotFoundError('Project not found')
        }

        if (!canUserPerform(user, 'read', project)) {
          throw new Error('Access denied')
        }

        // Get all images for the project
        const { data: images, error } = await supabaseAdmin
          .from('image_metadata')
          .select('*')
          .eq('project_id', projectId)
          .order('sort_order', { ascending: true })

        if (error) throw error

        return createSuccessResponse(images || [], 200, requestId)
      }

      case 'POST': {
        // Handle image operations
        const { action, ...payload } = body

        switch (action) {
          case 'generate-upload-url': {
            // Generate signed upload URL
            authorize(user, ['admin', 'editor'])

            const { fileName, projectId, fileSize, mimeType } = payload

            if (!fileName || !projectId) {
              throw new ValidationError('fileName and projectId are required')
            }

            // Validate file size (50MB max)
            const maxSize = 50 * 1024 * 1024 // 50MB
            if (fileSize && fileSize > maxSize) {
              throw new ValidationError('File size exceeds 50MB limit')
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
            if (mimeType && !allowedTypes.includes(mimeType)) {
              throw new ValidationError('Invalid file type. Allowed: JPEG, PNG, WebP, GIF')
            }

            // Verify project exists and user can access it
            const { data: project, error: projectError } = await supabaseAdmin
              .from('projects')
              .select('id, createdBy, title')
              .eq('id', projectId)
              .single()

            if (projectError || !project) {
              throw new NotFoundError('Project not found')
            }

            if (!canUserPerform(user, 'edit', project)) {
              throw new Error('Access denied')
            }

            // Generate unique filename
            const fileExt = fileName.split('.').pop()
            const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`
            const filePath = `${projectId}/${uniqueFileName}`

            // Create signed upload URL
            const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
              .from('project-images')
              .createSignedUploadUrl(filePath, {
                upsert: false
              })

            if (uploadError) {
              console.error('Upload URL generation error:', uploadError)
              throw new Error('Failed to generate upload URL')
            }

            return createSuccessResponse({
              uploadUrl: uploadData.signedUrl,
              filePath,
              expiresIn: uploadData.expiresIn
            }, 200, requestId)
          }

          case 'create-metadata': {
            // Create image metadata after successful upload
            authorize(user, ['admin', 'editor'])

            const {
              imagePath,
              projectId,
              altText,
              caption,
              fileSizeBytes,
              width,
              height,
              mimeType,
              positionX = 0,
              positionY = 0,
              scale = 1.0,
              rotation = 0,
              cropData,
              isPrimary = false,
              sortOrder = 0
            } = payload

            if (!imagePath || !projectId) {
              throw new ValidationError('imagePath and projectId are required')
            }

            // Verify project exists and user can access it
            const { data: project, error: projectError } = await supabaseAdmin
              .from('projects')
              .select('id, createdBy, title')
              .eq('id', projectId)
              .single()

            if (projectError || !project) {
              throw new NotFoundError('Project not found')
            }

            if (!canUserPerform(user, 'edit', project)) {
              throw new Error('Access denied')
            }

            // If this is set as primary, unset other primary images
            if (isPrimary) {
              await supabaseAdmin
                .from('image_metadata')
                .update({ is_primary: false })
                .eq('project_id', projectId)
            }

            // Create image metadata
            const { data: imageMetadata, error: metadataError } = await supabaseAdmin
              .from('image_metadata')
              .insert({
                project_id: projectId,
                uploader_id: user.id,
                image_path: imagePath,
                alt_text: altText || '',
                caption: caption || '',
                file_size_bytes: fileSizeBytes,
                width,
                height,
                mime_type: mimeType,
                position_x: positionX,
                position_y: positionY,
                scale,
                rotation,
                crop_data: cropData,
                is_primary: isPrimary,
                sort_order: sortOrder
              })
              .select()
              .single()

            if (metadataError) {
              console.error('Metadata creation error:', metadataError)
              throw new Error('Failed to create image metadata')
            }

            // Log the action
            await logUserAction(user.id, 'create', 'image', imageMetadata.id, {
              projectId,
              imagePath,
              isPrimary
            })

            return createSuccessResponse(imageMetadata, 201, requestId)
          }

          case 'update-metadata': {
            // Update image metadata
            const { imageId, updates } = payload

            if (!imageId || !updates) {
              throw new ValidationError('imageId and updates are required')
            }

            // Get existing image metadata
            const { data: existingImage, error: fetchError } = await supabaseAdmin
              .from('image_metadata')
              .select(`
                *,
                project:project_id (
                  id,
                  createdBy
                )
              `)
              .eq('id', imageId)
              .single()

            if (fetchError || !existingImage) {
              throw new NotFoundError('Image not found')
            }

            if (!canUserPerform(user, 'edit', existingImage.project)) {
              throw new Error('Access denied')
            }

            // If setting as primary, unset other primary images
            if (updates.isPrimary) {
              await supabaseAdmin
                .from('image_metadata')
                .update({ is_primary: false })
                .eq('project_id', existingImage.project_id)
                .neq('id', imageId)
            }

            // Update metadata
            const { data: updatedImage, error: updateError } = await supabaseAdmin
              .from('image_metadata')
              .update(updates)
              .eq('id', imageId)
              .select()
              .single()

            if (updateError) {
              console.error('Metadata update error:', updateError)
              throw new Error('Failed to update image metadata')
            }

            // Log the action
            await logUserAction(user.id, 'update', 'image', imageId, {
              projectId: existingImage.project_id,
              changes: Object.keys(updates)
            })

            return createSuccessResponse(updatedImage, 200, requestId)
          }

          case 'reorder-images': {
            // Reorder images for a project
            const { projectId, imageOrders } = payload

            if (!projectId || !Array.isArray(imageOrders)) {
              throw new ValidationError('projectId and imageOrders array are required')
            }

            // Verify project exists and user can access it
            const { data: project, error: projectError } = await supabaseAdmin
              .from('projects')
              .select('id, createdBy')
              .eq('id', projectId)
              .single()

            if (projectError || !project) {
              throw new NotFoundError('Project not found')
            }

            if (!canUserPerform(user, 'edit', project)) {
              throw new Error('Access denied')
            }

            // Update sort orders
            const updates = imageOrders.map(({ imageId, sortOrder }) => ({
              id: imageId,
              sort_order: sortOrder
            }))

            const { error: updateError } = await supabaseAdmin
              .from('image_metadata')
              .upsert(updates, { onConflict: 'id' })

            if (updateError) {
              console.error('Image reordering error:', updateError)
              throw new Error('Failed to reorder images')
            }

            return createSuccessResponse(
              { message: 'Images reordered successfully' },
              200,
              requestId
            )
          }

          default:
            throw new ValidationError('Invalid action specified')
        }
      }

      case 'DELETE': {
        // Delete an image
        const { imageId } = body

        if (!imageId) {
          throw new ValidationError('imageId is required')
        }

        // Get existing image metadata
        const { data: existingImage, error: fetchError } = await supabaseAdmin
          .from('image_metadata')
          .select(`
            *,
            project:project_id (
              id,
              createdBy
            )
          `)
          .eq('id', imageId)
          .single()

        if (fetchError || !existingImage) {
          throw new NotFoundError('Image not found')
        }

        if (!canUserPerform(user, 'delete', existingImage.project)) {
          throw new Error('Access denied')
        }

        // Delete from storage
        const { error: storageError } = await supabaseAdmin.storage
          .from('project-images')
          .remove([existingImage.image_path])

        if (storageError) {
          console.error('Storage deletion error:', storageError)
          // Continue with metadata deletion even if storage deletion fails
        }

        // Delete metadata
        const { error: deleteError } = await supabaseAdmin
          .from('image_metadata')
          .delete()
          .eq('id', imageId)

        if (deleteError) {
          console.error('Metadata deletion error:', deleteError)
          throw new Error('Failed to delete image metadata')
        }

        // Log the action
        await logUserAction(user.id, 'delete', 'image', imageId, {
          projectId: existingImage.project_id,
          imagePath: existingImage.image_path
        })

        return createSuccessResponse(
          { message: 'Image deleted successfully' },
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
    console.error(`Image management error [${requestId}]:`, error)
    return createErrorResponse(error, undefined, requestId)
  }
})

