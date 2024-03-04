// Habilitar validação cpf
//habilitar sorteio no memso dia cpf

window.onload = function() {
  document.getElementById("rulesPopup").style.display = "flex"; // Alterado para "flex" para trabalhar com o novo estilo CSS
      // Define um valor padrão para o campo CPF
      document.getElementById("cpf").value = "08765920945"; // Substitua '12345678901' pelo valor padrão desejado

      // Marca o checkbox como checado
      document.getElementById("agreeTerms").checked = true;
};


var popup = document.getElementById("rulesPopup");
var span = document.getElementsByClassName("close")[0]; // O botão de fechar

// Previne o fechamento do pop-up clicando fora dele
window.onclick = function(event) {
  if (event.target == popup) {
      event.preventDefault(); // Mantém o pop-up aberto
  }
}

function validateForm() {
  var cpf = document.getElementById("cpf").value;
  var agreeTerms = document.getElementById("agreeTerms").checked;
  
 // Adiciona a chamada para a função de validação de CPF
  if (!validaCPF(cpf)) {
    alert("Por favor, insira um CPF válido.");
    return; // Interrompe a execução se o CPF for inválido
  }

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

function enviarMensagemDiscord(cpf, numeroDoDia, numeroSorteado, resultado, mensagem_result) {
  const webhookUrl_nao_ganhou = "https://discord.com/api/webhooks/1214164460198174821/czAvUIv8OIY4LDL1eCXWEBUO-MG2xe299tjpI6d0CWQEHX3Dr5VmaWy8v2v4CkStew3g";
  const webhooks_ganhou = "https://discord.com/api/webhooks/1214155641002922015/oXZ91DU401E87kK-HRslmLH0ETFrBv_bDnu4DZy5m3O6gVHy0X3PUgXLNSJMbnzLC72Z"
  const mensagem = `
  🍀 Sorteio realizado
  | CPF: ${cpf}
  | Número do Dia: ${numeroDoDia} 
  | Número Sorteado: ${numeroSorteado} 
  | Resultado: ${resultado}
  | Mensagem: ${mensagem_result}`;


  if(resultado === "Ganhou") {
    webhookUrl = webhooks_ganhou;
  } else {
    webhookUrl = webhookUrl_nao_ganhou;
  }

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
  // if (localStorage.getItem(chaveSorteio)) {
  //     alert("Você já participou do sorteio hoje!");
  //     return; // Interrompe a execução da função se o sorteio já foi realizado
  // }

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
  //var numeroDoDia = dataAtual.getDate() % 21; // Garante que esteja entre 0 e 10

  var numeroDoDia = Math.floor(Math.random() * 20);

  // Gerar um número aleatório entre 0 e 10
  // Math.random() gera um número entre 0 (inclusivo) e 1 (exclusivo), então multiplicamos por 11
  // para obter um número no intervalo [0, 11) e usamos Math.floor() para arredondar para baixo,
  // resultando em um número inteiro entre 0 e 10
  var result = Math.floor(Math.random() * 20);

  var resultadoSorteio = numeroDoDia === result ? "Ganhou" : "Não ganhou";

  if (numeroDoDia === result){
    if(result === 2 ){
      var mensagem_result = "VOCÊ GANHOU UMA CARTOLA + 1 CHOPP + 1 COPO DO EVENTO!";
      } else {
        mensagem_result = "VOCÊ GANHOU 1 CHOPP + 1 COPO DO EVENTO!"
      }
    } else {
      mensagem_result = "Não foi dessa vez, volte amanhã e tente outra vez. 😢"
    }


  // Atualiza o conteúdo da página com o resultado do sorteio
  if (resultadoSorteio === "Ganhou") {
    var imagemPremio = document.querySelector('.imagem-premio');
    var elementoPremio = document.getElementById('premio');

    imagemPremio.style.display = 'block'; // Faz a imagem aparecer
      setTimeout(() => {
          imagemPremio.style.transform = 'translate(-50%, -50%) scale(1)'; // Crescimento
      }, 100); // Um pequeno delay para garantir que a transição ocorra

      setTimeout(() => {
            // Inicia a animação de desaparecimento
            imagemPremio.classList.add('desaparecer');

            // Espera a imagem desaparecer para revelar o prêmio
            setTimeout(() => {
                imagemPremio.style.display = 'none'; // Esconde a imagem após o desaparecimento
                elementoPremio.style.display = 'block'; // Mostra o prêmio
            }, 2000); // Este valor deve coincidir com a duração da animação de desaparecimento

            if(result === 2) {
              mensagem_result = "VOCÊ GANHOU UMA CARTOLA + 1 CHOPP + 1 COPO DO EVENTO!";
              document.querySelector('#result > span').textContent = mensagem_result;
            } else {
              mensagem_result = "VOCÊ GANHOU 1 CHOPP + 1 COPO DO EVENTO!"
              document.querySelector('#result > span').textContent = mensagem_result;
            }
        }, 3000); // Ajuste este valor conforme necessário para o tempo antes da imagem começar a desaparecer


  } else {
    mensagem_result = "Não foi dessa vez, volte amanhã e tente outra vez. 😢"
      document.querySelector('#result > span').textContent = mensagem_result;
  }

  // Continua com as chamadas para salvar os dados do sorteio e enviar mensagem para o Discord
  salvarDadosSorteio(cpf, diaDoMes, result, resultadoSorteio);
  enviarMensagemDiscord(cpf, numeroDoDia, result, resultadoSorteio, mensagem_result);
}

function validaCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false; // Verifica se tem 11 dígitos ou se são todos iguais

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;

  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;

  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}
