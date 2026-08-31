/* =========================================================
   CENTRAL DE ATENDIMENTO
   SCRIPT.JS COMPLETO
   COM LOGIN ADMINISTRATIVO
========================================================= */


/* =========================================================
   DADOS DO SISTEMA
========================================================= */

let chamados =
    JSON.parse(localStorage.getItem("chamados")) || [];

let atendentes =
    JSON.parse(localStorage.getItem("atendentes")) || [];

let notificacoes =
    JSON.parse(localStorage.getItem("notificacoes")) || [];

let historicoGeral =
    JSON.parse(localStorage.getItem("historicoGeral")) || [];

let clienteLogado =
    JSON.parse(localStorage.getItem("clienteLogado")) || null;

let administradorLogado =
    sessionStorage.getItem("administradorLogado") === "true";

let chamadoSelecionado = null;

let chamadoEditando = null;


/* =========================================================
   CREDENCIAIS ADMINISTRATIVAS
========================================================= */

const USUARIO_ADMIN = "admin";

const SENHA_ADMIN = "Admin@123";


/* =========================================================
   CONFIGURAÇÕES
========================================================= */

let configuracoes =
    JSON.parse(
        localStorage.getItem("configuracoes")
    ) || {

        nomeSistema:
            "Central de Atendimento",

        nomeEmpresa:
            "Sistema de Chamados",

        emailEmpresa:
            ""

    };


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        carregarConfiguracoes();

        configurarEventos();

        verificarClienteLogado();

        atualizarTudo();

        protegerAreaAdministrativa();

    }
);


/* =========================================================
   EVENTOS
========================================================= */

function configurarEventos() {

    /* LOGIN CLIENTE */

    const formLoginCliente =
        document.getElementById(
            "formLoginCliente"
        );

    if (formLoginCliente) {

        formLoginCliente.addEventListener(
            "submit",
            fazerLoginCliente
        );

    }


    /* LOGIN ADMIN */

    const formLoginAdmin =
        document.getElementById(
            "formLoginAdmin"
        );

    if (formLoginAdmin) {

        formLoginAdmin.addEventListener(
            "submit",
            fazerLoginAdmin
        );

    }


    /* CHAMADO CLIENTE */

    const formChamadoCliente =
        document.getElementById(
            "formChamadoCliente"
        );

    if (formChamadoCliente) {

        formChamadoCliente.addEventListener(
            "submit",
            cadastrarChamadoCliente
        );

    }


    /* CHAMADO ADMIN */

    const formChamado =
        document.getElementById(
            "formChamado"
        );

    if (formChamado) {

        formChamado.addEventListener(
            "submit",
            cadastrarChamadoAdmin
        );

    }


    /* EDITAR CHAMADO */

    const formEditar =
        document.getElementById(
            "formEditar"
        );

    if (formEditar) {

        formEditar.addEventListener(
            "submit",
            salvarEdicao
        );

    }


    /* ATENDENTE */

    const formAtendente =
        document.getElementById(
            "formAtendente"
        );

    if (formAtendente) {

        formAtendente.addEventListener(
            "submit",
            salvarAtendente
        );

    }


    /* NOVO ATENDENTE */

    const btnNovoAtendente =
        document.getElementById(
            "btnNovoAtendente"
        );

    if (btnNovoAtendente) {

        btnNovoAtendente.addEventListener(
            "click",
            abrirNovoAtendente
        );

    }


    /* SAIR ADMIN */

    const btnSair =
        document.getElementById(
            "btnSair"
        );

    if (btnSair) {

        btnSair.addEventListener(
            "click",
            sairAdministrativo
        );

    }


    /* CONFIGURAÇÕES */

    const btnSalvarConfiguracoes =
        document.getElementById(
            "btnSalvarConfiguracoes"
        );

    if (btnSalvarConfiguracoes) {

        btnSalvarConfiguracoes.addEventListener(
            "click",
            salvarConfiguracoes
        );

    }


    /* PESQUISA ADMIN */

    const pesquisa =
        document.getElementById(
            "pesquisa"
        );

    if (pesquisa) {

        pesquisa.addEventListener(
            "input",
            renderizarChamados
        );

    }


    const filtroStatus =
        document.getElementById(
            "filtroStatus"
        );

    if (filtroStatus) {

        filtroStatus.addEventListener(
            "change",
            renderizarChamados
        );

    }


    const filtroPrioridade =
        document.getElementById(
            "filtroPrioridade"
        );

    if (filtroPrioridade) {

        filtroPrioridade.addEventListener(
            "change",
            renderizarChamados
        );

    }


    /* PESQUISA CLIENTE */

    const pesquisaCliente =
        document.getElementById(
            "pesquisaChamadosCliente"
        );

    if (pesquisaCliente) {

        pesquisaCliente.addEventListener(
            "input",
            renderizarChamadosCliente
        );

    }


    const filtroStatusCliente =
        document.getElementById(
            "filtroStatusCliente"
        );

    if (filtroStatusCliente) {

        filtroStatusCliente.addEventListener(
            "change",
            renderizarChamadosCliente
        );

    }


    const filtroPrioridadeCliente =
        document.getElementById(
            "filtroPrioridadeCliente"
        );

    if (filtroPrioridadeCliente) {

        filtroPrioridadeCliente.addEventListener(
            "change",
            renderizarChamadosCliente
        );

    }


    /* MENU ADMINISTRATIVO */

    document
        .querySelectorAll(".menu-link")
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        if (
                            !administradorLogado
                        ) {

                            return;

                        }


                        document
                            .querySelectorAll(
                                ".menu-link"
                            )
                            .forEach(
                                function (item) {

                                    item.classList.remove(
                                        "ativo"
                                    );

                                }
                            );


                        this.classList.add(
                            "ativo"
                        );

                    }
                );

            }
        );

}/* =========================================================
   TELA INICIAL
========================================================= */

function abrirAreaCliente() {

    const telaEscolha =
        document.getElementById(
            "telaEscolha"
        );

    const areaCliente =
        document.getElementById(
            "areaCliente"
        );

    const sistema =
        document.getElementById(
            "sistema"
        );

    const loginAdmin =
        document.getElementById(
            "loginAdministrativo"
        );


    if (telaEscolha)
        telaEscolha.style.display = "none";


    if (sistema)
        sistema.style.display = "none";


    if (loginAdmin)
        loginAdmin.style.display = "none";


    if (areaCliente)
        areaCliente.style.display = "block";


    if (clienteLogado) {

        mostrarPainelCliente();

    } else {

        mostrarLoginCliente();

    }

}


/* =========================================================
   ABRIR ÁREA ADMINISTRATIVA
========================================================= */

function abrirAreaAdministrativa() {

    const telaEscolha =
        document.getElementById(
            "telaEscolha"
        );

    const areaCliente =
        document.getElementById(
            "areaCliente"
        );

    const sistema =
        document.getElementById(
            "sistema"
        );

    const loginAdmin =
        document.getElementById(
            "loginAdministrativo"
        );


    if (telaEscolha)
        telaEscolha.style.display = "none";


    if (areaCliente)
        areaCliente.style.display = "none";


    if (sistema)
        sistema.style.display = "none";


    /* Se já estiver autenticado */

    if (administradorLogado) {

        if (loginAdmin)
            loginAdmin.style.display = "none";


        if (sistema)
            sistema.style.display = "block";


        atualizarTudo();

        return;

    }


    /* Mostrar login administrativo */

    if (loginAdmin)
        loginAdmin.style.display = "block";


    const usuario =
        document.getElementById(
            "loginAdminUsuario"
        );

    const senha =
        document.getElementById(
            "loginAdminSenha"
        );


    if (usuario)
        usuario.value = "";


    if (senha)
        senha.value = "";


    const mensagem =
        document.getElementById(
            "mensagemLoginAdmin"
        );


    if (mensagem) {

        mensagem.textContent = "";

        mensagem.className =
            "mensagem-login-cliente";

    }

}


/* =========================================================
   LOGIN ADMINISTRATIVO
========================================================= */

function fazerLoginAdmin(event) {

    event.preventDefault();


    const usuarioElemento =
        document.getElementById(
            "loginAdminUsuario"
        );

    const senhaElemento =
        document.getElementById(
            "loginAdminSenha"
        );

    const mensagem =
        document.getElementById(
            "mensagemLoginAdmin"
        );


    const usuario =
        usuarioElemento
            ? usuarioElemento.value.trim()
            : "";


    const senha =
        senhaElemento
            ? senhaElemento.value
            : "";


    if (
        usuario === USUARIO_ADMIN &&
        senha === SENHA_ADMIN
    ) {

        administradorLogado = true;


        sessionStorage.setItem(
            "administradorLogado",
            "true"
        );


        if (mensagem) {

            mensagem.textContent =
                "Login realizado com sucesso!";


            mensagem.className =
                "mensagem-login-cliente sucesso";

        }


        adicionarHistoricoGeral(
            "Login administrativo",
            "O administrador acessou a área administrativa."
        );


        setTimeout(
            function () {

                const loginAdmin =
                    document.getElementById(
                        "loginAdministrativo"
                    );


                const sistema =
                    document.getElementById(
                        "sistema"
                    );


                if (loginAdmin)
                    loginAdmin.style.display =
                        "none";


                if (sistema)
                    sistema.style.display =
                        "block";


                atualizarTudo();

            },
            400
        );


    } else {

        administradorLogado = false;


        sessionStorage.removeItem(
            "administradorLogado"
        );


        if (mensagem) {

            mensagem.textContent =
                "❌ Usuário ou senha incorretos.";


            mensagem.className =
                "mensagem-login-cliente erro";

        }


        if (senhaElemento)
            senhaElemento.value = "";

    }

}


