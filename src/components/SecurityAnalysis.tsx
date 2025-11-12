import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Code2, BookOpen, TrendingUp, Database, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const SecurityAnalysis = () => {
  const [realtimeStats, setRealtimeStats] = useState<any>(null);

  useEffect(() => {
    fetchRealtimeStats();
  }, []);

  const fetchRealtimeStats = async () => {
    try {
      const { data } = await supabase.functions.invoke('get-security-logs');
      setRealtimeStats(data?.stats);
    } catch (error) {
      console.error('Error fetching realtime stats:', error);
    }
  };
  const vulnerabilities = [
    {
      type: "SQL Injection",
      severity: "Critical",
      description: "Entrada não sanitizada permite execução de código SQL malicioso",
      impact: "Acesso não autorizado, perda de dados, comprometimento do sistema",
      owasp: "A03:2021 - Injection",
      cvss: "9.8/10.0",
      examples: ["admin' --", "' OR '1'='1", "'; DROP TABLE users; --"]
    },
    {
      type: "Authentication Bypass",
      severity: "High", 
      description: "Possível bypass de autenticação através de injeção SQL",
      impact: "Acesso administrativo não autorizado",
      owasp: "A07:2021 - Identification and Authentication Failures",
      cvss: "8.1/10.0",
      examples: ["admin' OR 1=1 --", "' UNION SELECT null,null,null --"]
    },
    {
      type: "Information Disclosure",
      severity: "Medium",
      description: "Exposição de estrutura do banco e dados sensíveis",
      impact: "Vazamento de informações confidenciais",
      owasp: "A01:2021 - Broken Access Control",
      cvss: "6.5/10.0", 
      examples: ["' UNION SELECT schema_name FROM information_schema.schemata --"]
    }
  ];

  const mitigations = [
    {
      technique: "Prepared Statements / Parameterized Queries",
      description: "Separação completa entre código SQL e dados de entrada do usuário",
      effectiveness: "99%",
      implementation: "Usar bibliotecas ORM ou drivers com suporte nativo a prepared statements",
      cybok_category: "Software Security",
      code_example: "SELECT * FROM users WHERE username = ? AND password = ?"
    },
    {
      technique: "Input Validation & Sanitization",
      description: "Validação rigorosa e sanitização de todas as entradas do usuário",
      effectiveness: "95%",
      implementation: "Whitelist de caracteres permitidos, escape de caracteres especiais, validação de tipos",
      cybok_category: "Software Security", 
      code_example: "username.replace(/[^a-zA-Z0-9]/g, '').substring(0, 50)"
    },
    {
      technique: "Least Privilege Database Access", 
      description: "Conta de banco com privilégios mínimos necessários para operação",
      effectiveness: "85%",
      implementation: "Criar usuário específico para aplicação com permissões limitadas (apenas SELECT, INSERT, UPDATE)",
      cybok_category: "Access Control",
      code_example: "GRANT SELECT, INSERT, UPDATE ON app_tables TO app_user;"
    },
    {
      technique: "Web Application Firewall (WAF)",
      description: "Filtragem de requisições maliciosas antes de chegarem à aplicação",
      effectiveness: "80%",
      implementation: "Configurar regras para detectar padrões de SQL injection",
      cybok_category: "Network Security",
      code_example: "Regra: Bloquear requisições contendo: ', --, UNION, DROP"
    },
    {
      technique: "Database Activity Monitoring",
      description: "Monitoramento contínuo de atividades suspeitas no banco de dados",
      effectiveness: "75%",
      implementation: "Logs detalhados, alertas automáticos para queries anômalas",
      cybok_category: "Security Monitoring",
      code_example: "Log: ALERT - Multiple failed login attempts from IP"
    },
    {
      technique: "Error Handling Seguro",
      description: "Não exposição de detalhes técnicos em mensagens de erro",
      effectiveness: "70%", 
      implementation: "Mensagens genéricas para usuário, logs detalhados para desenvolvedores",
      cybok_category: "Software Security",
      code_example: "Usuário vê: 'Login inválido' | Log: 'SQL error: table users not found'"
    }
  ];

  const cybokPrinciples = [
    {
      principle: "Defense in Depth (Defesa em Profundidade)",
      description: "Múltiplas camadas independentes de segurança para proteção abrangente",
      application: "Combinação de validação de entrada + prepared statements + WAF + monitoramento + controle de acesso",
      cybok_domain: "Security Architecture & Design",
      real_world_example: "Mesmo que um atacante bypasse a validação de entrada, prepared statements ainda o impedirão"
    },
    {
      principle: "Principle of Least Privilege (Princípio do Menor Privilégio)",
      description: "Concessão apenas dos privilégios mínimos necessários para funcionamento",
      application: "Usuários de banco com permissões específicas, aplicação sem acesso admin desnecessário", 
      cybok_domain: "Access Control & Privilege Management",
      real_world_example: "App user só pode SELECT/INSERT/UPDATE em tabelas específicas, não pode DROP ou ALTER"
    },
    {
      principle: "Fail Secure (Falha Segura)",
      description: "Sistema deve falhar de forma que mantenha a segurança, não a funcionalidade",
      application: "Em caso de erro de validação ou conexão, negar acesso em vez de permitir bypass",
      cybok_domain: "Security Engineering",
      real_world_example: "Se validação falha, retornar erro genérico e negar acesso, não processar query"
    },
    {
      principle: "Security by Design (Segurança por Design)",
      description: "Segurança integrada desde o início do desenvolvimento, não como adição posterior", 
      application: "Arquitetura que previne SQL injection por design, não depende apenas de correções",
      cybok_domain: "Secure Development Lifecycle",
      real_world_example: "ORM configurado para usar prepared statements por padrão em toda aplicação"
    },
    {
      principle: "Monitoring & Incident Response (Monitoramento e Resposta)",
      description: "Detecção proativa de ataques e resposta rápida a incidentes de segurança",
      application: "Logs de tentativas de SQL injection, alertas automáticos, análise forense",
      cybok_domain: "Security Operations & Incident Management", 
      real_world_example: "Sistema detecta 5+ tentativas de injection do mesmo IP e bloqueia automaticamente"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Estatísticas em Tempo Real */}
      {realtimeStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Estatísticas de Segurança em Tempo Real</span>
            </CardTitle>
            <CardDescription>
              Dados coletados desta sessão de demonstração
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{realtimeStats.total_attempts}</div>
                <div className="text-xs text-muted-foreground">Total de Tentativas</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-red-600">{realtimeStats.sql_injection_attempts}</div>
                <div className="text-xs text-muted-foreground">SQL Injections Detectadas</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">{realtimeStats.successful_logins}</div>
                <div className="text-xs text-muted-foreground">Logins Bem-sucedidos</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{realtimeStats.security_incidents}</div>
                <div className="text-xs text-muted-foreground">Incidentes de Segurança</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm" onClick={fetchRealtimeStats}>
                Atualizar Estatísticas
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <span>Análise de Vulnerabilidades (OWASP Top 10)</span>
          </CardTitle>
          <CardDescription>
            Identificação e classificação detalhada de vulnerabilidades SQL injection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vulnerabilities.map((vuln, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{vuln.type}</h4>
                  <div className="flex space-x-2">
                    <Badge variant={vuln.severity === "Critical" ? "destructive" : vuln.severity === "High" ? "default" : "secondary"}>
                      {vuln.severity}
                    </Badge>
                    <Badge variant="outline">{vuln.cvss}</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{vuln.description}</p>
                <p className="text-sm mb-2"><strong>Impacto:</strong> {vuln.impact}</p>
                <p className="text-sm mb-2"><strong>OWASP:</strong> {vuln.owasp}</p>
                <div className="text-sm">
                  <strong>Exemplos de Payloads:</strong>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-1">
                    {vuln.examples.map((example, idx) => (
                      <code key={idx} className="bg-muted p-1 rounded text-xs block">{example}</code>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="mitigations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mitigations">Técnicas de Mitigação</TabsTrigger>
          <TabsTrigger value="cybok">Princípios CYBOK</TabsTrigger>
          <TabsTrigger value="implementation">Guia de Implementação</TabsTrigger>
        </TabsList>

        <TabsContent value="mitigations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-success" />
                <span>Estratégias de Mitigação</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mitigations.map((mitigation, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{mitigation.technique}</h4>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="text-success border-success">
                          {mitigation.effectiveness} efetivo
                        </Badge>
                        <Badge variant="secondary">{mitigation.cybok_category}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{mitigation.description}</p>
                    <p className="text-sm mb-2"><strong>Implementação:</strong> {mitigation.implementation}</p>
                    <div className="bg-muted p-2 rounded mt-2">
                      <p className="text-xs font-medium mb-1">Exemplo de Código:</p>
                      <code className="text-xs">{mitigation.code_example}</code>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cybok">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>Princípios CYBOK Aplicados</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cybokPrinciples.map((principle, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-primary">{principle.principle}</h4>
                      <Badge variant="outline">{principle.cybok_domain}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{principle.description}</p>
                    <p className="text-sm mb-2"><strong>Aplicação na Prática:</strong> {principle.application}</p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded mt-2">
                      <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">Exemplo Real:</p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">{principle.real_world_example}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="implementation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-blue-500" />
                <span>Guia de Implementação Segura</span>
              </CardTitle>
              <CardDescription>
                Passos práticos para implementar proteções contra SQL injection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Checklist de Implementação */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    Checklist de Segurança
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "✅ Usar prepared statements em 100% das queries",
                      "✅ Validar todos os inputs do usuário",
                      "✅ Implementar lista de caracteres permitidos",
                      "✅ Configurar usuário de banco com privilégios mínimos",
                      "✅ Implementar logs de auditoria detalhados",
                      "✅ Configurar alertas para tentativas de injection",
                      "✅ Realizar testes de penetração regulares",
                      "✅ Manter bibliotecas e frameworks atualizados"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exemplo de Código Seguro */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Code2 className="h-4 w-4 mr-2" />
                    Exemplo de Implementação (Node.js + PostgreSQL)
                  </h4>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-xs overflow-x-auto">
{`// ❌ VULNERÁVEL - Construção de query com concatenação
const vulnerableQuery = \`SELECT * FROM users 
WHERE username = '\${username}' AND password = '\${password}'\`;

// ✅ SEGURO - Prepared statement com parâmetros
const secureQuery = 'SELECT * FROM users WHERE username = $1 AND password = $2';
const result = await client.query(secureQuery, [username, hashedPassword]);

// ✅ SEGURO - Validação de entrada
function validateInput(input) {
  // Remover caracteres perigosos
  const sanitized = input.replace(/[^a-zA-Z0-9@._-]/g, '');
  // Limitar tamanho
  return sanitized.substring(0, 50);
}

// ✅ SEGURO - Hash da senha antes de comparar
const hashedPassword = await bcrypt.hash(password, 10);`}
                    </pre>
                  </div>
                </div>

                {/* Configurações de Banco */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Database className="h-4 w-4 mr-2" />
                    Configurações de Banco Seguras
                  </h4>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-xs overflow-x-auto">
{`-- Criar usuário com privilégios mínimos
CREATE USER app_user WITH PASSWORD 'secure_password';

-- Conceder apenas permissões necessárias
GRANT SELECT, INSERT, UPDATE ON users TO app_user;
GRANT SELECT, INSERT ON audit_logs TO app_user;

-- Revogar permissões perigosas
REVOKE ALL ON SCHEMA information_schema FROM app_user;
REVOKE ALL ON SCHEMA pg_catalog FROM app_user;

-- Habilitar logs de auditoria
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_duration_statement = 100;`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityAnalysis;