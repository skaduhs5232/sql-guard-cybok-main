import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Code2, Database, Lock, Server } from "lucide-react";
import { CodeBlock } from "@/components/ui/code-block";

const SecurityAnalysis = () => {

  const vulnerabilities = [
    {
      type: "SQL Injection (SQLi)",
      severity: "Critical",
      description: "Entrada não sanitizada permite execução de código SQL malicioso, podendo levar a extração total de dados.",
      impact: "Acesso não autorizado, perda de dados, comprometimento do sistema",
      owasp: "A03:2021 - Injection",
      cvss: "9.8/10.0",
      examples: ["admin' --", "' OR '1'='1", "'; DROP TABLE users; --"]
    },
    {
      type: "Authentication Bypass",
      severity: "High", 
      description: "Manipulação lógica da query de login para acessar contas sem senha válida.",
      impact: "Acesso administrativo não autorizado",
      owasp: "A07:2021 - Identification and Authentication Failures",
      cvss: "8.1/10.0",
      examples: ["admin' OR 1=1 --", "' UNION SELECT null,null,null --"]
    },
    {
      type: "Information Disclosure",
      severity: "Medium",
      description: "Mensagens de erro detalhadas que revelam estrutura do banco ou dados sensíveis.",
      impact: "Vazamento de informações confidenciais",
      owasp: "A01:2021 - Broken Access Control",
      cvss: "6.5/10.0", 
      examples: ["' UNION SELECT schema_name FROM information_schema.schemata --"]
    }
  ];

  const mitigations = [
    {
      technique: "Prepared Statements",
      description: "Separação completa entre código SQL e dados. O banco trata os inputs como dados literais, nunca como comandos.",
      effectiveness: "99%",
      implementation: "Usar bibliotecas ORM ou drivers com suporte nativo.",
      cybok_category: "Software Security",
      code_example: "const query = 'SELECT * FROM users WHERE username = $1';"
    },
    {
      technique: "Input Validation",
      description: "Validação rigorosa (allow-list) de todas as entradas antes de processá-las.",
      effectiveness: "95%",
      implementation: "Regex para validar formatos, tipos e comprimentos.",
      cybok_category: "Software Security", 
      code_example: "if (!/^[a-zA-Z0-9]+$/.test(username)) throw new Error('Invalid input');"
    },
    {
      technique: "Least Privilege", 
      description: "O usuário do banco deve ter apenas as permissões estritamente necessárias.",
      effectiveness: "85%",
      implementation: "Criar usuários específicos para a aplicação (ex: sem DROP/ALTER).",
      cybok_category: "Access Control",
      code_example: "GRANT SELECT, INSERT, UPDATE ON app_tables TO app_user;"
    }
  ];

  const cybokPrinciples = [
    {
      principle: "Defense in Depth",
      description: "Múltiplas camadas independentes de segurança. Se uma falhar, outras protegem o sistema.",
      application: "Validação + Prepared Statements + WAF + Monitoramento.",
      cybok_domain: "Security Architecture",
      icon: Shield
    },
    {
      principle: "Least Privilege",
      description: "Entidades devem operar com o mínimo de privilégios necessários para sua função.",
      application: "Usuário do DB não pode ser 'root' ou 'sa'.", 
      cybok_domain: "Access Control",
      icon: Lock
    },
    {
      principle: "Fail Secure",
      description: "Em caso de erro, o sistema deve falhar para um estado seguro (bloqueado), não aberto.",
      application: "Erros de banco não devem expor stack traces.",
      cybok_domain: "Security Engineering",
      icon: AlertTriangle
    },
    {
      principle: "Security by Design",
      description: "Segurança integrada desde o início do ciclo de desenvolvimento.", 
      application: "Escolha de frameworks seguros por padrão.",
      cybok_domain: "Secure Development",
      icon: Code2
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
          Análise de Vulnerabilidades
        </h2>
        <p className="text-muted-foreground text-lg">
          Guia detalhado de vulnerabilidades, mitigações e princípios de segurança (CYBOK).
        </p>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Vulnerabilities */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <h3 className="text-xl font-semibold">Vulnerabilidades (OWASP)</h3>
          </div>
          
          <div className="space-y-4">
            {vulnerabilities.map((vuln, index) => (
              <Card key={index} className="overflow-hidden border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">{vuln.type}</h4>
                    <Badge variant={vuln.severity === "Critical" ? "destructive" : "default"}>{vuln.severity}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{vuln.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-500">CVSS Score:</span>
                      <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{vuln.cvss}</span>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/10 p-2 rounded border border-red-100 dark:border-red-900/20">
                      <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">Exemplos de Payload:</p>
                      <div className="space-y-1">
                        {vuln.examples.map((ex, i) => (
                          <code key={i} className="block text-[10px] font-mono text-red-600 dark:text-red-300">{ex}</code>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Tabs for Mitigations & Implementation */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="mitigations" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-6 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
              <TabsTrigger value="mitigations" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Mitigações</TabsTrigger>
              <TabsTrigger value="cybok" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">CYBOK</TabsTrigger>
              <TabsTrigger value="implementation" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Implementação</TabsTrigger>
            </TabsList>

            <TabsContent value="mitigations" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2">
              {mitigations.map((mitigation, index) => (
                <Card key={index} className="border-none shadow-md bg-white dark:bg-slate-900">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-500" />
                        {mitigation.technique}
                      </CardTitle>
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20">
                        {mitigation.effectiveness} Eficácia
                      </Badge>
                    </div>
                    <CardDescription>{mitigation.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Como implementar: </span>
                        <span className="text-muted-foreground">{mitigation.implementation}</span>
                      </div>
                      <CodeBlock code={mitigation.code_example} language="javascript" title="Exemplo Prático" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="cybok" className="animate-in fade-in-50 slide-in-from-bottom-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cybokPrinciples.map((principle, index) => (
                  <Card key={index} className="hover:border-blue-400 transition-colors cursor-default group">
                    <CardHeader>
                      <div className="mb-2 p-2 w-fit rounded-lg bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100 transition-colors">
                        <principle.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <CardTitle className="text-lg">{principle.principle}</CardTitle>
                      <CardDescription className="text-xs uppercase tracking-wider font-semibold text-blue-500">
                        {principle.cybok_domain}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{principle.description}</p>
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                        <p className="text-xs font-medium text-slate-900 dark:text-slate-200 mb-1">Aplicação:</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{principle.application}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="implementation" className="animate-in fade-in-50 slide-in-from-bottom-2">
              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0 space-y-6">
                  
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Server className="h-5 w-5 text-indigo-500" />
                      Configuração Segura (Node.js + Postgres)
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Exemplo completo de como configurar uma rota de login segura utilizando as melhores práticas de mercado.
                    </p>
                    <CodeBlock 
                      title="secure-login-implementation.js"
                      showLineNumbers={true}
                      code={`// 1. Importar dependências
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

// 2. Configurar Pool com variáveis de ambiente
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// 3. Rota de Login Segura
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // ✅ Validação de Input (Fail Fast)
  if (!username || !password || username.length > 50) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  try {
    // ✅ Prepared Statement (Evita SQL Injection)
    const query = 'SELECT id, password_hash FROM users WHERE username = $1';
    const { rows } = await pool.query(query, [username]);

    if (rows.length === 0) {
      // ✅ Mensagem Genérica (Evita Enumeration)
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // ✅ Comparação Segura de Hash
    const validPassword = await bcrypt.compare(password, rows[0].password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Login bem sucedido...
    res.json({ token: generateToken(rows[0].id) });

  } catch (err) {
    // ✅ Log Seguro (Não expor erro ao cliente)
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Erro interno' });
  }
});`} 
                    />
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Database className="h-5 w-5 text-blue-500" />
                      Hardening do Banco de Dados
                    </h3>
                    <CodeBlock 
                      title="database-hardening.sql"
                      language="sql"
                      code={`-- 1. Criar usuário de aplicação com privilégios mínimos
CREATE USER app_user WITH PASSWORD 'StrongPass123!';

-- 2. Conceder apenas permissões DML necessárias
GRANT CONNECT ON DATABASE myapp TO app_user;
GRANT SELECT, INSERT, UPDATE ON TABLE users TO app_user;
GRANT SELECT, INSERT ON TABLE audit_logs TO app_user;

-- 3. Bloquear acesso a tabelas de sistema
REVOKE ALL ON SCHEMA information_schema FROM app_user;
REVOKE ALL ON SCHEMA pg_catalog FROM app_user;

-- 4. (Opcional) Criar view para limitar colunas expostas
CREATE VIEW public_users AS 
  SELECT id, username, created_at FROM users;
GRANT SELECT ON public_users TO app_user;`} 
                    />
                  </div>

                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SecurityAnalysis;