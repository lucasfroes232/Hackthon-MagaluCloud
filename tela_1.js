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
        showPopup(`Bem-vindo, ${username}! 🎮`);
        
        // Transição para o menu do jogo após 1 segundo
        setTimeout(() => {
            transitionToMenu();
        }, 1000);
        
    } else {
        showPopup('Por favor, preencha todos os campos! ⚠️');
    }
}

// Nova função: Transição para o menu do jogo
function transitionToMenu() {
    const logoContainer = document.getElementById('logoContainer');
    const loginContainer = document.getElementById('loginContainer');
    const menuContainer = document.getElementById('menuContainer');
    const backButton = document.getElementById('backButton');
    
    // Aplicar animação diretamente da posição atual
    logoContainer.style.animation = 'exitUpFromCurrent 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
    
    // Formulário fade out
    loginContainer.classList.add('fade-out');
    
    // Menu fade in com delay
    setTimeout(() => {
        menuContainer.classList.add('fade-in');
    }, 800);
    
    // Atualizar botão voltar para voltar ao login
    backButton.setAttribute('onclick', 'transitionBackToLogin()');
}

// Função para voltar do menu para o login
function transitionBackToLogin() {
    const logoContainer = document.getElementById('logoContainer');
    const loginContainer = document.getElementById('loginContainer');
    const menuContainer = document.getElementById('menuContainer');
    const backButton = document.getElementById('backButton');
    
    // Remover animações atuais
    logoContainer.style.animation = '';
    logoContainer.classList.remove('exit-up');
    
    // Menu fade out
    menuContainer.classList.remove('fade-in');
    menuContainer.style.display = 'none';
    
    // Logo volta para posição original (sem animação forçada)
    logoContainer.classList.remove('move-up');
    
    // Formulário volta
    loginContainer.classList.remove('fade-out');
    loginContainer.style.display = 'block';
    
    // Limpar campos
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
    // Restaurar botão voltar original
    backButton.setAttribute('onclick', 'transitionToHome()');
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

// ===== NOVAS FUNÇÕES PARA UPLOAD =====

// Função para transição para a tela de upload
// Função para transição para a tela de upload - CORRIGIDA
function transitionToUpload() {
    const menuContainer = document.getElementById('menuContainer');
    const uploadContainer = document.getElementById('uploadContainer');
    const backButton = document.getElementById('backButton');
    
    // Menu fade out
    menuContainer.classList.add('fade-out-upload');
    
    // Upload fade in com delay
    setTimeout(() => {
        uploadContainer.classList.add('fade-in-upload');
    }, 500);
    
    // CORREÇÃO: ESCONDER o botão voltar na tela de upload
    backButton.classList.remove('show');
    backButton.classList.add('hide');
}

// Função para voltar do upload para o menu
// Função para voltar do upload para o menu - CORRIGIDA
function transitionBackToMenuFromUpload() {
    const menuContainer = document.getElementById('menuContainer');
    const uploadContainer = document.getElementById('uploadContainer');
    const backButton = document.getElementById('backButton');
    
    // Upload fade out
    uploadContainer.classList.remove('fade-in-upload');
    uploadContainer.classList.add('fade-out');
    
    // Menu volta
    setTimeout(() => {
        menuContainer.classList.remove('fade-out-upload');
        uploadContainer.style.display = 'none';
        uploadContainer.classList.remove('fade-out');
        
        // CORREÇÃO: MOSTRAR o botão voltar novamente quando voltar ao menu
        backButton.classList.remove('hide');
        backButton.classList.add('show');
    }, 500);
    
    // Limpar arquivo selecionado se houver
    clearFileSelection();
}

// Função para limpar seleção de arquivo
function clearFileSelection() {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const fileInfo = document.querySelector('.file-info');
    
    fileInput.value = '';
    uploadArea.classList.remove('has-file');
    
    if (fileInfo) {
        fileInfo.remove();
    }
}

// Função para handle do upload
function handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (file) {
        showPopup(`📁 Arquivo "${file.name}" selecionado!`);
        
        // Mostrar informações do arquivo
        showFileInfo(file);
    }
}

// Função para mostrar informações do arquivo
function showFileInfo(file) {
    const uploadArea = document.getElementById('uploadArea');
    let fileInfo = document.querySelector('.file-info');
    
    // Remover info anterior se existir
    if (fileInfo) {
        fileInfo.remove();
    }
    
    // Criar elemento de informações
    fileInfo = document.createElement('div');
    fileInfo.className = 'file-info';
    
    const fileName = document.createElement('div');
    fileName.className = 'file-name';
    fileName.textContent = `📄 ${file.name}`;
    
    const fileSize = document.createElement('div');
    fileSize.className = 'file-size';
    fileSize.textContent = `Tamanho: ${formatFileSize(file.size)}`;
    
    fileInfo.appendChild(fileName);
    fileInfo.appendChild(fileSize);
    
    uploadArea.appendChild(fileInfo);
    uploadArea.classList.add('has-file');
}

