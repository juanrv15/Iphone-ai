// Meu Assistente Pessoal
// Primeira etapa: comandos por voz e respostas faladas.

(() => {
  "use strict";

  let reconhecimento = null;

  function iniciar() {
    const campo = document.querySelector("textarea");

    const botoes = Array.from(
      document.querySelectorAll("button")
    );

    const botaoFalar = botoes.find(botao =>
      botao.textContent
        .toLowerCase()
        .includes("falar meu comando")
    );

    const botaoEnviar = botoes.find(botao =>
      botao.textContent
        .toLowerCase()
        .includes("enviar comando")
    );

    if (!campo || !botaoFalar || !botaoEnviar) {
      console.error(
        "Não encontrei os elementos da interface."
      );
      return;
    }

    let resposta = document.getElementById(
      "resposta-assistente"
    );

    if (!resposta) {
      resposta = document.createElement("div");
      resposta.id = "resposta-assistente";
      resposta.setAttribute("role", "status");
      resposta.setAttribute("aria-live", "polite");

      resposta.style.marginTop = "20px";
      resposta.style.padding = "12px";
      resposta.style.lineHeight = "1.6";

      botaoEnviar.insertAdjacentElement(
        "afterend",
        resposta
      );
    }

    function falar(texto) {
      resposta.textContent = texto;

      if (!("speechSynthesis" in window)) {
        return;
      }

      window.speechSynthesis.cancel();

      const mensagem = new SpeechSynthesisUtterance(
        texto
      );

      mensagem.lang = "pt-BR";
      mensagem.rate = 1;

      window.speechSynthesis.speak(mensagem);
    }

    function executarComando(comando) {
      const texto = comando
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      if (!texto) {
        falar("Diga ou escreva um comando primeiro.");
        return;
      }

      if (
        texto.includes("que horas") ||
        texto.includes("horario")
      ) {
        const hora = new Date().toLocaleTimeString(
          "pt-BR",
          {
            hour: "2-digit",
            minute: "2-digit"
          }
        );

        falar("Agora são " + hora + ".");
        return;
      }

      if (
        texto.includes("que dia") ||
        texto.includes("data de hoje")
      ) {
        const data = new Date().toLocaleDateString(
          "pt-BR",
          {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
          }
        );

        falar("Hoje é " + data + ".");
        return;
      }

      if (
        texto.includes("abrir youtube") ||
        texto.includes("abre youtube")
      ) {
        falar("Abrindo o YouTube.");

        window.location.href =
          "https://m.youtube.com/";

        return;
      }

      if (
        texto.includes("abrir whatsapp") ||
        texto.includes("abre whatsapp")
      ) {
        falar("Abrindo o WhatsApp.");

        window.location.href =
          "https://wa.me/";

        return;
      }

      if (
        texto.includes("ajuda") ||
        texto.includes("quais comandos")
      ) {
        falar(
          "Por enquanto, posso informar as horas e a data, " +
          "ou abrir o YouTube e o WhatsApp. " +
          "Ainda estamos desenvolvendo as outras funções."
        );

        return;
      }

      falar(
        "Recebi seu comando: " + comando +
        ". Ainda não sei executar essa ação. " +
        "Vamos ampliar minhas funções nas próximas etapas."
      );
    }

    botaoEnviar.addEventListener(
      "click",
      evento => {
        evento.preventDefault();
        executarComando(campo.value);
      },
      true
    );

    botaoFalar.addEventListener(
      "click",
      evento => {
        evento.preventDefault();

        const Reconhecimento =
          window.SpeechRecognition ||
          window.webkitSpeechRecognition;

        if (!Reconhecimento) {
          falar(
            "O reconhecimento de voz não está disponível " +
            "neste navegador. Tente usar o Safari ou o Chrome."
          );
          return;
        }

        if (reconhecimento) {
          reconhecimento.abort();
        }

        reconhecimento = new Reconhecimento();
        reconhecimento.lang = "pt-BR";
        reconhecimento.continuous = false;
        reconhecimento.interimResults = false;

        falar("Pode falar. Estou ouvindo.");

        reconhecimento.onresult = resultado => {
          const comando =
            resultado.results[0][0].transcript;

          campo.value = comando;
          executarComando(comando);
        };

        reconhecimento.onerror = erro => {
          if (erro.error === "not-allowed") {
            falar(
              "O acesso ao microfone foi bloqueado. " +
              "Verifique a permissão do navegador."
            );
          } else {
            falar(
              "Não consegui entender. " +
              "Tente falar novamente ou digite o comando."
            );
          }
        };

        reconhecimento.start();
      },
      true
    );

    falar(
      "Assistente iniciado. " +
      "Você pode falar ou digitar um comando."
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      iniciar
    );
  } else {
    iniciar();
  }
})();
