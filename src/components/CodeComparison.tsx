import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Shield, Code, Terminal, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const CodeBlock = ({ code, language = "javascript", title }: { code: string, language?: string, title?: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          {title && <span className="ml-2 text-xs text-zinc-400 font-mono">{title}</span>}
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-zinc-100" onClick={copyToClipboard}>
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-zinc-300 leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

const CodeComparison = () => {
  const vulnerableCode = `// CÓDIGO VULNERÁVEL - NÃO USE EM PRODUÇÃO
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  // ❌ VULNERÁVEL: Concatenação direta de strings
  const query = \`SELECT * FROM users 
    WHERE username = '\${username}' 
    AND password = '\${password}'\`;
  
  db.query(query, (err, results) => {
    if (results.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

/* POSSÍVEIS ATAQUES:
 * username: admin' --
 * Resultado: SELECT * FROM users WHERE username = 'admin' -- AND password = 'qualquer'
 * 
 * username: ' OR '1'='1
 * Resultado: SELECT * FROM users WHERE username = '' OR '1'='1' AND password = 'qualquer'
 */`;

  const secureCode = `// CÓDIGO SEGURO - IMPLEMENTAÇÃO RECOMENDADA
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // ✅ SEGURO: Validação de entrada
    if (!username || !password) {
      return res.status(400).json({ error: 'Credenciais inválidas' });
    }
    
    // ✅ SEGURO: Prepared statement com placeholders
    const query = 'SELECT id, username, password_hash FROM users WHERE username = ?';
    
    const results = await db.execute(query, [username]);
    
    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    const user = results[0];
    
    // ✅ SEGURO: Hash da senha
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (isValidPassword) {
      // ✅ SEGURO: JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (error) {
    // ✅ SEGURO: Log de erro sem exposição de dados sensíveis
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});`;

  const additionalMitigations = `// MITIGAÇÕES ADICIONAIS

// 1. Configuração de banco com usuário limitado
const dbConfig = {
  user: 'app_user', // ✅ Usuário específico para aplicação
  password: process.env.DB_PASSWORD,
  database: 'myapp',
  // ✅ Usuário sem privilégios administrativos
  permissions: ['SELECT', 'INSERT', 'UPDATE'] // Sem DROP, ALTER, etc.
};

// 2. Middleware de validação
const validateLoginInput = (req, res, next) => {
  const { username, password } = req.body;
  
  // ✅ Whitelist de caracteres permitidos
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  
  if (!usernameRegex.test(username)) {
    return res.status(400).json({ error: 'Username inválido' });
  }
  
  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({ error: 'Username deve ter entre 3 e 20 caracteres' });
  }
  
  next();
};

// 3. Rate limiting
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // ✅ Limite de 5 tentativas por IP
  message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/login', loginLimiter);

// 4. Logging de segurança
const logSecurityEvent = (event, details) => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    event: event,
    ip: details.ip,
    userAgent: details.userAgent,
    // ✅ Log sem dados sensíveis
    sanitizedInput: details.input?.replace(/['"\\\\]/g, '')
  }));
};`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <Code className="h-6 w-6 text-primary" />
            <span>Comparação de Código</span>
          </CardTitle>
          <CardDescription className="text-base">
            Análise detalhada entre implementações vulneráveis e seguras
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Tabs defaultValue="vulnerable" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 h-auto p-1 bg-muted/50 rounded-xl">
              <TabsTrigger value="vulnerable" className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:text-destructive data-[state=active]:shadow-sm transition-all">
                <AlertTriangle className="h-4 w-4" />
                <span>Vulnerável</span>
              </TabsTrigger>
              <TabsTrigger value="secure" className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:text-success data-[state=active]:shadow-sm transition-all">
                <Shield className="h-4 w-4" />
                <span>Seguro</span>
              </TabsTrigger>
              <TabsTrigger value="mitigations" className="flex items-center gap-2 py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
                <Terminal className="h-4 w-4" />
                <span>Mitigações Extras</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vulnerable" className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-destructive text-lg">Código Vulnerável</h3>
                    <p className="text-sm text-muted-foreground">
                      Exemplo de implementação insegura comum em aplicações legadas
                    </p>
                  </div>
                </div>
                
                <div className="mb-6 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    <strong>Onde está o erro:</strong> Observe como as variáveis <code>username</code> e <code>password</code> são concatenadas diretamente na string da query. Isso permite que um atacante manipule a estrutura lógica do SQL inserindo caracteres especiais como aspas simples (').
                  </p>
                </div>

                <CodeBlock code={vulnerableCode} title="vulnerable-auth.js" />
              </div>
            </TabsContent>

            <TabsContent value="secure" className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl border border-success/20 bg-success/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-success/10">
                    <Shield className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-success text-lg">Código Seguro</h3>
                    <p className="text-sm text-muted-foreground">
                      Implementação recomendada seguindo as melhores práticas
                    </p>
                  </div>
                </div>

                <div className="mb-6 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    <strong>A Correção:</strong> O uso de <code>?</code> (placeholders) garante que o banco de dados trate os inputs estritamente como dados, nunca como comandos executáveis. Além disso, senhas são comparadas usando hash (bcrypt) e nunca em texto plano.
                  </p>
                </div>

                <CodeBlock code={secureCode} title="secure-auth.js" />
              </div>
            </TabsContent>

            <TabsContent value="mitigations" className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary text-lg">Mitigações Adicionais</h3>
                    <p className="text-sm text-muted-foreground">
                      Camadas extras de segurança para defesa em profundidade
                    </p>
                  </div>
                </div>

                <div className="mb-6 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    <strong>Defesa em Profundidade:</strong> Não confie em apenas uma camada de segurança. Valide inputs, limite privilégios do banco de dados e monitore atividades suspeitas.
                  </p>
                </div>

                <CodeBlock code={additionalMitigations} title="security-layers.js" />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeComparison;