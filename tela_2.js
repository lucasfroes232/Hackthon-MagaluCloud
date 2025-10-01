class TelaRaidViewer {
    constructor() {
        this.bossElement = document.getElementById('boss');
        this.fileContentElement = document.getElementById('file-content');
        this.backButton = document.getElementById('back-button');
        this.bossNameElement = document.getElementById('boss-name');
        this.healthBarElement = document.getElementById('health-bar');
        this.questionTextElement = document.getElementById('question-text');
        this.answerInputElement = document.getElementById('answer-input');
        this.submitButton = document.getElementById('submit-btn');
        
        this.bossHealth = 100;
        this.maxHealth = 100;
        this.currentQuestion = 0;
        this.poemasContent = '';
        
        this.questions = [
            {
                question: "Qual poema fala sobre Pedra?",
                correctAnswer: "Pedra",
                hint: "Pedra"
            },
            {
                question: "Em qual poema o Retrato é da Rua'?",
                correctAnswer: "Rua",
                hint: "Rua"
            },
            {
                question: "Qual poema menciona carta ao amanha?",
                correctAnswer: "carta ao amanha",
                hint: "carta"
            },
            {
                question: "coisa pequeno?",
                correctAnswer: "coisa pequeno",
                hint: "ultimo poema"
            }
        ];
        
        this.init();
    }

    async init() {
        await this.loadPoemasFile();
        this.setupEventListeners();
        this.createVisualEffects();
        this.updateHealthBar();
        this.showQuestion();
    }

    async loadPoemasFile() {
        try {
            // Tenta carregar o arquivo poemas.txt
            const response = await fetch('poemas.txt');
            if (response.ok) {
                this.poemasContent = await response.text();
                this.displayFileContent(this.poemasContent);
            } else {
                throw new Error('Arquivo poemas.txt não encontrado');
            }
        } catch (error) {
            console.error('Erro ao carregar poemas.txt:', error);
            // Fallback: conteúdo padrão caso o arquivo não exista
            this.poemasContent = this.getDefaultPoemas();
            this.displayFileContent(this.poemasContent);
        }
        
        // Tenta carregar dados da raid, se existirem
        const raidData = localStorage.getItem('selectedRaid');
        if (raidData) {
            const raid = JSON.parse(raidData);
            this.displayRaidInfo(raid);
        } else {
            // Dados padrão
            this.displayRaidInfo({
                name: 'Guardião dos Versos',
                health: 100,
                difficulty: 'medium'
            });
        }
    }

    getDefaultPoemas() {
        return `POEMAS

1. O Mar
O mar é um espelho
Onde o céu se reflete
Nas ondas que se quebram
A vida se completa

2. Noite Estrelada
A noite veste o manto
Das estrelas brilhantes
Sonhos se espalham
Em versos pulsantes

3. Vento
O vento sussurra
Segredos nas folhas
A natureza dança
Em rimas tão boas

4. Amanhecer
O sol desponta
Com raios de ouro
A esperança renasce
Num mundo futuro

5. Chuva
Gotas que caem
Lavas a alma
Renovam a terra
Com doce calma

6. Amor
Sentimento puro
Que nunca se esvai
No peito guardado
Sempre a brilhar

7. Tempo
O tempo não para
Corre veloz
Deixa marcas
Na pele e na voz

8. Liberdade
Asas abertas
Voar sem medo
O céu é limite
Num doce segredo`;
    }

    // No método displayRaidInfo, mude o nome padrão:
    displayRaidInfo(raid) {
        // SEMPRE será "Goblin dos Poemas", independente dos dados da raid
        this.bossNameElement.textContent = 'Goblin dos Poemas';
        this.bossHealth = raid.health || 100;
        this.maxHealth = this.bossHealth;
        this.customizeBoss(raid);
        this.updateHealthBar();
    }
    displayFileContent(content) {
        const formattedContent = this.formatFileContent(content);
        this.fileContentElement.innerHTML = formattedContent;
    }

    formatFileContent(content) {
        const lines = content.split('\n');
        let html = '';
        let inPoem = false;
        
        lines.forEach(line => {
            const trimmedLine = line.trim();
            
            if (trimmedLine === '') {
                html += '<br>';
                inPoem = false;
            } else if (trimmedLine === 'POEMAS') {
                html += `<h3 style="color: #ff9800; margin: 0 0 20px 0; text-align: center; text-shadow: 0 0 10px rgba(255, 152, 0, 0.5); font-size: 1.8em;">${trimmedLine}</h3>`;
            } else if (trimmedLine.match(/^\d+\./)) {
                // Título do poema
                inPoem = true;
                html += `<h4 style="color: #ffd54f; margin: 25px 0 10px 0; text-shadow: 0 0 5px rgba(255, 213, 79, 0.5); border-left: 3px solid #ff9800; padding-left: 15px;">${this.escapeHtml(trimmedLine)}</h4>`;
            } else if (inPoem && trimmedLine) {
                // Linhas do poema
                html += `<p style="color: #e0e0e0; margin: 5px 0; padding-left: 30px; font-style: italic;">${this.escapeHtml(trimmedLine)}</p>`;
            } else if (trimmedLine) {
                // Outras linhas
                html += `<p style="color: #b0b0b0; margin: 8px 0;">${this.escapeHtml(trimmedLine)}</p>`;
            }
        });
        
        return html;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showQuestion() {
        if (this.currentQuestion < this.questions.length) {
            const question = this.questions[this.currentQuestion];
            this.questionTextElement.textContent = question.question;
            this.answerInputElement.value = '';
            this.answerInputElement.placeholder = `Dica: ${question.hint}`;
        } else {
            this.questionTextElement.textContent = "Parabéns! Você respondeu todas as perguntas!";
            this.answerInputElement.style.display = 'none';
            this.submitButton.style.display = 'none';
        }
    }

    checkAnswer() {
        const userAnswer = this.answerInputElement.value.trim();
        const currentQuestion = this.questions[this.currentQuestion];
        
        if (userAnswer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()) {
            // Resposta correta - causa dano no boss
            this.takeDamage(25);
            this.showFeedback("Resposta correta! 💥 Dano causado no guardião!", "success");
            this.currentQuestion++;
            
            setTimeout(() => {
                this.showQuestion();
            }, 1500);
        } else {
            // Resposta errada
            this.showFeedback("Resposta incorreta! Tente novamente. 💢", "error");
            this.answerInputElement.focus();
        }
    }

    showFeedback(message, type) {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 1000;
            font-weight: bold;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: slideDown 0.5s ease;
        `;
        feedback.textContent = message;
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 3000);
    }

    customizeBoss(raid) {
        const boss = this.bossElement;
        const difficulty = raid.difficulty || 'medium';
        
        // Limpa o conteúdo anterior
        boss.innerHTML = '';
        
        // Cria a imagem do goblin
        const bossImage = document.createElement('img');
        bossImage.className = 'boss-image';
        bossImage.src = 'foto_goblin.jpg';
        bossImage.alt = 'Goblin Guardião';
        bossImage.onerror = () => {
            // Fallback se a imagem não carregar
            bossImage.style.display = 'none';
            boss.style.background = this.getBossGradient(difficulty);
            boss.innerHTML = '<div style="color: white; text-align: center; padding: 20px;">Goblin Guardião</div>';
        };
        
        boss.appendChild(bossImage);
        
        // Aplica estilos baseados na dificuldade
        boss.style.background = this.getBossGradient(difficulty);
        boss.style.boxShadow = this.getBossShadow(difficulty);
        boss.style.borderColor = this.getBossBorderColor(difficulty);
    }

    getBossGradient(difficulty) {
        switch (difficulty.toLowerCase()) {
            case 'easy': return 'linear-gradient(45deg, #228b22, #32cd32)';
            case 'hard': return 'linear-gradient(45deg, #8b0000, #dc143c)';
            case 'expert': return 'linear-gradient(45deg, #4b0082, #8a2be2)';
            default: return 'linear-gradient(45deg, #8b0000, #b22222)';
        }
    }

    getBossShadow(difficulty) {
        const color = this.getDifficultyColor(difficulty);
        return `0 0 30px ${color}, 0 0 60px rgba(255, 152, 0, 0.4), inset 0 0 20px rgba(0, 0, 0, 0.5)`;
    }

    getBossBorderColor(difficulty) {
        return this.getDifficultyColor(difficulty);
    }

    getDifficultyColor(difficulty) {
        switch (difficulty.toLowerCase()) {
            case 'easy': return '#00ff00';
            case 'hard': return '#ff4500';
            case 'expert': return '#ff00ff';
            default: return '#ff9800';
        }
    }

    updateHealthBar() {
        const percentage = (this.bossHealth / this.maxHealth) * 100;
        this.healthBarElement.style.width = `${percentage}%`;
        
        this.healthBarElement.className = 'health-bar';
        if (percentage >= 80) this.healthBarElement.classList.add('full');
        else if (percentage >= 60) this.healthBarElement.classList.add('high');
        else if (percentage >= 40) this.healthBarElement.classList.add('medium');
        else if (percentage >= 20) this.healthBarElement.classList.add('low');
        else this.healthBarElement.classList.add('critical');
    }

    takeDamage(amount) {
        this.healthBarElement.style.animation = 'damageFlash 0.4s ease';
        setTimeout(() => {
            this.healthBarElement.style.animation = '';
        }, 400);

        this.bossHealth = Math.max(0, this.bossHealth - amount);
        this.updateHealthBar();

        if (this.bossHealth <= 0) {
            this.defeatBoss();
        }
    }

    defeatBoss() {
        setTimeout(() => {
            this.showFeedback("🎉 Guardião derrotado! Você dominou a poesia!", "success");
        }, 500);
    }

    createVisualEffects() {
        this.createStars();
        this.createParticles();
    }

    createStars() {
        const starsContainer = document.createElement('div');
        starsContainer.className = 'stars';
        document.body.appendChild(starsContainer);
        
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.width = Math.random() * 3 + 'px';
            star.style.height = star.style.width;
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 5 + 's';
            starsContainer.appendChild(star);
        }
    }

    createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        document.body.appendChild(particlesContainer);
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.width = Math.random() * 5 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = Math.random() * 10 + 10 + 's';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particlesContainer.appendChild(particle);
        }
    }

    setupEventListeners() {
        this.backButton.addEventListener('click', () => {
            this.goBack();
        });

        this.submitButton.addEventListener('click', () => {
            this.checkAnswer();
        });

        this.answerInputElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.goBack();
            }
        });

        // Clique no boss para teste
        this.bossElement.addEventListener('click', () => {
            this.takeDamage(10);
        });
    }

    goBack() {
        window.location.href = 'tela_1.html';
    }
}

// Inicializa a tela quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new TelaRaidViewer();
});

// Adiciona estilo para a animação de feedback
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
`;
document.head.appendChild(style);