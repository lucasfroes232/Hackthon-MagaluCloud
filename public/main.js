const uploadForm = document.getElementById("uploadForm");
const quizContainer = document.getElementById("quizContainer");
const perguntasDiv = document.getElementById("perguntas");

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(uploadForm);

  const res = await fetch("/upload-pdf", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  if (data.error) {
    alert(data.error);
    return;
  }

  // Exibir perguntas
  perguntasDiv.innerHTML = "";
  quizContainer.style.display = "block";

  data.perguntas.forEach((p, index) => {
    const div = document.createElement("div");
    div.classList.add("pergunta");
    div.innerHTML = `
      <p><strong>Pergunta ${index + 1}:</strong> ${p.pergunta}</p>
      <input type="text" id="resposta-${index}" placeholder="Digite sua resposta">
      <button onclick="avaliar(${index})">Avaliar</button>
      <pre id="resultado-${index}"></pre>
    `;
    perguntasDiv.appendChild(div);
  });
});

// Função para avaliar resposta
async function avaliar(index) {
  const input = document.getElementById(`resposta-${index}`);
  const resposta = input.value;
  const pergunta = document.querySelectorAll(".pergunta p")[index].innerText.replace(/^Pergunta \d+: /, "");
  const palavraBase = "placeholder"; // aqui você poderia pegar a frase_baseada do JSON se quiser

  const res = await fetch("/avaliar-resposta", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pergunta, palavraBase, respostaUsuario: resposta })
  });

  const data = await res.json();
  const resultado = document.getElementById(`resultado-${index}`);
  resultado.textContent = JSON.stringify(data, null, 2);
}
