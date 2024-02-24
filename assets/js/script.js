document.addEventListener("DOMContentLoaded", function() {
  // Mostra o pop-up automaticamente quando a página é carregada
  document.getElementById("rulesPopup").style.display = "block";
});

var popup = document.getElementById("rulesPopup");
var span = document.getElementsByClassName("close")[0]; // O botão de fechar

// Previne o fechamento do pop-up clicando fora dele
window.onclick = function(event) {
  if (event.target == popup) {
      event.preventDefault(); // Mantém o pop-up aberto
  }
}

// Função para validar o formulário
function validateForm() {
  var cpf = document.getElementById("cpf").value;
  var agreeTerms = document.getElementById("agreeTerms").checked;
  
  // Verifica se o CPF está preenchido e o checkbox marcado
  if(cpf.trim() !== "" && agreeTerms) {
      document.getElementById("rulesPopup").style.display = "none";
      // Após fechar o pop-up, realiza o sorteio
      gerarNumeroDoDia(cpf); // Modificado para passar o CPF como argumento
  } else {
      alert("Por favor, insira seu CPF e concorde com os termos de uso.");
  }
}

// Botão de confirmação no formulário
document.getElementById("submitBtn").onclick = function(event) {
  validateForm();
}

// Quando o usuário tenta fechar o pop-up
span.onclick = function(event) {
  event.preventDefault(); // Previne o fechamento padrão
  validateForm(); // Tenta validar o formulário
}

function gerarNumeroDoDia(cpf) { // Modificado para aceitar o CPF como parâmetro
  var dataAtual = new Date();
  var diaDoMes = dataAtual.getDate();
  
  var numeroDoDia = ((diaDoMes % 10) + 1);
  var result = Math.floor(Math.random() * 10) + 1;
  var resultadoSorteio = numeroDoDia === result ? "Ganhou" : "Não ganhou"; // Adicionado para definir o resultado

  // Verifica se o usuário ganhou o sorteio
  if (resultadoSorteio === "Ganhou"){
      // Usuário ganhou o sorteio
      document.querySelector('#result > span').textContent = "VOCÊ GANHOU UM CHOPP";
  } else {
      // Usuário não ganhou o sorteio
      document.querySelector('#result > span').textContent = "Não foi dessa vez. Tente novamente amanhã!";
  }

  // Chamadas movidas para dentro desta função
  salvarDadosSorteio(cpf, diaDoMes, result, resultadoSorteio);
  enviarMensagemDiscord(cpf, diaDoMes, result, resultadoSorteio);
}

function salvarDadosSorteio(cpf, numeroDoDia, numeroSorteado, resultado) {
  let sorteios = JSON.parse(localStorage.getItem('sorteios')) || [];
  sorteios.push({
      cpf: cpf,
      numeroDoDia: numeroDoDia,
      numeroSorteado: numeroSorteado,
      resultado: resultado,
      data: new Date().toISOString()
  });

  localStorage.setItem('sorteios', JSON.stringify(sorteios));
}

function enviarMensagemDiscord(cpf, numeroDoDia, numeroSorteado, resultado) {
  const webhookUrl = "https://discord.com/api/webhooks/1211002858242314311/jWXj2f05181NVe59utAjDUyecpFFouT0RO1PuLAb2wQGDgh0VOW_JZh7lXlCgKEsvvD3";
  const mensagem = `CPF: ${cpf}, Número do Dia: ${numeroDoDia}, Número Sorteado: ${numeroSorteado}, Resultado: ${resultado}`;

  fetch(webhookUrl, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          content: mensagem
      })
  })
  .then(response => console.log("Mensagem enviada com sucesso."))
  .catch(error => console.error("Erro ao enviar mensagem.", error));
}