# Teste do Chatbot Sakura Sushi

## Frases para testar múltiplas intenções:

1. **Teste básico:**
   - "Olá, quero pedir sushi de salmão"
   - "Oi, quanto custa o temaki?"

2. **Múltiplas frases:**
   - "Olá! Quero fazer um pedido. Gostaria de saber o preço do combo família."
   - "Boa noite, quero sushi de atum e também gostaria de saber o tempo de entrega."

3. **Frases complexas:**
   - "Oi, preciso fazer um pedido urgente, quero combo salmão, quanto custa e em quanto tempo chega?"
   - "Bom dia! Quero ver o cardápio, principalmente os preços dos temakis, e também saber sobre tempo de entrega."

4. **Teste de reconhecimento de pratos:**
   - "Quero hot roll"
   - "Preciso de yakissoba"
   - "Gostaria de philadelphia"
   - "Vou querer califórnia"

5. **Teste de reclamações:**
   - "Meu pedido chegou frio"
   - "O sushi veio mal feito"
   - "Demorou muito para entregar"

6. **Teste de agradecimentos:**
   - "Muito obrigado"
   - "Valeu pela ajuda"
   - "Arigato!"

7. **Teste de despedidas:**
   - "Tchau"
   - "Até logo"
   - "Sayonara"

## Intenções implementadas (9 intenções):

✅ **cumprimento** - 15+ frases, 4+ respostas
✅ **compra** - 15+ frases, 4+ respostas  
✅ **itens_disponiveis** - 15+ frases, 4+ respostas
✅ **precos** - 15+ frases, 4+ respostas
✅ **tempo_entrega** - 15+ frases, 4+ respostas
✅ **agradecimento** - 15+ frases, 4+ respostas
✅ **reclamacao** - 15+ frases, 4+ respostas
✅ **despedida** - 15+ frases, 4+ respostas
✅ **ingredientes** - 50+ frases, integração com Gemini AI

## Funcionalidades implementadas:

✅ **Processamento de múltiplas frases** em uma única requisição
✅ **Exibição de resposta, intenção detectada e probabilidade**
✅ **Frontend web para interação**
✅ **Mais de 15 frases por intenção**
✅ **4+ respostas por intenção**
✅ **8 intenções obrigatórias do Checkpoint 2**
✅ **Intenção "ingredientes" com integração Gemini AI**
✅ **Seleção múltipla de pratos**
✅ **Busca de receitas e ingredientes via API Gemini**

## Configuração da API Gemini:

Para usar a funcionalidade de ingredientes, você precisa de uma API key do Google Gemini:

1. **Obter API Key:**
   - Acesse: https://makersuite.google.com/app/apikey
   - Crie uma conta Google (se necessário)
   - Gere uma nova API key

2. **Configurar API Key:**
   - **Opção 1 (Recomendado):** Configure como variável de ambiente:
     ```bash
     export GEMINI_API_KEY="sua-api-key-aqui"
     ```
   - **Opção 2:** Envie a API key diretamente na requisição (não recomendado para produção)

## Como testar:

1. **Instalar dependências:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Executar o servidor:**
   ```bash
   python app.py
   ```

3. **Acessar a interface:**
   - Abra o navegador: `http://localhost:5000`

4. **Testar funcionalidade de ingredientes:**
   - Digite: "Quais são os ingredientes do lasanha?"
   - Ou: "Quero saber a receita do temaki"
   - O bot mostrará uma lista de pratos disponíveis
   - Selecione o número do prato (ex: "1" ou "1,3,5" para múltiplos)
   - O bot consultará a API Gemini e retornará a receita completa

5. **Testar outras intenções:**
   - Use as frases de teste acima
   - Observe as informações de intenção e probabilidade
   - Teste frases com múltiplas intenções

## Exemplos de uso da API:

### Teste via cURL (sem interface web):

```bash
# 1. Detectar intenção de ingredientes
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "quais são os ingredientes"}'

# 2. Selecionar prato (resposta do passo 1 mostrará lista)
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "1",
    "selecao_prato": "1",
    "api_key": "sua-gemini-api-key"
  }'
```

## Pratos disponíveis para consulta:

1. lasanha
2. feijoada
3. moqueca
4. spaghetti alla carbonara
5. yakissoba
6. sushi de salmão
7. temaki
8. ramen
9. hot roll
10. combo família
11. sushi de atum
12. sashimi
13. udon
14. teriyaki
15. philadelphia roll
16. califórnia roll
17. gyoza
18. tempura

## Notas importantes:

- ⚠️ **Nunca compartilhe sua API key** publicamente
- 🔒 Use variáveis de ambiente para armazenar a chave
- 📝 A API Gemini tem limites de uso (consulte a documentação)
- 🌐 Requer conexão com internet para funcionar