/* =========================================================
   PROTEGER ÁREA ADMINISTRATIVA
========================================================= */

function protegerAreaAdministrativa() {

    const sistema =
        document.getElementById(
            "sistema"
        );


    const loginAdmin =
        document.getElementById(
            "loginAdministrativo"
        );


    if (!administradorLogado) {

        if (sistema)
            sistema.style.display = "none";


        if (loginAdmin)
            loginAdmin.style.display = "none";

    }

}


/* =========================================================
   VOLTAR PARA TELA INICIAL
========================================================= */

function voltarTelaEscolha() {

    const telaEscolha =
        document.getElementById(
            "telaEscolha"
        );


    const areaCliente =
        document.getElementById(
            "areaCliente"
        );


    const sistema =
        document.getElementById(
            "sistema"
        );


    const loginAdmin =
        document.getElementById(
            "loginAdministrativo"
        );


    if (telaEscolha)
        telaEscolha.style.display = "flex";


    if (areaCliente)
        areaCliente.style.display = "none";


    if (sistema)
        sistema.style.display = "none";


    if (loginAdmin)
        loginAdmin.style.display = "none";

}


/* =========================================================
   LOGIN CLIENTE
========================================================= */

function fazerLoginCliente(event) {

    event.preventDefault();


    const nome =
        document
            .getElementById(
                "loginClienteNome"
            )
            .value
            .trim();


    const email =
        document
            .getElementById(
                "loginClienteEmail"
            )
            .value
            .trim()
            .toLowerCase();


    if (!nome || !email) {

        mostrarMensagemLogin(
            "Preencha seu nome e e-mail.",
            "erro"
        );

        return;

    }


    clienteLogado = {

        nome: nome,

        email: email

    };


    localStorage.setItem(
        "clienteLogado",
        JSON.stringify(
            clienteLogado
        )
    );


    mostrarPainelCliente();

}/* =========================================================
   PREENCHER DADOS CLIENTE
========================================================= */

function preencherDadosCliente() {

    if (!clienteLogado)
        return;


    const elementos = [

        "nomeClienteLogado",

        "nomeClienteTopo",

        "perfilNomeCliente"

    ];


    elementos.forEach(function (id) {

        const elemento =
            document.getElementById(id);


        if (elemento)
            elemento.textContent =
                clienteLogado.nome;

    });


    const email =
        document.getElementById(
            "perfilEmailCliente"
        );


    if (email)
        email.textContent =
            clienteLogado.email;


    preencherDadosFormularioCliente();

}


/* =========================================================
   PREENCHER FORMULÁRIO CLIENTE
========================================================= */

function preencherDadosFormularioCliente() {

    if (!clienteLogado)
        return;


    const nome =
        document.getElementById(
            "clienteNome"
        );


    const email =
        document.getElementById(
            "clienteEmail"
        );


    if (nome)
        nome.value =
            clienteLogado.nome;


    if (email)
        email.value =
            clienteLogado.email;

}


/* =========================================================
   SAIR CLIENTE
========================================================= */

function sairCliente() {

    if (clienteLogado) {

        adicionarHistoricoGeral(
            "Logout do cliente",

            `${clienteLogado.nome} saiu da Área do Cliente.`
        );

    }


    clienteLogado = null;


    localStorage.removeItem(
        "clienteLogado"
    );


    const areaCliente =
        document.getElementById(
            "areaCliente"
        );


    if (areaCliente)
        areaCliente.style.display =
            "none";


    voltarTelaEscolha();

}


/* =========================================================
   NAVEGAÇÃO CLIENTE
========================================================= */

function mostrarTelaCliente(
    id,
    botao
) {

    document
        .querySelectorAll(
            ".cliente-tela"
        )
        .forEach(function (tela) {

            tela.style.display =
                "none";


            tela.classList.remove(
                "ativo"
            );

        });


    const tela =
        document.getElementById(id);


    if (tela) {

        tela.style.display =
            "block";


        tela.classList.add(
            "ativo"
        );

    }


    document
        .querySelectorAll(
            ".cliente-menu-link"
        )
        .forEach(function (item) {

            item.classList.remove(
                "ativo"
            );

        });


    if (botao)
        botao.classList.add(
            "ativo"
        );


    /* Dashboard */

    if (
        id === "clienteDashboard"
    ) {

        atualizarDashboardCliente();

    }


    /* Meus chamados */

    if (
        id === "meusChamadosCliente"
    ) {

        renderizarChamadosCliente();

    }


    /* Notificações */

    if (
        id === "notificacoesCliente"
    ) {

        renderizarNotificacoesCliente();

    }


    /* Histórico */

    if (
        id === "historicoCliente"
    ) {

        renderizarHistoricoCliente();

    }


    /* Perfil */

    if (
        id === "perfilCliente"
    ) {

        preencherDadosCliente();

    }

}


/* =========================================================
   MOSTRAR TELA CLIENTE POR ID
========================================================= */

function mostrarTelaClientePorId(
    id
) {

    const botoes =
        document.querySelectorAll(
            ".cliente-menu-link"
        );


    let botaoEncontrado =
        null;


    botoes.forEach(function (botao) {

        const onclick =
            botao.getAttribute(
                "onclick"
            ) || "";


        if (
            onclick.includes(id)
        ) {

            botaoEncontrado =
                botao;

        }

    });


    mostrarTelaCliente(
        id,
        botaoEncontrado
    );

}


/* =========================================================
   ABRIR NOVO CHAMADO CLIENTE
========================================================= */

function abrirTelaNovoChamadoCliente() {

    mostrarTelaClientePorId(
        "abrirChamadoCliente"
    );

}


/* =========================================================
   CADASTRAR CHAMADO CLIENTE
========================================================= */

function cadastrarChamadoCliente(
    event
) {

    event.preventDefault();


    if (!clienteLogado) {

        alert(
            "Faça login para abrir um chamado."
        );

        return;

    }


    const nome =
        document
            .getElementById(
                "clienteNome"
            )
            .value
            .trim();


    const email =
        document
            .getElementById(
                "clienteEmail"
            )
            .value
            .trim();


    const telefone =
        document
            .getElementById(
                "clienteTelefone"
            )
            .value
            .trim();


    const categoria =
        document
            .getElementById(
                "clienteCategoria"
            )
            .value;


    const assunto =
        document
            .getElementById(
                "clienteAssunto"
            )
            .value
            .trim();


    const prioridade =
        document
            .getElementById(
                "clientePrioridade"
            )
            .value;


    const descricao =
        document
            .getElementById(
                "clienteDescricao"
            )
            .value
            .trim();


    const novoChamado =
        criarChamadoBase({

            cliente:
                nome,

            email:
                email,

            telefone:
                telefone,

            categoria:
                categoria,

            assunto:
                assunto,

            prioridade:
                prioridade,

            descricao:
                descricao,

            atendente:
                "",

            origem:
                "Cliente"

        });


    chamados.push(
        novoChamado
    );


    salvarDados();


    adicionarNotificacao(

        "Novo chamado",

        `O cliente ${nome} abriu o chamado #${novoChamado.id}.`

    );


    adicionarHistoricoGeral(

        "Chamado criado",

        `O cliente ${nome} abriu o chamado #${novoChamado.id}.`

    );


    atualizarTudo();


    event.target.reset();


    preencherDadosFormularioCliente();


    alert(
        `Chamado #${novoChamado.id} criado com sucesso!`
    );


    mostrarTelaClientePorId(
        "meusChamadosCliente"
    );

}/* =========================================================
   CRIAR CHAMADO BASE
========================================================= */

function criarChamadoBase(dados) {

    const agora = new Date();

    const numero =
        chamados.length > 0
            ? Math.max(
                ...chamados.map(
                    chamado =>
                        Number(chamado.id) || 0
                )
            ) + 1
            : 1;


    return {

        id: numero,

        cliente:
            dados.cliente || "",

        email:
            dados.email || "",

        telefone:
            dados.telefone || "",

        categoria:
            dados.categoria || "",

        assunto:
            dados.assunto || "",

        prioridade:
            dados.prioridade || "Média",

        descricao:
            dados.descricao || "",

        status:
            "Aberto",

        atendente:
            dados.atendente || "",

        origem:
            dados.origem || "Admin",

        dataCriacao:
            agora.toISOString(),

        dataAtualizacao:
            agora.toISOString(),

        dataFechamento:
            null,

        observacoes:
            "",

        historico: [

            {

                data:
                    agora.toISOString(),

                acao:
                    "Chamado criado",

                descricao:
                    "Chamado aberto no sistema."

            }

        ]

    };

}


/* =========================================================
   CADASTRAR CHAMADO ADMIN
========================================================= */

