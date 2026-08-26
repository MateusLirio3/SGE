const Toast = (() => {

    // ─────────────────────────────────────────────────────────────
    // CONFIGURAÇÕES PADRÃO
    // ─────────────────────────────────────────────────────────────
    const CONFIG = {
        duracaoPadrao:  5000,   // ms antes de sumir automaticamente
        maxVisiveis:    1,      // quantos ficam expandidos por padrão
                                // (os demais ficam agrupados em pilha)
    };

    // Fila de toasts ativos { elemento, timerId }
    let fila = [];


    // ─────────────────────────────────────────────────────────────
    // OBTER OU CRIAR O CONTAINER
    // ─────────────────────────────────────────────────────────────
    function obterContainer() {
        let container = document.getElementById("toast-container");

        if (!container) {
            container    = document.createElement("div");
            container.id = "toast-container";
            container.classList.add("toast-container");
            document.body.appendChild(container);

            // Ao entrar com o mouse no container, pausa os timers de todos os toasts
            container.addEventListener("mouseenter", pausarTodos);
            // Ao sair, retoma os timers
            container.addEventListener("mouseleave", retormarTodos);
        }

        return container;
    }

    // ─────────────────────────────────────────────────────────────
    // CRIAR E EXIBIR UM TOAST
    // ─────────────────────────────────────────────────────────────
    function criar(tipo, mensagem, titulo = "", duracao = CONFIG.duracaoPadrao) {
        const container = obterContainer();

        // — Elemento raiz —
        const toast = document.createElement("div");
        toast.classList.add("toast", `toast--${tipo}`, "toast--entrando");
        if (!titulo) toast.classList.add("toast--sem-titulo");

        // — Corpo de texto —
        const corpo = document.createElement("div");
        corpo.classList.add("toast__corpo");

        if (titulo) {
            const tituloEl       = document.createElement("p");
            tituloEl.classList.add("toast__titulo");
            tituloEl.textContent = titulo;
            corpo.appendChild(tituloEl);
        }

        const mensagemEl       = document.createElement("p");
        mensagemEl.classList.add("toast__mensagem");
        mensagemEl.textContent = mensagem;
        corpo.appendChild(mensagemEl);

        // — Botão fechar —
        const fechar       = document.createElement("button");
        fechar.classList.add("toast__fechar");
        fechar.innerHTML   = "×";
        fechar.setAttribute("aria-label", "Fechar notificação");
        fechar.addEventListener("click", () => remover(entrada));

        // — Barra de progresso —
        const progresso = document.createElement("div");
        progresso.classList.add("toast__progresso");

        // — Monta o toast —
        toast.appendChild(corpo);
        toast.appendChild(fechar);
        if (duracao > 0) toast.appendChild(progresso);

        // — Badge de agrupamento —
        const badge = document.createElement("span");
        badge.classList.add("toast__badge");
        toast.appendChild(badge);

        // — Adiciona ao DOM —
        container.appendChild(toast);

        // Remove a classe de entrada após a animação
        toast.addEventListener("animationend", () => {
            toast.classList.remove("toast--entrando");
        }, { once: true });

        // — Configura o timer —
        let timerId     = null;
        let tempoCriado = Date.now();
        let tempoRestante = duracao;

        if (duracao > 0) {
            progresso.style.animationDuration = `${duracao}ms`;
            timerId = setTimeout(() => remover(entrada), duracao);
        }

        // — Limite máximo na fila —
        // Se já tiver CONFIG.maxVisiveis toasts, remove o mais antigo antes de adicionar
        if (fila.length >= CONFIG.maxVisiveis) {
            remover(fila[0]);
        }

        // — Entrada na fila —
        const entrada = { elemento: toast, timerId, tempoCriado, tempoRestante, duracao, progresso };
        fila.push(entrada);

        // — Atualiza agrupamento —
        atualizarAgrupamento();

        return entrada;
    }


    // ─────────────────────────────────────────────────────────────
    // REMOVER UM TOAST (com animação de saída)
    // ─────────────────────────────────────────────────────────────
    function remover(entrada) {
        if (!entrada || !entrada.elemento.isConnected) return;

        // Cancela o timer pendente
        if (entrada.timerId) clearTimeout(entrada.timerId);

        entrada.elemento.classList.add("toast--saindo");

        entrada.elemento.addEventListener("animationend", () => {
            entrada.elemento.remove();
            fila = fila.filter(e => e !== entrada);
            atualizarAgrupamento();
        }, { once: true });
    }


    // ─────────────────────────────────────────────────────────────
    // PAUSAR TODOS OS TIMERS (ao entrar com o mouse)
    // ─────────────────────────────────────────────────────────────
    function pausarTodos() {
        const agora = Date.now();
        fila.forEach(entrada => {
            if (entrada.timerId) {
                clearTimeout(entrada.timerId);
                entrada.timerId = null;
                // Calcula quanto tempo ainda restava
                const decorrido = agora - entrada.tempoCriado;
                entrada.tempoRestante = Math.max(0, entrada.duracao - decorrido);

                // Pausa a animação da barra de progresso
                if (entrada.progresso) {
                    entrada.progresso.style.animationPlayState = "paused";
                }
            }
        });
    }


    // ─────────────────────────────────────────────────────────────
    // RETOMAR TODOS OS TIMERS (ao sair com o mouse)
    // ─────────────────────────────────────────────────────────────
    function retormarTodos() {
        fila.forEach(entrada => {
            if (entrada.duracao > 0 && entrada.tempoRestante > 0 && !entrada.timerId) {
                entrada.tempoCriado = Date.now();
                entrada.timerId     = setTimeout(() => remover(entrada), entrada.tempoRestante);

                // Retoma a animação da barra de progresso
                if (entrada.progresso) {
                    entrada.progresso.style.animationPlayState = "running";
                }
            }
        });
    }


    // ─────────────────────────────────────────────────────────────
    // AGRUPAMENTO
    // Os últimos CONFIG.maxVisiveis ficam expandidos.
    // Os mais antigos ficam comprimidos em pilha com badge "+N".
    // ─────────────────────────────────────────────────────────────
    function atualizarAgrupamento() {
        const total    = fila.length;
        const visiveis = CONFIG.maxVisiveis;

        fila.forEach((entrada, index) => {
            const el    = entrada.elemento;
            const badge = el.querySelector(".toast__badge");

            // Os mais novos (final do array) ficam expandidos
            const estaExpandido = index >= total - visiveis;

            if (estaExpandido) {
                el.classList.remove("toast--agrupado");

                // Só o mais novo da pilha mostra o badge de quantos estão agrupados
                const agrupados = total - visiveis;
                if (index === total - visiveis && agrupados > 0) {
                    badge.classList.add("toast__badge--visivel");
                } else {
                    badge.classList.remove("toast__badge--visivel");
                }
            } else {
                el.classList.add("toast--agrupado");
                badge.classList.remove("toast__badge--visivel");
            }
        });
    }

    // ─────────────────────────────────────────────────────────────
    // API PÚBLICA
    // ─────────────────────────────────────────────────────────────
    return {

        /**
         * Toast de sucesso — verde
         * @param {string} mensagem  - Texto principal
         * @param {string} [titulo]  - Título em negrito (opcional)
         * @param {number} [duracao] - Duração em ms (padrão: 5000 | 0 = permanente)
         */
        sucesso(mensagem, titulo = "", duracao = CONFIG.duracaoPadrao) {
            return criar("sucesso", mensagem, titulo, duracao);
        },

        /**
         * Toast de erro — vermelho
         * Duração padrão maior (7s) porque erros merecem atenção.
         */
        erro(mensagem, titulo = "", duracao = 7000) {
            return criar("erro", mensagem, titulo, duracao);
        },

        /**
         * Toast de aviso — âmbar
         */
        aviso(mensagem, titulo = "", duracao = CONFIG.duracaoPadrao) {
            return criar("aviso", mensagem, titulo, duracao);
        },

        /**
         * Toast informativo — azul
         */
        info(mensagem, titulo = "", duracao = CONFIG.duracaoPadrao) {
            return criar("info", mensagem, titulo, duracao);
        },

        /**
         * Remove todos os toasts ativos imediatamente.
         */
        limparTodos() {
            [...fila].forEach(entrada => remover(entrada));
        },
    };

})();