window.onload = function() {
  document.getElementById("rulesPopup").style.display = "block";
};

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

function gerarNumeroDoDia(cpf) {
  // Inicia a contagem regressiva de 5 segundos
  let counter = 5;
  const countdownElement = document.getElementById("countdown");
  countdownElement.style.display = "block"; // Exibe o elemento de contagem regressiva
  countdownElement.textContent = "Preparando resultado... " + counter;

  let intervalId = setInterval(() => {
      counter--;
      countdownElement.textContent = "Preparando resultado... " + counter;
      if (counter <= 0) {
          clearInterval(intervalId); // Para a contagem regressiva
          countdownElement.style.display = "none"; // Oculta o contador
          mostrarResultadoSorteio(cpf); // Chama a função para mostrar o resultado
      }
  }, 1000); // Atualiza a contagem a cada segundo
}

function mostrarResultadoSorteio(cpf) {
  var dataAtual = new Date();
  var diaDoMes = dataAtual.getDate();

  // Garantir que o número do dia esteja entre 0 e 10
  // Como o dia do mês pode ser de 1 a 31, usamos o módulo (%) por 11 para obter um número entre 0 e 10
  var numeroDoDia = dataAtual.getDate() % 11; // Garante que esteja entre 0 e 10

  // Gerar um número aleatório entre 0 e 10
  // Math.random() gera um número entre 0 (inclusivo) e 1 (exclusivo), então multiplicamos por 11
  // para obter um número no intervalo [0, 11) e usamos Math.floor() para arredondar para baixo,
  // resultando em um número inteiro entre 0 e 10
  var result = Math.floor(Math.random() * 11);

  var resultadoSorteio = numeroDoDia === result ? "Ganhou" : "Não ganhou";

  // Atualiza o conteúdo da página com o resultado do sorteio
  if (resultadoSorteio === "Ganhou") {
      document.querySelector('#result > span').textContent = "VOCÊ GANHOU UM CHOPP";
  } else {
      document.querySelector('#result > span').textContent = "Não foi dessa vez. Tente novamente amanhã!";
  }

  // Continua com as chamadas para salvar os dados do sorteio e enviar mensagem para o Discord
  salvarDadosSorteio(cpf, diaDoMes, result, resultadoSorteio);
  enviarMensagemDiscord(cpf, numeroDoDia, result, resultadoSorteio);
}