import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Shield, Code } from "lucide-react";

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="h-5 w-5" />
            <span>Comparação de Código</span>
          </CardTitle>
          <CardDescription>
            Análise detalhada entre implementações vulneráveis e seguras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="vulnerable" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="vulnerable" className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Vulnerável</span>
              </TabsTrigger>
              <TabsTrigger value="secure" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Seguro</span>
              </TabsTrigger>
              <TabsTrigger value="mitigations">Mitigações Extras</TabsTrigger>
            </TabsList>

            <TabsContent value="vulnerable">
              <div className="border border-danger/20 rounded-lg p-4 bg-danger/5">
                <div className="flex items-center space-x-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-danger" />
                  <h3 className="font-semibold text-danger">Código Vulnerável</h3>
                </div>
                <div className="bg-background rounded-md p-4 overflow-x-auto">
                  <pre className="text-sm">
                    <code>{vulnerableCode}</code>
                  </pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="secure">
              <div className="border border-success/20 rounded-lg p-4 bg-success/5">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="h-5 w-5 text-success" />
                  <h3 className="font-semibold text-success">Código Seguro</h3>
                </div>
                <div className="bg-background rounded-md p-4 overflow-x-auto">
                  <pre className="text-sm">
                    <code>{secureCode}</code>
                  </pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mitigations">
              <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-primary">Mitigações Adicionais</h3>
                </div>
                <div className="bg-background rounded-md p-4 overflow-x-auto">
                  <pre className="text-sm">
                    <code>{additionalMitigations}</code>
                  </pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeComparison;