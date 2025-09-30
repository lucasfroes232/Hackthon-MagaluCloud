// Sistema de Popup Personalizado
// Sistema de Popup Personalizado - Estilo Notificação
function showPopup(message) {
    // Criar popup
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background: rgba(255, 255, 255, 0.95);
        border: none;
        border-radius: 15px;
        padding: 15px 25px;
        text-align: center;
        color: #1a237e;
        max-width: 350px;
        width: 90%;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        z-index: 2000;
        font-size: 1rem;
        font-weight: 500;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        animation: slideDown 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    `;
    
    // Mensagem
    popup.textContent = message;
    
    // Adicionar ao body
    document.body.appendChild(popup);
    
    // Remover automaticamente após 3 segundos
    setTimeout(() => {
        popup.style.animation = 'slideUp 0.4s ease forwards';
        setTimeout(() => {
            if (popup.parentNode) {
                document.body.removeChild(popup);
            }
        }, 400);
    }, 3000);
}

// Adicionar estilos do popup
function addPopupStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { 
                opacity: 0;
                transform: translateX(-50%) translateY(-100px);
            }
            to { 
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        
        @keyframes slideUp {
            from { 
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            to { 
                opacity: 0;
                transform: translateX(-50%) translateY(-100px);
            }
        }
    `;
    document.head.appendChild(style);
}

// Criar estrelas
function createStars() {
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 150; i++) {
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

// Criar partículas
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
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

// Função para handle login - MODIFICADA
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username && password) {
        showPopup(`Bem-vindo de volta, ${username}! 🎮`);
        // Aqui você pode redirecionar para a próxima tela
        // window.location.href = 'tela_3.html';
    } else {
        showPopup('Por favor, preencha todos os campos! ⚠️');
    }
}

// Função para simular registro - MODIFICADA
function handleRegistration() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simular registro bem-sucedido
    if (username && password) {
        showPopup('🎉 Registro realizado com sucesso!\n\nAgora você pode fazer login com suas credenciais!');
        
        // Limpar campos
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        
        // Mudar para tela de login automaticamente
        setTimeout(() => {
            const enterBtn = document.getElementById('enterBtn');
            enterBtn.textContent = 'Entrar';
            enterBtn.onclick = handleLogin;
        }, 500);
        
    } else {
        showPopup('Por favor, preencha todos os campos! ⚠️');
    }
}

// Função de transição para login
function transitionToLogin() {
    const mainButtons = document.getElementById('mainButtons');
    const loginContainer = document.getElementById('loginContainer');
    const logoContainer = document.getElementById('logoContainer');
    const backButton = document.getElementById('backButton');
    
    // Animar botões saindo pela esquerda
    mainButtons.classList.add('exit-left');
    
    // Logo sobe mais para dar espaço (próximo da lua)
    logoContainer.classList.add('move-up');
    
    // Mostrar formulário de login entrando pela direita
    setTimeout(() => {
        loginContainer.style.display = 'block';
        setTimeout(() => {
            loginContainer.classList.add('enter-right');
        }, 50);
    }, 400);
    
    // Mostrar botão voltar
    setTimeout(() => {
        backButton.classList.add('show');
    }, 600);
}

// Função de transição para home (voltar)
function transitionToHome() {
    const mainButtons = document.getElementById('mainButtons');
    const loginContainer = document.getElementById('loginContainer');
    const logoContainer = document.getElementById('logoContainer');
    const backButton = document.getElementById('backButton');
    
    // LIMPAR OS CAMPOS
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
    // Botão voltar some devagar
    backButton.classList.remove('show');
    backButton.classList.add('hide');
    
    // Formulário sai pela direita
    loginContainer.classList.remove('enter-right');
    loginContainer.classList.add('exit-right');
    
    // Logo desce para posição original
    logoContainer.classList.remove('move-up');
    logoContainer.classList.add('move-down');
    
    // Botões voltam pela esquerda
    setTimeout(() => {
        mainButtons.classList.remove('exit-left');
        mainButtons.classList.add('return-left');
    }, 400);
    
    // Resetar tudo após animações
    setTimeout(() => {
        loginContainer.style.display = 'none';
        loginContainer.classList.remove('exit-right');
        mainButtons.classList.remove('return-left');
        logoContainer.classList.remove('move-down');
        backButton.classList.remove('hide');
    }, 1200);
}

// Configurar transição para login
function setupLoginTransition() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const backBtn = document.getElementById('backButton');
    const enterBtn = document.getElementById('enterBtn');
    
    // Configurar o botão entrar inicialmente para login
    enterBtn.onclick = handleLogin;
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            enterBtn.textContent = 'Entrar';
            enterBtn.onclick = handleLogin;
            transitionToLogin();
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            enterBtn.textContent = 'Registrar-se';
            enterBtn.onclick = handleRegistration;
            transitionToLogin();
        });
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            transitionToHome();
        });
    }
}

// Função para navegação (mantida para compatibilidade)
function navigateTo(screen) {
    console.log(`Navegando para: ${screen}`);
    if (screen === 'login' || screen === 'register') {
        transitionToLogin();
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    createStars();
    createParticles();
    addPopupStyles(); // Adiciona os estilos do popup
    setupLoginTransition();
    console.log('Tela 1 carregada com sucesso!');
});