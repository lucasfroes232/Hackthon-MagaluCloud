# Este é o seu código, salvo no arquivo app.py
from flask import Flask

# Cria a aplicação web
app = Flask(__name__)

# Define a rota principal (ex: http://seusite.com/)
@app.route('/')
def hello():
    return "Meu código do Hackathon está funcionando!"

# Roda o servidor quando o script é executado
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
