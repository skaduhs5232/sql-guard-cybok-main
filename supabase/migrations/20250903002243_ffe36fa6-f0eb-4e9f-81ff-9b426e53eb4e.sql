-- Habilitar RLS na tabela demo_users (necessário para fins educacionais)
ALTER TABLE public.demo_users ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura dos usuários de demonstração (apenas para fins educacionais)
CREATE POLICY "Allow read access to demo_users" 
ON public.demo_users 
FOR SELECT 
USING (true);