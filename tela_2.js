class TelaRaidViewer {
    constructor() {
        this.bossElement = document.getElementById('boss');
        this.fileContentElement = document.getElementById('file-content');
        this.backButton = document.getElementById('back-button');
        this.bossNameElement = document.getElementById('boss-name');
        this.healthBarElement = document.getElementById('health-bar');
        
        this.bossHealth = 100;
        this.maxHealth = 100;
        
        this.init();
    }

    init() {
        this.loadRaidData();
        this.setupEventListeners();
        this.createVisualEffects();
        this.updateHealthBar();
    }

    loadRaidData() {
        // Recupera os dados da raid do localStorage
        const raidData = localStorage.getItem('selectedRaid');
        const fileContent = localStorage.getItem('uploadedFileContent');
        
        if (raidData) {
            const raid = JSON.parse(raidData);
            this.displayRaidInfo(raid);
        } else {
            // Dados de exemplo se não houver raid carregada
            this.displayRaidInfo({
                name: 'Dragão Infernal',
                health: 100,
                difficulty: 'hard'
            });
        }
        
        if (fileContent) {
            this.displayFileContent(fileContent);
        } else {
            this.fileContentElement.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #ffd54f;">
                    <p style="font-size: 1.2em; margin-bottom: 10px;">📁 Nenhum arquivo carregado</p>
                    <p style="color: #e0e0e0;">Volte à tela anterior e faça upload de um arquivo</p>
                </div>
            `;
        }
    }

    displayRaidInfo(raid) {
        // Atualiza o nome do boss
        this.bossNameElement.textContent = raid.name || 'Chefe da Raid';
        
        // Configura a vida do boss
        this.bossHealth = raid.health || 100;
        this.maxHealth = this.bossHealth;
        
        // Personaliza a aparência do boss baseado na dificuldade
        this.customizeBoss(raid);
        this.updateHealthBar();
    }

    displayFileContent(content) {
        // Formata o conteúdo do arquivo para exibição
        const formattedContent = this.formatFileContent(content);
        this.fileContentElement.innerHTML = formattedContent;
    }

    formatFileContent(content) {
        // Converte quebras de linha e formata o texto
        const lines = content.split('\n');
        let html = '';
        
        lines.forEach(line => {
            if (line.trim() === '') {
                html += '<br>';
            } else if (line.trim().toUpperCase() === line.trim() && line.length < 50) {
                // Títulos em caixa alta
                html += `<h3 style="color: #ff9800; margin: 20px 0 10px 0; text-shadow: 0 0 5px rgba(255, 152, 0, 0.5);">${this.escapeHtml(line)}</h3>`;
            } else if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
                // Listas
                html += `<p style="color: #ffd54f; margin: 5px 0; padding-left: 20px;">${this.escapeHtml(line)}</p>`;
            } else if (line.match(/^\d+\./)) {
                // Listas numeradas
                html += `<p style="color: #e0e0e0; margin: 8px 0; padding-left: 15px;">${this.escapeHtml(line)}</p>`;
            } else {
                // Texto normal
                html += `<p style="color: #e0e0e0; margin: 8px 0;">${this.escapeHtml(line)}</p>`;
            }
        });
        
        return html;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    customizeBoss(raid) {
        const boss = this.bossElement;
        const difficulty = raid.difficulty || 'medium';
        
        // Limpa estilos anteriores
        boss.style.cssText = '';
        
        // Aplica gradiente baseado na dificuldade
        boss.style.background = this.getBossGradient(difficulty);
        boss.style.boxShadow = this.getBossShadow(difficulty);
        boss.style.borderColor = this.getBossBorderColor(difficulty);
    }

    getBossGradient(difficulty) {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'linear-gradient(45deg, #228b22, #32cd32)';
            case 'hard':
                return 'linear-gradient(45deg, #8b0000, #dc143c)';
            case 'expert':
                return 'linear-gradient(45deg, #4b0082, #8a2be2)';
            default:
                return 'linear-gradient(45deg, #8b0000, #b22222)';
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
        
        // Atualizar classe baseada na vida
        this.healthBarElement.className = 'health-bar';
        if (percentage >= 80) this.healthBarElement.classList.add('full');
        else if (percentage >= 60) this.healthBarElement.classList.add('high');
        else if (percentage >= 40) this.healthBarElement.classList.add('medium');
        else if (percentage >= 20) this.healthBarElement.classList.add('low');
        else this.healthBarElement.classList.add('critical');
    }

    takeDamage(amount) {
        // Efeito visual de dano
        this.healthBarElement.classList.add('damage');
        
        setTimeout(() => {
            this.healthBarElement.classList.remove('damage');
        }, 400);

        // Aplicar dano
        this.bossHealth = Math.max(0, this.bossHealth - amount);
        this.updateHealthBar();

        // Verificar se o chefe foi derrotado
        if (this.bossHealth <= 0) {
            this.defeatBoss();
        }
    }

    defeatBoss() {
        setTimeout(() => {
            alert('🎉 Chefão derrotado! Recompensas adquiridas!');
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

        // Tecla ESC para voltar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.goBack();
            }
        });

        // Exemplo: Clique no boss causa dano (para teste)
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