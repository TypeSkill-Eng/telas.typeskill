// TypeSkill — codigo.js (etapa 2 da recuperação de senha)
// Os 4 campos do código: pula sozinho para o próximo, aceita colar, mostra erro.
(function () {
    "use strict";

    var form = document.getElementById("form-codigo");
    var grupo = form.querySelector(".codigo-campos");
    var campos = Array.prototype.slice.call(form.querySelectorAll(".codigo-campo"));
    var mensagem = document.getElementById("mensagem-codigo");
    var botao = form.querySelector("button[type='submit']");
    var emailDestino = document.getElementById("email-destino");
    var total = campos.length;

    
    function lerEmail() {
        var email = new URLSearchParams(window.location.search).get("email");
        if (!email) {
            try { email = sessionStorage.getItem("emailRecuperacao"); } catch (e) { /* sem acesso */ }
        }
        return email || "";
    }

    function mascararEmail(email) {
        var partes = email.split("@");
        if (partes.length !== 2 || !partes[0] || !partes[1]) return "";
        return partes[0].slice(0, 2) + "***@" + partes[1];
    }

    emailDestino.textContent = mascararEmail(lerEmail()) || "seu email";

    /* O código foi gerado na tela "Esqueceu a senha?" (auth.js) e guardado
       na sessão do navegador. Como não temos servidor de e-mail,
       mostramos o código aqui (modo de teste). */
    var recuperacao = null;
    try { recuperacao = JSON.parse(sessionStorage.getItem("typeskill-recuperacao")); } catch (e) { recuperacao = null; }
    var teste = document.getElementById("codigo-teste");
    if (recuperacao && teste) {
        teste.innerHTML = "Modo de teste (sem e-mail de verdade): seu código é <strong>" + recuperacao.codigo + "</strong>";
        teste.hidden = false;
    }
    var tentativas = 0;

    /* ---------- Ajudantes ---------- */
    function mostrar(texto, tipo) {
        mensagem.textContent = texto;
        mensagem.setAttribute("data-tipo", tipo || "");
    }

    function limparErro() {
        grupo.classList.remove("is-erro");
        campos.forEach(function (c) { c.removeAttribute("aria-invalid"); });
    }

    function marcar(campo) {
        campo.classList.toggle("is-preenchido", campo.value !== "");
    }

    /* Distribui os dígitos a partir do campo "inicio" (usado ao colar ou no preenchimento automático) */
    function preencher(inicio, texto) {
        var digitos = texto.replace(/\D/g, "").slice(0, total - inicio);
        digitos.split("").forEach(function (d, i) {
            campos[inicio + i].value = d;
            marcar(campos[inicio + i]);
        });
        campos[Math.min(inicio + digitos.length, total - 1)].focus();
    }

    /* ---------- Comportamento de cada campo ---------- */
    campos.forEach(function (campo, i) {

        campo.addEventListener("focus", function () { campo.select(); });

        campo.addEventListener("keydown", function (e) {
            if (e.ctrlKey || e.metaKey || e.altKey) return;

            if (e.key === "Backspace") {
                if (campo.value === "" && i > 0) {          /* campo vazio: volta e apaga o anterior */
                    e.preventDefault();
                    campos[i - 1].value = "";
                    marcar(campos[i - 1]);
                    campos[i - 1].focus();
                }
            } else if (e.key === "ArrowLeft" && i > 0) {
                e.preventDefault();
                campos[i - 1].focus();
            } else if (e.key === "ArrowRight" && i < total - 1) {
                e.preventDefault();
                campos[i + 1].focus();
            } else if (e.key.length === 1 && !/\d/.test(e.key)) {
                e.preventDefault();                          /* só aceita números */
            }
        });

        campo.addEventListener("input", function (e) {
            limparErro();
            mostrar("");

            /* digitou um número: fica só ele e passa para o próximo campo */
            if (e.data && e.data.length === 1 && /\d/.test(e.data)) {
                campo.value = e.data;
                marcar(campo);
                if (i < total - 1) campos[i + 1].focus();
                return;
            }

            /* preenchimento automático (vários dígitos de uma vez) ou apagou */
            var digitos = campo.value.replace(/\D/g, "");
            campo.value = "";
            if (digitos) { preencher(i, digitos); } else { marcar(campo); }
        });

        campo.addEventListener("paste", function (e) {
            e.preventDefault();
            var texto = (e.clipboardData || window.clipboardData).getData("text");
            limparErro();
            mostrar("");
            preencher(i, texto);
        });
    });

    /* confere o código digitado com o que foi gerado: vale por 10 minutos e 5 tentativas */
    function verificarCodigo(codigo) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                if (!recuperacao) return reject(new Error("Peça um código na tela \"Esqueceu a senha?\"."));
                if (Date.now() > recuperacao.ate) return reject(new Error("Esse código expirou. Peça um novo."));
                if (++tentativas > 5) return reject(new Error("Muitas tentativas. Peça um novo código."));
                if (codigo !== recuperacao.codigo) return reject(new Error("Código incorreto. Confira e tente de novo."));
                recuperacao.confirmado = true;
                sessionStorage.setItem("typeskill-recuperacao", JSON.stringify(recuperacao));
                resolve();
            }, 400);
        });
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        var codigo = campos.map(function (c) { return c.value; }).join("");

        if (codigo.length < total) {
            grupo.classList.add("is-erro");
            campos.forEach(function (c) { if (!c.value) c.setAttribute("aria-invalid", "true"); });
            mostrar("Digite os " + total + " números do código.", "erro");
            campos.filter(function (c) { return !c.value; })[0].focus();
            return;
        }

        botao.disabled = true;
        mostrar("Verificando...", "");

        verificarCodigo(codigo)
            .then(function () {
                mostrar("Código confirmado! Agora crie sua nova senha...", "ok");
                setTimeout(function () { window.location.href = "nova-senha.html"; }, 1000);
            })
            .catch(function (erro) {
                grupo.classList.add("is-erro");
                mostrar(erro.message || "Código inválido.", "erro");
                campos.forEach(function (c) { c.value = ""; marcar(c); });
                campos[0].focus();
            })
            .then(function () { botao.disabled = false; });
    });
})();