// Função para formatar tamanho do arquivo
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Função para confirmar upload - ATUALIZADA
// Função para confirmar upload - CORRIGIDA
function confirmUpload() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const uploadArea = document.getElementById('uploadArea');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const confirmBtn = document.getElementById('confirmUploadBtn');
    const cancelBtn = document.getElementById('cancelUploadBtn');
    
    if (!file) {
        showPopup('⚠️ Por favor, selecione um arquivo primeiro!');
        return;
    }
    
    // Mostrar barra de progresso
    progressContainer.style.display = 'block';
    uploadArea.classList.add('uploading');
    
    // Desabilitar botões durante o upload
    confirmBtn.disabled = true;
    cancelBtn.disabled = true;
    
    // Garantir que a barra comece em 0%
    progressBar.style.width = '0%';
    progressText.textContent = 'Processando arquivo... 0%';
    
    // Forçar reflow para a animação funcionar
    void progressBar.offsetWidth;
    
    // Simular progresso do upload
    simulateUploadProgress(file, progressBar, progressText, confirmBtn, cancelBtn, uploadArea);
}

// Nova função para simular progresso do upload
// Nova função para simular progresso do upload - CORRIGIDA
// Versão alternativa mais simples - GARANTIDA
function simulateUploadProgress(file, progressBar, progressText, confirmBtn, cancelBtn, uploadArea) {
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            progressText.textContent = `Processando arquivo... 100%`;
            
            setTimeout(() => {
                showPopup('✅ Arquivo processado com sucesso! Criando raid...');
                const progressContainer = document.getElementById('progressContainer');
                resetUploadInterface(progressContainer, uploadArea, confirmBtn, cancelBtn);
            }, 500);
        } else {
            width += 1;
            progressBar.style.width = width + '%';
            progressText.textContent = `Processando arquivo... ${width}%`;
        }
    }, 30); // Atualiza a cada 30ms (total ~3 segundos)
}

// Nova função para resetar a interface do upload
function resetUploadInterface(progressContainer, uploadArea, confirmBtn, cancelBtn) {
    // Esconder barra de progresso
    progressContainer.style.display = 'none';
    
    // Reativar área de upload
    uploadArea.classList.remove('uploading');
    
    // Reativar botões
    confirmBtn.disabled = false;
    cancelBtn.disabled = false;
    
    // Resetar barra de progresso
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    progressBar.style.width = '0%';
    progressText.textContent = 'Processando arquivo... 0%';
}

// Atualize a função clearFileSelection para incluir o reset do progresso
function clearFileSelection() {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const fileInfo = document.querySelector('.file-info');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const confirmBtn = document.getElementById('confirmUploadBtn');
    const cancelBtn = document.getElementById('cancelUploadBtn');
    
    fileInput.value = '';
    uploadArea.classList.remove('has-file');
    uploadArea.classList.remove('uploading');
    
    // Resetar barra de progresso
    progressContainer.style.display = 'none';
    progressBar.style.width = '0%';
    progressText.textContent = 'Processando arquivo... 0%';
    
    // Reativar botões
    confirmBtn.disabled = false;
    cancelBtn.disabled = false;
    
    if (fileInfo) {
        fileInfo.remove();
    }
}

// ===== FIM DAS NOVAS FUNÇÕES PARA UPLOAD =====

// Configurar transição para login
function setupLoginTransition() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const backBtn = document.getElementById('backButton');
    const enterBtn = document.getElementById('enterBtn');
    const newRaidBtn = document.getElementById('newRaidBtn');
    const raidsBtn = document.getElementById('raidsBtn');
    
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
    
    // Na função setupLoginTransition, atualize esta parte:
if (backBtn) {
    backBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const menuContainer = document.getElementById('menuContainer');
        const uploadContainer = document.getElementById('uploadContainer');
        
        // Se estiver no upload, NÃO FAZ NADA (botão está escondido)
        if (uploadContainer.style.display === 'block' || uploadContainer.classList.contains('fade-in-upload')) {
            return; // Não faz nada, o botão está escondido
        } 
        // Se estiver no menu, volta para login
        else if (menuContainer.style.display === 'block' || menuContainer.classList.contains('fade-in')) {
            transitionBackToLogin();
        } else {
            // Se estiver no login, volta para home
            transitionToHome();
        }
    });
}
    
    // Configurar botões do menu
    if (newRaidBtn) {
        newRaidBtn.addEventListener('click', function(e) {
            e.preventDefault();
            transitionToUpload(); // Nova função para upload
        });
    }
    
    if (raidsBtn) {
        raidsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showPopup('📋 Carregando raids...');
        });
    }
}

