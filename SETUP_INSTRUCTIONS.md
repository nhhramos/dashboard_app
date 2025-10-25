# CSV Analyzer - Instruções de Setup

Este documento descreve como configurar e rodar o CSV Analyzer (Frontend React + Backend Flask).

## Pré-requisitos

- Node.js 18+ e npm/pnpm
- Python 3.8+
- Git

## Estrutura do Projeto

```
├── csv-analyzer-lp/          # Frontend React (este projeto)
│   ├── client/
│   ├── pnpm-lock.yaml
│   └── ...
│
└── alphabot-app/             # Backend Flask (seu repositório)
    ├── app.py
    ├── requirements.txt
    └── ...
```

## Passo 1: Preparar o Backend Flask

### 1.1 Clonar/Acessar o repositório Flask

```bash
cd /caminho/para/alphabot-app
```

### 1.2 Instalar dependências Python

```bash
pip install -r requirements.txt
pip install flask-cors  # Importante para CORS
```

### 1.3 Configurar variáveis de ambiente

Certifique-se de que seu `.env` contém:
```
GEMINI_API_KEY=sua_chave_aqui
```

### 1.4 Atualizar app.py para habilitar CORS

Adicione as seguintes linhas no início do `app.py`:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas as rotas
```

### 1.5 Rodar o servidor Flask

```bash
python app.py
```

O servidor estará disponível em: **http://localhost:5000**

## Passo 2: Preparar o Frontend React

### 2.1 Acessar o diretório do frontend

```bash
cd /caminho/para/csv-analyzer-lp
```

### 2.2 Instalar dependências

```bash
pnpm install
```

ou

```bash
npm install
```

### 2.3 Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_API_URL=http://localhost:5000
```

Para produção, altere para sua URL do servidor Flask:
```env
VITE_API_URL=https://seu-servidor.com
```

### 2.4 Rodar o servidor de desenvolvimento

```bash
pnpm dev
```

O frontend estará disponível em: **http://localhost:3000**

## Passo 3: Testar a Integração

### 3.1 Acessar a aplicação

1. Abra seu navegador e vá para **http://localhost:3000**
2. Você verá a página Hero com a opção de upload

### 3.2 Testar upload de CSV

1. Clique em "Selecionar Arquivo" ou arraste um arquivo CSV
2. O arquivo será enviado para `http://localhost:5000/upload_csv`
3. Você verá uma mensagem de sucesso com as colunas detectadas

### 3.3 Testar o chat

1. Após o upload, você será redirecionado para a página de chat
2. Digite uma pergunta sobre seus dados (ex: "Qual é o total de vendas?")
3. A pergunta será enviada para `http://localhost:5000/chat`
4. A resposta do Gemini será exibida no chat

## Troubleshooting

### Erro: "Erro ao conectar com o servidor"

**Solução:**
1. Verifique se o Flask está rodando em http://localhost:5000
2. Verifique se CORS está habilitado no Flask
3. Abra o console do navegador (F12) para ver erros mais detalhados

### Erro: "GEMINI_API_KEY não configurada"

**Solução:**
1. Verifique se a chave está no arquivo `.env` do Flask
2. Reinicie o servidor Flask após alterar `.env`

### Erro: "Arquivo CSV não é processado"

**Solução:**
1. Verifique se o arquivo está em formato CSV válido
2. Verifique se o arquivo tem menos de 10MB
3. Verifique os logs do Flask para erros de parsing

### CORS Error

**Solução:**
1. Certifique-se de que `flask-cors` está instalado
2. Certifique-se de que `CORS(app)` está no seu `app.py`
3. Reinicie o servidor Flask

## Estrutura de Arquivos Importantes

```
csv-analyzer-lp/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Hero.tsx        # Página inicial com upload
│   │   │   └── Home.tsx        # Página de chat (integrada com Flask)
│   │   ├── components/
│   │   │   └── CSVUpload.tsx   # Componente de upload (integrado com Flask)
│   │   ├── App.tsx             # Roteamento
│   │   └── main.tsx
│   ├── index.html
│   └── vite.config.ts
├── INTEGRATION_GUIDE.md        # Guia detalhado de integração
├── SETUP_INSTRUCTIONS.md       # Este arquivo
└── ...

alphabot-app/
├── app.py                      # Backend Flask (com endpoints /upload_csv e /chat)
├── requirements.txt
├── templates/
├── static/
└── ...
```

## Endpoints da API

### Upload CSV
```
POST /upload_csv
Content-Type: multipart/form-data

Request:
- csv_file: <arquivo CSV>

Response:
{
  "message": "Arquivo CSV carregado e pronto para análise!",
  "columns": ["coluna1", "coluna2", "coluna3"]
}
```

### Chat
```
POST /chat
Content-Type: application/json

Request:
{
  "message": "Sua pergunta sobre os dados"
}

Response:
{
  "reply": "Resposta da análise gerada pelo Gemini"
}
```

## Próximos Passos

### Desenvolvimento Local
1. ✅ Frontend rodando em http://localhost:3000
2. ✅ Backend rodando em http://localhost:5000
3. ✅ CORS habilitado
4. ✅ Variáveis de ambiente configuradas

### Deploy em Produção
1. Build do frontend: `pnpm build`
2. Deploy do frontend (Vercel, Netlify, etc.)
3. Deploy do backend (Heroku, Railway, etc.)
4. Atualizar `VITE_API_URL` para a URL do servidor em produção

## Recursos Adicionais

- [Documentação do Flask](https://flask.palletsprojects.com/)
- [Documentação do React](https://react.dev/)
- [Documentação da API Gemini](https://ai.google.dev/)
- [Documentação do Vite](https://vitejs.dev/)

## Suporte

Se encontrar problemas:
1. Verifique os logs do navegador (F12)
2. Verifique os logs do servidor Flask
3. Consulte o arquivo `INTEGRATION_GUIDE.md`
4. Verifique se todas as dependências estão instaladas

---

**Última atualização:** Outubro 2024

