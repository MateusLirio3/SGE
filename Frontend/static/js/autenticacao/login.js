 const form = document.querySelector("form");
    
    // ─────────────────────────────────────────────────────────────
    // ENTER AVANÇA PARA O PRÓXIMO CAMPO
    // ─────────────────────────────────────────────────────────────
    const camposNavegaveis = [...document.querySelectorAll(
        ".secao-login__campo input, .secao-login__checkboxes input"
    )];
    // ─────────────────────────────────────────────────────────────
    // ENTER E SETAS AVANÇAM/VOLTAM PARA O PRÓXIMO CAMPO
    // ─────────────────────────────────────────────────────────────
    function obterCamposAtivos() {
        return [...document.querySelectorAll(
            ".secao-login__campo input"
        )].filter(campo => !campo.readOnly && !campo.disabled);
    }

    document.addEventListener("keydown", (e) => {
        if (!["Enter", "ArrowDown", "ArrowUp"].includes(e.key)) return;

        const campos = obterCamposAtivos();
        const focado = document.activeElement;
        const index  = campos.indexOf(focado);

        if (index === -1) return;

        if (e.key === "ArrowUp" || (e.key === "Enter" && e.shiftKey)) {
            const anterior = campos[index - 1];
            if (anterior) {
                e.preventDefault();
                anterior.focus();
            }
            return;
        }

        const proximo = campos[index + 1];
        if (proximo) {
            e.preventDefault();
            proximo.focus();
        }
        // último campo: Enter submete normalmente
    });

    form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.querySelector('input[name="username"]').value;
    const senha   = document.querySelector('input[name="password"]').value;

    const formData = new URLSearchParams();
    formData.append("username", usuario);
    formData.append("password", senha);

    try {
        const resposta = await fetch("/login/submit", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData.toString()
        });

        const dados = await resposta.json();

       if (resposta.ok) {
        localStorage.setItem("token",        dados.access_token);
        localStorage.setItem("tipo_usuario", dados.tipo);
        localStorage.setItem("nomeUsuario",  dados.usuario);

        Toast.sucesso("Redirecionando...", "Login realizado!");

        const rotas = {
            "aluno":       "/aluno/pagina-inicial/",
            "coordenador": "/coordenador/pagina-inicial/",
            "admin": "/admin/inicio/"
        };

        const destino = rotas[dados.tipo];
        if (destino) {
            setTimeout(() => { window.location.href = destino; }, 1200);
        }

    } else {
        Toast.erro("Usuário e/ou senha inválidos.");
    }

        } catch (erro) {
            Toast.aviso("Não foi possível conectar. Tente novamente.", "Problema de conexão");
            console.error(erro);
        };
    });