// Nova função para configurar o upload
function setupUploadFunctionality() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const confirmUploadBtn = document.getElementById('confirmUploadBtn');
    const cancelUploadBtn = document.getElementById('cancelUploadBtn');
    
    if (uploadArea && fileInput) {
        // Click na área de upload
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
        
        // Alteração no input de arquivo
        fileInput.addEventListener('change', handleFileUpload);
        
        // Drag and drop
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', function() {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                handleFileUpload();
            }
        });
    }
    
    if (confirmUploadBtn) {
        confirmUploadBtn.addEventListener('click', confirmUpload);
    }
    
    if (cancelUploadBtn) {
        cancelUploadBtn.addEventListener('click', function() {
            transitionBackToMenuFromUpload();
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
    setupUploadFunctionality(); // Nova função para configurar upload
    
    console.log('Tela 1 carregada com sucesso!');
});

// Array para armazenar as raids
let raids = [];

// Função para transição para a tela de raids
function transitionToRaids() {
    const uploadContainer = document.getElementById('uploadContainer');
    const raidsContainer = document.getElementById('raidsContainer');
    const backButton = document.getElementById('backButton');
    
    // Upload fade out
    uploadContainer.classList.add('fade-out-raids');
    
    // Raids fade in com delay
    setTimeout(() => {
        raidsContainer.classList.add('fade-in-raids');
    }, 500);
    
    // Atualizar botão voltar
    backButton.classList.remove('show');
    backButton.classList.add('hide');
}

// Função para voltar das raids para o menu
function transitionBackToMenuFromRaids() {
    const menuContainer = document.getElementById('menuContainer');
    const raidsContainer = document.getElementById('raidsContainer');
    const backButton = document.getElementById('backButton');
    
    // Raids fade out
    raidsContainer.classList.remove('fade-in-raids');
    raidsContainer.classList.add('fade-out');
    
    // Menu volta
    setTimeout(() => {
        raidsContainer.style.display = 'none';
        raidsContainer.classList.remove('fade-out');
        
        // Mostrar botão voltar novamente
        backButton.classList.remove('hide');
        backButton.classList.add('show');
    }, 500);
}

// Função para adicionar uma nova raid
function addNewRaid(fileName) {
    const newRaid = {
        id: Date.now(), // ID único baseado no timestamp
        name: fileName.replace(/\.[^/.]+$/, ""), // Remove a extensão do arquivo
        fileName: fileName,
        date: new Date().toLocaleDateString('pt-BR'),
        timestamp: new Date()
    };
    
    raids.push(newRaid);
    
    // Atualizar a lista de raids
    updateRaidsList();
    
    // Ordenar raids por data (mais recente primeiro)
    raids.sort((a, b) => b.timestamp - a.timestamp);
}

// Função para atualizar a lista de raids na tela
// Função para atualizar a lista de raids na tela
function updateRaidsList() {
    const raidsList = document.getElementById('raidsList');
    const noRaids = document.getElementById('noRaids');
    
    // Limpar lista atual
    raidsList.innerHTML = '';
    
    if (raids.length === 0) {
        // Mostrar mensagem de nenhuma raid
        raidsList.appendChild(noRaids);
        noRaids.style.display = 'block';
    } else {
        // Esconder mensagem de nenhuma raid
        noRaids.style.display = 'none';
        
        // Adicionar cada raid à lista
        raids.forEach(raid => {
            const raidItem = document.createElement('div');
            raidItem.className = 'raid-item';
            raidItem.setAttribute('data-raid-id', raid.id);
            raidItem.innerHTML = `
                <div class="raid-name">${raid.name}</div>
                <div class="raid-info">
                    <span>Arquivo: ${raid.fileName}</span>
                    <span class="raid-date">Criada em: ${raid.date}</span>
                </div>
            `;
            
            // Adicionar clique na raid - REDIRECIONA PARA TELA_2
            raidItem.addEventListener('click', function() {
                startRaid(raid.id);
            });
            
            raidsList.appendChild(raidItem);
        });
    }
}

// NOVA FUNÇÃO: Iniciar uma raid específica
function startRaid(raidId) {
    // Encontrar a raid pelo ID
    const raid = raids.find(r => r.id === raidId);
    
    if (raid) {
        showPopup(`🚀 Iniciando raid: ${raid.name}`);
        
        // Salvar a raid selecionada no localStorage para usar na tela_2
        localStorage.setItem('selectedRaid', JSON.stringify(raid));
        
        // Redirecionar para tela_2 após um breve delay
        setTimeout(() => {
            window.location.href = 'tela_2.html';
        }, 1500);
    } else {
        showPopup('❌ Raid não encontrada!');
    }
}

// Atualize a função simulateUploadProgress para ir para a tela de raids
function simulateUploadProgress(file, progressBar, progressText, confirmBtn, cancelBtn, uploadArea) {
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            progressText.textContent = `Processando arquivo... 100%`;
            
            setTimeout(() => {
                // Adicionar a nova raid
                addNewRaid(file.name);
                
                // Mostrar popup de sucesso
                showPopup('✅ Arquivo processado com sucesso! Criando raid...');
                
                // Resetar interface do upload
                const progressContainer = document.getElementById('progressContainer');
                resetUploadInterface(progressContainer, uploadArea, confirmBtn, cancelBtn);
                
                // Ir para a tela de raids
                setTimeout(() => {
                    transitionToRaids();
                }, 1000);
                
            }, 500);
        } else {
            width += 1;
            progressBar.style.width = width + '%';
            progressText.textContent = `Processando arquivo... ${width}%`;
        }
    }, 30);
}
