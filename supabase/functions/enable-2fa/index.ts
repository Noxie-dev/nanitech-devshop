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
    const { user_id } = await req.json()
    
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Generate a random secret for TOTP
    const secret = generateSecret()
    
    // Generate QR code URL
    const qrCodeUrl = `otpauth://totp/NaniTech:${user_id}?secret=${secret}&issuer=NaniTech`
    
    // Generate backup codes
    const backupCodes = generateBackupCodes()
    
    // Store 2FA data in database
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { error: insertError } = await supabase
      .from('user_2fa')
      .upsert({
        user_id,
        secret,
        backup_codes: backupCodes,
        is_enabled: false, // Will be enabled after verification
        created_at: new Date().toISOString()
      })

    if (insertError) {
      throw insertError
    }

    return new Response(
      JSON.stringify({
        success: true,
        secret,
        qr_code: await generateQRCode(qrCodeUrl),
        backup_codes: backupCodes
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error enabling 2FA:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

function generateSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function generateBackupCodes(): string[] {
  const codes = []
  for (let i = 0; i < 10; i++) {
    codes.push(Math.random().toString(36).substring(2, 10).toUpperCase())
  }
  return codes
}

async function generateQRCode(data: string): Promise<string> {
  // In a real implementation, you would use a QR code library
  // For now, we'll return a placeholder
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`
}
