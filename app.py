from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from chatbot import chatbot
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message', '')
        selecao_prato = data.get('selecao_prato', None)  # Para quando usuário seleciona prato
        # Prioriza API key da variável de ambiente (Render) ou da requisição
        api_key = os.getenv('GEMINI_API_KEY') or data.get('api_key', None)
        
        if not message:
            return jsonify({'error': 'Mensagem não fornecida'}), 400
        
        # Chama o chatbot com os parâmetros apropriados
        result = chatbot.get_response(message, selecao_prato=selecao_prato, api_key=api_key)
        
        return jsonify({
            'response': result['response'],
            'intent': result['intent'],
            'probability': result['probability'],
            'all_intents': result.get('all_intents', []),
            'all_probabilities': result.get('all_probabilities', []),
            'sentences_processed': result.get('sentences_processed', 1),
            'multiple_sentences': result.get('sentences_processed', 1) > 1,
            'needs_prato_selection': result.get('needs_prato_selection', False)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/intents')
def get_intents():
    """Endpoint para ver todas as intenções disponíveis"""
    return jsonify(chatbot.intents)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)