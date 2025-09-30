const pdfInput = document.getElementById('pdfInput') as HTMLInputElement;
const generateBtn = document.getElementById('generateBtn') as HTMLButtonElement;
const quizContainer = document.getElementById('quizContainer') as HTMLDivElement;
const questionText = document.getElementById('questionText') as HTMLParagraphElement;
const userAnswer = document.getElementById('userAnswer') as HTMLInputElement;
const submitAnswer = document.getElementById('submitAnswer') as HTMLButtonElement;
const feedback = document.getElementById('feedback') as HTMLParagraphElement;

let questions: any[] = [];
let currentQuestionIndex = 0;

// Envia PDF para gerar perguntas
generateBtn.addEventListener('click', async () => {
  if (!pdfInput.files?.length) return alert("Selecione um PDF!");
  
  const file = pdfInput.files[0];
  const formData = new FormData();
  formData.append("pdf", file);

  try {
    const res = await fetch("/api/generate", { method: "POST", body: formData });
    questions = await res.json();
    if (questions.length === 0) return alert("Nenhuma pergunta gerada.");
    
    currentQuestionIndex = 0;
    quizContainer.style.display = "block";
    showQuestion();
  } catch (err) {
    console.error(err);
    alert("Erro ao gerar perguntas.");
  }
});

function showQuestion() {
  const q = questions[currentQuestionIndex];
  questionText.textContent = `${q.pergunta} (Palavra base: ${q.palavra_baseada})`;
  userAnswer.value = '';
  feedback.textContent = '';
}

// Checa a resposta do usuário
submitAnswer.addEventListener('click', async () => {
  const answer = userAnswer.value.trim();
  if (!answer) return alert("Digite uma resposta!");

  const q = questions[currentQuestionIndex];
  try {
    const res = await fetch("/api/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pergunta: q.pergunta,
        palavra_baseada: q.palavra_baseada,
        resposta: answer
      })
    });

    const result = await res.json();
    feedback.textContent = `Classificação: ${result.classificacao}. Palavras-chave: ${result.palavras_chave.join(", ")}`;

    if (result.classificacao === "bom") {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        setTimeout(showQuestion, 1000); // Próxima pergunta
      } else {
        feedback.textContent += " | Quiz finalizado!";
      }
    } else {
      feedback.textContent += " | Tente novamente.";
    }

  } catch (err) {
    console.error(err);
    alert("Erro ao checar a resposta.");
  }
});

