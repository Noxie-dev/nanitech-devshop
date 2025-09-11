import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id, token } = await req.json()
    
    if (!user_id || !token) {
      return new Response(
        JSON.stringify({ error: 'User ID and token are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get user's 2FA data
    const { data: user2FA, error: fetchError } = await supabase
      .from('user_2fa')
      .select('*')
      .eq('user_id', user_id)
      .single()

    if (fetchError || !user2FA) {
      return new Response(
        JSON.stringify({ error: '2FA not set up for this user' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Verify token before disabling
    const isValid = verifyTOTP(user2FA.secret, token)
    
    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Disable 2FA
    const { error: updateError } = await supabase
      .from('user_2fa')
      .update({ 
        is_enabled: false,
        secret: null,
        backup_codes: null
      })
      .eq('user_id', user_id)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error disabling 2FA:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

function verifyTOTP(secret: string, token: string): boolean {
  // In a real implementation, you would use a proper TOTP library
  const currentTime = Math.floor(Date.now() / 1000 / 30)
  const expectedToken = generateTOTP(secret, currentTime)
  
  return expectedToken === token
}

function generateTOTP(secret: string, time: number): string {
  // This is a simplified implementation
  const hash = new TextEncoder().encode(secret + time.toString())
  const hashArray = Array.from(new Uint8Array(hash))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  const offset = parseInt(hashHex.slice(-1), 16)
  const code = parseInt(hashHex.slice(offset, offset + 8), 16) % 1000000
  
  return code.toString().padStart(6, '0')
}
