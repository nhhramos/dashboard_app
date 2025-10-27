import { useState } from 'react';

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);

  // Função para enviar mensagem
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    
    // Adicionar mensagem do usuário
    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Chamar o backend
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          message: message 
        })
      });

      const data = await response.json();

      // Adicionar resposta da IA
      const botMessage = { 
        role: 'assistant', 
        content: data.reply 
      };
      setMessages(prev => [...prev, botMessage]);

      // Atualizar dashboard
      if (data.dashboard) {
        setDashboard(data.dashboard);
      }

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: '❌ Erro ao se comunicar com o servidor.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setMessage(''); // Limpar input
    }
  };

  // Função para buscar apenas o dashboard
  const fetchDashboard = async () => {
    if (!message.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message })
      });

      const data = await response.json();
      setDashboard(data);
    } catch (error) {
      console.error('Erro ao buscar dashboard:', error);
    }
  };

  return (
    <div className="chat-container">
      {/* Área do Dashboard */}
      {dashboard && dashboard.available && (
        <div className="dashboard">
          <h3>🎯 Análises Disponíveis</h3>
          <div className="dashboard-info">
            <p>📊 {dashboard.data_info.rows} linhas | {dashboard.data_info.columns} colunas</p>
          </div>
          
          <div className="analyses-grid">
            {dashboard.analyses.map((analysis) => (
              <div 
                key={analysis.id} 
                className={`analysis-card ${analysis.relevant ? 'relevant' : ''}`}
              >
                <h4>{analysis.name}</h4>
                <p>{analysis.description}</p>
                {analysis.relevant && <span className="badge">Relevante</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Área de Mensagens */}
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-content">
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div className="loading">Analisando...</div>}
      </div>

      {/* Área de Input */}
      <div className="input-area">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Faça uma pergunta sobre seus dados..."
        />
        <button onClick={fetchDashboard} disabled={loading}>
          📊 Ver Análises
        </button>
        <button onClick={handleSendMessage} disabled={loading}>
          Enviar
        </button>
      </div>
    </div>
  );
}

export default Chat;