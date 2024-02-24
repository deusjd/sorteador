window.onload = function() {
  document.getElementById("rulesPopup").style.display = "flex"; // Alterado para "flex" para trabalhar com o novo estilo CSS
};


var popup = document.getElementById("rulesPopup");
var span = document.getElementsByClassName("close")[0]; // O botão de fechar

// Previne o fechamento do pop-up clicando fora dele
window.onclick = function(event) {
  if (event.target == popup) {
      event.preventDefault(); // Mantém o pop-up aberto
  }
}

async function carregarConfiguracoes() {
  try {
    const response = await fetch('config.json'); // Caminho para o seu arquivo config.json
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const config = await response.json();

    // Agora você pode usar `config` para acessar as configurações
    console.log(config.rangeNumeros.minimo); // Exemplo de acesso
    console.log(config.mensagens.ganhou); // Exemplo de acesso

    // Aqui você pode substituir os valores diretamente no seu código existente
    // Por exemplo, substituindo os valores fixos por aqueles definidos no arquivo de configuração
    // Exemplo: var result = Math.floor(Math.random() * (config.rangeNumeros.maximo + 1));

  } catch (e) {
    console.error("Não foi possível carregar o arquivo de configuração:", e);
  }
}

// Lembre-se de chamar a função `carregarConfiguracoes` no início do seu script ou quando for necessário
carregarConfiguracoes();

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

function gerarNumeroDoDia(cpf) {
  // Exibe o container da contagem regressiva
  document.getElementById("countdownContainer").style.display = "block";

  let counter = 5; // Inicia a contagem regressiva de 5 segundos
  const countdownElement = document.getElementById("countdownTimer");
  countdownElement.textContent = counter; // Exibe o número inicial

  let intervalId = setInterval(() => {
    counter--;
    countdownElement.textContent = counter;
    if (counter <= 0) {
      clearInterval(intervalId); // Para a contagem regressiva
      mostrarResultadoSorteio(cpf);
      document.getElementById("countdownContainer").style.display = "none"; // Oculta o container após o término
    }
  }, 1000); // Atualiza a contagem a cada segundo
}

function mostrarResultadoSorteio(cpf) {
  var resultadoSorteio = gerarResultadoSorteio(); // Função hipotética que determina se o usuário ganhou

  // Atualiza o conteúdo do pop-up com o resultado do sorteio
  const countdownElement = document.getElementById("countdownTimer");
  countdownElement.textContent = resultadoSorteio ? "VOCÊ GANHOU UM CHOPP 🍺🍺🍺" : "Não foi dessa vez. 😢";

  // Fecha o pop-up após alguns segundos
  setTimeout(() => {
      document.getElementById("countdownPopup").style.display = "none";
  }, 5000); // Mantém o resultado visível por 5 segundos antes de fechar
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
  const mensagem = `
  🍀 Sorteio realizado
  | CPF: ${cpf}
  | Número do Dia: ${numeroDoDia} 
  | Número Sorteado: ${numeroSorteado} 
  | Resultado: ${resultado}`;

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
  var dataAtual = new Date();
  var chaveSorteio = 'sorteio-' + cpf + '-' + dataAtual.toISOString().split('T')[0]; // Cria uma chave única por dia para cada CPF

  // Verifica se o sorteio já foi realizado hoje para este CPF
  if (localStorage.getItem(chaveSorteio)) {
      alert("Você já participou do sorteio hoje!");
      return; // Interrompe a execução da função se o sorteio já foi realizado
  }

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
          localStorage.setItem(chaveSorteio, true); // Marca que o sorteio foi realizado hoje para este CPF
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
      document.querySelector('#result > span').textContent = "VOCÊ GANHOU UM CHOPP 🍺🍺🍺";
  } else {
      document.querySelector('#result > span').textContent = "Não foi dessa vez. 😢";
  }

  // Continua com as chamadas para salvar os dados do sorteio e enviar mensagem para o Discord
  salvarDadosSorteio(cpf, diaDoMes, result, resultadoSorteio);
  enviarMensagemDiscord(cpf, numeroDoDia, result, resultadoSorteio);
}