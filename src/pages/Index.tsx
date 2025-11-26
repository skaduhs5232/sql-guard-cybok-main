import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SecurityHeader from "@/components/SecurityHeader";
import LoginDemo from "@/components/LoginDemo";
import SecurityAnalysis from "@/components/SecurityAnalysis";
import CodeComparison from "@/components/CodeComparison";
import SecurityLogs from "@/components/SecurityLogs";
import SqlInjectionGuide from "@/components/SqlInjectionGuide";
import { BookOpen, Play, ShieldCheck, Code2, Activity } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SecurityHeader />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        <Tabs defaultValue="guide" className="w-full space-y-6">
          <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 -mx-4 px-4 md:mx-0 md:px-0">
             <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50 rounded-xl border border-border/50 shadow-sm">
              <TabsTrigger value="guide" className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Guia Educativo</span>
                <span className="sm:hidden">Guia</span>
              </TabsTrigger>
              <TabsTrigger value="demo" className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                <Play className="h-4 w-4" />
                <span className="hidden sm:inline">Demonstração</span>
                <span className="sm:hidden">Demo</span>
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                <ShieldCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Análise</span>
                <span className="sm:hidden">Análise</span>
              </TabsTrigger>
              <TabsTrigger value="code" className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                <Code2 className="h-4 w-4" />
                <span className="hidden sm:inline">Código</span>
                <span className="sm:hidden">Código</span>
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex flex-col sm:flex-row items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Logs</span>
                <span className="sm:hidden">Logs</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-6">
            <TabsContent value="guide" className="m-0 focus-visible:outline-none focus-visible:ring-0">
              <SqlInjectionGuide />
            </TabsContent>

            <TabsContent value="demo" className="m-0 focus-visible:outline-none focus-visible:ring-0">
              <LoginDemo />
            </TabsContent>

            <TabsContent value="analysis" className="m-0 focus-visible:outline-none focus-visible:ring-0">
              <SecurityAnalysis />
            </TabsContent>

            <TabsContent value="code" className="m-0 focus-visible:outline-none focus-visible:ring-0">
              <CodeComparison />
            </TabsContent>

            <TabsContent value="logs" className="m-0 focus-visible:outline-none focus-visible:ring-0">
              <SecurityLogs />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
