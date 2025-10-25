import { useState } from "react";
import { useLocation } from "wouter";
import CSVUpload from "@/components/CSVUpload";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Hero() {
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [apiUrl] = useState(import.meta.env.VITE_API_URL || "http://localhost:5000");

  const handleFileSelect = (file: File, columns?: string[]) => {
    // Armazenar arquivo no localStorage
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      localStorage.setItem("uploadedCSV", JSON.stringify({ 
        name: file.name, 
        content,
        columns 
      }));
      // Navegar para a página de chat
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
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CSV</span>
            </div>
            <h1 className="text-2xl font-bold">CSV Analyzer</h1>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-foreground/70 hover:text-foreground transition-colors">
              Recursos
            </a>
            <a href="#how-it-works" className="text-foreground/70 hover:text-foreground transition-colors">
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
          {/* Main Content */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Seu Assistente Inteligente para{" "}
              <span className="text-primary">Planilhas CSV</span>
            </h2>

            <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto leading-relaxed">
              Analise, entenda e solucione suas planilhas de forma fácil e rápida
              com a ajuda de inteligência artificial avançada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-lg px-8"
              >
                Começar Agora
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8"
              >
                Ver Demo
              </Button>
            </div>
          </div>

          {/* Upload Area */}
          <div className="mb-20">
            <CSVUpload onFileSelect={handleFileSelect} apiUrl={apiUrl} />
          </div>

          {/* Features Grid */}
          <div id="features" className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Análise Profunda</h3>
              <p className="text-foreground/70">
                Extrai insights valiosos de seus dados com análise estatística avançada.
              </p>
            </div>

            <div className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">IA Inteligente</h3>
              <p className="text-foreground/70">
                Respostas contextualizadas e personalizadas para suas perguntas sobre dados.
              </p>
            </div>

            <div className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Rápido e Seguro</h3>
              <p className="text-foreground/70">
                Processamento instantâneo com máxima segurança e privacidade dos dados.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div id="how-it-works" className="bg-card/50 rounded-xl border border-border p-12 mb-20">
            <h3 className="text-3xl font-bold mb-12 text-center">Como Funciona</h3>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                  1
                </div>
                <h4 className="font-semibold mb-2">Faça Upload</h4>
                <p className="text-sm text-foreground/70">
                  Selecione seu arquivo CSV
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                  2
                </div>
                <h4 className="font-semibold mb-2">Processa</h4>
                <p className="text-sm text-foreground/70">
                  IA analisa seus dados
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                  3
                </div>
                <h4 className="font-semibold mb-2">Conversa</h4>
                <p className="text-sm text-foreground/70">
                  Faça perguntas sobre dados
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                  4
                </div>
                <h4 className="font-semibold mb-2">Insights</h4>
                <p className="text-sm text-foreground/70">
                  Obtenha respostas e insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Sobre</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="#" className="hover:text-foreground transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Carreiras</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="#" className="hover:text-foreground transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentação</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Termos</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookies</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="mailto:contato@csvanalyzer.com" className="hover:text-foreground transition-colors">contato@csvanalyzer.com</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-foreground/70">
              © 2024 CSV Analyzer. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                Status
              </a>
              <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                Suporte
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

