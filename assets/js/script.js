window.onload = function() {
  document.getElementById("rulesPopup").style.display = "flex";
  var campoCPF = document.getElementById("cpf");

  campoCPF.addEventListener('input', function() {
    aplicarMascaraCPF(campoCPF);
  });
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
  
//Adiciona a chamada para a função de validação de CPF
//  if (!validaCPF(cpf)) {
//    alert("Por favor, insira um CPF válido.");
//    return; // Interrompe a execução se o CPF for inválido
//  }

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
  const webhookUrl = "https://discord.com/api/webhooks/1221818185339244644/o7zDnm4zvILaQNt4tSQW1M5pC-ldYWSQI1g9YhstlLp3ZeI8KiyMLS8F8JkMD8MMB8vM"
  const mensagem = `
  🍀 Sorteio realizado
  | CPF: ${cpf}
  | Número do Dia: ${numeroDoDia} 
  | Número Sorteado: ${numeroSorteado} 
  | Resultado: ${resultado}
  | Mensagem: ${mensagem_result}`;

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
  }, 1000); // Atualiza a contagem a cada segundo.
}

function mostrarResultadoSorteio(cpf) {
  var dataAtual = new Date();
  var diaDoMes = dataAtual.getDate();

  // Garantir que o número do dia esteja entre 0 e 10
  // Como o dia do mês pode ser de 1 a 31, usamos o módulo (%) por 11 para obter um número entre 0 e 10
  //var numeroDoDia = dataAtual.getDate() % 21; // Garante que esteja entre 0 e 10

  var numeroDoDia = 1;// Math.floor(Math.random() * 8);

  // Gerar um número aleatório entre 0 e 10
  // Math.random() gera um número entre 0 (inclusivo) e 1 (exclusivo), então multiplicamos por 11
  // para obter um número no intervalo [0, 11) e usamos Math.floor() para arredondar para baixo,
  // resultando em um número inteiro entre 0 e 10
  var result = 1;//Math.floor(Math.random() * 8);

  var resultadoSorteio = numeroDoDia === result ? "Ganhou" : "Não ganhou";

  if (numeroDoDia === result){
    mensagem_result = "VOCÊ GANHOU 1 DRINK DE CAFÉ";
    
    // Cria o botão WhatsApp
    var botaoWhatsApp = document.createElement('a'); // Cria um elemento de link
    botaoWhatsApp.href = "https://api.whatsapp.com/send?phone=5548996909196&text=Ol%C3%A1%20Favorito!%0AAcabei%20de%20ganhar%20um%20PREMIO%20no%20sorteio%20do%20APP,%20e%20gostaria%20de%20retirar%20meu%20Voucher."; // Configura o link
    botaoWhatsApp.textContent = "Clique aqui para resgatar seu premio"; // Define o texto do botão
    botaoWhatsApp.target = "_blank"; // Garante que o link será aberto em uma nova aba
    botaoWhatsApp.style.display = "block"; // Faz o botão aparecer como um bloco, para ficar em uma nova linha
    botaoWhatsApp.className = "whatsapp-button"; // Adiciona uma classe para estilização (opcional)
    
    // Insere o botão após a mensagem de resultado
    var divResultado = document.getElementById('result'); // Localiza a div onde a mensagem de resultado é exibida
    divResultado.appendChild(botaoWhatsApp); // Adiciona o botão à div

  } else {
    mensagem_result = "Não foi dessa vez. 😢";
    document.querySelector('#result > span').textContent = mensagem_result;
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

            //  mensagem_result = "VOCÊ GANHOU 1 DRINK DE CAFÉ"
              document.querySelector('#result > span').textContent = mensagem_result;

        }, 3000); // Ajuste este valor conforme necessário para o tempo antes da imagem começar a desaparecer


  } else {
    mensagem_result = "Não foi dessa vez. 😢"
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

function aplicarMascaraCPF(campo) {
  var valor = campo.value;

  valor = valor.replace(/\D/g, ""); // Remove tudo o que não é dígito
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2"); // Coloca ponto após o terceiro dígito
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2"); // Coloca ponto após o sexto dígito
  valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Coloca hífen antes dos dois últimos dígitos

  campo.value = valor;
}
