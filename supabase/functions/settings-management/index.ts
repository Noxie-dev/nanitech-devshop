// supabase/functions/settings-management/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { supabaseAdmin, createCorsHeaders, handleOptionsRequest, createSuccessResponse, createErrorResponse, getRequestId } from '../shared/supabase-client.ts'
import { getUserProfile, authorize, logUserAction } from '../shared/iam.ts'
import { Setting } from '../shared/types.ts'
import { ValidationError, NotFoundError } from '../shared/errors.ts'

serve(async (req) => {
  const requestId = getRequestId(req)
  
  if (req.method === 'OPTIONS') {
    return handleOptionsRequest()
  }

  try {
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
        // Get settings with optional filtering
        const url = new URL(req.url)
        const category = url.searchParams.get('category')
        const publicOnly = url.searchParams.get('publicOnly') === 'true'
        const key = url.searchParams.get('key')

        let userRole = 'viewer' // Default to public access
        try {
          const user = await getUserProfile(req)
          userRole = user.role
        } catch {
          // User is not authenticated, proceed with public access
        }

        let query = supabaseAdmin.from('settings').select('*')

        // Apply filters
        if (category) {
          query = query.eq('category', category)
        }

        if (key) {
          query = query.eq('key', key)
        }

        // Only admins can see non-public settings
        if (userRole !== 'admin' || publicOnly) {
          query = query.eq('is_public', true)
        }

        // Order by category and key
        query = query.order('category', { ascending: true })
        query = query.order('key', { ascending: true })

        const { data: settings, error } = await query

        if (error) {
          console.error('Settings fetch error:', error)
          throw new Error('Failed to fetch settings')
        }

        // Convert array to key-value object if single key requested
        if (key) {
          const setting = settings?.[0]
          if (!setting) {
            throw new NotFoundError('Setting not found')
          }
          return createSuccessResponse(setting, 200, requestId)
        }

        // Convert array to key-value object
        const settingsObject = (settings || []).reduce((acc, setting) => {
          acc[setting.key] = setting.value
          return acc
        }, {} as Record<string, any>)

        return createSuccessResponse(settingsObject, 200, requestId)
      }

      case 'POST': {
        // Create a new setting (admin only)
        const user = await getUserProfile(req)
        authorize(user, ['admin'])

        const {
          key,
          value,
          description,
          isPublic = false,
          category = 'general'
        } = body

        if (!key || value === undefined) {
          throw new ValidationError('key and value are required')
        }

        // Validate key format (alphanumeric with dots and underscores)
        if (!/^[a-zA-Z0-9._-]+$/.test(key)) {
          throw new ValidationError('Key must contain only alphanumeric characters, dots, underscores, and hyphens')
        }

        // Check if setting already exists
        const { data: existingSetting, error: checkError } = await supabaseAdmin
          .from('settings')
          .select('key')
          .eq('key', key)
          .single()

        if (checkError && checkError.code !== 'PGRST116') {
          // PGRST116 is "not found" error, which is what we want
          console.error('Settings check error:', checkError)
          throw new Error('Failed to check existing setting')
        }

        if (existingSetting) {
          throw new ValidationError('Setting with this key already exists')
        }

        // Create the setting
        const { data: newSetting, error: createError } = await supabaseAdmin
          .from('settings')
          .insert({
            key,
            value: typeof value === 'string' ? JSON.parse(value) : value,
            description: description || '',
            is_public: isPublic,
            category,
            last_updated_by: user.id
          })
          .select()
          .single()

        if (createError) {
          console.error('Setting creation error:', createError)
          throw new Error('Failed to create setting')
        }

        // Log the action
        await logUserAction(user.id, 'create', 'setting', key, {
          category,
          isPublic,
          value: typeof value === 'object' ? JSON.stringify(value) : value
        })

        return createSuccessResponse(newSetting, 201, requestId)
      }

      case 'PUT': {
        // Update an existing setting (admin only)
        const user = await getUserProfile(req)
        authorize(user, ['admin'])

        const { key, value, description, isPublic, category } = body

        if (!key || value === undefined) {
          throw new ValidationError('key and value are required')
        }

        // Check if setting exists
        const { data: existingSetting, error: checkError } = await supabaseAdmin
          .from('settings')
          .select('key, category, is_public')
          .eq('key', key)
          .single()

        if (checkError || !existingSetting) {
          throw new NotFoundError('Setting not found')
        }

        // Prepare update data
        const updateData: Partial<Setting> = {
          value: typeof value === 'string' ? JSON.parse(value) : value,
          last_updated_by: user.id
        }

        if (description !== undefined) updateData.description = description
        if (isPublic !== undefined) updateData.is_public = isPublic
        if (category !== undefined) updateData.category = category

        // Update the setting
        const { data: updatedSetting, error: updateError } = await supabaseAdmin
          .from('settings')
          .update(updateData)
          .eq('key', key)
          .select()
          .single()

        if (updateError) {
          console.error('Setting update error:', updateError)
          throw new Error('Failed to update setting')
        }

        // Log the action
        await logUserAction(user.id, 'update', 'setting', key, {
          category: updatedSetting.category,
          isPublic: updatedSetting.is_public,
          changes: Object.keys(updateData)
        })

        return createSuccessResponse(updatedSetting, 200, requestId)
      }

      case 'DELETE': {
        // Delete a setting (admin only)
        const user = await getUserProfile(req)
        authorize(user, ['admin'])

        const { key } = body

        if (!key) {
          throw new ValidationError('key is required')
        }

        // Check if setting exists
        const { data: existingSetting, error: checkError } = await supabaseAdmin
          .from('settings')
          .select('key, category')
          .eq('key', key)
          .single()

        if (checkError || !existingSetting) {
          throw new NotFoundError('Setting not found')
        }

        // Prevent deletion of critical settings
        const criticalSettings = [
          'site.title',
          'site.description',
          'iam.default_role',
          'dashboard.max_file_size'
        ]

        if (criticalSettings.includes(key)) {
          throw new ValidationError('Cannot delete critical system settings')
        }

        // Delete the setting
        const { error: deleteError } = await supabaseAdmin
          .from('settings')
          .delete()
          .eq('key', key)

        if (deleteError) {
          console.error('Setting deletion error:', deleteError)
          throw new Error('Failed to delete setting')
        }

        // Log the action
        await logUserAction(user.id, 'delete', 'setting', key, {
          category: existingSetting.category
        })

        return createSuccessResponse(
          { message: 'Setting deleted successfully' },
          200,
          requestId
        )
      }

      case 'PATCH': {
        // Bulk update settings (admin only)
        const user = await getUserProfile(req)
        authorize(user, ['admin'])

        const { settings } = body

        if (!Array.isArray(settings)) {
          throw new ValidationError('settings must be an array')
        }

        if (settings.length === 0) {
          throw new ValidationError('settings array cannot be empty')
        }

        if (settings.length > 50) {
          throw new ValidationError('Cannot update more than 50 settings at once')
        }

        // Validate each setting
        for (const setting of settings) {
          if (!setting.key || setting.value === undefined) {
            throw new ValidationError('Each setting must have key and value')
          }
        }

        // Prepare bulk update data
        const updateData = settings.map(setting => ({
          key: setting.key,
          value: typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value,
          description: setting.description,
          is_public: setting.isPublic,
          category: setting.category,
          last_updated_by: user.id
        }))

        // Bulk upsert settings
        const { data: updatedSettings, error: updateError } = await supabaseAdmin
          .from('settings')
          .upsert(updateData, { onConflict: 'key' })
          .select()

        if (updateError) {
          console.error('Bulk settings update error:', updateError)
          throw new Error('Failed to update settings')
        }

        // Log the action
        await logUserAction(user.id, 'bulk_update', 'setting', 'multiple', {
          count: settings.length,
          keys: settings.map(s => s.key)
        })

        return createSuccessResponse({
          message: 'Settings updated successfully',
          updatedCount: updatedSettings?.length || 0
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
    console.error(`Settings management error [${requestId}]:`, error)
    return createErrorResponse(error, undefined, requestId)
  }
})

