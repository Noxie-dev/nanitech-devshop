// supabase/functions/iam-system/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { supabaseAdmin, createCorsHeaders, handleOptionsRequest, createSuccessResponse, createErrorResponse, getRequestId } from '../shared/supabase-client.ts'
import { getUserProfile, authorize, logUserAction } from '../shared/iam.ts'
import { UserProfile } from '../shared/types.ts'
import { ValidationError, NotFoundError, ConflictError } from '../shared/errors.ts'

serve(async (req) => {
  const requestId = getRequestId(req)
  
  if (req.method === 'OPTIONS') {
    return handleOptionsRequest()
  }

  try {
    const adminUser = await getUserProfile(req)
    authorize(adminUser, ['admin']) // This entire function is admin-only

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
        // Get users with their roles and profiles
        const url = new URL(req.url)
        const page = parseInt(url.searchParams.get('page') || '1')
        const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100)
        const role = url.searchParams.get('role')
        const search = url.searchParams.get('search')
        const sortBy = url.searchParams.get('sortBy') || 'created_at'
        const sortOrder = url.searchParams.get('sortOrder') || 'desc'

        // Build query for users with profiles
        let query = supabaseAdmin
          .from('profiles')
          .select(`
            id,
            role,
            fullName,
            avatarUrl,
            createdAt,
            updatedAt,
            user:auth.users!inner (
              id,
              email,
              created_at,
              last_sign_in_at,
              email_confirmed_at
            )
          `)

        // Apply filters
        if (role) {
          query = query.eq('role', role)
        }

        if (search) {
          query = query.or(`fullName.ilike.%${search}%,user.email.ilike.%${search}%`)
        }

        // Apply sorting
        const sortColumn = sortBy === 'created_at' ? 'user.created_at' : sortBy
        query = query.order(sortColumn, { ascending: sortOrder === 'asc' })

        // Apply pagination
        const from = (page - 1) * limit
        const to = from + limit - 1
        query = query.range(from, to)

        const { data: profiles, error, count } = await query

        if (error) {
          console.error('Users fetch error:', error)
          throw new Error('Failed to fetch users')
        }

        // Transform data for easier consumption
        const users = (profiles || []).map(profile => ({
          id: profile.id,
          email: profile.user.email,
          fullName: profile.fullName,
          avatarUrl: profile.avatarUrl,
          role: profile.role,
          createdAt: profile.user.created_at,
          lastSignInAt: profile.user.last_sign_in_at,
          emailConfirmed: !!profile.user.email_confirmed_at,
          profileCreatedAt: profile.createdAt,
          profileUpdatedAt: profile.updatedAt
        }))

        return createSuccessResponse({
          users,
          pagination: {
            page,
            limit,
            total: count || 0,
            pages: Math.ceil((count || 0) / limit)
          }
        }, 200, requestId)
      }

      case 'POST': {
        // Create or update user role
        const { targetUserId, newRole, fullName, avatarUrl } = body

        if (!targetUserId || !newRole) {
          throw new ValidationError('targetUserId and newRole are required')
        }

        if (!['admin', 'editor', 'viewer'].includes(newRole)) {
          throw new ValidationError('Invalid role. Must be admin, editor, or viewer')
        }

        // Check if target user exists
        const { data: targetUser, error: userError } = await supabaseAdmin.auth.admin.getUserById(targetUserId)
        
        if (userError || !targetUser.user) {
          throw new NotFoundError('Target user not found')
        }

        // Check if profile already exists
        const { data: existingProfile, error: profileError } = await supabaseAdmin
          .from('profiles')
          .select('id, role')
          .eq('id', targetUserId)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116 is "not found" error
          console.error('Profile check error:', profileError)
          throw new Error('Failed to check existing profile')
        }

        const updateData = {
          role: newRole,
          fullName: fullName || targetUser.user.user_metadata?.full_name || '',
          avatarUrl: avatarUrl || targetUser.user.user_metadata?.avatar_url || null
        }

        let result
        if (existingProfile) {
          // Update existing profile
          const { data: updatedProfile, error: updateError } = await supabaseAdmin
            .from('profiles')
            .update(updateData)
            .eq('id', targetUserId)
            .select()
            .single()

          if (updateError) {
            console.error('Profile update error:', updateError)
            throw new Error('Failed to update user profile')
          }

          result = updatedProfile
        } else {
          // Create new profile
          const { data: newProfile, error: createError } = await supabaseAdmin
            .from('profiles')
            .insert({
              id: targetUserId,
              ...updateData
            })
            .select()
            .single()

          if (createError) {
            console.error('Profile creation error:', createError)
            throw new Error('Failed to create user profile')
          }

          result = newProfile
        }

        // Log the action
        await logUserAction(adminUser.id, 'update_role', 'user', targetUserId, {
          targetEmail: targetUser.user.email,
          oldRole: existingProfile?.role,
          newRole,
          fullName: updateData.fullName
        })

        return createSuccessResponse({
          ...result,
          email: targetUser.user.email
        }, 200, requestId)
      }

      case 'PUT': {
        // Update user profile details
        const { targetUserId, fullName, avatarUrl } = body

        if (!targetUserId) {
          throw new ValidationError('targetUserId is required')
        }

        // Check if profile exists
        const { data: existingProfile, error: profileError } = await supabaseAdmin
          .from('profiles')
          .select('id, role, fullName, avatarUrl')
          .eq('id', targetUserId)
          .single()

        if (profileError || !existingProfile) {
          throw new NotFoundError('User profile not found')
        }

        // Prepare update data
        const updateData: any = {}
        if (fullName !== undefined) updateData.fullName = fullName
        if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl

        if (Object.keys(updateData).length === 0) {
          throw new ValidationError('No valid fields to update')
        }

        // Update profile
        const { data: updatedProfile, error: updateError } = await supabaseAdmin
          .from('profiles')
          .update(updateData)
          .eq('id', targetUserId)
          .select()
          .single()

        if (updateError) {
          console.error('Profile update error:', updateError)
          throw new Error('Failed to update user profile')
        }

        // Log the action
        await logUserAction(adminUser.id, 'update_profile', 'user', targetUserId, {
          changes: Object.keys(updateData)
        })

        return createSuccessResponse(updatedProfile, 200, requestId)
      }

      case 'DELETE': {
        // Deactivate user (soft delete)
        const { targetUserId, reason } = body

        if (!targetUserId) {
          throw new ValidationError('targetUserId is required')
        }

        // Prevent admin from deactivating themselves
        if (targetUserId === adminUser.id) {
          throw new ValidationError('Cannot deactivate your own account')
        }

        // Check if profile exists
        const { data: existingProfile, error: profileError } = await supabaseAdmin
          .from('profiles')
          .select('id, role, fullName')
          .eq('id', targetUserId)
          .single()

        if (profileError || !existingProfile) {
          throw new NotFoundError('User profile not found')
        }

        // Update profile to mark as inactive (we'll add an is_active field)
        const { data: updatedProfile, error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({ 
            is_active: false,
            deactivated_at: new Date().toISOString(),
            deactivated_by: adminUser.id,
            deactivation_reason: reason || 'Deactivated by admin'
          })
          .eq('id', targetUserId)
          .select()
          .single()

        if (updateError) {
          console.error('Profile deactivation error:', updateError)
          throw new Error('Failed to deactivate user')
        }

        // Log the action
        await logUserAction(adminUser.id, 'deactivate_user', 'user', targetUserId, {
          targetName: existingProfile.fullName,
          reason
        })

        return createSuccessResponse({
          message: 'User deactivated successfully',
          userId: targetUserId
        }, 200, requestId)
      }

      case 'PATCH': {
        // Bulk role updates
        const { updates } = body

        if (!Array.isArray(updates)) {
          throw new ValidationError('updates must be an array')
        }

        if (updates.length === 0) {
          throw new ValidationError('updates array cannot be empty')
        }

        if (updates.length > 50) {
          throw new ValidationError('Cannot update more than 50 users at once')
        }

        // Validate each update
        for (const update of updates) {
          if (!update.userId || !update.role) {
            throw new ValidationError('Each update must have userId and role')
          }
          if (!['admin', 'editor', 'viewer'].includes(update.role)) {
            throw new ValidationError('Invalid role in updates')
          }
        }

        // Prepare bulk update data
        const updateData = updates.map(update => ({
          id: update.userId,
          role: update.role,
          fullName: update.fullName,
          avatarUrl: update.avatarUrl
        }))

        // Bulk upsert profiles
        const { data: updatedProfiles, error: updateError } = await supabaseAdmin
          .from('profiles')
          .upsert(updateData, { onConflict: 'id' })
          .select()

        if (updateError) {
          console.error('Bulk role update error:', updateError)
          throw new Error('Failed to update user roles')
        }

        // Log the action
        await logUserAction(adminUser.id, 'bulk_update_roles', 'user', 'multiple', {
          count: updates.length,
          userIds: updates.map(u => u.userId)
        })

        return createSuccessResponse({
          message: 'User roles updated successfully',
          updatedCount: updatedProfiles?.length || 0
        }, 200, requestId)
      }

      default:
        return createErrorResponse(
          new Error('Method not allowed'),
          405,
          requestId
        )
    }
  } catch (error) {
    console.error(`IAM system error [${requestId}]:`, error)
    return createErrorResponse(error, undefined, requestId)
  }
})

