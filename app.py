import os
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import pandas as pd
import google.generativeai as genai
from werkzeug.utils import secure_filename
import io
from dotenv import load_dotenv
import re

# Carregar variáveis de ambiente
load_dotenv()

app = Flask(__name__)

@app.route('/')
def index():
    return jsonify({
        "message": "Bem-vindo à CSV Analizer!",
        "status": "online",
        "endpoints": {
        "health": "/health",
        "chat": "/chat (POST)",
        "upload_csv": "/upload_csv (POST)",
        "dashboard": "/dashboard (POST)"
        },
        "version": "1.0"
    })

# Configurar CORS para permitir requisições do front-end
# app.py
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:5173",
            "http://localhost:3000",
            "https://*.vercel.app",  # Aceita todos os domínios do Vercel
            "https://dashboard-app-kofs.onrender.com"  # Ou seu domínio específico
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})
app.config["UPLOAD_FOLDER"] = "./uploads"
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB max file size

# Garante que o diretório de uploads exista
if not os.path.exists(app.config["UPLOAD_FOLDER"]):
    os.makedirs(app.config["UPLOAD_FOLDER"])

# Configuração da API Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("  Erro: A variável de ambiente GEMINI_API_KEY não está configurada.")
else:
    genai.configure(api_key=GEMINI_API_KEY)
    print(" API Gemini configurada com sucesso")

# Variável global para armazenar o DataFrame
df_global = None

# Função para carregar CSV local de exemplo ao iniciar
def load_local_csv():
    global df_global
    local_csv_path = "./exemplo_vendas.csv"
    if os.path.exists(local_csv_path):
        try:
            df_global = pd.read_csv(local_csv_path)
            print(f" CSV local carregado: {local_csv_path}")
        except Exception as e:
            print(f" Erro ao carregar CSV local: {str(e)}")

load_local_csv()

# Função para identificar tipos de análises disponíveis baseado na pergunta e nos dados
def generate_dashboard(user_message, df):
    """
    Gera um dashboard de análises disponíveis baseado na pergunta do usuário
    e nas características dos dados disponíveis.
    """
    if df is None:
        return {
            "available": False,
            "message": "Nenhum CSV carregado. Por favor, carregue um arquivo primeiro."
        }
    
    # Análise das colunas
    numeric_cols = df.select_dtypes(include=['int64', 'float64']).columns.tolist()
    categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
    date_cols = []
    
    # Tentar identificar colunas de data
    for col in df.columns:
        if 'data' in col.lower() or 'date' in col.lower():
            date_cols.append(col)
    
    # Palavras-chave na pergunta
    message_lower = user_message.lower()
    
    # Definir análises disponíveis
    analyses = []
    
    # 1. Análise Descritiva (sempre disponível se houver dados numéricos)
    if numeric_cols:
        analyses.append({
            "id": "descriptive",
            "name": "📊 Análise Descritiva",
            "description": "Estatísticas básicas: média, mediana, min, max, desvio padrão",
            "relevant": any(word in message_lower for word in ['média', 'resumo', 'estatística', 'geral', 'descritiva']),
            "columns": numeric_cols
        })
    
    # 2. Análise de Tendências (se houver coluna de data)
    if date_cols or any('mes' in col.lower() or 'ano' in col.lower() for col in df.columns):
        analyses.append({
            "id": "trends",
            "name": "📈 Análise de Tendências",
            "description": "Padrões ao longo do tempo, crescimento, sazonalidade",
            "relevant": any(word in message_lower for word in ['tendência', 'tempo', 'crescimento', 'evolução', 'histórico']),
            "columns": date_cols if date_cols else [col for col in df.columns if 'mes' in col.lower() or 'ano' in col.lower()]
        })
    
    # 3. Comparação entre Categorias
    if categorical_cols:
        analyses.append({
            "id": "comparison",
            "name": "⚖️ Análise Comparativa",
            "description": f"Compare {', '.join(categorical_cols[:3])}",
            "relevant": any(word in message_lower for word in ['comparar', 'diferença', 'versus', 'entre', 'melhor', 'pior']),
            "columns": categorical_cols
        })
    
    # 4. Top/Ranking
    if categorical_cols and numeric_cols:
        analyses.append({
            "id": "ranking",
            "name": "🏆 Rankings e Top N",
            "description": "Identificar maiores, menores, melhores performances",
            "relevant": any(word in message_lower for word in ['maior', 'menor', 'top', 'ranking', 'melhor', 'pior', 'mais', 'menos']),
            "columns": categorical_cols + numeric_cols
        })
    
    # 5. Detecção de Anomalias
    if numeric_cols:
        analyses.append({
            "id": "anomalies",
            "name": "🔍 Detecção de Anomalias",
            "description": "Identificar valores incomuns ou outliers",
            "relevant": any(word in message_lower for word in ['anomalia', 'outlier', 'incomum', 'estranho', 'problema']),
            "columns": numeric_cols
        })
    
    # 6. Correlações
    if len(numeric_cols) >= 2:
        analyses.append({
            "id": "correlation",
            "name": "🔗 Análise de Correlações",
            "description": "Relações entre diferentes variáveis numéricas",
            "relevant": any(word in message_lower for word in ['correlação', 'relação', 'influência', 'impacto', 'afeta']),
            "columns": numeric_cols
        })
    
    # 7. Distribuição
    if numeric_cols or categorical_cols:
        analyses.append({
            "id": "distribution",
            "name": "📉 Análise de Distribuição",
            "description": "Como os dados estão distribuídos, frequências",
            "relevant": any(word in message_lower for word in ['distribuição', 'frequência', 'como está', 'quantos']),
            "columns": numeric_cols + categorical_cols
        })
    
    # 8. Agregações e Totais
    if numeric_cols:
        analyses.append({
            "id": "aggregation",
            "name": "➕ Totais e Agregações",
            "description": "Somas, contagens, agrupamentos",
            "relevant": any(word in message_lower for word in ['total', 'soma', 'quantos', 'contar', 'agrupar']),
            "columns": numeric_cols + categorical_cols
        })
    
    # Ordenar por relevância
    analyses_sorted = sorted(analyses, key=lambda x: x['relevant'], reverse=True)
    
    return {
        "available": True,
        "total_analyses": len(analyses),
        "analyses": analyses_sorted,
        "data_info": {
            "rows": len(df),
            "columns": len(df.columns),
            "numeric_columns": len(numeric_cols),
            "categorical_columns": len(categorical_cols),
            "has_dates": len(date_cols) > 0
        }
    }

