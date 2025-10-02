"use strict";
// Exemplo simples de interatividade em TypeScript que manipula o DOM
const nameInput = document.getElementById('name');
const greetBtn = document.getElementById('greetBtn');
const greeting = document.getElementById('greeting');
const decBtn = document.getElementById('dec');
const incBtn = document.getElementById('inc');
const countSpan = document.getElementById('count');
let count = 0;
function updateCount() {
    if (countSpan)
        countSpan.textContent = String(count);
}
if (greetBtn && nameInput && greeting) {
    greetBtn.addEventListener('click', () => {
        const name = nameInput.value.trim() || 'amigo';
        greeting.textContent = `Olá, ${name}! Bem-vindo ao site em TypeScript.`;
    });
}
if (incBtn && decBtn) {
    incBtn.addEventListener('click', () => { count++; updateCount(); });
    decBtn.addEventListener('click', () => { count--; updateCount(); });
}
// Inicializa
updateCount();
// Exemplo adicional: fetch de exemplo (apenas demonstrativo)
async function fetchExample() {
    try {
        // não faz requisição real — só demonstra uso de async/await
        // const res = await fetch('https://api.example.com/data');
        // const data = await res.json();
        // console.log('dados:', data);
    }
    catch (err) {
        console.error('erro no fetch', err);
    }
}
fetchExample();
