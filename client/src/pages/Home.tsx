import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Menu, X, Clock, Settings, HomeIcon } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  csvFile?: string;
  csvColumns?: string[];
}

export default function ChatPage() {
  const [, setLocation] = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Nova Conversa",
      messages: [],
      createdAt: new Date(),
    },
  ]);

  const [currentConversationId, setCurrentConversationId] = useState("1");
  const [messageInput, setMessageInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiUrl] = useState(import.meta.env.VITE_API_URL || "http://localhost:5000");

  const currentConversation =
    conversations.find((c) => c.id === currentConversationId) ||
    conversations[0];

  const handleSendMessage = async () => {
    if (!messageInput.trim() || isLoading) return;

    const userMessage = messageInput;
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: userMessage,
      timestamp: new Date(),
    };

    const updatedConversations = conversations.map((conv) => {
      if (conv.id === currentConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setMessageInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + Math.random()).toString(),
        type: "assistant",
        content: data.reply || "Erro ao processar a resposta",
        timestamp: new Date(),
      };

      const finalConversations = updatedConversations.map((conv) => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, assistantMessage],
          };
        }
        return conv;
      });

      setConversations(finalConversations);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "Desculpe, houve um erro ao processar sua solicitação. Verifique se o servidor está rodando em " +
          apiUrl,
        timestamp: new Date(),
      };

      const finalConversations = updatedConversations.map((conv) => {
        if (conv.id === currentConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, errorMessage],
          };
        }
        return conv;
      });

      setConversations(finalConversations);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `Nova Conversa ${conversations.length + 1}`,
      messages: [],
      createdAt: new Date(),
    };
    setConversations([...conversations, newConversation]);
    setCurrentConversationId(newConversation.id);
    setShowHistoryPanel(false);
  };

  const handleDeleteConversation = (id: string) => {
    const filtered = conversations.filter((c) => c.id !== id);
    setConversations(filtered);
    if (currentConversationId === id && filtered.length > 0) {
      setCurrentConversationId(filtered[0].id);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } bg-card border-r border-border transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                CSV
              </span>
            </div>
            <span className="font-bold text-lg">Analyzer</span>
          </div>
          <Button
            onClick={handleNewConversation}
            className="w-full gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus size={18} />
            Nova Conversa
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Conversas Recentes
          </div>
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => {
                setCurrentConversationId(conv.id);
                setShowHistoryPanel(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                currentConversationId === conv.id
                  ? "bg-primary/20 text-primary"
                  : "hover:bg-muted text-foreground/70"
              }`}
            >
              <div className="truncate text-sm font-medium">{conv.title}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {conv.messages.length} mensagens
              </div>
            </button>
          ))}
        </div>

        <div className="border-t border-border p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-foreground/70 hover:text-foreground"
          >
            <Clock size={18} />
            Histórico
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-foreground/70 hover:text-foreground"
          >
            <Settings size={18} />
            Configurações
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <button
              onClick={() => setLocation("/")}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Voltar para home"
            >
              <HomeIcon size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold">
                {currentConversation?.title || "CSV Analyzer"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {currentConversation?.messages.length || 0} mensagens
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistoryPanel(!showHistoryPanel)}
            >
              <Clock size={16} />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {currentConversation?.messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Upload size={32} className="text-muted-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    Comece uma nova análise
                  </h2>
                  <p className="text-muted-foreground max-w-md">
                    Faça upload de um arquivo CSV para começar a análise
                    inteligente com nosso assistente de IA.
                  </p>
                </div>
              ) : (
                currentConversation?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-md px-4 py-3 rounded-lg ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted text-foreground rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground rounded-lg rounded-bl-none px-4 py-3">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-border bg-card/50 backdrop-blur-sm p-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Digite sua pergunta sobre o CSV..."
                  disabled={isLoading}
                  className="flex-1 bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90 disabled:opacity-50"
                >
                  {isLoading ? "..." : "Enviar"}
                </Button>
              </div>
            </div>
          </div>

          {/* History Panel */}
          {showHistoryPanel && (
            <div className="w-80 border-l border-border bg-card/50 backdrop-blur-sm flex flex-col">
              <div className="border-b border-border p-4">
                <h3 className="font-bold text-lg">Histórico</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer group"
                    onClick={() => {
                      setCurrentConversationId(conv.id);
                      setShowHistoryPanel(false);
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {conv.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {conv.messages.length} mensagens
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {conv.createdAt.toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conv.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/80 transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