# Rota de health check
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "gemini_configured": bool(GEMINI_API_KEY),
        "csv_loaded": df_global is not None
    }), 200

# Nova rota para obter o dashboard
@app.route("/dashboard", methods=["POST"])
def get_dashboard():
    """
    Retorna um dashboard de análises disponíveis baseado na pergunta do usuário
    """
    user_message = request.json.get("message", "")
    
    dashboard = generate_dashboard(user_message, df_global)
    
    return jsonify(dashboard), 200

# Upload de arquivo CSV
@app.route("/upload_csv", methods=["POST"])
def upload_csv():
    global df_global
    
    if "csv_file" not in request.files:
        return jsonify({"message": "Nenhum arquivo enviado"}), 400

    file = request.files["csv_file"]
    
    if file.filename == "":
        return jsonify({"message": "Nenhum arquivo selecionado"}), 400

    if file and file.filename.endswith(".csv"):
        try:
            # Ler o CSV diretamente do stream
            df_global = pd.read_csv(io.StringIO(file.stream.read().decode("utf-8")))
            
            return jsonify({
                "message": " Arquivo CSV carregado e pronto para análise!",
                "columns": df_global.columns.tolist(),
                "rows": len(df_global),
                "preview": df_global.head(5).to_dict(orient="records")
            }), 200
            
        except Exception as e:
            return jsonify({
                "message": f"Erro ao processar o arquivo CSV: {str(e)}"
            }), 500

    return jsonify({
        "message": "Formato de arquivo inválido. Por favor, envie um arquivo CSV."
    }), 400

