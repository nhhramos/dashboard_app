# 📊 CSV Analyzer - Guia de Instalação e Uso

Aplicação para análise inteligente de arquivos CSV usando Dashboard + IA (Google Gemini).

## 🚀 Tecnologias

- **Backend**: Flask (Python)
- **Frontend**: React + Vite + TypeScript
- **IA**: Google Gemini API

## 📋 Pré-requisitos

- Python 3.8+
- Node.js 18+
- Chave API do Google Gemini ([obter aqui](https://makersuite.google.com/app/apikey))

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd csv-analyzer
```

### 2. Configure o Backend

```bash
# Instale as dependências Python
pip install -r requirements.txt

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env e adicione sua GEMINI_API_KEY
```

### 3. Configure o Frontend

```bash
cd client
npm install
```

## ▶️ Executar a Aplicação

### Opção 1: Script Automático (Linux/Mac)

```bash
chmod +x start.sh
./start.sh
```

### Opção 2: Manualmente

**Terminal 1 - Backend:**
```bash
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

## 🌐 Acessar a Aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📝 Como Usar

1. Acesse o frontend em `http://localhost:5173`
2. Faça upload de um arquivo CSV
3. Faça perguntas sobre seus dados no chat
4. A IA irá analisar e responder baseada nos dados do CSV

## 🔍 Endpoints da API

### Upload CSV
```
POST /upload_csv
Content-Type: multipart/form-data
Body: { csv_file: <arquivo> }
```

### Chat
```
POST /chat
Content-Type: application/json
Body: { message: "sua pergunta" }
```

### Health Check
```
GET /health
```

## 🐛 Solução de Problemas

### Backend não inicia
- Verifique se o Python 3.8+ está instalado
- Verifique se a GEMINI_API_KEY está configurada no `.env`
- Execute: `pip install -r requirements.txt`

### Frontend não conecta ao backend
- Verifique se o backend está rodando em `http://localhost:5000`
- Verifique o arquivo `client/.env` - deve ter `VITE_API_URL=http://localhost:5000`

### Erro de CORS
- Certifique-se de que `flask-cors` está instalado
- Verifique se o backend tem a configuração CORS correta

## 📁 Estrutura do Projeto

```
csv-analyzer/
├── app.py                 # Backend Flask
├── requirements.txt       # Dependências Python
├── .env                   # Variáveis de ambiente (criar)
├── .env.example          # Exemplo de configuração
├── uploads/              # Diretório para arquivos temporários
├── client/               # Frontend React
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Hero.tsx      # Página inicial
│   │   │   └── Home.tsx      # Página de chat
│   │   └── components/
│   │       └── CSVUpload.tsx # Componente de upload
│   ├── .env              # Config do frontend (criar)
│   └── package.json
└── README.md
```

## 🔐 Segurança

- Nunca commite o arquivo `.env` com suas chaves
- O `.gitignore` já está configurado para ignorar arquivos sensíveis
- Mantenha suas dependências atualizadas

## 📄 Licença

MIT License - sinta-se livre para usar e modificar.

## 🤝 Contribuindo

Contribuições são bem-vindas! Abra uma issue ou pull request.

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do backend e frontend
2. Consulte a seção "Solução de Problemas"
3. Abra uma issue no GitHub
