import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Criar cliente Supabase
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Buscar tentativas de login recentes
    const { data: loginAttempts, error: loginError } = await supabaseAdmin
      .from('login_attempts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (loginError) {
      throw loginError
    }

    // Buscar logs de segurança recentes
    const { data: securityLogs, error: securityError } = await supabaseAdmin
      .from('security_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (securityError) {
      throw securityError
    }

    // Calcular estatísticas
    const totalAttempts = loginAttempts?.length || 0
    const sqlInjectionAttempts = loginAttempts?.filter(attempt => attempt.sql_injection_detected).length || 0
    const vulnerableEndpointAttempts = loginAttempts?.filter(attempt => attempt.is_vulnerable_endpoint).length || 0
    const successfulLogins = loginAttempts?.filter(attempt => attempt.success).length || 0

    const stats = {
      total_attempts: totalAttempts,
      sql_injection_attempts: sqlInjectionAttempts,
      vulnerable_endpoint_attempts: vulnerableEndpointAttempts,
      successful_logins: successfulLogins,
      security_incidents: securityLogs?.filter(log => log.severity === 'high').length || 0
    }

    return new Response(
      JSON.stringify({
        success: true,
        stats,
        login_attempts: loginAttempts,
        security_logs: securityLogs,
        last_updated: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in get-security-logs function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})