/* =========================================================
   SISTEMA DE CHAMADOS
   SCRIPT.JS COMPLETO
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTOS PRINCIPAIS
    ===================================================== */

    const telaLogin = document.getElementById("telaLogin");
    const areaCliente = document.getElementById("areaCliente");
    const sistema = document.getElementById("sistema");

    const formLogin = document.getElementById("formLogin");
    const formLoginCliente = document.getElementById("formLoginCliente");
    const formChamado = document.getElementById("formChamado");
    const formChamadoCliente = document.getElementById("formChamadoCliente");

    const btnSair = document.getElementById("btnSair");

    /* =====================================================
       DADOS
    ===================================================== */

    let chamados = JSON.parse(localStorage.getItem("chamados")) || [];
    let atendentes = JSON.parse(localStorage.getItem("atendentes")) || [];
    let historicoGeral = JSON.parse(localStorage.getItem("historicoGeral")) || [];
    let notificacoes = JSON.parse(localStorage.getItem("notificacoes")) || [];

    let chamadoSelecionado = null;
    let clienteLogado = null;

    /* =====================================================
       TELA INICIAL
    ===================================================== */

    function mostrarTelaInicial() {

        if (telaLogin) {
            telaLogin.style.display = "none";
        }

        if (areaCliente) {
            areaCliente.style.display = "none";
        }

        if (sistema) {
            sistema.style.display = "none";
        }

        document.body.classList.remove("modo-cliente");
        document.body.classList.remove("modo-admin");

        criarTelaEscolha();

    }


    /* =====================================================
       CRIA TELA DE ESCOLHA
       CLIENTE OU ADMINISTRATIVO
    ===================================================== */

    function criarTelaEscolha() {

        let telaEscolha = document.getElementById("telaEscolha");

        if (!telaEscolha) {

            telaEscolha = document.createElement("section");

            telaEscolha.id = "telaEscolha";
            telaEscolha.className = "tela-login";

            telaEscolha.innerHTML = `
                <div class="login-container">

                    <h1>🎧 Central de Atendimento</h1>

                    <p>
                        Escolha como deseja acessar o sistema.
                    </p>

                    <div style="
                        display:flex;
                        flex-direction:column;
                        gap:15px;
                        margin-top:25px;
                    ">

                        <button
                            type="button"
                            id="btnEntrarCliente"
                        >
                            👤 Área do Cliente
                        </button>

                        <button
                            type="button"
                            id="btnEntrarAdmin"
                        >
                            🛠️ Área Administrativa
                        </button>

                    </div>

                </div>
            `;

            document.body.insertBefore(
                telaEscolha,
                document.body.firstChild
            );

            document
                .getElementById("btnEntrarCliente")
                .addEventListener("click", function () {

                    abrirLoginCliente();

                });

            document
                .getElementById("btnEntrarAdmin")
                .addEventListener("click", function () {

                    abrirLoginAdmin();

                });

        } else {

            telaEscolha.style.display = "flex";

        }

    }


    /* =====================================================
       LOGIN CLIENTE
    ===================================================== */

    function abrirLoginCliente() {

        const telaEscolha = document.getElementById("telaEscolha");

        if (telaEscolha) {
            telaEscolha.style.display = "none";
        }

        if (telaLogin) {
            telaLogin.style.display = "none";
        }

        if (sistema) {
            sistema.style.display = "none";
        }

        if (areaCliente) {
            areaCliente.style.display = "block";
        }

        const loginCliente = document.getElementById("loginCliente");
        const painelCliente = document.getElementById("painelCliente");

        if (loginCliente) {
            loginCliente.style.display = "block";
        }

        if (painelCliente) {
            painelCliente.style.display = "none";
        }

        document.body.classList.add("modo-cliente");
        document.body.classList.remove("modo-admin");

    }


    /* =====================================================
       LOGIN ADMINISTRATIVO
    ===================================================== */

    function abrirLoginAdmin() {

        const telaEscolha = document.getElementById("telaEscolha");

        if (telaEscolha) {
            telaEscolha.style.display = "none";
        }

        if (areaCliente) {
            areaCliente.style.display = "none";
        }

        if (sistema) {
            sistema.style.display = "none";
        }

        if (telaLogin) {
            telaLogin.style.display = "flex";
        }

        document.body.classList.add("modo-admin");
        document.body.classList.remove("modo-cliente");

        const mensagem = document.getElementById("mensagemLogin");

        if (mensagem) {
            mensagem.textContent = "";
        }

    }


    /* =====================================================
       LOGIN ADMIN
    ===================================================== */

    if (formLogin) {

        formLogin.addEventListener("submit", function (event) {

            event.preventDefault();

            const usuario = document
                .getElementById("usuario")
                .value
                .trim();

            const senha = document
                .getElementById("senha")
                .value
                .trim();

            const mensagem = document.getElementById("mensagemLogin");

            /*
                LOGIN DEMONSTRATIVO

                Usuário: admin
                Senha: 1234
            */

            if (usuario === "admin" && senha === "1234") {

                if (mensagem) {
                    mensagem.textContent = "";
                }

                if (telaLogin) {
                    telaLogin.style.display = "none";
                }

                if (areaCliente) {
                    areaCliente.style.display = "none";
                }

                if (sistema) {
                    sistema.style.display = "block";
                }

                document.body.classList.remove("modo-cliente");
                document.body.classList.add("modo-admin");

                atualizarSistema();

            } else {

                if (mensagem) {

                    mensagem.textContent =
                        "❌ Usuário ou senha incorretos.";

                    mensagem.style.color = "#dc2626";

                }

            }

        });

    }


    /* =====================================================
       LOGIN DO CLIENTE
    ===================================================== */

    if (formLoginCliente) {

        formLoginCliente.addEventListener("submit", function (event) {

            event.preventDefault();

            const nome = document
                .getElementById("loginClienteNome")
                .value
                .trim();

            const email = document
                .getElementById("loginClienteEmail")
                .value
                .trim();

            const mensagem = document.getElementById(
                "mensagemLoginCliente"
            );

            if (!nome || !email) {

                if (mensagem) {
                    mensagem.textContent =
                        "❌ Preencha todos os campos.";
                }

                return;

            }

            clienteLogado = {
                nome: nome,
                email: email
            };

            localStorage.setItem(
                "clienteLogado",
                JSON.stringify(clienteLogado)
            );

            entrarAreaCliente();

        });

    }


    /* =====================================================
       ENTRAR NA ÁREA DO CLIENTE
    ===================================================== */

    function entrarAreaCliente() {

        const loginCliente =
            document.getElementById("loginCliente");

        const painelCliente =
            document.getElementById("painelCliente");

        const nomeClienteLogado =
            document.getElementById("nomeClienteLogado");

        if (loginCliente) {
            loginCliente.style.display = "none";
        }

        if (painelCliente) {
            painelCliente.style.display = "block";
        }

        if (nomeClienteLogado && clienteLogado) {
            nomeClienteLogado.textContent =
                clienteLogado.nome;
        }

        preencherDadosCliente();

        mostrarTelaCliente(
            "abrirChamadoCliente",
            document.querySelector(".cliente-menu-btn")
        );

    }


    /* =====================================================
       PREENCHER DADOS DO CLIENTE
    ===================================================== */

    function preencherDadosCliente() {

        if (!clienteLogado) {
            return;
        }

        const nome = document.getElementById("clienteNome");
        const email = document.getElementById("clienteEmail");

        if (nome) {
            nome.value = clienteLogado.nome;
        }

        if (email) {
            email.value = clienteLogado.email;
        }

        atualizarMeusChamados();

    }


    /* =====================================================
       MENU DA ÁREA DO CLIENTE
    ===================================================== */

    window.mostrarTelaCliente = function (
        idTela,
        botao
    ) {

        const telas =
            document.querySelectorAll(".cliente-tela");

        telas.forEach(function (tela) {

            tela.style.display = "none";

        });

        const tela =
            document.getElementById(idTela);

        if (tela) {
            tela.style.display = "block";
        }

        const botoes =
            document.querySelectorAll(".cliente-menu-btn");

        botoes.forEach(function (btn) {

            btn.classList.remove("ativo");

        });

        if (botao) {
            botao.classList.add("ativo");
        }

        if (idTela === "meusChamadosCliente") {

            atualizarMeusChamados();

        }

    };


    /* =====================================================
       SAIR DO CLIENTE
    ===================================================== */

    window.sairCliente = function () {

        clienteLogado = null;

        localStorage.removeItem("clienteLogado");

        const form = document.getElementById(
            "formLoginCliente"
        );

        if (form) {
            form.reset();
        }

        mostrarTelaInicial();

    };


    /* =====================================================
       SAIR DO ADMIN
    ===================================================== */

    if (btnSair) {

        btnSair.addEventListener("click", function () {

            mostrarTelaInicial();

        });

    }


    /* =====================================================
       CADASTRAR CHAMADO PELO CLIENTE
    ===================================================== */

    if (formChamadoCliente) {

        formChamadoCliente.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const nome =
                    document.getElementById("clienteNome").value.trim();

                const email =
                    document.getElementById("clienteEmail").value.trim();

                const telefone =
                    document.getElementById("clienteTelefone").value.trim();

                const categoria =
                    document.getElementById("clienteCategoria").value;

                const assunto =
                    document.getElementById("clienteAssunto").value.trim();

                const prioridade =
                    document.getElementById("clientePrioridade").value;

                const descricao =
                    document.getElementById("clienteDescricao").value.trim();

                if (
                    !nome ||
                    !email ||
                    !categoria ||
                    !assunto ||
                    !prioridade ||
                    !descricao
                ) {

                    alert(
                        "❌ Preencha todos os campos obrigatórios."
                    );

                    return;

                }

                const novoChamado = {

                    id: Date.now(),

                    cliente: nome,

                    email: email,

                    telefone: telefone,

                    categoria: categoria,

                    assunto: assunto,

                    prioridade: prioridade,

                    descricao: descricao,

                    status: "Aberto",

                    atendente: "",

                    data: new Date().toLocaleString("pt-BR"),

                    historico: []

                };

                chamados.push(novoChamado);

                salvarDados();

                registrarHistorico(
                    "Novo chamado criado pelo cliente: " +
                    nome
                );

                criarNotificacao(
                    "Novo chamado recebido de " +
                    nome
                );

                atualizarSistema();

                atualizarMeusChamados();

                formChamadoCliente.reset();

                preencherDadosCliente();

                alert(
                    "✅ Chamado enviado com sucesso!"
                );

            }
        );

    }


    /* =====================================================
       CADASTRAR CHAMADO ADMIN
    ===================================================== */

    if (formChamado) {

        formChamado.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const cliente =
                    document.getElementById("cliente").value.trim();

                const email =
                    document.getElementById("email").value.trim();

                const assunto =
                    document.getElementById("assunto").value.trim();

                const prioridade =
                    document.getElementById("prioridade").value;

                const atendente =
                    document.getElementById("atendente").value;

                const descricao =
                    document.getElementById("descricao").value.trim();

                if (
                    !cliente ||
                    !email ||
                    !assunto ||
                    !prioridade ||
                    !descricao
                ) {

                    alert(
                        "❌ Preencha todos os campos obrigatórios."
                    );

                    return;

                }

                const novoChamado = {

                    id: Date.now(),

                    cliente: cliente,

                    email: email,

                    telefone: "",

                    categoria: "Administrativo",

                    assunto: assunto,

                    prioridade: prioridade,

                    descricao: descricao,

                    status: "Aberto",

                    atendente: atendente,

                    data: new Date().toLocaleString("pt-BR"),

                    historico: []

                };

                chamados.push(novoChamado);

                salvarDados();

                registrarHistorico(
                    "Novo chamado cadastrado para " +
                    cliente
                );

                criarNotificacao(
                    "Novo chamado cadastrado: " +
                    assunto
                );

                formChamado.reset();

                atualizarSistema();

                alert(
                    "✅ Chamado cadastrado com sucesso!"
                );

            }
        );

    }


    /* =====================================================
       ATUALIZAR SISTEMA
    ===================================================== */

    function atualizarSistema() {

        atualizarDashboard();

        atualizarPrioridades();

        atualizarListaChamados();

        atualizarAtendentes();

        atualizarSelectAtendentes();

        atualizarSLA();

        atualizarNotificacoes();

        atualizarHistoricoGeral();

        atualizarRelatorio();

        atualizarRecentes();

        atualizarNomeSistema();

    }


    /* =====================================================
       DASHBOARD
    ===================================================== */

    function atualizarDashboard() {

        const total = chamados.length;

        const abertos =
            chamados.filter(c => c.status === "Aberto").length;

        const andamento =
            chamados.filter(
                c => c.status === "Em andamento"
            ).length;

        const resolvidos =
            chamados.filter(
                c => c.status === "Resolvido"
            ).length;

        const taxa =
            total > 0
                ? Math.round((resolvidos / total) * 100)
                : 0;

        definirTexto("totalChamados", total);
        definirTexto("chamadosAbertos", abertos);
        definirTexto("chamadosAndamento", andamento);
        definirTexto("chamadosResolvidos", resolvidos);
        definirTexto("taxaResolucao", taxa + "%");

    }


    /* =====================================================
       PRIORIDADES
    ===================================================== */

    function atualizarPrioridades() {

        const alta =
            chamados.filter(
                c => c.prioridade === "Alta"
            ).length;

        const media =
            chamados.filter(
                c => c.prioridade === "Média"
            ).length;

        const baixa =
            chamados.filter(
                c => c.prioridade === "Baixa"
            ).length;

        definirTexto("prioridadeAlta", alta);
        definirTexto("prioridadeMedia", media);
        definirTexto("prioridadeBaixa", baixa);

    }


    /* =====================================================
       LISTA DE CHAMADOS
    ===================================================== */

    function atualizarListaChamados() {

        const lista =
            document.getElementById("listaChamados");

        if (!lista) {
            return;
        }

        const pesquisa =
            document.getElementById("pesquisa")?.value
                .toLowerCase()
                .trim() || "";

        const filtroStatus =
            document.getElementById("filtroStatus")?.value
            || "Todos";

        const filtroPrioridade =
            document.getElementById("filtroPrioridade")?.value
            || "Todas";

        const filtrados =
            chamados.filter(function (chamado) {

                const texto =
                    (
                        chamado.cliente +
                        " " +
                        chamado.email +
                        " " +
                        chamado.assunto +
                        " " +
                        chamado.descricao
                    ).toLowerCase();

                const correspondePesquisa =
                    texto.includes(pesquisa);

                const correspondeStatus =
                    filtroStatus === "Todos" ||
                    chamado.status === filtroStatus;

                const correspondePrioridade =
                    filtroPrioridade === "Todas" ||
                    chamado.prioridade === filtroPrioridade;

                return (
                    correspondePesquisa &&
                    correspondeStatus &&
                    correspondePrioridade
                );

            });

        if (filtrados.length === 0) {

            lista.innerHTML = `
                <div class="sem-chamados">

                    <h3>
                        Nenhum chamado encontrado
                    </h3>

                    <p>
                        Não existem chamados com os filtros selecionados.
                    </p>

                </div>
            `;

            return;

        }

        lista.innerHTML = "";

        filtrados.forEach(function (chamado) {

            const card =
                document.createElement("div");

            card.className = "chamado-card";

            card.innerHTML = `

                <div>

                    <h3>
                        🎫 #${chamado.id}
                        - ${escaparHTML(chamado.assunto)}
                    </h3>

                    <p>
                        👤 ${escaparHTML(chamado.cliente)}
                    </p>

                    <p>
                        📧 ${escaparHTML(chamado.email)}
                    </p>

                    <p>
                        📅 ${escaparHTML(chamado.data)}
                    </p>

                </div>

                <div>

                    <strong>
                        ${escaparHTML(chamado.status)}
                    </strong>

                    <br>

                    <span>
                        ${escaparHTML(chamado.prioridade)}
                    </span>

                </div>

                <div style="
                    display:flex;
                    gap:8px;
                    flex-wrap:wrap;
                    margin-top:15px;
                ">

                    <button
                        type="button"
                        onclick="verDetalhes(${chamado.id})"
                    >
                        👁️ Detalhes
                    </button>

                    <button
                        type="button"
                        onclick="editarChamado(${chamado.id})"
                    >
                        ✏️ Editar
                    </button>

                    <button
                        type="button"
                        onclick="excluirChamado(${chamado.id})"
                    >
                        🗑️ Excluir
                    </button>

                </div>

            `;

            lista.appendChild(card);

        });

    }


    /* =====================================================
       FILTROS
    ===================================================== */

    const pesquisa =
        document.getElementById("pesquisa");

    const filtroStatus =
        document.getElementById("filtroStatus");

    const filtroPrioridade =
        document.getElementById("filtroPrioridade");

    if (pesquisa) {
        pesquisa.addEventListener(
            "input",
            atualizarListaChamados
        );
    }

    if (filtroStatus) {
        filtroStatus.addEventListener(
            "change",
            atualizarListaChamados
        );
    }

    if (filtroPrioridade) {
        filtroPrioridade.addEventListener(
            "change",
            atualizarListaChamados
        );
    }


    /* =====================================================
       DETALHES DO CHAMADO
    ===================================================== */

    window.verDetalhes = function (id) {

        const chamado =
            chamados.find(c => c.id === id);

        if (!chamado) {
            return;
        }

        chamadoSelecionado = id;

        const modal =
            document.getElementById("modalDetalhes");

        const conteudo =
            document.getElementById("conteudoDetalhes");

        if (!modal || !conteudo) {
            return;
        }

        conteudo.innerHTML = `

            <p>
                <strong>ID:</strong>
                #${chamado.id}
            </p>

            <p>
                <strong>Cliente:</strong>
                ${escaparHTML(chamado.cliente)}
            </p>

            <p>
                <strong>E-mail:</strong>
                ${escaparHTML(chamado.email)}
            </p>

            <p>
                <strong>Telefone:</strong>
                ${escaparHTML(chamado.telefone || "Não informado")}
            </p>

            <p>
                <strong>Categoria:</strong>
                ${escaparHTML(chamado.categoria || "Não informada")}
            </p>

            <p>
                <strong>Assunto:</strong>
                ${escaparHTML(chamado.assunto)}
            </p>

            <p>
                <strong>Prioridade:</strong>
                ${escaparHTML(chamado.prioridade)}
            </p>

            <p>
                <strong>Status:</strong>
                ${escaparHTML(chamado.status)}
            </p>

            <p>
                <strong>Atendente:</strong>
                ${escaparHTML(chamado.atendente || "Sem atendente")}
            </p>

            <p>
                <strong>Descrição:</strong>
            </p>

            <p>
                ${escaparHTML(chamado.descricao)}
            </p>

        `;

        atualizarHistoricoChamado();

        modal.style.display = "flex";

    };


    /* =====================================================
       FECHAR DETALHES
    ===================================================== */

    window.fecharDetalhes = function () {

        const modal =
            document.getElementById("modalDetalhes");

        if (modal) {
            modal.style.display = "none";
        }

        chamadoSelecionado = null;

    };


    /* =====================================================
       HISTÓRICO DO CHAMADO
    ===================================================== */

    function atualizarHistoricoChamado() {

        const area =
            document.getElementById("historicoChamado");

        if (!area || !chamadoSelecionado) {
            return;
        }

        const chamado =
            chamados.find(
                c => c.id === chamadoSelecionado
            );

        if (!chamado) {
            return;
        }

        if (
            !chamado.historico ||
            chamado.historico.length === 0
        ) {

            area.innerHTML = `
                <p>
                    Nenhum atendimento registrado.
                </p>
            `;

            return;

        }

        area.innerHTML =
            chamado.historico
                .map(function (item) {

                    return `
                        <div style="
                            padding:10px;
                            margin-bottom:8px;
                            border-radius:8px;
                        ">

                            <strong>
                                ${escaparHTML(item.data)}
                            </strong>

                            <p>
                                ${escaparHTML(item.texto)}
                            </p>

                        </div>
                    `;

                })
                .join("");

    }


    /* =====================================================
       ADICIONAR HISTÓRICO
    ===================================================== */

    window.adicionarHistorico = function () {

        if (!chamadoSelecionado) {
            return;
        }

        const campo =
            document.getElementById("novoHistorico");

        if (!campo) {
            return;
        }

        const texto =
            campo.value.trim();

        if (!texto) {

            alert(
                "Digite uma atualização."
            );

            return;

        }

        const chamado =
            chamados.find(
                c => c.id === chamadoSelecionado
            );

        if (!chamado) {
            return;
        }

        if (!chamado.historico) {
            chamado.historico = [];
        }

        chamado.historico.push({

            texto: texto,

            data: new Date().toLocaleString("pt-BR")

        });

        salvarDados();

        registrarHistorico(
            "Atualização adicionada ao chamado #" +
            chamado.id
        );

        campo.value = "";

        atualizarHistoricoChamado();

        atualizarHistoricoGeral();

    };


    /* =====================================================
       EDITAR CHAMADO
    ===================================================== */

    window.editarChamado = function (id) {

        const chamado =
            chamados.find(c => c.id === id);

        if (!chamado) {
            return;
        }

        chamadoSelecionado = id;

        document.getElementById("editarCliente").value =
            chamado.cliente || "";

        document.getElementById("editarEmail").value =
            chamado.email || "";

        document.getElementById("editarAssunto").value =
            chamado.assunto || "";

        document.getElementById("editarDescricao").value =
            chamado.descricao || "";

        document.getElementById("editarPrioridade").value =
            chamado.prioridade || "Média";

        document.getElementById("editarStatus").value =
            chamado.status || "Aberto";

        atualizarSelectAtendentesEdicao(
            chamado.atendente || ""
        );

        const modal =
            document.getElementById("modalEditar");

        if (modal) {
            modal.style.display = "flex";
        }

    };


    /* =====================================================
       FORMULÁRIO DE EDIÇÃO
    ===================================================== */

    const formEditar =
        document.getElementById("formEditar");

    if (formEditar) {

        formEditar.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                if (!chamadoSelecionado) {
                    return;
                }

                const chamado =
                    chamados.find(
                        c => c.id === chamadoSelecionado
                    );

                if (!chamado) {
                    return;
                }

                chamado.cliente =
                    document
                        .getElementById("editarCliente")
                        .value.trim();

                chamado.email =
                    document
                        .getElementById("editarEmail")
                        .value.trim();

                chamado.assunto =
                    document
                        .getElementById("editarAssunto")
                        .value.trim();

                chamado.descricao =
                    document
                        .getElementById("editarDescricao")
                        .value.trim();

                chamado.prioridade =
                    document
                        .getElementById("editarPrioridade")
                        .value;

                chamado.status =
                    document
                        .getElementById("editarStatus")
                        .value;

                chamado.atendente =
                    document
                        .getElementById("editarAtendente")
                        .value;

                salvarDados();

                registrarHistorico(
                    "Chamado #" +
                    chamado.id +
                    " foi atualizado."
                );

                fecharEdicao();

                atualizarSistema();

                alert(
                    "✅ Chamado atualizado com sucesso!"
                );

            }
        );

    }


    /* =====================================================
       FECHAR EDIÇÃO
    ===================================================== */

    window.fecharEdicao = function () {

        const modal =
            document.getElementById("modalEditar");

        if (modal) {
            modal.style.display = "none";
        }

        chamadoSelecionado = null;

    };


    /* =====================================================
       EXCLUIR CHAMADO
    ===================================================== */

    window.excluirChamado = function (id) {

        const confirmar =
            confirm(
                "Tem certeza que deseja excluir este chamado?"
            );

        if (!confirmar) {
            return;
        }

        const chamado =
            chamados.find(c => c.id === id);

        chamados =
            chamados.filter(c => c.id !== id);

        salvarDados();

        registrarHistorico(
            "Chamado #" +
            id +
            " excluído."
        );

        if (chamado) {

            criarNotificacao(
                "Chamado excluído: " +
                chamado.assunto
            );

        }

        atualizarSistema();

    };


    /* =====================================================
       ATENDENTES
    ===================================================== */

    const btnNovoAtendente =
        document.getElementById("btnNovoAtendente");

    if (btnNovoAtendente) {

        btnNovoAtendente.addEventListener(
            "click",
            function () {

                const modal =
                    document.getElementById("modalAtendente");

                const form =
                    document.getElementById("formAtendente");

                if (form) {
                    form.reset();
                }

                if (modal) {
                    modal.style.display = "flex";
                }

            }
        );

    }


    /* =====================================================
       FORMULÁRIO ATENDENTE
    ===================================================== */

    const formAtendente =
        document.getElementById("formAtendente");

    if (formAtendente) {

        formAtendente.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const nome =
                    document
                        .getElementById("nomeAtendente")
                        .value.trim();

                const email =
                    document
                        .getElementById("emailAtendente")
                        .value.trim();

                const funcao =
                    document
                        .getElementById("funcaoAtendente")
                        .value;

                const novoAtendente = {

                    id: Date.now(),

                    nome: nome,

                    email: email,

                    funcao: funcao

                };

                atendentes.push(novoAtendente);

                salvarDados();

                registrarHistorico(
                    "Novo atendente cadastrado: " +
                    nome
                );

                formAtendente.reset();

                fecharAtendente();

                atualizarSistema();

                alert(
                    "✅ Atendente cadastrado com sucesso!"
                );

            }
        );

    }


    /* =====================================================
       ATUALIZAR ATENDENTES
    ===================================================== */

    function atualizarAtendentes() {

        const lista =
            document.getElementById("listaAtendentes");

        if (!lista) {
            return;
        }

        if (atendentes.length === 0) {

            lista.innerHTML = `

                <div class="sem-atendentes">

                    <h3>
                        Nenhum atendente cadastrado
                    </h3>

                    <p>
                        Cadastre um atendente para começar.
                    </p>

                </div>

            `;

            return;

        }

        lista.innerHTML = "";

        atendentes.forEach(function (atendente) {

            const card =
                document.createElement("div");

            card.className = "atendente-card";

            card.innerHTML = `

                <h3>
                    👤 ${escaparHTML(atendente.nome)}
                </h3>

                <p>
                    📧 ${escaparHTML(atendente.email)}
                </p>

                <p>
                    💼 ${escaparHTML(atendente.funcao)}
                </p>

                <button
                    type="button"
                    onclick="excluirAtendente(${atendente.id})"
                >
                    🗑️ Excluir
                </button>

            `;

            lista.appendChild(card);

        });

    }


    /* =====================================================
       SELECT DE ATENDENTES
    ===================================================== */

    function atualizarSelectAtendentes() {

        const select =
            document.getElementById("atendente");

        if (!select) {
            return;
        }

        select.innerHTML = `
            <option value="">
                Selecione um atendente
            </option>
        `;

        atendentes.forEach(function (atendente) {

            const option =
                document.createElement("option");

            option.value =
                atendente.nome;

            option.textContent =
                atendente.nome;

            select.appendChild(option);

        });

    }


    /* =====================================================
       SELECT DE ATENDENTES NA EDIÇÃO
    ===================================================== */

    function atualizarSelectAtendentesEdicao(
        atendenteSelecionado
    ) {

        const select =
            document.getElementById("editarAtendente");

        if (!select) {
            return;
        }

        select.innerHTML = `
            <option value="">
                Sem atendente
            </option>
        `;

        atendentes.forEach(function (atendente) {

            const option =
                document.createElement("option");

            option.value =
                atendente.nome;

            option.textContent =
                atendente.nome;

            if (
                atendente.nome ===
                atendenteSelecionado
            ) {

                option.selected = true;

            }

            select.appendChild(option);

        });

    }


    /* =====================================================
       EXCLUIR ATENDENTE
    ===================================================== */

    window.excluirAtendente = function (id) {

        const confirmar =
            confirm(
                "Deseja excluir este atendente?"
            );

        if (!confirmar) {
            return;
        }

        const atendente =
            atendentes.find(
                a => a.id === id
            );

        atendentes =
            atendentes.filter(
                a => a.id !== id
            );

        salvarDados();

        if (atendente) {

            registrarHistorico(
                "Atendente excluído: " +
                atendente.nome
            );

        }

        atualizarSistema();

    };


    /* =====================================================
       FECHAR MODAL ATENDENTE
    ===================================================== */

    window.fecharAtendente = function () {

        const modal =
            document.getElementById("modalAtendente");

        if (modal) {
            modal.style.display = "none";
        }

    };


    /* =====================================================
       SLA
    ===================================================== */

    function atualizarSLA() {

        let dentro = 0;
        let atencao = 0;
        let atrasados = 0;

        chamados.forEach(function (chamado) {

            if (chamado.status === "Resolvido") {
                return;
            }

            /*
                Como o projeto é frontend,
                usamos a prioridade para uma
                estimativa simples de SLA.
            */

            if (chamado.prioridade === "Alta") {

                atrasados++;

            } else if (
                chamado.prioridade === "Média"
            ) {

                atencao++;

            } else {

                dentro++;

            }

        });

        definirTexto("slaDentro", dentro);
        definirTexto("slaAtencao", atencao);
        definirTexto("slaAtrasados", atrasados);

    }


    /* =====================================================
       NOTIFICAÇÕES
    ===================================================== */

    function criarNotificacao(texto) {

        notificacoes.unshift({

            id: Date.now(),

            texto: texto,

            data: new Date().toLocaleString("pt-BR")

        });

        if (notificacoes.length > 50) {

            notificacoes =
                notificacoes.slice(0, 50);

        }

        salvarDados();

        atualizarNotificacoes();

    }


    function atualizarNotificacoes() {

        const lista =
            document.getElementById("listaNotificacoes");

        if (!lista) {
            return;
        }

        if (notificacoes.length === 0) {

            lista.innerHTML = `

                <div class="sem-notificacoes">

                    <h3>
                        Nenhuma notificação
                    </h3>

                    <p>
                        Tudo está em ordem por enquanto.
                    </p>

                </div>

            `;

            return;

        }

        lista.innerHTML =
            notificacoes
                .map(function (notificacao) {

                    return `

                        <div class="notificacao-card">

                            <strong>
                                🔔
                                ${escaparHTML(notificacao.texto)}
                            </strong>

                            <small>
                                ${escaparHTML(notificacao.data)}
                            </small>

                        </div>

                    `;

                })
                .join("");

    }


    /* =====================================================
       LIMPAR NOTIFICAÇÕES
    ===================================================== */

    window.limparNotificacoes = function () {

        notificacoes = [];

        salvarDados();

        atualizarNotificacoes();

    };


    /* =====================================================
       HISTÓRICO GERAL
    ===================================================== */

    function registrarHistorico(texto) {

        historicoGeral.unshift({

            id: Date.now(),

            texto: texto,

            data: new Date().toLocaleString("pt-BR")

        });

        if (historicoGeral.length > 100) {

            historicoGeral =
                historicoGeral.slice(0, 100);

        }

        salvarDados();

        atualizarHistoricoGeral();

    }


    function atualizarHistoricoGeral() {

        const lista =
            document.getElementById(
                "listaHistoricoGeral"
            );

        if (!lista) {
            return;
        }

        if (historicoGeral.length === 0) {

            lista.innerHTML = `

                <div class="sem-historico-geral">

                    <h3>
                        Nenhuma atividade registrada
                    </h3>

                    <p>
                        As atividades do sistema aparecerão aqui.
                    </p>

                </div>

            `;

            return;

        }

        lista.innerHTML =
            historicoGeral
                .map(function (item) {

                    return `

                        <div class="historico-item">

                            <strong>
                                ${escaparHTML(item.texto)}
                            </strong>

                            <small>
                                ${escaparHTML(item.data)}
                            </small>

                        </div>

                    `;

                })
                .join("");

    }


    /* =====================================================
       LIMPAR HISTÓRICO
    ===================================================== */

    window.limparHistoricoGeral = function () {

        const confirmar =
            confirm(
                "Deseja limpar todo o histórico?"
            );

        if (!confirmar) {
            return;
        }

        historicoGeral = [];

        salvarDados();

        atualizarHistoricoGeral();

    };


    /* =====================================================
       RELATÓRIO
    ===================================================== */

    function atualizarRelatorio() {

        const total = chamados.length;

        const abertos =
            chamados.filter(
                c => c.status === "Aberto"
            ).length;

        const andamento =
            chamados.filter(
                c => c.status === "Em andamento"
            ).length;

        const resolvidos =
            chamados.filter(
                c => c.status === "Resolvido"
            ).length;

        const taxa =
            total > 0
                ? Math.round(
                    (resolvidos / total) * 100
                )
                : 0;

        definirTexto(
            "relatorioTotal",
            total
        );

        definirTexto(
            "relatorioAbertos",
            abertos
        );

        definirTexto(
            "relatorioAndamento",
            andamento
        );

        definirTexto(
            "relatorioResolvidos",
            resolvidos
        );

        definirTexto(
            "relatorioTaxa",
            taxa + "%"
        );

    }


    /* =====================================================
       IMPRIMIR RELATÓRIO
    ===================================================== */

    window.imprimirRelatorio = function () {

        window.print();

    };


    /* =====================================================
       CHAMADOS RECENTES
    ===================================================== */

    function atualizarRecentes() {

        const area =
            document.getElementById(
                "chamadosRecentes"
            );

        if (!area) {
            return;
        }

        if (chamados.length === 0) {

            area.innerHTML = `

                <p class="sem-recentes">
                    Nenhum chamado cadastrado.
                </p>

            `;

            return;

        }

        const recentes =
            [...chamados]
                .sort(
                    (a, b) => b.id - a.id
                )
                .slice(0, 5);

        area.innerHTML =
            recentes
                .map(function (chamado) {

                    return `

                        <div class="chamado-recente">

                            <strong>
                                #${chamado.id}
                                -
                                ${escaparHTML(chamado.assunto)}
                            </strong>

                            <p>
                                👤
                                ${escaparHTML(chamado.cliente)}
                            </p>

                            <small>
                                ${escaparHTML(chamado.status)}
                                •
                                ${escaparHTML(chamado.data)}
                            </small>

                        </div>

                    `;

                })
                .join("");

    }


    /* =====================================================
       MEUS CHAMADOS - CLIENTE
    ===================================================== */

    function atualizarMeusChamados() {

        const lista =
            document.getElementById(
                "listaMeusChamados"
            );

        if (!lista || !clienteLogado) {
            return;
        }

        const meusChamados =
            chamados.filter(function (chamado) {

                return (
                    chamado.email &&
                    chamado.email.toLowerCase() ===
                    clienteLogado.email.toLowerCase()
                );

            });

        if (meusChamados.length === 0) {

            lista.innerHTML = `

                <div class="cliente-sem-chamados">

                    <span>📭</span>

                    <h3>
                        Nenhum chamado encontrado
                    </h3>

                    <p>
                        Seus chamados aparecerão aqui
                        depois que você enviar uma solicitação.
                    </p>

                </div>

            `;

            return;

        }

        lista.innerHTML =
            meusChamados
                .map(function (chamado) {

                    return `

                        <div class="cliente-chamado-card">

                            <h3>
                                🎫
                                ${escaparHTML(chamado.assunto)}
                            </h3>

                            <p>
                                <strong>
                                    Status:
                                </strong>

                                ${escaparHTML(chamado.status)}
                            </p>

                            <p>
                                <strong>
                                    Prioridade:
                                </strong>

                                ${escaparHTML(chamado.prioridade)}
                            </p>

                            <p>
                                <strong>
                                    Categoria:
                                </strong>

                                ${escaparHTML(
                                    chamado.categoria ||
                                    "Não informada"
                                )}
                            </p>

                            <p>
                                <strong>
                                    Data:
                                </strong>

                                ${escaparHTML(chamado.data)}
                            </p>

                            <p>
                                ${escaparHTML(chamado.descricao)}
                            </p>

                        </div>

                    `;

                })
                .join("");

    }


    /* =====================================================
       CONFIGURAÇÕES
    ===================================================== */

    const btnSalvarConfiguracoes =
        document.getElementById(
            "btnSalvarConfiguracoes"
        );

    if (btnSalvarConfiguracoes) {

        btnSalvarConfiguracoes.addEventListener(
            "click",
            function () {

                const nomeSistema =
                    document
                        .getElementById("nomeSistema")
                        .value.trim();

                const nomeEmpresa =
                    document
                        .getElementById("nomeEmpresa")
                        .value.trim();

                const emailEmpresa =
                    document
                        .getElementById("emailEmpresa")
                        .value.trim();

                const configuracoes = {

                    nomeSistema:
                        nomeSistema ||
                        "Sistema de Chamados",

                    nomeEmpresa:
                        nomeEmpresa ||
                        "Central de Atendimento",

                    emailEmpresa:
                        emailEmpresa ||
                        ""

                };

                localStorage.setItem(
                    "configuracoes",
                    JSON.stringify(configuracoes)
                );

                atualizarNomeSistema();

                registrarHistorico(
                    "Configurações do sistema atualizadas."
                );

                alert(
                    "✅ Configurações salvas!"
                );

            }
        );

    }


    /* =====================================================
       ATUALIZAR NOME DO SISTEMA
    ===================================================== */

    function atualizarNomeSistema() {

        const configuracoes =
            JSON.parse(
                localStorage.getItem(
                    "configuracoes"
                )
            ) || {};

        const nomeSistema =
            configuracoes.nomeSistema ||
            "Sistema de Chamados";

        const nomeEmpresa =
            configuracoes.nomeEmpresa ||
            "Central de Atendimento";

        definirTexto(
            "menuNomeSistema",
            nomeEmpresa
        );

        definirTexto(
            "logoNomeEmpresa",
            nomeEmpresa
        );

        definirTexto(
            "logoEmpresa",
            nomeSistema
        );

        definirTexto(
            "tituloSistema",
            "🎧 " + nomeEmpresa
        );

        const campoNomeSistema =
            document.getElementById(
                "nomeSistema"
            );

        const campoNomeEmpresa =
            document.getElementById(
                "nomeEmpresa"
            );

        const campoEmailEmpresa =
            document.getElementById(
                "emailEmpresa"
            );

        if (
            campoNomeSistema &&
            document.activeElement !== campoNomeSistema
        ) {

            campoNomeSistema.value =
                nomeSistema;

        }

        if (
            campoNomeEmpresa &&
            document.activeElement !== campoNomeEmpresa
        ) {

            campoNomeEmpresa.value =
                nomeEmpresa;

        }

        if (
            campoEmailEmpresa &&
            document.activeElement !== campoEmailEmpresa
        ) {

            campoEmailEmpresa.value =
                configuracoes.emailEmpresa || "";

        }

    }


    /* =====================================================
       SALVAR DADOS
    ===================================================== */

    function salvarDados() {

        localStorage.setItem(
            "chamados",
            JSON.stringify(chamados)
        );

        localStorage.setItem(
            "atendentes",
            JSON.stringify(atendentes)
        );

        localStorage.setItem(
            "historicoGeral",
            JSON.stringify(historicoGeral)
        );

        localStorage.setItem(
            "notificacoes",
            JSON.stringify(notificacoes)
        );

    }


    /* =====================================================
       FUNÇÃO PARA TEXTO SEGURO
    ===================================================== */

    function escaparHTML(texto) {

        if (texto === null || texto === undefined) {
            return "";
        }

        return String(texto)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       DEFINIR TEXTO
    ===================================================== */

    function definirTexto(id, valor) {

        const elemento =
            document.getElementById(id);

        if (elemento) {
            elemento.textContent = valor;
        }

    }


    /* =====================================================
       FECHAR MODAIS AO CLICAR FORA
    ===================================================== */

    window.addEventListener(
        "click",
        function (event) {

            const modalDetalhes =
                document.getElementById(
                    "modalDetalhes"
                );

            const modalEditar =
                document.getElementById(
                    "modalEditar"
                );

            const modalAtendente =
                document.getElementById(
                    "modalAtendente"
                );

            if (
                event.target === modalDetalhes
            ) {

                fecharDetalhes();

            }

            if (
                event.target === modalEditar
            ) {

                fecharEdicao();

            }

            if (
                event.target === modalAtendente
            ) {

                fecharAtendente();

            }

        }
    );


    /* =====================================================
       VERIFICAR CLIENTE SALVO
    ===================================================== */

    const clienteSalvo =
        JSON.parse(
            localStorage.getItem(
                "clienteLogado"
            )
        );

    /*
       Não entramos automaticamente no sistema
       administrativo ou cliente.

       Sempre mostramos a tela de escolha
       quando a página é aberta.
    */

    clienteLogado = null;

    localStorage.removeItem("clienteLogado");


    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    mostrarTelaInicial();

    atualizarSistema();

});