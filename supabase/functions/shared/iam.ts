// supabase/functions/shared/iam.ts

import { supabaseAdmin } from './supabase-client.ts'
import { UserProfile } from './types.ts'
import { AuthenticationError, AuthorizationError, NotFoundError } from './errors.ts'

// Function to get the authenticated user's profile and role from the JWT
export async function getUserProfile(req: Request): Promise<UserProfile> {
  const authHeader = req.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('Missing or invalid authorization header')
  }
  
  const token = authHeader.replace('Bearer ', '')
  
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

    if (error) {
      console.error('JWT validation error:', error)
      throw new AuthenticationError('Invalid or expired token')
    }
    
    if (!user) {
      throw new AuthenticationError('User not found in token')
    }

    // Fetch the user's role from the 'profiles' table
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role, fullName, avatarUrl')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      throw new AuthenticationError('User profile not found')
    }
    
    if (!profile) {
      throw new AuthenticationError('User profile not found')
    }

    return { 
      id: user.id, 
      role: profile.role,
      fullName: profile.fullName,
      avatarUrl: profile.avatarUrl
    } as UserProfile & { fullName?: string; avatarUrl?: string }
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error
    }
    console.error('Unexpected error in getUserProfile:', error)
    throw new AuthenticationError('Failed to authenticate user')
  }
}

// Authorization check: Throws an error if the user's role is not in the allowed list
export function authorize(user: UserProfile, allowedRoles: Array<UserProfile['role']>): boolean {
  if (!allowedRoles.includes(user.role)) {
    throw new AuthorizationError(
      `Access denied. Required roles: ${allowedRoles.join(', ')}. User role: ${user.role}`
    )
  }
  return true
}

// Check if user can perform action on a specific resource
export function canUserPerform(
  user: UserProfile, 
  action: string, 
  resource?: { createdBy?: string }
): boolean {
  // Admins can do everything
  if (user.role === 'admin') {
    return true
  }
  
  // Editors can create and manage their own resources
  if (user.role === 'editor') {
    if (action === 'create') return true
    if (action === 'edit' && resource?.createdBy === user.id) return true
    if (action === 'delete' && resource?.createdBy === user.id) return true
  }
  
  // Viewers can only read
  if (user.role === 'viewer') {
    return action === 'read'
  }
  
  return false
}

// Get user permissions based on role
export function getUserPermissions(role: UserProfile['role']): string[] {
  const permissions = {
    admin: [
      'project.create',
      'project.edit.own',
      'project.edit.all',
      'project.delete.own',
      'project.delete.all',
      'project.read.all',
      'user.manage',
      'settings.manage',
      'queue.manage',
      'image.manage.all'
    ],
    editor: [
      'project.create',
      'project.edit.own',
      'project.delete.own',
      'project.read.all',
      'image.manage.own'
    ],
    viewer: [
      'project.read.all',
      'image.read.all'
    ]
  }
  
  return permissions[role] || []
}

// Validate user has specific permission
export function hasPermission(user: UserProfile, permission: string): boolean {
  const permissions = getUserPermissions(user.role)
  return permissions.includes(permission)
}

// Check resource ownership
export function isResourceOwner(user: UserProfile, resource: { createdBy?: string }): boolean {
  return resource.createdBy === user.id
}

// Get user's accessible projects based on role
export function getAccessibleProjectsQuery(user: UserProfile) {
  if (user.role === 'admin') {
    // Admins can see all projects
    return supabaseAdmin
      .from('projects')
      .select('*')
  } else if (user.role === 'editor') {
    // Editors can see all published projects and their own projects
    return supabaseAdmin
      .from('projects')
      .select('*')
      .or(`status.eq.published,createdBy.eq.${user.id}`)
  } else {
    // Viewers can only see published projects
    return supabaseAdmin
      .from('projects')
      .select('*')
      .eq('status', 'published')
  }
}

// Audit log helper
export async function logUserAction(
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  details?: Record<string, any>
) {
  try {
    await supabaseAdmin
      .from('audit_logs')
      .insert({
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details: details || {},
        timestamp: new Date().toISOString()
      })
  } catch (error) {
    console.error('Failed to log user action:', error)
    // Don't throw error as this is not critical
  }
}

// Rate limiting helper (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string, 
  maxRequests: number = 100, 
  windowMs: number = 60000
): boolean {
  const now = Date.now()
  const key = identifier
  const current = rateLimitMap.get(key)
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (current.count >= maxRequests) {
    return false
  }
  
  current.count++
  return true
}

// Clean up expired rate limit entries
export function cleanupRateLimit() {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}

