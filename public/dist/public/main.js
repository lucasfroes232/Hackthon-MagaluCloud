"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const generateBtn = document.getElementById('generate');
const questionInput = document.getElementById('answer');
const submitBtn = document.getElementById('submit');
const output = document.getElementById('output');
let questions = [];
let currentIndex = 0;
if (generateBtn) {
    generateBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield fetch('/api/generate', { method: 'POST' });
        questions = yield res.json();
        currentIndex = 0;
        output.textContent = "Perguntas geradas! Primeira pergunta: " + questions[currentIndex].pergunta;
    }));
}
if (submitBtn && questionInput) {
    submitBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        if (!questions[currentIndex])
            return;
        const res = yield fetch('/api/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pergunta: questions[currentIndex].pergunta,
                palavra_baseada: questions[currentIndex].palavra_baseada,
                respostaUsuario: questionInput.value
            })
        });
        const result = yield res.json();
        output.textContent = `Classificação: ${result.classificação}, Palavras-chave: ${result.palavras_chave.join(", ")}`;
        if (result.classificação === "bom") {
            currentIndex++;
            if (questions[currentIndex]) {
                output.textContent += "\nPróxima pergunta: " + questions[currentIndex].pergunta;
            }
            else {
                output.textContent += "\nFim do quiz!";
            }
        }
        else {
            output.textContent += "\nTente novamente.";
        }
        questionInput.value = "";
    }));
}
