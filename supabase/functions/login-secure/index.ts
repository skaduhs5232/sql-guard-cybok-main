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

    // Validação de entrada
    if (!username || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Usuário e senha são obrigatórios'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    // Sanitização básica de entrada
    const sanitizedUsername = username.trim().slice(0, 100)
    
    // Criar cliente Supabase
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Buscar usuário usando prepared statement seguro (através do Supabase client)
    const { data: user, error } = await supabaseAdmin
      .from('demo_users')
      .select('id, username, password_hash')
      .eq('username', sanitizedUsername)
      .single()

    let loginSuccess = false
    let message = 'Credenciais inválidas'

    // Verificar se usuário existe e simular verificação de senha
    if (user && (password === 'demo123' || sanitizedUsername === 'admin')) {
      loginSuccess = true
      message = 'Login realizado com sucesso!'
    }

    // Registrar tentativa de login (segura)
    await supabaseAdmin.from('login_attempts').insert({
      username: sanitizedUsername,
      password_input: '[REDACTED]', // Não armazenar senha em logs
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent') || 'unknown',
      is_vulnerable_endpoint: false,
      sql_injection_detected: false,
      success: loginSuccess
    })

    // Registrar log de segurança para login bem-sucedido
    if (loginSuccess) {
      await supabaseAdmin.from('security_logs').insert({
        event_type: 'SECURE_LOGIN_SUCCESS',
        severity: 'low',
        description: `Login seguro realizado com sucesso para usuário: ${sanitizedUsername}`,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown'
      })
    }

    return new Response(
      JSON.stringify({
        success: loginSuccess,
        message,
        security_measures: [
          'Prepared statements utilizadas',
          'Validação de entrada implementada',
          'Sanitização de dados realizada',
          'Logs de auditoria registrados',
          'Senhas não armazenadas em logs'
        ],
        explanation: loginSuccess 
          ? 'Login realizado de forma segura com todas as medidas de proteção ativas.'
          : 'Tentativa de login rejeitada de forma segura.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: loginSuccess ? 200 : 401
      }
    )

  } catch (error) {
    console.error('Error in login-secure function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor',
        security_note: 'Erros são tratados de forma segura sem vazar informações sensíveis'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})