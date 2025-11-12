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
    const { username, password } = await req.json()
    
    // Criar cliente Supabase
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Detectar possível SQL injection
    const sqlInjectionPatterns = [
      /'/g,
      /--/g,
      /\bOR\b/gi,
      /\bAND\b/gi,
      /\bDROP\b/gi,
      /\bDELETE\b/gi,
      /\bUNION\b/gi,
      /\bSELECT\b/gi,
      /;/g
    ]

    let isSqlInjection = false
    let injectionPayload = null
    
    for (const pattern of sqlInjectionPatterns) {
      if (pattern.test(username) || pattern.test(password)) {
        isSqlInjection = true
        injectionPayload = `Username: ${username}, Password: ${password}`
        break
      }
    }

    // Registrar tentativa de login (vulnerável)
    await supabaseAdmin.from('login_attempts').insert({
      username,
      password_input: password,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent') || 'unknown',
      is_vulnerable_endpoint: true,
      sql_injection_detected: isSqlInjection,
      injection_payload: injectionPayload,
      success: false
    })

    // Registrar log de segurança se SQL injection foi detectado
    if (isSqlInjection) {
      await supabaseAdmin.from('security_logs').insert({
        event_type: 'SQL_INJECTION_ATTEMPT',
        severity: 'high',
        description: `Tentativa de SQL injection detectada no endpoint vulnerável`,
        payload: injectionPayload,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown'
      })

      // Simular que SQL injection "funcionou"
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Login realizado com sucesso! (SQL Injection funcionou)',
          vulnerability_detected: true,
          simulated_query: `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`,
          explanation: 'Em um sistema vulnerável, este input malicioso permitiria bypass da autenticação.'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    // Simulação de tentativa de login normal (sempre falha para demonstração)
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Credenciais inválidas',
        vulnerability_detected: false,
        simulated_query: `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401
      }
    )

  } catch (error) {
    console.error('Error in login-vulnerable function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})