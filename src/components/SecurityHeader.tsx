import { Shield, AlertTriangle } from "lucide-react";

const SecurityHeader = () => {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                CYBOK Defesa SQL
              </h1>
              <p className="text-sm text-muted-foreground">
                Sistema de Demonstração de Segurança CYBOK
              </p>
            </div>
          </div>
          {/* <div className="flex items-center space-x-2 text-warning">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-sm font-medium">Ambiente de Demonstração</span>
          </div> */}
        </div>
      </div>
    </header>
  );
};

export default SecurityHeader;