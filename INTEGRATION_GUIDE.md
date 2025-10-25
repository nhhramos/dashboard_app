# Guia de Integração - CSV Analyzer Frontend com Flask Backend

Este guia descreve como integrar o frontend React (CSV Analyzer) com seu backend Flask existente.

## Estrutura da Integração

O frontend React se comunica com o backend Flask através de dois endpoints principais:

### 1. Upload de CSV
**Endpoint:** `POST /upload_csv`
- **Descrição:** Recebe um arquivo CSV e o processa
- **Parâmetros:** Arquivo CSV no campo `csv_file` (FormData)
- **Resposta esperada:** 
```json
{
  "message": "Arquivo CSV carregado e pronto para análise!",
  "columns": ["coluna1", "coluna2", "coluna3"]
}
```

### 2. Chat/Análise
**Endpoint:** `POST /chat`
- **Descrição:** Recebe uma pergunta do usuário e retorna análise do Gemini
- **Parâmetros:** 
```json
{
  "message": "Qual é o total de vendas?"
}
```
- **Resposta esperada:**
```json
{
  "reply": "Resposta da análise gerada pelo Gemini..."
}
```

## Configuração do CORS

Para que o frontend React se comunique com o backend Flask, você precisa habilitar CORS. Adicione o seguinte ao seu `app.py`:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas as rotas
```

Instale a dependência:
```bash
pip install flask-cors
```

## Como Rodar Localmente

### 1. Backend Flask

```bash
cd /caminho/para/alphabot-app
pip install -r requirements.txt
python app.py
```

O Flask rodará em `http://localhost:5000`

### 2. Frontend React

```bash
cd /caminho/para/csv-analyzer-lp
pnpm install
pnpm dev
```

O React rodará em `http://localhost:3000`

## Fluxo de Funcionamento

1. **Usuário acessa** `http://localhost:3000`
2. **Página Hero** é exibida com opção de upload
3. **Usuário faz upload de CSV** → Frontend envia para `POST /upload_csv`
4. **Backend processa** o arquivo com Pandas e retorna colunas
5. **Frontend navega** para página de chat
6. **Usuário digita pergunta** → Frontend envia para `POST /chat`
7. **Backend processa** com Gemini API e retorna resposta
8. **Frontend exibe** a resposta no chat

## Variáveis de Ambiente

### Backend (.env)
```
GEMINI_API_KEY=sua_chave_aqui
```

### Frontend (Configurável em Home.tsx)
```typescript
const [apiUrl] = useState("http://localhost:5000");
```

Para produção, altere para sua URL do servidor Flask.

## Estrutura de Pastas

```
csv-analyzer-lp/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Hero.tsx        # Página inicial com upload
│   │   │   └── Home.tsx        # Página de chat
│   │   ├── components/
│   │   │   └── CSVUpload.tsx   # Componente de upload
│   │   └── App.tsx
│   └── ...
└── ...

alphabot-app/
├── app.py                      # Backend Flask
├── requirements.txt
├── templates/
├── static/
└── ...
```

## Funcionalidades Implementadas

✅ **Upload de CSV com validação**
- Drag-and-drop
- Validação de tipo e tamanho
- Feedback visual

✅ **Chat Inteligente**
- Integração com Gemini API
- Histórico de conversas
- Sistema de abas

✅ **Design Responsivo**
- Dark mode
- Sidebar colapsável
- Interface limpa e moderna

## Troubleshooting

### Erro: "Erro ao conectar com o servidor"
- Verifique se o Flask está rodando em `http://localhost:5000`
- Verifique se CORS está habilitado no Flask
- Verifique o console do navegador para mais detalhes

### Erro: "GEMINI_API_KEY não configurada"
- Certifique-se de que a chave está no arquivo `.env`
- Reinicie o servidor Flask após alterar `.env`

### Arquivo CSV não é processado
- Verifique se o arquivo está em formato CSV válido
- Verifique se o arquivo tem menos de 10MB
- Verifique os logs do Flask para erros de parsing

## Próximos Passos

1. Adicione CORS ao seu Flask
2. Teste o upload de um arquivo CSV
3. Teste o chat com uma pergunta simples
4. Implante em produção conforme necessário

## Contato

Para dúvidas sobre a integração, verifique os logs do navegador (F12) e do servidor Flask.

