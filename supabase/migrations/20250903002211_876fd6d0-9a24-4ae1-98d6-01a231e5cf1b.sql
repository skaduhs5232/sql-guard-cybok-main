-- Criar tabela de usuários para demonstração
CREATE TABLE public.demo_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de tentativas de login para auditoria
CREATE TABLE public.login_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  password_input TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  is_vulnerable_endpoint BOOLEAN NOT NULL DEFAULT false,
  sql_injection_detected BOOLEAN NOT NULL DEFAULT false,
  injection_payload TEXT,
  success BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de logs de segurança
CREATE TABLE public.security_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  payload TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir alguns usuários de demonstração
INSERT INTO public.demo_users (username, password_hash, email) VALUES
('admin', '$2b$10$rOF1SJ5wRwM6QVZhBbJZouJ4B5B5B5B5B5B5B5B5B5B5B5B5B5B5B5', 'admin@demo.com'),
('user', '$2b$10$rOF1SJ5wRwM6QVZhBbJZouJ4B5B5B5B5B5B5B5B5B5B5B5B5B5B5B5', 'user@demo.com'),
('test', '$2b$10$rOF1SJ5wRwM6QVZhBbJZouJ4B5B5B5B5B5B5B5B5B5B5B5B5B5B5B5', 'test@demo.com');

-- Habilitar RLS apenas nas tabelas que precisam
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir leitura dos logs (para fins educacionais)
CREATE POLICY "Allow read access to login_attempts" 
ON public.login_attempts 
FOR SELECT 
USING (true);

CREATE POLICY "Allow insert to login_attempts" 
ON public.login_attempts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow read access to security_logs" 
ON public.security_logs 
FOR SELECT 
USING (true);

CREATE POLICY "Allow insert to security_logs" 
ON public.security_logs 
FOR INSERT 
WITH CHECK (true);

-- Função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger para atualizar updated_at na tabela demo_users
CREATE TRIGGER update_demo_users_updated_at
  BEFORE UPDATE ON public.demo_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();