document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.querySelector('input[name="email"]');
    const btnRecuperar = document.getElementById('btnRecuperar');
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function EnviarEmail(email) {
        // implementar a função de enviar o email real aqui
        console.log('====== ENVIO DE EMAIL ======');
        console.log('Para:', email);
        console.log('Assunto: Redefinição de Senha - SIGA');
        console.log('Link de redefinição: http://localhost:8000/redefinir-senha?token='); // + token);
        console.log('Token expira em: 1 hora');
    }


    btnRecuperar.addEventListener('click', function () {
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

        const textoOriginal = this.textContent;
        this.textContent = 'Enviando..';
        this.disabled = true;

        setTimeout(() => {
            EnviarEmail(email);
            Toast.sucesso('Link de recuperação enviado para o e-mail informado!', 'Email enviado!');
            emailInput.value = '';
            this.textContent = textoOriginal;
            this.disabled = false;
        }, 2000);
    });

    emailInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            btnRecuperar.click();
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