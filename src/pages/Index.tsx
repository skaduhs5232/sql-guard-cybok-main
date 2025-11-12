import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SecurityHeader from "@/components/SecurityHeader";
import LoginDemo from "@/components/LoginDemo";
import SecurityAnalysis from "@/components/SecurityAnalysis";
import CodeComparison from "@/components/CodeComparison";
import SecurityLogs from "@/components/SecurityLogs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SecurityHeader />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Sistema de Demonstração: SQL Injection
          </h2>
          <p className="text-lg text-muted-foreground max-w-4xl">
            Esta aplicação demonstra vulnerabilidades de SQL injection e suas respectivas mitigações, 
            seguindo os princípios estabelecidos pelo CYBOK (Cyber Security Body of Knowledge). 
            Explore diferentes cenários de ataque e aprenda como implementar defesas eficazes.
          </p>
        </div>

        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="demo">Demonstração de Login</TabsTrigger>
            <TabsTrigger value="analysis">Análise de Segurança</TabsTrigger>
            <TabsTrigger value="code">Comparação de Código</TabsTrigger>
            <TabsTrigger value="logs">Logs em Tempo Real</TabsTrigger>
          </TabsList>

          <TabsContent value="demo">
            <LoginDemo />
          </TabsContent>

          <TabsContent value="analysis">
            <SecurityAnalysis />
          </TabsContent>

          <TabsContent value="code">
            <CodeComparison />
          </TabsContent>

          <TabsContent value="logs">
            <SecurityLogs />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
