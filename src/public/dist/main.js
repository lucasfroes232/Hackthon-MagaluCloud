"use strict";
// Exemplo simples de interatividade em TypeScript que manipula o DOM
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function fetchExample() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // não faz requisição real — só demonstra uso de async/await
            // const res = await fetch('https://api.example.com/data');
            // const data = await res.json();
            // console.log('dados:', data);
        }
        catch (err) {
            console.error('erro no fetch', err);
        }
    });
}
fetchExample();
