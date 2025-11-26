import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, Lock, Database, Server, FileCode, Terminal, Cpu, Network, ArrowRight, CheckCircle2, XCircle } from "lucide-react";

const SqlInjectionGuide = () => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-background via-muted/30 to-muted/80 p-8 md:p-10 shadow-sm">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="relative flex flex-col md:flex-row items-start gap-8">
          <div className="rounded-2xl bg-primary/10 p-6 ring-1 ring-primary/20">
            <Database className="h-12 w-12 text-primary" />
          </div>
          <div className="space-y-4 flex-1">
            <div className="space-y-2">
              <Badge variant="outline" className="mb-2 bg-background/50 backdrop-blur">Segurança de Aplicações</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Visão Técnica: SQL Injection (SQLi)
              </h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              Uma análise aprofundada sobre a manipulação da gramática SQL e a injeção de AST (Abstract Syntax Tree).
              Entenda como a falha na separação entre <strong>Plano de Controle</strong> e <strong>Plano de Dados</strong> compromete a integridade do banco de dados.
            </p>
          </div>
        </div>
      </div>

      {/* Problem vs Solution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vulnerable Card */}
        <Card className="border-destructive/20 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-b from-background to-destructive/5">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle className="text-xl text-destructive">O Problema: Parsing Dinâmico</CardTitle>
              </div>
              <Badge variant="destructive" className="uppercase text-[10px] tracking-wider">Vulnerável</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Interpretação em Tempo de Execução</h4>
              <div className="relative rounded-lg bg-zinc-950 p-4 font-mono text-sm text-zinc-50 shadow-inner border border-zinc-800">
                <div className="flex gap-1.5 absolute top-3 right-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                </div>
                <div className="pt-2">
                  <span className="text-zinc-500">-- O Parser vê isso como uma única instrução:</span><br/>
                  <span className="text-purple-400">SELECT</span> * <span className="text-purple-400">FROM</span> users <br/>
                  <span className="text-purple-400">WHERE</span> user = <span className="text-green-400">'admin'</span> <span className="text-orange-400">OR</span> <span className="text-green-400">'1'</span>=<span className="text-green-400">'1'</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O otimizador de query (Query Optimizer) recebe a string completa já manipulada. Ele gera um plano de execução (Execution Plan) baseado na lógica alterada, ignorando completamente a intenção original do desenvolvedor.
            </p>
          </CardContent>
        </Card>

        {/* Secure Card */}
        <Card className="border-success/20 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-b from-background to-success/5">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <CardTitle className="text-xl text-success">A Solução: Parametrização</CardTitle>
              </div>
              <Badge variant="outline" className="uppercase text-[10px] tracking-wider border-success/50 text-success">Recomendado</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Pré-compilação e Binding</h4>
              <div className="relative rounded-lg bg-zinc-950 p-4 font-mono text-sm text-zinc-50 shadow-inner border border-zinc-800">
                <div className="flex gap-1.5 absolute top-3 right-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                </div>
                <div className="pt-2">
                  <span className="text-purple-400">PREPARE</span> stmt <span className="text-purple-400">FROM</span> <span className="text-green-400">'SELECT * FROM users WHERE user = ?'</span>;<br/>
                  <span className="text-purple-400">EXECUTE</span> stmt <span className="text-purple-400">USING</span> @userInput;
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O banco compila a query e gera o plano de execução <strong>antes</strong> de ver os dados. O input do usuário é tratado estritamente como um literal escalar durante a fase de execução (Binding), impossibilitando a alteração da lógica.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-2 border-b">
          <Terminal className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-bold tracking-tight">Análise Técnica Detalhada</h3>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="border rounded-xl px-4 bg-card shadow-sm">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-4 text-left">
                <div className="p-2 rounded-md bg-blue-500/10 text-blue-500">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Ciclo de Vida da Query e Injeção</h4>
                  <p className="text-sm text-muted-foreground font-normal">Entenda como o RDBMS processa a query passo a passo</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6 pt-2">
              <div className="relative space-y-8 pl-8 before:absolute before:left-3.5 before:top-2 before:h-full before:w-0.5 before:bg-border">
                <div className="relative">
                  <div className="absolute -left-[2.4rem] top-1 h-6 w-6 rounded-full border-4 border-background bg-muted flex items-center justify-center">
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                  </div>
                  <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <p className="font-semibold mb-2 flex items-center gap-2 text-primary"><Terminal className="h-4 w-4" /> 1. Parsing (Análise Sintática)</p>
                    <p className="text-sm text-muted-foreground">O banco quebra a string SQL em tokens e constrói uma Árvore de Sintaxe Abstrata (AST). No SQL Injection, o atacante insere tokens que alteram essa árvore (ex: adicionando um nó <code>OR</code> onde não deveria existir).</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[2.4rem] top-1 h-6 w-6 rounded-full border-4 border-background bg-muted flex items-center justify-center">
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                  </div>
                  <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <p className="font-semibold mb-2 flex items-center gap-2 text-primary"><Network className="h-4 w-4" /> 2. Optimization (Otimização)</p>
                    <p className="text-sm text-muted-foreground">O otimizador analisa a AST e decide o melhor caminho (índices, joins). Se a injeção for <code>' OR '1'='1</code>, o otimizador pode decidir fazer um <em>Full Table Scan</em> em vez de um <em>Index Seek</em>, pois a condição é sempre verdadeira.</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[2.4rem] top-1 h-6 w-6 rounded-full border-4 border-background bg-success flex items-center justify-center">
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  </div>
                  <div className="rounded-lg border border-success/20 bg-success/5 p-4 shadow-sm">
                    <p className="font-semibold mb-2 text-success flex items-center gap-2"><Lock className="h-4 w-4" /> Onde o Prepared Statement Atua</p>
                    <p className="text-sm text-muted-foreground">
                      Com Prepared Statements, os passos 1 e 2 acontecem com placeholders (<code>?</code>). A estrutura da AST é "congelada". Quando os dados chegam (passo 3 - Execution), eles preenchem os placeholders sem passar pelo parser novamente.
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border rounded-xl px-4 bg-card shadow-sm">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-4 text-left">
                <div className="p-2 rounded-md bg-orange-500/10 text-orange-500">
                  <Server className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Vetores de Ataque Avançados</h4>
                  <p className="text-sm text-muted-foreground font-normal">Além do básico: UNION, Error-based e Blind SQLi</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-muted/30 border-none shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-primary" /> UNION-Based SQLi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Permite extrair dados de outras tabelas combinando resultados.</p>
                    <code className="text-xs bg-zinc-950 text-zinc-50 p-2 rounded block font-mono border border-zinc-800">UNION SELECT username, password FROM users--</code>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30 border-none shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-primary" /> Error-Based SQLi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Força o banco a gerar erros verbosos que revelam estrutura ou dados.</p>
                    <code className="text-xs bg-zinc-950 text-zinc-50 p-2 rounded block font-mono border border-zinc-800">CAST((SELECT version()) AS INT)</code>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30 border-none shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-primary" /> Blind SQLi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Infere dados fazendo perguntas de "sim/não" ao banco ou medindo tempo de resposta.</p>
                    <code className="text-xs bg-zinc-950 text-zinc-50 p-2 rounded block font-mono border border-zinc-800">WAITFOR DELAY '0:0:5'--</code>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30 border-none shadow-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-primary" /> Stored Procedure Injection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Execução de procedimentos armazenados perigosos (ex: xp_cmdshell).</p>
                    <code className="text-xs bg-zinc-950 text-zinc-50 p-2 rounded block font-mono border border-zinc-800">EXEC xp_cmdshell 'net user add...'</code>
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border rounded-xl px-4 bg-card shadow-sm">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-4 text-left">
                <div className="p-2 rounded-md bg-green-500/10 text-green-600">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Defesa em Profundidade (DBA Perspective)</h4>
                  <p className="text-sm text-muted-foreground font-normal">Estratégias de mitigação em múltiplas camadas</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6 pt-2 space-y-6">
              
              <div className="flex gap-4 items-start">
                <div className="mt-1">
                  <Badge variant="default" className="bg-primary/80 hover:bg-primary">Nível Aplicação</Badge>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base">Prepared Statements (Obrigatório)</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Uso mandatório de bibliotecas que suportem o protocolo binário do banco de dados (ex: <code>pg-protocol</code> para Postgres, <code>libmysqlclient</code>). ORMs modernos geralmente fazem isso por padrão.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="mt-1">
                  <Badge variant="secondary">Nível Banco</Badge>
                </div>
                <div className="space-y-2 w-full">
                  <h4 className="font-bold text-base">Least Privilege (GRANT/REVOKE)</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A aplicação nunca deve conectar como <code>sa</code> ou <code>postgres</code>. Crie usuários com permissões granulares.
                  </p>
                  <div className="bg-zinc-950 p-4 rounded-lg text-sm font-mono text-zinc-300 border border-zinc-800 shadow-inner">
                    <span className="text-zinc-500">-- Exemplo de Hardening:</span><br/>
                    <span className="text-purple-400">CREATE ROLE</span> app_user <span className="text-purple-400">LOGIN PASSWORD</span> <span className="text-green-400">'...'</span>;<br/>
                    <span className="text-purple-400">GRANT SELECT, INSERT, UPDATE ON</span> table_users <span className="text-purple-400">TO</span> app_user;<br/>
                    <span className="text-purple-400">REVOKE ALL ON</span> table_admin_logs <span className="text-purple-400">FROM</span> app_user;<br/>
                    <span className="text-zinc-500">-- Bloquear acesso a tabelas de sistema</span><br/>
                    <span className="text-purple-400">REVOKE SELECT ON</span> information_schema.tables <span className="text-purple-400">FROM</span> app_user;
                  </div>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="mt-1">
                  <Badge variant="outline">Arquitetura</Badge>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base">Stored Procedures & Views</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Encapsular queries complexas em Stored Procedures pode adicionar uma camada de abstração. O uso de Views pode limitar quais colunas a aplicação consegue enxergar, mitigando o impacto de um <code>SELECT *</code> injetado.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="mt-1">
                  <Badge variant="outline">Monitoramento</Badge>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base">Database Activity Monitoring (DAM)</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Implementar auditoria para detectar padrões anômalos, como queries que retornam um número excessivo de linhas ou erros de sintaxe frequentes vindos do mesmo IP.
                  </p>
                </div>
              </div>

            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default SqlInjectionGuide;