# Rota do chat
@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")

    if not user_message:
        return jsonify({"reply": "Por favor, digite uma mensagem."}), 400

    if not GEMINI_API_KEY:
        return jsonify({
            "reply": "Erro: a chave da API do Gemini não foi configurada."
        }), 500

    # Gerar dashboard de análises disponíveis
    dashboard = generate_dashboard(user_message, df_global)

    # Montar contexto inteligente
    context = ""
    if df_global is not None:
        try:
            resumo_dados = df_global.describe(include="all").to_markdown()
        except Exception:
            resumo_dados = "Não foi possível gerar resumo estatístico."

        # Para evitar overload, envia até 100 linhas de exemplo
        amostra = df_global.head(100).to_markdown(index=False)

        # Adicionar informações do dashboard ao contexto
        dashboard_info = ""
        if dashboard["available"]:
            relevant_analyses = [a for a in dashboard["analyses"] if a["relevant"]]
            if relevant_analyses:
                dashboard_info = "\n\n🎯 ANÁLISES MAIS RELEVANTES PARA ESTA PERGUNTA:\n"
                for analysis in relevant_analyses[:3]:  # Top 3 mais relevantes
                    dashboard_info += f"- {analysis['name']}: {analysis['description']}\n"

        context = (
            f"Você tem acesso aos seguintes dados de um arquivo CSV:\n"
            f"Colunas: {df_global.columns.tolist()}\n"
            f"Total de linhas: {len(df_global)}\n\n"
            f"Resumo geral dos dados (numéricos e categóricos):\n{resumo_dados}\n\n"
            f"Amostra de 100 linhas do dataset:\n{amostra}\n"
            f"{dashboard_info}\n"
        )
    else:
        context = "Nenhum arquivo CSV foi carregado ainda. Por favor, carregue um arquivo CSV para análise.\n"

    # Prompt base do sistema - ATUALIZADO COM NOVA FUNÇÃO DE DASHBOARD
    prompt_system = (
        "Você é um bot especialista em análise de dados com uma NOVA FUNCIONALIDADE:\n\n"
        
        "🎯 MODO DE OPERAÇÃO:\n"
        "1. PRIMEIRO: Sempre apresente um mini-dashboard das análises mais relevantes que você pode fazer\n"
        "2. DEPOIS: Execute a análise principal solicitada\n"
        "3. FINALMENTE: Ofereça fazer análises complementares\n\n"
        
        "📊 TIPOS DE ANÁLISES QUE VOCÊ DOMINA:\n"
        "- Análise Descritiva: estatísticas básicas e resumos\n"
        "- Análise de Tendências: padrões temporais e evolução\n"
        "- Análise Comparativa: diferenças entre categorias\n"
        "- Rankings: identificar top performers\n"
        "- Detecção de Anomalias: valores incomuns\n"
        "- Correlações: relações entre variáveis\n"
        "- Distribuições: como os dados estão espalhados\n"
        "- Agregações: totais e agrupamentos\n\n"
        
        "💡 FORMATO DE RESPOSTA IDEAL:\n"
        "```\n"
        "🎯 ANÁLISES DISPONÍVEIS PARA SUA PERGUNTA:\n"
        "[Liste 2-3 análises mais relevantes]\n\n"
        "📊 ANÁLISE PRINCIPAL:\n"
        "[Responda a pergunta do usuário com dados concretos]\n\n"
        "💡 PRÓXIMOS PASSOS:\n"
        "[Sugira 1-2 análises complementares]\n"
        "```\n\n"
        
        "IMPORTANTE: Use o contexto fornecido para responder às perguntas, "
        "oferecendo insights, tendências e conclusões possíveis. "
        "Evite repetir o conteúdo do CSV; em vez disso, explique e interprete os dados.\n\n"
        f"{context}"
    )

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        chat_session = model.start_chat(history=[])
        response = chat_session.send_message(prompt_system + "\nUsuário: " + user_message)

        bot_reply = response.text
        
        # Retornar resposta com dashboard incluído
        return jsonify({
            "reply": bot_reply,
            "dashboard": dashboard  # Incluir dashboard na resposta
        })
        
    except Exception as e:
        print(f"❌ Erro na API Gemini: {str(e)}")
        return jsonify({
            "reply": f" Erro ao se comunicar com a IA: {str(e)}"
        }), 500

if __name__ == "__main__":
    print(" Servidor Flask iniciando...")
    print(" Certifique-se de que o arquivo .env está configurado com GEMINI_API_KEY")
    app.run(debug=True, port=5000, host="0.0.0.0")