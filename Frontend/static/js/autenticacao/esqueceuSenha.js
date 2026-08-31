function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

async function carregarTokenCsrf() {
    const resposta = await fetch('/get-token', {
        credentials: 'same-origin',
        cache: 'no-store'
    });
    if (!resposta.ok) throw new Error('Não foi possível obter o token CSRF');
    return resposta.headers.get('X-CSRF-Token');
}



document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.querySelector('input[name="email"]');
    const form = document.getElementById("form-recuperacao");
    const botao = document.getElementById("btnRecuperar");
    let intervalo = null;

    if (!emailInput || !form || !botao) {
        return;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function resetarBotao() {
        botao.disabled = false;
        botao.textContent = "Enviar link de redefinição";
    }

    function iniciarContador() {
        if (intervalo) {
            return;
        }

        let contador = 30;
        botao.disabled = true;
        botao.textContent = `Enviar link de redefinição (${contador}s)`;

        intervalo = setInterval(() => {
            contador -= 1;

            if (contador <= 0) {
                clearInterval(intervalo);
                intervalo = null;
                resetarBotao();
                return;
            }

            botao.textContent = `Enviar link de redefinição (${contador}s)`;
        }, 1000);
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = emailInput.value.trim();

        if (!email) {
            Toast.erro('Por favor, informe seu e-mail.');
            emailInput.focus();
            return;
        }

        if (!isValidEmail(email)) {
            Toast.erro('Por favor, informe um e-mail válido.');
            emailInput.focus();
            return;
        }

        const formData = new URLSearchParams();
        formData.append("email", email);

        botao.disabled = true;
        botao.textContent = "Enviando...";

        try {
            const csrfToken = await carregarTokenCsrf();
            const csrfCookie = getCookie('fastapi-csrf-token');
            if (!csrfToken || !csrfCookie) throw new Error('Token CSRF ausente');
            const resposta = await fetch("/Esqueceu-Senha/Submit", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded", "X-CSRF-Token": csrfToken },
                body: formData.toString()
            });

            const dados = await resposta.json();

            if (resposta.ok && dados.enviado) {
                Toast.sucesso("Verifique sua caixa de entrada e o spam.", "E-mail enviado!");
                iniciarContador();
            } else if (resposta.ok && !dados.enviado) {
                Toast.erro(dados.message || "Não foi possível processar a solicitação.", "Erro");
                resetarBotao();
            } else {
                Toast.erro("Não foi possível processar a solicitação. Tente novamente.");
                resetarBotao();
            }
        } catch (erro) {
            Toast.aviso("Não foi possível conectar. Tente novamente.", "Problema de conexão");
            console.error(erro);
            resetarBotao();
        }
    });

    botao.addEventListener('click', function () {
        form.requestSubmit();
    });

    emailInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            form.requestSubmit();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const voltarLink = document.querySelector('.link_voltar');
            if (voltarLink) {
                window.location.href = voltarLink.href;
            }
        }
    });
});