import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Shield, Code, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const LoginDemo = () => {
  const [vulnerableInput, setVulnerableInput] = useState("");
  const [vulnerablePassword, setVulnerablePassword] = useState("");
  const [secureInput, setSecureInput] = useState("");
  const [securePassword, setSecurePassword] = useState("");
  const [vulnerableLoading, setVulnerableLoading] = useState(false);
  const [secureLoading, setSecureLoading] = useState(false);
  const [vulnerableResult, setVulnerableResult] = useState<any>(null);
  const [secureResult, setSecureResult] = useState<any>(null);
  const { toast } = useToast();

  const vulnerableExamples = [
    "admin' --",
    "' OR '1'='1",
    "'; DROP TABLE users; --",
    "admin' OR 1=1 --"
  ];

  const handleVulnerableLogin = async () => {
    if (!vulnerableInput.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite um usuário",
        variant: "destructive"
      });
      return;
    }

    setVulnerableLoading(true);
    setVulnerableResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('login-vulnerable', {
        body: {
          username: vulnerableInput,
          password: vulnerablePassword || 'qualquersenha'
        }
      });

      if (error) throw error;
      
      setVulnerableResult(data);
      
      if (data.vulnerability_detected) {
        toast({
          title: "SQL Injection Detectado!",
          description: "O ataque foi bem-sucedido no sistema vulnerável",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao processar login vulnerável",
        variant: "destructive"
      });
    } finally {
      setVulnerableLoading(false);
    }
  };

  const handleSecureLogin = async () => {
    if (!secureInput.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite um usuário",
        variant: "destructive"
      });
      return;
    }

    setSecureLoading(true);
    setSecureResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('login-secure', {
        body: {
          username: secureInput,
          password: securePassword || 'demo123'
        }
      });

      if (error) throw error;
      
      setSecureResult(data);
      
      toast({
        title: data.success ? "Login Seguro" : "Login Rejeitado",
        description: data.message,
        variant: data.success ? "default" : "destructive"
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao processar login seguro",
        variant: "destructive"
      });
    } finally {
      setSecureLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-danger" />
            <CardTitle className="text-danger">Sistema Vulnerável</CardTitle>
          </div>
          <CardDescription>
            Demonstração de um sistema de login com vulnerabilidade SQL injection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vulnerable-username">Usuário</Label>
            <Input
              id="vulnerable-username"
              value={vulnerableInput}
              onChange={(e) => setVulnerableInput(e.target.value)}
              placeholder="Digite o usuário..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vulnerable-password">Senha</Label>
            <Input 
              id="vulnerable-password" 
              type="password" 
              placeholder="Digite a senha..."
              value={vulnerablePassword}
              onChange={(e) => setVulnerablePassword(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleVulnerableLogin} 
            variant="destructive" 
            className="w-full"
            disabled={vulnerableLoading}
          >
            {vulnerableLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login Vulnerável
          </Button>

          {vulnerableResult && (
            <Alert className={vulnerableResult.vulnerability_detected ? "border-danger" : "border-muted"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className={vulnerableResult.vulnerability_detected ? "text-danger" : "text-muted-foreground"}>
                <strong>{vulnerableResult.vulnerability_detected ? "SQL Injection Bem-sucedido!" : "Login Falhado"}</strong>
                <br />
                {vulnerableResult.message}
                {vulnerableResult.simulated_query && (
                  <div className="mt-2">
                    <code className="text-xs bg-muted p-1 rounded">{vulnerableResult.simulated_query}</code>
                  </div>
                )}
                {vulnerableResult.explanation && (
                  <p className="text-xs mt-1 opacity-80">{vulnerableResult.explanation}</p>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Exemplos de SQL Injection:</p>
            <div className="space-y-1">
              {vulnerableExamples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setVulnerableInput(example)}
                  className="block text-xs bg-background hover:bg-secondary p-2 rounded border text-left w-full"
                >
                  <code>{example}</code>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-success" />
            <CardTitle className="text-success">Sistema Seguro</CardTitle>
          </div>
          <CardDescription>
            Sistema protegido contra SQL injection usando prepared statements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="secure-username">Usuário</Label>
            <Input
              id="secure-username"
              value={secureInput}
              onChange={(e) => setSecureInput(e.target.value)}
              placeholder="Digite o usuário..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secure-password">Senha</Label>
            <Input 
              id="secure-password" 
              type="password" 
              placeholder="Use: demo123"
              value={securePassword}
              onChange={(e) => setSecurePassword(e.target.value)}
            />
          </div>
          <Button 
            className="w-full bg-success hover:bg-success/90"
            onClick={handleSecureLogin}
            disabled={secureLoading}
          >
            {secureLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login Seguro
          </Button>

          {secureResult && (
            <Alert className={secureResult.success ? "border-success" : "border-muted"}>
              <Shield className="h-4 w-4" />
              <AlertDescription className={secureResult.success ? "text-success" : "text-muted-foreground"}>
                <strong>{secureResult.success ? "Login Seguro Bem-sucedido!" : "Login Rejeitado"}</strong>
                <br />
                {secureResult.message}
                {secureResult.security_measures && (
                  <div className="mt-2">
                    <p className="text-xs font-medium">Medidas de Segurança Aplicadas:</p>
                    <ul className="text-xs list-disc list-inside mt-1 space-y-1">
                      {secureResult.security_measures.map((measure: string, index: number) => (
                        <li key={index}>{measure}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {secureResult.explanation && (
                  <p className="text-xs mt-2 opacity-80">{secureResult.explanation}</p>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-muted p-3 rounded-md">
            <div className="flex items-center space-x-2 mb-2">
              <Code className="h-4 w-4" />
              <p className="text-sm font-medium">Código Seguro:</p>
            </div>
            <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
{`// Prepared Statement
const query = 'SELECT * FROM users 
WHERE username = ? AND password = ?';
db.execute(query, [username, hashedPassword]);`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginDemo;