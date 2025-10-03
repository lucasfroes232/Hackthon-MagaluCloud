const pdfForm = document.getElementById("pdfForm");
const perguntasDiv = document.getElementById("perguntas");
const statusDiv = document.getElementById("status");

// Submeter PDF
pdfForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(pdfForm);

  statusDiv.textContent = "📤 Enviando PDF e gerando perguntas...";

  try {
    const response = await fetch("/upload-pdf", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    perguntasDiv.innerHTML = "";
    statusDiv.textContent = "";

    if (data.perguntas && data.perguntas.length > 0) {
      data.perguntas.forEach((p, index) => {
        perguntasDiv.innerHTML += `
          <div class="pergunta">
            <p><b>Pergunta ${index + 1}:</b> ${p.pergunta}</p>
            <small><i>Baseada em: ${p.frase_baseada}</i></small><br><br>
            <input type="text" id="resposta-${index}" placeholder="Digite sua resposta">
            <button onclick="enviarResposta(${index}, '${p.pergunta}', '${p.frase_baseada}')">Enviar</button>
            <div id="avaliacao-${index}" style="margin-top:10px; color:blue;"></div>
          </div>
        `;
      });
    } else {
      perguntasDiv.innerHTML = "<p>Nenhuma pergunta foi gerada.</p>";
    }
  } catch (err) {
    console.error(err);
    statusDiv.textContent = "❌ Erro ao enviar PDF.";
  }
});

// Função para enviar resposta de uma pergunta
async function enviarResposta(index, pergunta, fraseBaseada) {
  const respostaUsuario = document.getElementById(`resposta-${index}`).value;
  const avaliacaoDiv = document.getElementById(`avaliacao-${index}`);

  if (!respostaUsuario.trim()) {
    avaliacaoDiv.textContent = "⚠️ Escreva uma resposta primeiro.";
    return;
  }

  avaliacaoDiv.textContent = "⏳ Avaliando resposta...";

  try {
    const response = await fetch("/avaliar-resposta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pergunta, palavraBase: fraseBaseada, respostaUsuario }),
    });

    const data = await response.json();
    avaliacaoDiv.textContent = `✅ Avaliação: ${JSON.stringify(data)}`;
  } catch (err) {
    console.error(err);
    avaliacaoDiv.textContent = "❌ Erro ao avaliar resposta.";
  }
}
