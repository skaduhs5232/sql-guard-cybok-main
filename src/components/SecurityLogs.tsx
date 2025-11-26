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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 p-8 text-white shadow-2xl border border-blue-900/50">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
        
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg backdrop-blur-sm border border-blue-400/20">
                <Activity className="h-6 w-6 text-blue-300" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
                Dashboard de Monitoramento
              </h2>
            </div>
            <p className="text-blue-200/80 max-w-2xl text-lg leading-relaxed">
              Monitoramento em tempo real de tentativas de login, detecção de SQL Injection e análise de tráfego suspeito.
            </p>
          </div>
          <Button 
            onClick={fetchSecurityLogs} 
            disabled={loading}
            variant="outline"
            className="bg-blue-500/10 border-blue-400/30 text-blue-200 hover:bg-blue-500/20 hover:text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Total</Badge>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.total_attempts}</h3>
                <p className="text-sm text-muted-foreground">Tentativas Totais</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/10 border-red-200 dark:border-red-900/50 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Crítico</Badge>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-red-700 dark:text-red-400">{stats.sql_injection_attempts}</h3>
                <p className="text-sm text-red-600/80 dark:text-red-400/70">Injeções Detectadas</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/10 border-green-200 dark:border-green-900/50 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Sucesso</Badge>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-green-700 dark:text-green-400">{stats.successful_logins}</h3>
                <p className="text-sm text-green-600/80 dark:text-green-400/70">Logins Legítimos</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/10 border-purple-200 dark:border-purple-900/50 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Monitor</Badge>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-purple-700 dark:text-purple-400">{stats.security_incidents}</h3>
                <p className="text-sm text-purple-600/80 dark:text-purple-400/70">Incidentes Registrados</p>
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