function cadastrarChamadoAdmin(event) {

    event.preventDefault();


    if (!administradorLogado) {

        alert(
            "Acesso administrativo necessário."
        );

        return;

    }


    const cliente =
        document
            .getElementById("nomeCliente")
            ?.value
            .trim() || "";


    const email =
        document
            .getElementById("emailCliente")
            ?.value
            .trim() || "";


    const telefone =
        document
            .getElementById("telefoneCliente")
            ?.value
            .trim() || "";


    const categoria =
        document
            .getElementById("categoria")
            ?.value || "";


    const assunto =
        document
            .getElementById("assunto")
            ?.value
            .trim() || "";


    const prioridade =
        document
            .getElementById("prioridade")
            ?.value || "Média";


    const descricao =
        document
            .getElementById("descricao")
            ?.value
            .trim() || "";


    if (
        !cliente ||
        !email ||
        !assunto ||
        !descricao
    ) {

        alert(
            "Preencha todos os campos obrigatórios."
        );

        return;

    }


    const novoChamado =
        criarChamadoBase({

            cliente:
                cliente,

            email:
                email,

            telefone:
                telefone,

            categoria:
                categoria,

            assunto:
                assunto,

            prioridade:
                prioridade,

            descricao:
                descricao,

            atendente:
                "",

            origem:
                "Admin"

        });


    chamados.push(
        novoChamado
    );


    salvarDados();


    adicionarNotificacao(

        "Novo chamado",

        `O chamado #${novoChamado.id} foi criado para ${cliente}.`

    );


    adicionarHistoricoGeral(

        "Chamado criado",

        `O administrador criou o chamado #${novoChamado.id}.`

    );


    atualizarTudo();


    if (event.target)
        event.target.reset();


    alert(
        `Chamado #${novoChamado.id} criado com sucesso!`
    );

}


/* =========================================================
   SALVAR DADOS
========================================================= */

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
        "notificacoes",
        JSON.stringify(notificacoes)
    );


    localStorage.setItem(
        "historicoGeral",
        JSON.stringify(historicoGeral)
    );


    localStorage.setItem(
        "configuracoes",
        JSON.stringify(configuracoes)
    );

}


/* =========================================================
   ATUALIZAR TUDO
========================================================= */

function atualizarTudo() {

    salvarDados();

    renderizarChamados();

    renderizarAtendentes();

    renderizarNotificacoes();

    renderizarHistorico();

    atualizarDashboard();

    atualizarDashboardCliente();

    renderizarChamadosCliente();

    renderizarNotificacoesCliente();

    renderizarHistoricoCliente();

    preencherDadosCliente();

    atualizarContadores();

}


/* =========================================================
   CONTADORES
========================================================= */

function atualizarContadores() {

    const total =
        chamados.length;


    const abertos =
        chamados.filter(
            chamado =>
                chamado.status === "Aberto"
        ).length;


    const andamento =
        chamados.filter(
            chamado =>
                chamado.status ===
                "Em andamento"
        ).length;


    const pendentes =
        chamados.filter(
            chamado =>
                chamado.status ===
                "Pendente"
        ).length;


    const resolvidos =
        chamados.filter(
            chamado =>
                chamado.status ===
                "Resolvido"
        ).length;


    const fechados =
        chamados.filter(
            chamado =>
                chamado.status ===
                "Fechado"
        ).length;


    definirTexto(
        "totalChamados",
        total
    );


    definirTexto(
        "chamadosAbertos",
        abertos
    );


    definirTexto(
        "chamadosAndamento",
        andamento
    );


    definirTexto(
        "chamadosPendentes",
        pendentes
    );


    definirTexto(
        "chamadosResolvidos",
        resolvidos
    );


    definirTexto(
        "chamadosFechados",
        fechados
    );


    definirTexto(
        "contadorNotificacoes",
        notificacoes.length
    );

}


/* =========================================================
   FUNÇÃO AUXILIAR — TEXTO
========================================================= */

function definirTexto(
    id,
    valor
) {

    const elemento =
        document.getElementById(id);


    if (elemento)
        elemento.textContent =
            valor;

}


/* =========================================================
   VERIFICAR CLIENTE LOGADO
========================================================= */

function verificarClienteLogado() {

    if (!clienteLogado)
        return;


    mostrarPainelCliente();

}


/* =========================================================
   MOSTRAR LOGIN CLIENTE
========================================================= */

function mostrarLoginCliente() {

    const login =
        document.getElementById(
            "loginCliente"
        );


    const painel =
        document.getElementById(
            "painelCliente"
        );


    if (login)
        login.style.display =
            "block";


    if (painel)
        painel.style.display =
            "none";

}


/* =========================================================
   MOSTRAR PAINEL CLIENTE
========================================================= */

function mostrarPainelCliente() {

    const login =
        document.getElementById(
            "loginCliente"
        );


    const painel =
        document.getElementById(
            "painelCliente"
        );


    if (login)
        login.style.display =
            "none";


    if (painel)
        painel.style.display =
            "block";


    preencherDadosCliente();

    atualizarDashboardCliente();

    renderizarChamadosCliente();

}/* =========================================================
   RENDERIZAR CHAMADOS — ADMIN
========================================================= */

function renderizarChamados() {

    const tabela =
        document.getElementById(
            "listaChamados"
        );


    if (!tabela)
        return;


    const pesquisa =
        (
            document.getElementById(
                "pesquisa"
            )?.value || ""
        )
        .toLowerCase()
        .trim();


    const filtroStatus =
        document.getElementById(
            "filtroStatus"
        )?.value || "";


    const filtroPrioridade =
        document.getElementById(
            "filtroPrioridade"
        )?.value || "";


    let lista =
        [...chamados];


    if (pesquisa) {

        lista =
            lista.filter(
                chamado =>

                    String(chamado.id)
                        .toLowerCase()
                        .includes(pesquisa)

                    ||

                    (chamado.cliente || "")
                        .toLowerCase()
                        .includes(pesquisa)

                    ||

                    (chamado.email || "")
                        .toLowerCase()
                        .includes(pesquisa)

                    ||

                    (chamado.assunto || "")
                        .toLowerCase()
                        .includes(pesquisa)

                    ||

                    (chamado.categoria || "")
                        .toLowerCase()
                        .includes(pesquisa)

            );

    }


    if (filtroStatus) {

        lista =
            lista.filter(
                chamado =>
                    chamado.status ===
                    filtroStatus
            );

    }


    if (filtroPrioridade) {

        lista =
            lista.filter(
                chamado =>
                    chamado.prioridade ===
                    filtroPrioridade
            );

    }


    lista.sort(
        (a, b) =>
            Number(b.id) -
            Number(a.id)
    );


    if (lista.length === 0) {

        tabela.innerHTML = `

            <tr>

                <td
                    colspan="100%"
                    style="text-align:center;"
                >

                    Nenhum chamado encontrado.

                </td>

            </tr>

        `;

        return;

    }


    tabela.innerHTML =
        lista.map(
            chamado =>
                criarLinhaChamado(
                    chamado
                )
        ).join("");

}


/* =========================================================
   CRIAR LINHA DO CHAMADO
========================================================= */

function criarLinhaChamado(
    chamado
) {

    const data =
        formatarData(
            chamado.dataCriacao
        );


    const status =
        chamado.status ||
        "Aberto";


    const prioridade =
        chamado.prioridade ||
        "Média";


    return `

        <tr>

            <td>
                #${escapeHTML(chamado.id)}
            </td>

            <td>
                ${escapeHTML(
                    chamado.cliente
                )}
            </td>

            <td>
                ${escapeHTML(
                    chamado.assunto
                )}
            </td>

            <td>
                ${escapeHTML(
                    chamado.categoria
                )}
            </td>

            <td>
                <span class="status status-${normalizarClasse(status)}">
                    ${escapeHTML(status)}
                </span>
            </td>

            <td>
                <span class="prioridade prioridade-${normalizarClasse(prioridade)}">
                    ${escapeHTML(prioridade)}
                </span>
            </td>

            <td>
                ${data}
            </td>

            <td>

                <button
                    type="button"
                    onclick="abrirChamado(${Number(chamado.id)})"
                >
                    👁️
                </button>

                <button
                    type="button"
                    onclick="editarChamado(${Number(chamado.id)})"
                >
                    ✏️
                </button>

                <button
                    type="button"
                    onclick="excluirChamado(${Number(chamado.id)})"
                >
                    🗑️
                </button>

            </td>

        </tr>

    `;

}


/* =========================================================
   ABRIR CHAMADO
========================================================= */

function abrirChamado(id) {

    if (!administradorLogado) {

        alert(
            "Acesso administrativo necessário."
        );

        return;

    }


    const chamado =
        chamados.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!chamado) {

        alert(
            "Chamado não encontrado."
        );

        return;

    }


    chamadoSelecionado =
        chamado;


    const modal =
        document.getElementById(
            "modalChamado"
        );


    if (!modal) {

        mostrarDetalhesChamado(
            chamado
        );

        return;

    }


    const campos = {

        "detalheId":
            `#${chamado.id}`,

        "detalheCliente":
            chamado.cliente,

        "detalheEmail":
            chamado.email,

        "detalheTelefone":
            chamado.telefone,

        "detalheCategoria":
            chamado.categoria,

        "detalheAssunto":
            chamado.assunto,

        "detalhePrioridade":
            chamado.prioridade,

        "detalheStatus":
            chamado.status,

        "detalheAtendente":
            chamado.atendente ||
            "Não atribuído",

        "detalheDescricao":
            chamado.descricao

    };


    Object.keys(campos)
        .forEach(
            function (idCampo) {

                const elemento =
                    document.getElementById(
                        idCampo
                    );


                if (elemento)
                    elemento.textContent =
                        campos[idCampo];

            }
        );


    modal.style.display =
        "flex";


    renderizarHistoricoChamado(
        chamado
    );

}


/* =========================================================
   FECHAR MODAL
========================================================= */

function fecharModalChamado() {

    const modal =
        document.getElementById(
            "modalChamado"
        );


    if (modal)
        modal.style.display =
            "none";


    chamadoSelecionado =
        null;

}


/* =========================================================
   MOSTRAR DETALHES SEM MODAL
========================================================= */

function mostrarDetalhesChamado(
    chamado
) {

    const texto = `

Chamado #${chamado.id}

Cliente: ${chamado.cliente}

E-mail: ${chamado.email}

Telefone: ${chamado.telefone}

Categoria: ${chamado.categoria}

Assunto: ${chamado.assunto}

Prioridade: ${chamado.prioridade}

Status: ${chamado.status}

Atendente: ${
    chamado.atendente ||
    "Não atribuído"
}

Descrição:

${chamado.descricao}

    `;


    alert(texto);

}


/* =========================================================
   EDITAR CHAMADO
========================================================= */

function editarChamado(id) {

    if (!administradorLogado) {

        alert(
            "Acesso administrativo necessário."
        );

        return;

    }


    const chamado =
        chamados.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!chamado) {

        alert(
            "Chamado não encontrado."
        );

        return;

    }


    chamadoEditando =
        chamado;


    const campos = {

        "editarCliente":
            chamado.cliente,

        "editarEmail":
            chamado.email,

        "editarTelefone":
            chamado.telefone,

        "editarCategoria":
            chamado.categoria,

        "editarAssunto":
            chamado.assunto,

        "editarPrioridade":
            chamado.prioridade,

        "editarStatus":
            chamado.status,

        "editarAtendente":
            chamado.atendente || "",

        "editarDescricao":
            chamado.descricao

    };


    let encontrouFormulario =
        false;


    Object.keys(campos)
        .forEach(
            function (idCampo) {

                const elemento =
                    document.getElementById(
                        idCampo
                    );


                if (elemento) {

                    encontrouFormulario =
                        true;

                    elemento.value =
                        campos[idCampo];

                }

            }
        );


    const modal =
        document.getElementById(
            "modalEditar"
        );


    if (modal) {

        modal.style.display =
            "flex";

        return;

    }


    if (!encontrouFormulario) {

        const novoStatus =
            prompt(
                "Digite o novo status:",
                chamado.status
            );


        if (
            novoStatus &&
            novoStatus.trim()
        ) {

            alterarStatusChamado(
                chamado.id,
                novoStatus.trim()
            );

        }

    }

}


/* =========================================================
   SALVAR EDIÇÃO
========================================================= */

function salvarEdicao(event) {

    event.preventDefault();


    if (!administradorLogado) {

        alert(
            "Acesso administrativo necessário."
        );

        return;

    }


    if (!chamadoEditando) {

        alert(
            "Nenhum chamado selecionado."
        );

        return;

    }


    const chamado =
        chamadoEditando;


    const obterValor =
        function (id, valorAtual) {

            const elemento =
                document.getElementById(id);


            return elemento
                ? elemento.value.trim()
                : valorAtual;

        };


    const statusAnterior =
        chamado.status;


    chamado.cliente =
        obterValor(
            "editarCliente",
            chamado.cliente
        );


    chamado.email =
        obterValor(
            "editarEmail",
            chamado.email
        );


    chamado.telefone =
        obterValor(
            "editarTelefone",
            chamado.telefone
        );


    chamado.categoria =
        obterValor(
            "editarCategoria",
            chamado.categoria
        );


    chamado.assunto =
        obterValor(
            "editarAssunto",
            chamado.assunto
        );


    chamado.prioridade =
        obterValor(
            "editarPrioridade",
            chamado.prioridade
        );


    chamado.status =
        obterValor(
            "editarStatus",
            chamado.status
        );


    chamado.atendente =
        obterValor(
            "editarAtendente",
            chamado.atendente
        );


    chamado.descricao =
        obterValor(
            "editarDescricao",
            chamado.descricao
        );


    chamado.dataAtualizacao =
        new Date().toISOString();


    if (
        statusAnterior !==
        chamado.status
    ) {

        if (
            chamado.status ===
            "Fechado"
        ) {

            chamado.dataFechamento =
                new Date().toISOString();

        }


        adicionarHistoricoChamado(

            chamado,

            "Status alterado",

            `Status alterado de "${statusAnterior}" para "${chamado.status}".`

        );

    } else {

        adicionarHistoricoChamado(

            chamado,

            "Chamado atualizado",

            "As informações do chamado foram atualizadas."

        );

    }


    salvarDados();


    adicionarNotificacao(

        "Chamado atualizado",

        `O chamado #${chamado.id} foi atualizado.`

    );


    adicionarHistoricoGeral(

        "Chamado atualizado",

        `O chamado #${chamado.id} foi atualizado pelo administrador.`

    );


    chamadoEditando =
        null;


    const modal =
        document.getElementById(
            "modalEditar"
        );


    if (modal)
        modal.style.display =
            "none";


    atualizarTudo();


    alert(
        "Chamado atualizado com sucesso!"
    );

}


/* =========================================================
   ALTERAR STATUS
========================================================= */

function alterarStatusChamado(
    id,
    novoStatus
) {

    if (!administradorLogado) {

        alert(
            "Acesso administrativo necessário."
        );

        return;

    }


    const chamado =
        chamados.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!chamado)
        return;


    const statusAnterior =
        chamado.status;


    chamado.status =
        novoStatus;


    chamado.dataAtualizacao =
        new Date().toISOString();


    if (
        novoStatus ===
        "Fechado"
    ) {

        chamado.dataFechamento =
            new Date().toISOString();

    }


    adicionarHistoricoChamado(

        chamado,

        "Status alterado",

        `Status alterado de "${statusAnterior}" para "${novoStatus}".`

    );


    salvarDados();


    atualizarTudo();

}/* =========================================================
   RENDERIZAR ATENDENTES
========================================================= */

function renderizarAtendentes() {

    const lista =
        document.getElementById(
            "listaAtendentes"
        );

    if (!lista)
        return;


    if (atendentes.length === 0) {

        lista.innerHTML = `
            <div class="sem-registros">
                Nenhum atendente cadastrado.
            </div>
        `;

        return;

    }


    lista.innerHTML =
        atendentes.map(
            atendente => `

                <div class="atendente-item">

                    <div>

                        <strong>
                            ${escapeHTML(
                                atendente.nome
                            )}
                        </strong>

                        <small>
                            ${escapeHTML(
                                atendente.email || ""
                            )}
                        </small>

                    </div>

                    <div>

                        <button
                            type="button"
                            onclick="editarAtendente(${Number(atendente.id)})"
                        >
                            ✏️
                        </button>

                        <button
                            type="button"
                            onclick="excluirAtendente(${Number(atendente.id)})"
                        >
                            🗑️
                        </button>

                    </div>

                </div>

            `
        ).join("");

}


/* =========================================================
   NOVO ATENDENTE
========================================================= */

function abrirNovoAtendente() {

    if (!administradorLogado) {

        alert(
            "Acesso administrativo necessário."
        );

        return;

    }


    const form =
        document.getElementById(
            "formAtendente"
        );


    if (form)
        form.reset();


    const modal =
        document.getElementById(
            "modalAtendente"
        );


    if (modal)
        modal.style.display =
            "flex";

}


/* =========================================================
   SALVAR ATENDENTE
========================================================= */

function salvarAtendente(event) {

    event.preventDefault();


    if (!administradorLogado) {

        alert(
            "Acesso administrativo necessário."
        );

        return;

    }


    const nome =
        document
            .getElementById(
                "atendenteNome"
            )
            ?.value
            .trim() || "";


    const email =
        document
            .getElementById(
                "atendenteEmail"
            )
            ?.value
            .trim() || "";


    const telefone =
        document
            .getElementById(
                "atendenteTelefone"
            )
            ?.value
            .trim() || "";


    if (!nome) {

        alert(
            "Informe o nome do atendente."
        );

        return;

    }


    const id =
        atendentes.length > 0
            ? Math.max(
                ...atendentes.map(
                    item =>
                        Number(item.id) || 0
                )
            ) + 1
            : 1;


    const novoAtendente = {

        id: id,

        nome: nome,

        email: email,

        telefone: telefone,

        ativo: true,

        dataCadastro:
            new Date().toISOString()

    };


    atendentes.push(
        novoAtendente
    );


    salvarDados();


    adicionarHistoricoGeral(

        "Atendente cadastrado",

        `${nome} foi cadastrado como atendente.`

    );


    renderizarAtendentes();


    const modal =
        document.getElementById(
            "modalAtendente"
        );


    if (modal)
        modal.style.display =
            "none";


    if (event.target)
        event.target.reset();


    alert(
        "Atendente cadastrado com sucesso!"
    );

}


/* =========================================================
   EDITAR ATENDENTE
========================================================= */

function editarAtendente(id) {

    if (!administradorLogado) {

        alert(
            "Acesso administrativo necessário."
        );

        return;

    }


    const atendente =
        atendentes.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!atendente) {

        alert(
            "Atendente não encontrado."
        );

        return;

    }


    const nome =
        prompt(
            "Nome do atendente:",
            atendente.nome
        );


    if (
        nome === null ||
        !nome.trim()
    ) {

        return;

    }


    const email =
        prompt(
            "E-mail do atendente:",
            atendente.email || ""
        );


    atendente.nome =
        nome.trim();


    if (email !== null)
        atendente.email =
            email.trim();


    salvarDados();


    adicionarHistoricoGeral(

        "Atendente atualizado",

        `${atendente.nome} foi atualizado.`

    );


    renderizarAtendentes();

}


/* =========================================================
   EXCLUIR ATENDENTE
========================================================= */

function excluirAtendente(id) {

    if (!administradorLogado) {

        alert(
            "Acesso administrativo necessário."
        );

        return;

    }


    const atendente =
        atendentes.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!atendente)
        return;


    const confirmar =
        confirm(
            `Deseja excluir o atendente "${atendente.nome}"?`
        );


    if (!confirmar)
        return;


    atendentes =
        atendentes.filter(
            item =>
                Number(item.id) !==
                Number(id)
        );


    /* Remove o atendente dos chamados */

    chamados.forEach(
        chamado => {

            if (
                chamado.atendente ===
                atendente.nome
            ) {

                chamado.atendente = "";

            }

        }
    );


    salvarDados();


    adicionarHistoricoGeral(

        "Atendente excluído",

        `${atendente.nome} foi removido do sistema.`

    );


    renderizarAtendentes();


    renderizarChamados();


    alert(
        "Atendente excluído com sucesso!"
    );

}


/* =========================================================
   NOTIFICAÇÕES
========================================================= */

function adicionarNotificacao(
    titulo,
    mensagem
) {

    const notificacao = {

        id:
            Date.now(),

        titulo:
            titulo,

        mensagem:
            mensagem,

        data:
            new Date().toISOString(),

        lida:
            false

    };


    notificacoes.unshift(
        notificacao
    );


    /* Limita o histórico */

    if (
        notificacoes.length >
        100
    ) {

        notificacoes =
            notificacoes.slice(
                0,
                100
            );

    }


    salvarDados();


    renderizarNotificacoes();

    renderizarNotificacoesCliente();

    atualizarContadores();

}


/* =========================================================
   RENDERIZAR NOTIFICAÇÕES ADMIN
========================================================= */

function renderizarNotificacoes() {

    const lista =
        document.getElementById(
            "listaNotificacoes"
        );


    if (!lista)
        return;


    if (
        notificacoes.length === 0
    ) {

        lista.innerHTML = `

            <div class="sem-registros">

                Nenhuma notificação.

            </div>

        `;

        return;

    }


    lista.innerHTML =
        notificacoes.map(
            notificacao => `

                <div
                    class="notificacao-item ${
                        notificacao.lida
                            ? "lida"
                            : "nao-lida"
                    }"
                >

                    <div>

                        <strong>
                            ${escapeHTML(
                                notificacao.titulo
                            )}
                        </strong>

                        <p>
                            ${escapeHTML(
                                notificacao.mensagem
                            )}
                        </p>

                        <small>
                            ${formatarData(
                                notificacao.data
                            )}
                        </small>

                    </div>

                    <button
                        type="button"
                        onclick="marcarNotificacaoLida(${Number(notificacao.id)})"
                    >

                        ${
                            notificacao.lida
                                ? "✓"
                                : "Marcar como lida"
                        }

                    </button>

                </div>

            `
        ).join("");

}


/* =========================================================
   MARCAR NOTIFICAÇÃO COMO LIDA
========================================================= */

function marcarNotificacaoLida(
    id
) {

    const notificacao =
        notificacoes.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!notificacao)
        return;


    notificacao.lida =
        true;


    salvarDados();


    renderizarNotificacoes();

    renderizarNotificacoesCliente();

    atualizarContadores();

}


/* =========================================================
   MARCAR TODAS COMO LIDAS
========================================================= */

function marcarTodasNotificacoesLidas() {

    notificacoes.forEach(
        notificacao => {

            notificacao.lida =
                true;

        }
    );


    salvarDados();


    renderizarNotificacoes();

    renderizarNotificacoesCliente();

    atualizarContadores();

}


/* =========================================================
   NOTIFICAÇÕES DO CLIENTE
========================================================= */

function renderizarNotificacoesCliente() {

    const lista =
        document.getElementById(
            "listaNotificacoesCliente"
        );


    if (!lista)
        return;


    if (
        notificacoes.length === 0
    ) {

        lista.innerHTML = `

            <div class="sem-registros">

                Nenhuma notificação.

            </div>

        `;

        return;

    }


    lista.innerHTML =
        notificacoes.map(
            notificacao => `

                <div
                    class="notificacao-item ${
                        notificacao.lida
                            ? "lida"
                            : "nao-lida"
                    }"
                >

                    <strong>
                        ${escapeHTML(
                            notificacao.titulo
                        )}
                    </strong>

                    <p>
                        ${escapeHTML(
                            notificacao.mensagem
                        )}
                    </p>

                    <small>
                        ${formatarData(
                            notificacao.data
                        )}
                    </small>

                </div>

            `
        ).join("");

}


/* =========================================================
   LIMPAR NOTIFICAÇÕES
========================================================= */

function limparNotificacoes() {

    if (!administradorLogado) {

        alert(
            "Acesso administrativo necessário."
        );

        return;

    }


    if (
        notificacoes.length === 0
    ) {

        return;

    }


    const confirmar =
        confirm(
            "Deseja apagar todas as notificações?"
        );


    if (!confirmar)
        return;


    notificacoes = [];


    salvarDados();


    renderizarNotificacoes();

    renderizarNotificacoesCliente();

    atualizarContadores();

}/* =========================================================
   HISTÓRICO DO CHAMADO
========================================================= */

function adicionarHistoricoChamado(
    chamado,
    acao,
    descricao
) {

    if (!chamado)
        return;


    if (!Array.isArray(chamado.historico)) {

        chamado.historico = [];

    }


    chamado.historico.push({

        data:
            new Date().toISOString(),

        acao:
            acao || "Atualização",

        descricao:
            descricao || ""

    });


    chamado.dataAtualizacao =
        new Date().toISOString();

}


/* =========================================================
   RENDERIZAR HISTÓRICO DO CHAMADO
========================================================= */

function renderizarHistoricoChamado(
    chamado
) {

    const lista =
        document.getElementById(
            "historicoChamado"
        );


    if (!lista)
        return;


    if (
        !chamado ||
        !Array.isArray(
            chamado.historico
        ) ||
        chamado.historico.length === 0
    ) {

        lista.innerHTML = `

            <div class="sem-registros">

                Nenhum histórico disponível.

            </div>

        `;

        return;

    }


    lista.innerHTML =
        chamado.historico
            .slice()
            .reverse()
            .map(
                item => `

                    <div class="historico-item">

                        <div>

                            <strong>
                                ${escapeHTML(
                                    item.acao
                                )}
                            </strong>

                            <p>
                                ${escapeHTML(
                                    item.descricao
                                )}
                            </p>

                            <small>
                                ${formatarData(
                                    item.data
                                )}
                            </small>

                        </div>

                    </div>

                `
            )
            .join("");

}


/* =========================================================
   HISTÓRICO GERAL
========================================================= */

function adicionarHistoricoGeral(
    acao,
    descricao
) {

    historicoGeral.unshift({

        id:
            Date.now(),

        data:
            new Date().toISOString(),

        acao:
            acao || "Ação realizada",

        descricao:
            descricao || ""

    });


    if (
        historicoGeral.length >
        200
    ) {

        historicoGeral =
            historicoGeral.slice(
                0,
                200
            );

    }


    salvarDados();


    renderizarHistorico();

}


/* =========================================================
   RENDERIZAR HISTÓRICO GERAL
========================================================= */

function renderizarHistorico() {

    const lista =
        document.getElementById(
            "listaHistorico"
        );


    if (!lista)
        return;


    if (
        historicoGeral.length === 0
    ) {

        lista.innerHTML = `

            <div class="sem-registros">

                Nenhum histórico registrado.

            </div>

        `;

        return;

    }


    lista.innerHTML =
        historicoGeral
            .map(
                item => `

                    <div class="historico-item">

                        <div>

                            <strong>
                                ${escapeHTML(
                                    item.acao
                                )}
                            </strong>

                            <p>
                                ${escapeHTML(
                                    item.descricao
                                )}
                            </p>

                            <small>
                                ${formatarData(
                                    item.data
                                )}
                            </small>

                        </div>

                    </div>

                `
            )
            .join("");

}


/* =========================================================
   HISTÓRICO DO CLIENTE
========================================================= */

