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

    // Verify TOTP token
    const isValid = verifyTOTP(user2FA.secret, token)
    
    if (!isValid) {
      // Check backup codes
      const isBackupCode = user2FA.backup_codes?.includes(token)
      
      if (isBackupCode) {
        // Remove used backup code
        const updatedBackupCodes = user2FA.backup_codes.filter(code => code !== token)
        
        await supabase
          .from('user_2fa')
          .update({ 
            backup_codes: updatedBackupCodes,
            is_enabled: true 
          })
          .eq('user_id', user_id)
      } else {
        return new Response(
          JSON.stringify({ error: 'Invalid token' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
    } else {
      // Enable 2FA
      await supabase
        .from('user_2fa')
        .update({ is_enabled: true })
        .eq('user_id', user_id)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error verifying 2FA:', error)
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
  // For now, we'll do a simple validation
  const currentTime = Math.floor(Date.now() / 1000 / 30)
  const expectedToken = generateTOTP(secret, currentTime)
  
  return expectedToken === token
}

function generateTOTP(secret: string, time: number): string {
  // This is a simplified implementation
  // In production, use a proper TOTP library
  const hash = new TextEncoder().encode(secret + time.toString())
  const hashArray = Array.from(new Uint8Array(hash))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  // Extract 6 digits
  const offset = parseInt(hashHex.slice(-1), 16)
  const code = parseInt(hashHex.slice(offset, offset + 8), 16) % 1000000
  
  return code.toString().padStart(6, '0')
}
