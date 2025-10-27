import { useState } from "react";
import { useLocation } from "wouter";
import CSVUpload from "@/components/CSVUpload";
import { Button } from "@/components/ui/button";
import {
  Menu,
  BarChart3,
  Sparkles,
  Shield,
  Upload,
  TrendingUp,
  MessageSquare,
  Lightbulb,
  FileSpreadsheet,
} from "lucide-react";

import { ReactElement } from "react";

// Tipagem das props dos componentes
type FeatureCardProps = {
  icon: ReactElement;
  title: string;
  description: string;
};

type StepProps = {
  icon: ReactElement;
  title: string;
  text: string;
};

type FooterColumnProps = {
  title: string;
  links: string[];
};

// Componente FeatureCard
function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-xl border border-border/50 bg-card/30 hover:bg-card/50 transition-all">
      <div className="mb-3">{icon}</div>
      <h4 className="font-semibold mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

// Componente Step
function Step({ icon, title, text }: StepProps) {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="mb-2">{icon}</div>
      <h5 className="font-medium mb-1">{title}</h5>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

// Componente FooterColumn
function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="flex flex-col gap-2">
      <h6 className="font-semibold">{title}</h6>
      <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
        {links.map((link, i) => (
          <li key={i}>
            <a href="#" className="hover:text-foreground transition-colors">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}








export default function Hero() {
  const [, setLocation] = useLocation();
  const [apiUrl] = useState(import.meta.env.VITE_API_URL || "http://localhost:5000");

  // Manipula upload do arquivo CSV
  const handleFileSelect = (file: File, columns?: string[]) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;

      // Armazena o arquivo e colunas no localStorage
      localStorage.setItem(
        "uploadedCSV",
        JSON.stringify({
          name: file.name,
          content,
          columns,
          uploadedAt: new Date().toISOString(),
        })
      );

      // Redireciona para o chat
      setLocation("/chat");
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card/30 flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="relative w-10 h-10 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <FileSpreadsheet
                className="w-5 h-5 text-primary-foreground"
                strokeWidth={2.5}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" strokeWidth={3} />
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              CSV Analyzer
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              Recursos
            </a>
            <a
              href="#how-it-works"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              Como Funciona
            </a>
            <Button variant="outline" size="sm">
              Sobre
            </Button>
          </nav>

          <button className="md:hidden p-2 hover:bg-muted rounded-lg">
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-4xl w-full">
          {/* Texto principal */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Seu Assistente Inteligente para{" "}
              <span className="text-primary">Planilhas CSV</span>
            </h2>

            <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto leading-relaxed">
              Analise, entenda e extraia insights das suas planilhas com
              inteligência artificial avançada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-lg px-8"
                onClick={() =>
                  document
                    .getElementById("upload-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Começar Agora
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8"
                onClick={() => setLocation("/chat")}
              >
                Ver Demo
              </Button>
            </div>
          </div>

          {/* Upload CSV */}
          <div id="upload-section" className="mb-20">
            <CSVUpload onFileSelect={handleFileSelect} apiUrl={apiUrl} />
          </div>

          {/* Features */}
          <div id="features" className="grid md:grid-cols-3 gap-8 mb-20">
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
              title="Análise Profunda"
              description="Extraia insights valiosos com análise estatística avançada e visualização inteligente."
            />
            <FeatureCard
              icon={<Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
              title="IA Inteligente"
              description="Respostas contextuais e personalizadas para suas perguntas sobre dados."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-green-600 dark:text-green-400" />}
              title="Rápido e Seguro"
              description="Processamento instantâneo com máxima segurança e privacidade de dados."
            />
          </div>

          {/* Como Funciona */}
          <div
            id="how-it-works"
            className="bg-card/50 rounded-xl border border-border p-12 mb-20"
          >
            <h3 className="text-3xl font-bold mb-12 text-center">Como Funciona</h3>

            <div className="grid md:grid-cols-4 gap-6">
              <Step icon={<Upload />} title="Faça Upload" text="Envie seu arquivo CSV" />
              <Step icon={<TrendingUp />} title="Processa" text="IA analisa seus dados" />
              <Step
                icon={<MessageSquare />}
                title="Converse"
                text="Faça perguntas sobre seus dados"
              />
              <Step
                icon={<Lightbulb />}
                title="Obtenha Insights"
                text="Receba análises automáticas"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <FooterColumn
              title="Sobre"
              links={["Sobre Nós", "Blog", "Carreiras"]}
            />
            <FooterColumn
              title="Produto"
              links={["Recursos", "Preços", "Documentação"]}
            />
            <FooterColumn title="Legal" links={["Privacidade", "Termos", "Cookies"]} />
            <FooterColumn
              title="Contato"
              links={["contato@csvanalyzer.com", "Twitter", "LinkedIn"]}
            />
          </div>

          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-foreground/70">
              © 2024 CSV Analyzer. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                Status
              </a>
              <a
                href="#"
                className="text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                Suporte
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}