function renderizarHistoricoCliente() {

    const lista =
        document.getElementById(
            "listaHistoricoCliente"
        );


    if (!lista)
        return;


    if (!clienteLogado) {

        lista.innerHTML = `

            <div class="sem-registros">

                Faça login para visualizar
                seu histórico.

            </div>

        `;

        return;

    }


    const emailCliente =
        (
            clienteLogado.email || ""
        )
        .toLowerCase();


    const chamadosCliente =
        chamados.filter(
            chamado =>
                (
                    chamado.email || ""
                )
                .toLowerCase() ===
                emailCliente
        );


    let historico = [];


    chamadosCliente.forEach(
        chamado => {

            if (
                Array.isArray(
                    chamado.historico
                )
            ) {

                chamado.historico.forEach(
                    item => {

                        historico.push({

                            ...item,

                            chamadoId:
                                chamado.id,

                            assunto:
                                chamado.assunto

                        });

                    }
                );

            }

        }
    );


    historico.sort(
        (a, b) =>
            new Date(b.data) -
            new Date(a.data)
    );


    if (historico.length === 0) {

        lista.innerHTML = `

            <div class="sem-registros">

                Nenhum histórico disponível.

            </div>

        `;

        return;

    }


    lista.innerHTML =
        historico
            .map(
                item => `

                    <div class="historico-item">

                        <strong>
                            Chamado #${Number(
                                item.chamadoId
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                item.acao
                            )}
                        </span>

                        <p>
                            ${escapeHTML(
                                item.descricao
                            )}
                        </p>

                        <small>
                            ${formatarData(
                                item.data
                            )}
                        </small>

                    </div>

                `
            )
            .join("");

}


/* =========================================================
   EXCLUIR CHAMADO
========================================================= */

function excluirChamado(id) {

    if (!administradorLogado) {

        alert(
            "Acesso administrativo necessário."
        );

        return;

    }


    const chamado =
        chamados.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!chamado) {

        alert(
            "Chamado não encontrado."
        );

        return;

    }


    const confirmar =
        confirm(
            `Deseja realmente excluir o chamado #${chamado.id}?`
        );


    if (!confirmar)
        return;


    chamados =
        chamados.filter(
            item =>
                Number(item.id) !==
                Number(id)
        );


    salvarDados();


    adicionarHistoricoGeral(

        "Chamado excluído",

        `O chamado #${chamado.id} de ${chamado.cliente} foi excluído.`

    );


    adicionarNotificacao(

        "Chamado excluído",

        `O chamado #${chamado.id} foi removido do sistema.`

    );


    atualizarTudo();


    alert(
        "Chamado excluído com sucesso!"
    );

}


/* =========================================================
   LIMPAR HISTÓRICO GERAL
========================================================= */

function limparHistorico() {

    if (!administradorLogado) {

        alert(
            "Acesso administrativo necessário."
        );

        return;

    }


    if (
        historicoGeral.length === 0
    ) {

        return;

    }


    const confirmar =
        confirm(
            "Deseja apagar todo o histórico?"
        );


    if (!confirmar)
        return;


    historicoGeral = [];


    salvarDados();


    renderizarHistorico();

}/* =========================================================
   DASHBOARD ADMINISTRATIVO
========================================================= */

function atualizarDashboard() {

    const total =
        chamados.length;

    const abertos =
        chamados.filter(
            chamado =>
                chamado.status === "Aberto"
        ).length;

    const andamento =
        chamados.filter(
            chamado =>
                chamado.status === "Em andamento"
        ).length;

    const pendentes =
        chamados.filter(
            chamado =>
                chamado.status === "Pendente"
        ).length;

    const resolvidos =
        chamados.filter(
            chamado =>
                chamado.status === "Resolvido"
        ).length;

    const fechados =
        chamados.filter(
            chamado =>
                chamado.status === "Fechado"
        ).length;


    definirTexto(
        "dashboardTotal",
        total
    );

    definirTexto(
        "dashboardAbertos",
        abertos
    );

    definirTexto(
        "dashboardAndamento",
        andamento
    );

    definirTexto(
        "dashboardPendentes",
        pendentes
    );

    definirTexto(
        "dashboardResolvidos",
        resolvidos
    );

    definirTexto(
        "dashboardFechados",
        fechados
    );


    atualizarPercentuais();

}


/* =========================================================
   PERCENTUAIS DO DASHBOARD
========================================================= */

function atualizarPercentuais() {

    const total =
        chamados.length;


    if (total === 0) {

        definirTexto(
            "percentualAbertos",
            "0%"
        );

        definirTexto(
            "percentualAndamento",
            "0%"
        );

        definirTexto(
            "percentualPendentes",
            "0%"
        );

        definirTexto(
            "percentualResolvidos",
            "0%"
        );

        definirTexto(
            "percentualFechados",
            "0%"
        );

        return;

    }


    const calcular =
        function (status) {

            const quantidade =
                chamados.filter(
                    chamado =>
                        chamado.status ===
                        status
                ).length;


            return Math.round(
                (
                    quantidade /
                    total
                ) * 100
            ) + "%";

        };


    definirTexto(
        "percentualAbertos",
        calcular("Aberto")
    );

    definirTexto(
        "percentualAndamento",
        calcular("Em andamento")
    );

    definirTexto(
        "percentualPendentes",
        calcular("Pendente")
    );

    definirTexto(
        "percentualResolvidos",
        calcular("Resolvido")
    );

    definirTexto(
        "percentualFechados",
        calcular("Fechado")
    );

}


/* =========================================================
   DASHBOARD CLIENTE
========================================================= */

function atualizarDashboardCliente() {

    if (!clienteLogado)
        return;


    const email =
        (
            clienteLogado.email || ""
        )
        .toLowerCase();


    const meusChamados =
        chamados.filter(
            chamado =>
                (
                    chamado.email || ""
                )
                .toLowerCase() ===
                email
        );


    const total =
        meusChamados.length;


    const abertos =
        meusChamados.filter(
            chamado =>
                chamado.status ===
                "Aberto"
        ).length;


    const andamento =
        meusChamados.filter(
            chamado =>
                chamado.status ===
                "Em andamento"
        ).length;


    const pendentes =
        meusChamados.filter(
            chamado =>
                chamado.status ===
                "Pendente"
        ).length;


    const resolvidos =
        meusChamados.filter(
            chamado =>
                chamado.status ===
                "Resolvido"
        ).length;


    const fechados =
        meusChamados.filter(
            chamado =>
                chamado.status ===
                "Fechado"
        ).length;


    definirTexto(
        "clienteTotalChamados",
        total
    );


    definirTexto(
        "clienteChamadosAbertos",
        abertos
    );


    definirTexto(
        "clienteChamadosAndamento",
        andamento
    );


    definirTexto(
        "clienteChamadosPendentes",
        pendentes
    );


    definirTexto(
        "clienteChamadosResolvidos",
        resolvidos
    );


    definirTexto(
        "clienteChamadosFechados",
        fechados
    );

}


/* =========================================================
   RENDERIZAR CHAMADOS DO CLIENTE
========================================================= */

function renderizarChamadosCliente() {

    const tabela =
        document.getElementById(
            "listaChamadosCliente"
        );


    if (!tabela)
        return;


    if (!clienteLogado) {

        tabela.innerHTML = `

            <tr>

                <td
                    colspan="100%"
                    style="text-align:center;"
                >

                    Faça login para visualizar
                    seus chamados.

                </td>

            </tr>

        `;

        return;

    }


    const emailCliente =
        (
            clienteLogado.email || ""
        )
        .toLowerCase();


    const pesquisa =
        (
            document.getElementById(
                "pesquisaChamadosCliente"
            )?.value || ""
        )
        .toLowerCase()
        .trim();


    const filtroStatus =
        document.getElementById(
            "filtroStatusCliente"
        )?.value || "";


    const filtroPrioridade =
        document.getElementById(
            "filtroPrioridadeCliente"
        )?.value || "";


    let lista =
        chamados.filter(
            chamado =>
                (
                    chamado.email || ""
                )
                .toLowerCase() ===
                emailCliente
        );


    if (pesquisa) {

        lista =
            lista.filter(
                chamado =>

                    String(chamado.id)
                        .toLowerCase()
                        .includes(pesquisa)

                    ||

                    (chamado.assunto || "")
                        .toLowerCase()
                        .includes(pesquisa)

                    ||

                    (chamado.categoria || "")
                        .toLowerCase()
                        .includes(pesquisa)

                    ||

                    (chamado.descricao || "")
                        .toLowerCase()
                        .includes(pesquisa)

            );

    }


    if (filtroStatus) {

        lista =
            lista.filter(
                chamado =>
                    chamado.status ===
                    filtroStatus
            );

    }


    if (filtroPrioridade) {

        lista =
            lista.filter(
                chamado =>
                    chamado.prioridade ===
                    filtroPrioridade
            );

    }


    lista.sort(
        (a, b) =>
            Number(b.id) -
            Number(a.id)
    );


    if (lista.length === 0) {

        tabela.innerHTML = `

            <tr>

                <td
                    colspan="100%"
                    style="text-align:center;"
                >

                    Você ainda não possui
                    chamados.

                </td>

            </tr>

        `;

        return;

    }


    tabela.innerHTML =
        lista.map(
            chamado => `

                <tr>

                    <td>
                        #${Number(
                            chamado.id
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            chamado.assunto
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            chamado.categoria
                        )}
                    </td>

                    <td>

                        <span
                            class="status status-${normalizarClasse(
                                chamado.status
                            )}"
                        >

                            ${escapeHTML(
                                chamado.status
                            )}

                        </span>

                    </td>

                    <td>

                        <span
                            class="prioridade prioridade-${normalizarClasse(
                                chamado.prioridade
                            )}"
                        >

                            ${escapeHTML(
                                chamado.prioridade
                            )}

                        </span>

                    </td>

                    <td>
                        ${formatarData(
                            chamado.dataCriacao
                        )}
                    </td>

                    <td>

                        <button
                            type="button"
                            onclick="verChamadoCliente(${Number(chamado.id)})"
                        >

                            👁️ Ver

                        </button>

                    </td>

                </tr>

            `
        ).join("");

}


/* =========================================================
   VER CHAMADO DO CLIENTE
========================================================= */

function verChamadoCliente(id) {

    if (!clienteLogado) {

        alert(
            "Faça login para continuar."
        );

        return;

    }


    const chamado =
        chamados.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!chamado) {

        alert(
            "Chamado não encontrado."
        );

        return;

    }


    const emailCliente =
        (
            clienteLogado.email || ""
        )
        .toLowerCase();


    if (
        (
            chamado.email || ""
        )
        .toLowerCase() !==
        emailCliente
    ) {

        alert(
            "Você não tem acesso a este chamado."
        );

        return;

    }


    const modal =
        document.getElementById(
            "modalChamadoCliente"
        );


    if (!modal) {

        alert(`

Chamado #${chamado.id}

Assunto: ${chamado.assunto}

Status: ${chamado.status}

Prioridade: ${chamado.prioridade}

Categoria: ${chamado.categoria}

Atendente: ${
    chamado.atendente ||
    "Não atribuído"
}

Descrição:

${chamado.descricao}

        `);

        return;

    }


    const campos = {

        "clienteDetalheId":
            `#${chamado.id}`,

        "clienteDetalheAssunto":
            chamado.assunto,

        "clienteDetalheCategoria":
            chamado.categoria,

        "clienteDetalheStatus":
            chamado.status,

        "clienteDetalhePrioridade":
            chamado.prioridade,

        "clienteDetalheAtendente":
            chamado.atendente ||
            "Não atribuído",

        "clienteDetalheDescricao":
            chamado.descricao,

        "clienteDetalheData":
            formatarData(
                chamado.dataCriacao
            )

    };


    Object.keys(campos)
        .forEach(
            function (idCampo) {

                const elemento =
                    document.getElementById(
                        idCampo
                    );


                if (elemento)
                    elemento.textContent =
                        campos[idCampo];

            }
        );


    modal.style.display =
        "flex";


    renderizarHistoricoChamadoCliente(
        chamado
    );

}


/* =========================================================
   FECHAR MODAL CLIENTE
========================================================= */

function fecharModalChamadoCliente() {

    const modal =
        document.getElementById(
            "modalChamadoCliente"
        );


    if (modal)
        modal.style.display =
            "none";

}


/* =========================================================
   HISTÓRICO DO CHAMADO — CLIENTE
========================================================= */

function renderizarHistoricoChamadoCliente(
    chamado
) {

    const lista =
        document.getElementById(
            "historicoChamadoCliente"
        );


    if (!lista)
        return;


    if (
        !chamado ||
        !Array.isArray(
            chamado.historico
        )
    ) {

        lista.innerHTML = `

            <div class="sem-registros">

                Nenhum histórico disponível.

            </div>

        `;

        return;

    }


    lista.innerHTML =
        chamado.historico
            .slice()
            .reverse()
            .map(
                item => `

                    <div class="historico-item">

                        <strong>
                            ${escapeHTML(
                                item.acao
                            )}
                        </strong>

                        <p>
                            ${escapeHTML(
                                item.descricao
                            )}
                        </p>

                        <small>
                            ${formatarData(
                                item.data
                            )}
                        </small>

                    </div>

                `
            )
            .join("");

}/* =========================================================
   CONFIGURAÇÕES
========================================================= */

function carregarConfiguracoes() {

    const nomeSistema =
        document.getElementById(
            "configNomeSistema"
        );

    const nomeEmpresa =
        document.getElementById(
            "configNomeEmpresa"
        );

    const emailEmpresa =
        document.getElementById(
            "configEmailEmpresa"
        );


    if (nomeSistema)
        nomeSistema.value =
            configuracoes.nomeSistema || "";


    if (nomeEmpresa)
        nomeEmpresa.value =
            configuracoes.nomeEmpresa || "";


    if (emailEmpresa)
        emailEmpresa.value =
            configuracoes.emailEmpresa || "";


    aplicarConfiguracoes();

}


/* =========================================================
   APLICAR CONFIGURAÇÕES
========================================================= */

function aplicarConfiguracoes() {

    document.title =
        configuracoes.nomeSistema ||
        "Central de Atendimento";


    const elementosNome =
        document.querySelectorAll(
            ".nomeSistema"
        );


    elementosNome.forEach(
        elemento => {

            elemento.textContent =
                configuracoes.nomeSistema ||
                "Central de Atendimento";

        }
    );


    const elementosEmpresa =
        document.querySelectorAll(
            ".nomeEmpresa"
        );


    elementosEmpresa.forEach(
        elemento => {

            elemento.textContent =
                configuracoes.nomeEmpresa ||
                "Sistema de Chamados";

        }
    );

}


/* =========================================================
   SALVAR CONFIGURAÇÕES
========================================================= */

function salvarConfiguracoes() {

    if (!administradorLogado) {

        alert(
            "Acesso administrativo necessário."
        );

        return;

    }


    const nomeSistema =
        document.getElementById(
            "configNomeSistema"
        )?.value.trim();


    const nomeEmpresa =
        document.getElementById(
            "configNomeEmpresa"
        )?.value.trim();


    const emailEmpresa =
        document.getElementById(
            "configEmailEmpresa"
        )?.value.trim();


    configuracoes.nomeSistema =
        nomeSistema ||
        "Central de Atendimento";


    configuracoes.nomeEmpresa =
        nomeEmpresa ||
        "Sistema de Chamados";


    configuracoes.emailEmpresa =
        emailEmpresa || "";


    localStorage.setItem(
        "configuracoes",
        JSON.stringify(
            configuracoes
        )
    );


    aplicarConfiguracoes();


    adicionarHistoricoGeral(

        "Configurações atualizadas",

        "As configurações do sistema foram atualizadas."

    );


    alert(
        "Configurações salvas com sucesso!"
    );

}


/* =========================================================
   LOGOUT ADMINISTRATIVO
========================================================= */

function sairAdministrativo() {

    if (administradorLogado) {

        adicionarHistoricoGeral(

            "Logout administrativo",

            "O administrador saiu da área administrativa."

        );

    }


    administradorLogado =
        false;


    sessionStorage.removeItem(
        "administradorLogado"
    );


    const sistema =
        document.getElementById(
            "sistema"
        );


    const loginAdmin =
        document.getElementById(
            "loginAdministrativo"
        );


    if (sistema)
        sistema.style.display =
            "none";


    if (loginAdmin)
        loginAdmin.style.display =
            "none";


    voltarTelaEscolha();

}


/* =========================================================
   FORMATAR DATA
========================================================= */

function formatarData(
    data
) {

    if (!data)
        return "-";


    const dataObjeto =
        new Date(data);


    if (
        Number.isNaN(
            dataObjeto.getTime()
        )
    ) {

        return "-";

    }


    return dataObjeto.toLocaleString(
        "pt-BR",
        {

            day: "2-digit",

            month: "2-digit",

            year: "numeric",

            hour: "2-digit",

            minute: "2-digit"

        }
    );

}


/* =========================================================
   NORMALIZAR CLASSE
========================================================= */

function normalizarClasse(
    texto
) {

    return String(
        texto || ""
    )
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .replace(
            /\s+/g,
            "-"
        )
        .replace(
            /[^a-z0-9-]/g,
            ""
        );

}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escapeHTML(
    valor
) {

    return String(
        valor ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   FECHAR MODAIS AO CLICAR FORA
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const modais =
            document.querySelectorAll(
                ".modal"
            );


        modais.forEach(
            function (modal) {

                if (
                    event.target ===
                    modal
                ) {

                    modal.style.display =
                        "none";

                }

            }
        );

    }
);


/* =========================================================
   ESC PARA FECHAR MODAIS
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        document
            .querySelectorAll(
                ".modal"
            )
            .forEach(
                function (modal) {

                    modal.style.display =
                        "none";

                }
            );


        chamadoSelecionado =
            null;

        chamadoEditando =
            null;

    }
);


/* =========================================================
   ATUALIZAÇÃO AUTOMÁTICA
========================================================= */

setInterval(
    function () {

        chamados =
            JSON.parse(
                localStorage.getItem(
                    "chamados"
                )
            ) || [];


        atendentes =
            JSON.parse(
                localStorage.getItem(
                    "atendentes"
                )
            ) || [];


        notificacoes =
            JSON.parse(
                localStorage.getItem(
                    "notificacoes"
                )
            ) || [];


        historicoGeral =
            JSON.parse(
                localStorage.getItem(
                    "historicoGeral"
                )
            ) || [];


        atualizarTudo();

    },
    5000
);/* =========================================================
   NAVEGAÇÃO ADMINISTRATIVA
========================================================= */

function mostrarTelaAdmin(id, botao) {

    if (!administradorLogado) {

        alert(
            "Faça login como administrador para continuar."
        );

        return;

    }


    document
        .querySelectorAll(".admin-tela")
        .forEach(function (tela) {

            tela.style.display = "none";

            tela.classList.remove("ativo");

        });


    const tela =
        document.getElementById(id);


    if (tela) {

        tela.style.display = "block";

        tela.classList.add("ativo");

    }


    document
        .querySelectorAll(".menu-link")
        .forEach(function (item) {

            item.classList.remove("ativo");

        });


    if (botao) {

        botao.classList.add("ativo");

    }


    /* Atualiza o conteúdo da tela */

    switch (id) {

        case "dashboard":

            atualizarDashboard();

            break;


        case "chamados":

            renderizarChamados();

            break;


        case "atendentes":

            renderizarAtendentes();

            break;


        case "notificacoes":

            renderizarNotificacoes();

            break;


        case "historico":

            renderizarHistorico();

            break;


        case "configuracoes":

            carregarConfiguracoes();

            break;

    }

}


