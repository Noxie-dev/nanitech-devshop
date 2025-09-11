// supabase/functions/shared/supabase-client.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { ApplicationError } from './errors.ts'

// Create a Supabase client with the service_role key for admin operations
export const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  {
    auth: {
      // Important: Don't manage sessions for admin client
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Create a regular client for user operations (respects RLS)
export function createUserClient(authToken: string) {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }
    }
  )
}

// Helper function to validate environment variables
export function validateEnvironment() {
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_ANON_KEY'
  ]
  
  const missing = requiredEnvVars.filter(envVar => !Deno.env.get(envVar))
  
  if (missing.length > 0) {
    throw new ApplicationError(
      `Missing required environment variables: ${missing.join(', ')}`,
      500,
      'configuration_error'
    )
  }
}

// Helper function to get request ID for logging
export function getRequestId(req: Request): string {
  return req.headers.get('x-request-id') || 
         req.headers.get('x-correlation-id') || 
         `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Helper function to create CORS headers
export function createCorsHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-id',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Max-Age': '86400'
  }
}

// Helper function to handle OPTIONS requests
export function handleOptionsRequest() {
  return new Response('ok', { 
    status: 200, 
    headers: createCorsHeaders() 
  })
}

// Helper function to create success response
export function createSuccessResponse<T>(
  data: T, 
  statusCode: number = 200,
  requestId?: string
): Response {
  const response = {
    data,
    success: true,
    requestId,
    timestamp: new Date().toISOString()
  }
  
  return new Response(JSON.stringify(response), {
    status: statusCode,
    headers: createCorsHeaders()
  })
}

// Helper function to create error response
export function createErrorResponse(
  error: Error,
  statusCode: number = 500,
  requestId?: string
): Response {
  const response = {
    error: {
      message: error.message,
      code: error.name,
      statusCode,
      requestId,
      timestamp: new Date().toISOString()
    },
    success: false
  }
  
  return new Response(JSON.stringify(response), {
    status: statusCode,
    headers: createCorsHeaders()
  })
}

