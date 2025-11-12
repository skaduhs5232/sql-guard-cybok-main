import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Activity, Shield, AlertTriangle, Eye, Server } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LoginAttempt {
  id: string;
  username: string;
  password_input: string;
  ip_address: string;
  user_agent: string;
  is_vulnerable_endpoint: boolean;
  sql_injection_detected: boolean;
  injection_payload: string;
  success: boolean;
  created_at: string;
}

interface SecurityLog {
  id: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  payload: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

interface SecurityStats {
  total_attempts: number;
  sql_injection_attempts: number;
  vulnerable_endpoint_attempts: number;
  successful_logins: number;
  security_incidents: number;
}

const SecurityLogs = () => {
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const { toast } = useToast();

  const fetchSecurityLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-security-logs');

      if (error) throw error;

      setStats(data.stats);
      setLoginAttempts(data.login_attempts || []);
      setSecurityLogs(data.security_logs || []);
      setLastUpdated(data.last_updated);

      toast({
        title: "Logs Atualizados",
        description: "Dados de segurança carregados com sucesso"
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao carregar logs de segurança",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityLogs();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Logs de Segurança em Tempo Real</h3>
          <p className="text-muted-foreground">
            Monitoramento de tentativas de login e atividades suspeitas
          </p>
        </div>
        <Button onClick={fetchSecurityLogs} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Cards de estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Total de Tentativas</p>
                  <p className="text-lg font-bold">{stats.total_attempts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-xs text-muted-foreground">SQL Injections</p>
                  <p className="text-lg font-bold text-red-500">{stats.sql_injection_attempts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Server className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Endpoint Vulnerável</p>
                  <p className="text-lg font-bold text-orange-500">{stats.vulnerable_endpoint_attempts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Logins Bem-sucedidos</p>
                  <p className="text-lg font-bold text-green-500">{stats.successful_logins}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Incidentes Críticos</p>
                  <p className="text-lg font-bold text-purple-500">{stats.security_incidents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs com logs detalhados */}
      <Tabs defaultValue="attempts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="attempts">Tentativas de Login ({loginAttempts.length})</TabsTrigger>
          <TabsTrigger value="security">Logs de Segurança ({securityLogs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="attempts" className="space-y-4">
          {loginAttempts.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Nenhuma tentativa de login registrada ainda.</p>
              </CardContent>
            </Card>
          ) : (
            loginAttempts.map((attempt) => (
              <Card key={attempt.id} className={attempt.sql_injection_detected ? "border-red-500" : ""}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant={attempt.success ? "default" : "destructive"}>
                        {attempt.success ? "Sucesso" : "Falha"}
                      </Badge>
                      {attempt.sql_injection_detected && (
                        <Badge variant="destructive">SQL Injection</Badge>
                      )}
                      {attempt.is_vulnerable_endpoint && (
                        <Badge variant="outline">Endpoint Vulnerável</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{formatDate(attempt.created_at)}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      <strong>Usuário:</strong> {attempt.username}
                    </div>
                    <div>
                      <strong>IP:</strong> {attempt.ip_address}
                    </div>
                    <div className="md:col-span-1">
                      <strong>Senha:</strong> {attempt.is_vulnerable_endpoint ? attempt.password_input : '[REDACTED]'}
                    </div>
                  </div>

                  {attempt.injection_payload && (
                    <Alert className="mt-2 border-red-500">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Payload de Ataque:</strong> <code>{attempt.injection_payload}</code>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          {securityLogs.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Nenhum log de segurança registrado ainda.</p>
              </CardContent>
            </Card>
          ) : (
            securityLogs.map((log) => (
              <Card key={log.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge className={getSeverityColor(log.severity)}>
                        {log.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{log.event_type}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{formatDate(log.created_at)}</p>
                  </div>
                  
                  <p className="text-sm mb-2">{log.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div><strong>IP:</strong> {log.ip_address}</div>
                    <div><strong>User Agent:</strong> {log.user_agent?.substring(0, 50)}...</div>
                  </div>

                  {log.payload && (
                    <div className="mt-2 p-2 bg-muted rounded text-xs">
                      <strong>Payload:</strong> <code>{log.payload}</code>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {lastUpdated && (
        <p className="text-xs text-muted-foreground text-center">
          Última atualização: {new Date(lastUpdated).toLocaleString('pt-BR')}
        </p>
      )}
    </div>
  );
};

export default SecurityLogs;