/* =========================================================
   NAVEGAÇÃO ADMIN POR ID
========================================================= */

function mostrarTelaAdminPorId(id) {

    if (!administradorLogado) {

        alert(
            "Faça login como administrador para continuar."
        );

        return;

    }


    let botao = null;


    document
        .querySelectorAll(".menu-link")
        .forEach(function (item) {

            const onclick =
                item.getAttribute("onclick") || "";


            if (
                onclick.includes(id)
            ) {

                botao = item;

            }

        });


    mostrarTelaAdmin(
        id,
        botao
    );

}


/* =========================================================
   ABRIR NOVO CHAMADO ADMIN
========================================================= */

function abrirNovoChamadoAdmin() {

    if (!administradorLogado) {

        alert(
            "Acesso administrativo necessário."
        );

        return;

    }


    const formulario =
        document.getElementById(
            "formChamado"
        );


    if (formulario) {

        formulario.reset();

    }


    mostrarTelaAdminPorId(
        "novoChamado"
    );

}


/* =========================================================
   FECHAR QUALQUER MODAL
========================================================= */

function fecharModal(id) {

    const modal =
        document.getElementById(id);


    if (modal) {

        modal.style.display =
            "none";

    }


    chamadoSelecionado =
        null;

    chamadoEditando =
        null;

}


/* =========================================================
   LIMPAR PESQUISA ADMIN
========================================================= */

function limparPesquisa() {

    const pesquisa =
        document.getElementById(
            "pesquisa"
        );


    const filtroStatus =
        document.getElementById(
            "filtroStatus"
        );


    const filtroPrioridade =
        document.getElementById(
            "filtroPrioridade"
        );


    if (pesquisa)
        pesquisa.value = "";


    if (filtroStatus)
        filtroStatus.value = "";


    if (filtroPrioridade)
        filtroPrioridade.value = "";


    renderizarChamados();

}


/* =========================================================
   LIMPAR PESQUISA CLIENTE
========================================================= */

function limparPesquisaCliente() {

    const pesquisa =
        document.getElementById(
            "pesquisaChamadosCliente"
        );


    const filtroStatus =
        document.getElementById(
            "filtroStatusCliente"
        );


    const filtroPrioridade =
        document.getElementById(
            "filtroPrioridadeCliente"
        );


    if (pesquisa)
        pesquisa.value = "";


    if (filtroStatus)
        filtroStatus.value = "";


    if (filtroPrioridade)
        filtroPrioridade.value = "";


    renderizarChamadosCliente();

}


/* =========================================================
   RECARREGAR SISTEMA
========================================================= */

function recarregarSistema() {

    atualizarTudo();

}


/* =========================================================
   EXPORTAR DADOS
========================================================= */

function exportarDados() {

    if (!administradorLogado) {

        alert(
            "Acesso administrativo necessário."
        );

        return;

    }


    const dados = {

        chamados:
            chamados,

        atendentes:
            atendentes,

        notificacoes:
            notificacoes,

        historicoGeral:
            historicoGeral,

        configuracoes:
            configuracoes

    };


    const arquivo =
        new Blob(
            [
                JSON.stringify(
                    dados,
                    null,
                    2
                )
            ],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            arquivo
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "backup-central-atendimento.json";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );


    adicionarHistoricoGeral(

        "Backup exportado",

        "O administrador exportou os dados do sistema."

    );

}


/* =========================================================
   IMPORTAR DADOS
========================================================= */

function importarDados(event) {

    if (!administradorLogado) {

        alert(
            "Acesso administrativo necessário."
        );

        return;

    }


    const arquivo =
        event.target.files?.[0];


    if (!arquivo)
        return;


    const leitor =
        new FileReader();


    leitor.onload =
        function () {

            try {

                const dados =
                    JSON.parse(
                        leitor.result
                    );


                if (
                    dados.chamados &&
                    Array.isArray(
                        dados.chamados
                    )
                ) {

                    chamados =
                        dados.chamados;

                }


                if (
                    dados.atendentes &&
                    Array.isArray(
                        dados.atendentes
                    )
                ) {

                    atendentes =
                        dados.atendentes;

                }


                if (
                    dados.notificacoes &&
                    Array.isArray(
                        dados.notificacoes
                    )
                ) {

                    notificacoes =
                        dados.notificacoes;

                }


                if (
                    dados.historicoGeral &&
                    Array.isArray(
                        dados.historicoGeral
                    )
                ) {

                    historicoGeral =
                        dados.historicoGeral;

                }


                if (
                    dados.configuracoes &&
                    typeof dados.configuracoes ===
                    "object"
                ) {

                    configuracoes =
                        dados.configuracoes;

                }


                salvarDados();


                atualizarTudo();


                alert(
                    "Dados importados com sucesso!"
                );


                adicionarHistoricoGeral(

                    "Backup importado",

                    "Os dados do sistema foram restaurados."

                );


            } catch (erro) {

                console.error(
                    erro
                );


                alert(
                    "Erro ao importar o arquivo. Verifique se o backup é válido."
                );

            }

        };


    leitor.readAsText(
        arquivo
    );

}


/* =========================================================
   LIMPAR TODOS OS DADOS
========================================================= */

function limparTodosDados() {

    if (!administradorLogado) {

        alert(
            "Acesso administrativo necessário."
        );

        return;

    }


    const confirmar =
        confirm(
            "ATENÇÃO!\n\nIsso apagará todos os chamados, atendentes, notificações e histórico.\n\nDeseja realmente continuar?"
        );


    if (!confirmar)
        return;


    const confirmarNovamente =
        confirm(
            "Tem certeza? Essa ação não poderá ser desfeita sem um backup."
        );


    if (!confirmarNovamente)
        return;


    chamados = [];

    atendentes = [];

    notificacoes = [];

    historicoGeral = [];


    salvarDados();


    atualizarTudo();


    alert(
        "Todos os dados foram apagados."
    );

}


/* =========================================================
   INICIALIZAÇÃO FINAL
========================================================= */

function inicializarSistema() {

    carregarConfiguracoes();

    atualizarTudo();


    if (clienteLogado) {

        preencherDadosCliente();

    }


    if (administradorLogado) {

        protegerAreaAdministrativa();

    }

}


/* =========================================================
   INICIALIZAÇÃO DE SEGURANÇA
========================================================= */

window.addEventListener(
    "load",
    function () {

        inicializarSistema();

    }
);


/* =========================================================
   EXPOR FUNÇÕES PARA O HTML
========================================================= */

window.abrirAreaCliente =
    abrirAreaCliente;

window.abrirAreaAdministrativa =
    abrirAreaAdministrativa;

window.voltarTelaEscolha =
    voltarTelaEscolha;

window.fazerLoginCliente =
    fazerLoginCliente;

window.fazerLoginAdmin =
    fazerLoginAdmin;

window.sairCliente =
    sairCliente;

window.sairAdministrativo =
    sairAdministrativo;

window.mostrarTelaCliente =
    mostrarTelaCliente;

window.mostrarTelaClientePorId =
    mostrarTelaClientePorId;

window.mostrarTelaAdmin =
    mostrarTelaAdmin;

window.mostrarTelaAdminPorId =
    mostrarTelaAdminPorId;

window.abrirTelaNovoChamadoCliente =
    abrirTelaNovoChamadoCliente;

window.abrirNovoChamadoAdmin =
    abrirNovoChamadoAdmin;

window.cadastrarChamadoCliente =
    cadastrarChamadoCliente;

window.cadastrarChamadoAdmin =
    cadastrarChamadoAdmin;

window.abrirChamado =
    abrirChamado;

window.editarChamado =
    editarChamado;

window.excluirChamado =
    excluirChamado;

window.alterarStatusChamado =
    alterarStatusChamado;

window.fecharModalChamado =
    fecharModalChamado;

window.verChamadoCliente =
    verChamadoCliente;

window.fecharModalChamadoCliente =
    fecharModalChamadoCliente;

window.abrirNovoAtendente =
    abrirNovoAtendente;

window.salvarAtendente =
    salvarAtendente;

window.editarAtendente =
    editarAtendente;

window.excluirAtendente =
    excluirAtendente;

window.marcarNotificacaoLida =
    marcarNotificacaoLida;

window.marcarTodasNotificacoesLidas =
    marcarTodasNotificacoesLidas;

window.limparNotificacoes =
    limparNotificacoes;

window.limparHistorico =
    limparHistorico;

window.salvarConfiguracoes =
    salvarConfiguracoes;

window.fecharModal =
    fecharModal;

window.limparPesquisa =
    limparPesquisa;

window.limparPesquisaCliente =
    limparPesquisaCliente;

window.recarregarSistema =
    recarregarSistema;

window.exportarDados =
    exportarDados;

window.importarDados =
    importarDados;

window.limparTodosDados =
    limparTodosDados;


/* =========================================================
   FIM DO SCRIPT
========================================================= */

console.log(
    "Central de Atendimento carregada com sucesso."
);