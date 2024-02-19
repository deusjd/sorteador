document.addEventListener("DOMContentLoaded", function() {
    verificarParticipacaoSorteio();
  });

const button = document.getElementById('generate');
const jaParticipou = localStorage.getItem('jaParticipouSorteio');


function gerarNumeroDoDia() {

    var dataAtual = new Date();
    var diaDoMes = dataAtual.getDate();
    
    // Ajusta o dia do mês para o intervalo de 1 a 10
    // Isso é apenas uma sugestão de fórmula. Você pode ajustar conforme necessário.
    var numeroDoDia = ((diaDoMes % 10) + 1);
    var result = Math.floor(Math.random() * 10) + 1;

    document.querySelector('#number_key > span').textContent = numeroDoDia;
    document.querySelector('#result > span').textContent = result;

    if (numeroDoDia == result){
        result = "VOCÊ GANHOU UM CHOPP"
        document.querySelector('#result > span').textContent = result;
 
    }
    
  }

  function verificarParticipacaoSorteio() {
    // Verifica se o dispositivo já participou
    const jaParticipou = localStorage.getItem('jaParticipouSorteio');
    
    if (jaParticipou) {
      // Dispositivo já participou do sorteio
      alert("Este dispositivo já participou do sorteio.");
      return false; // Impede a participação no sorteio novamente
    } else {
      // Primeira participação no sorteio
      gerarNumeroDoDia();
      // Marca o dispositivo como já participante
      localStorage.setItem('jaParticipouSorteio', 'true');
      return true;
    }
  }