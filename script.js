/* =========================================================
   CENTRAL DE ATENDIMENTO
   SCRIPT.JS COMPLETO
========================================================= */


/* =========================================================
   DADOS DO SISTEMA
========================================================= */

let chamados = JSON.parse(localStorage.getItem("chamados")) || [];
let atendentes = JSON.parse(localStorage.getItem("atendentes")) || [];
let notificacoes = JSON.parse(localStorage.getItem("notificacoes")) || [];
let historicoGeral = JSON.parse(localStorage.getItem("historicoGeral")) || [];

let clienteLogado = JSON.parse(localStorage.getItem("clienteLogado")) || null;

let chamadoSelecionado = null;
let chamadoEditando = null;


/* =========================================================
   CONFIGURAÇÕES
========================================================= */

let configuracoes = JSON.parse(
    localStorage.getItem("configuracoes")
) || {
    nomeSistema: "Central de Atendimento",
    nomeEmpresa: "Sistema de Chamados",
    emailEmpresa: ""
};


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    carregarConfiguracoes();

    atualizarTudo();

    configurarEventos();

    verificarClienteLogado();

});


/* =========================================================
   EVENTOS
========================================================= */

function configurarEventos() {

    const formLoginCliente =
        document.getElementById("formLoginCliente");

    if (formLoginCliente) {

        formLoginCliente.addEventListener(
            "submit",
            fazerLoginCliente
        );

    }


    const formChamadoCliente =
        document.getElementById("formChamadoCliente");

    if (formChamadoCliente) {

        formChamadoCliente.addEventListener(
            "submit",
            cadastrarChamadoCliente
        );

    }


    const formChamado =
        document.getElementById("formChamado");

    if (formChamado) {

        formChamado.addEventListener(
            "submit",
            cadastrarChamadoAdmin
        );

    }


    const formEditar =
        document.getElementById("formEditar");

    if (formEditar) {

        formEditar.addEventListener(
            "submit",
            salvarEdicao
        );

    }


    const formAtendente =
        document.getElementById("formAtendente");

    if (formAtendente) {

        formAtendente.addEventListener(
            "submit",
            salvarAtendente
        );

    }


    const btnNovoAtendente =
        document.getElementById("btnNovoAtendente");

    if (btnNovoAtendente) {

        btnNovoAtendente.addEventListener(
            "click",
            abrirNovoAtendente
        );

    }


    const btnSair =
        document.getElementById("btnSair");

    if (btnSair) {

        btnSair.addEventListener(
            "click",
            sairAdministrativo
        );

    }


    const btnSalvarConfiguracoes =
        document.getElementById("btnSalvarConfiguracoes");

    if (btnSalvarConfiguracoes) {

        btnSalvarConfiguracoes.addEventListener(
            "click",
            salvarConfiguracoes
        );

    }


    const pesquisa =
        document.getElementById("pesquisa");

    if (pesquisa) {

        pesquisa.addEventListener(
            "input",
            renderizarChamados
        );

    }


    const filtroStatus =
        document.getElementById("filtroStatus");

    if (filtroStatus) {

        filtroStatus.addEventListener(
            "change",
            renderizarChamados
        );

    }


    const filtroPrioridade =
        document.getElementById("filtroPrioridade");

    if (filtroPrioridade) {

        filtroPrioridade.addEventListener(
            "change",
            renderizarChamados
        );

    }


    const pesquisaCliente =
        document.getElementById("pesquisaChamadosCliente");

    if (pesquisaCliente) {

        pesquisaCliente.addEventListener(
            "input",
            renderizarChamadosCliente
        );

    }


    const filtroStatusCliente =
        document.getElementById("filtroStatusCliente");

    if (filtroStatusCliente) {

        filtroStatusCliente.addEventListener(
            "change",
            renderizarChamadosCliente
        );

    }


    const filtroPrioridadeCliente =
        document.getElementById("filtroPrioridadeCliente");

    if (filtroPrioridadeCliente) {

        filtroPrioridadeCliente.addEventListener(
            "change",
            renderizarChamadosCliente
        );

    }


    /* MENU ADMINISTRATIVO */

    document.querySelectorAll(".menu-link").forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(".menu-link")
                        .forEach(function (item) {

                            item.classList.remove("ativo");

                        });

                    this.classList.add("ativo");

                }
            );

        }
    );

}


/* =========================================================
   TELA INICIAL
========================================================= */

function abrirAreaCliente() {

    const telaEscolha =
        document.getElementById("telaEscolha");

    const areaCliente =
        document.getElementById("areaCliente");

    const sistema =
        document.getElementById("sistema");

    if (telaEscolha)
        telaEscolha.style.display = "none";

    if (sistema)
        sistema.style.display = "none";

    if (areaCliente)
        areaCliente.style.display = "block";


    if (clienteLogado) {

        mostrarPainelCliente();

    } else {

        mostrarLoginCliente();

    }

}


function abrirAreaAdministrativa() {

    const telaEscolha =
        document.getElementById("telaEscolha");

    const areaCliente =
        document.getElementById("areaCliente");

    const sistema =
        document.getElementById("sistema");

    if (telaEscolha)
        telaEscolha.style.display = "none";

    if (areaCliente)
        areaCliente.style.display = "none";

    if (sistema)
        sistema.style.display = "block";


    atualizarTudo();

}


function voltarTelaEscolha() {

    const telaEscolha =
        document.getElementById("telaEscolha");

    const areaCliente =
        document.getElementById("areaCliente");

    const sistema =
        document.getElementById("sistema");

    if (telaEscolha)
        telaEscolha.style.display = "flex";

    if (areaCliente)
        areaCliente.style.display = "none";

    if (sistema)
        sistema.style.display = "none";

}


/* =========================================================
   LOGIN CLIENTE
========================================================= */

function fazerLoginCliente(event) {

    event.preventDefault();

    const nome =
        document
            .getElementById("loginClienteNome")
            .value
            .trim();

    const email =
        document
            .getElementById("loginClienteEmail")
            .value
            .trim()
            .toLowerCase();


    const mensagem =
        document.getElementById(
            "mensagemLoginCliente"
        );


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
        JSON.stringify(clienteLogado)
    );


    adicionarHistoricoGeral(
        "Login do cliente",
        `${nome} acessou a Área do Cliente.`
    );


    mostrarMensagemLogin(
        "Login realizado com sucesso!",
        "sucesso"
    );


    setTimeout(function () {

        mostrarPainelCliente();

    }, 500);

}


function mostrarMensagemLogin(texto, tipo) {

    const mensagem =
        document.getElementById(
            "mensagemLoginCliente"
        );

    if (!mensagem)
        return;


    mensagem.textContent = texto;

    mensagem.className =
        "mensagem-login-cliente " + tipo;

}


function mostrarLoginCliente() {

    const login =
        document.getElementById("loginCliente");

    const painel =
        document.getElementById("painelCliente");


    if (login)
        login.style.display = "block";

    if (painel)
        painel.style.display = "none";

}


function mostrarPainelCliente() {

    const login =
        document.getElementById("loginCliente");

    const painel =
        document.getElementById("painelCliente");


    if (login)
        login.style.display = "none";

    if (painel)
        painel.style.display = "flex";


    preencherDadosCliente();

    atualizarDashboardCliente();

    renderizarChamadosCliente();

    renderizarNotificacoesCliente();

    renderizarHistoricoCliente();

}


/* =========================================================
   CLIENTE LOGADO
========================================================= */

function verificarClienteLogado() {

    if (!clienteLogado)
        return;


    preencherDadosCliente();

}


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


function preencherDadosFormularioCliente() {

    if (!clienteLogado)
        return;


    const nome =
        document.getElementById("clienteNome");

    const email =
        document.getElementById("clienteEmail");


    if (nome)
        nome.value = clienteLogado.nome;

    if (email)
        email.value = clienteLogado.email;

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
        document.getElementById("areaCliente");

    if (areaCliente)
        areaCliente.style.display = "none";


    voltarTelaEscolha();

}


/* =========================================================
   NAVEGAÇÃO CLIENTE
========================================================= */

function mostrarTelaCliente(id, botao) {

    document
        .querySelectorAll(".cliente-tela")
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
        .querySelectorAll(".cliente-menu-link")
        .forEach(function (item) {

            item.classList.remove("ativo");

        });


    if (botao)
        botao.classList.add("ativo");


    if (id === "clienteDashboard") {

        atualizarDashboardCliente();

    }


    if (id === "meusChamadosCliente") {

        renderizarChamadosCliente();

    }


    if (id === "notificacoesCliente") {

        renderizarNotificacoesCliente();

    }


    if (id === "historicoCliente") {

        renderizarHistoricoCliente();

    }


    if (id === "perfilCliente") {

        preencherDadosCliente();

    }

}


function mostrarTelaClientePorId(id) {

    const botoes =
        document.querySelectorAll(
            ".cliente-menu-link"
        );


    let botaoEncontrado = null;


    botoes.forEach(function (botao) {

        const onclick =
            botao.getAttribute("onclick") || "";

        if (onclick.includes(id)) {

            botaoEncontrado = botao;

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

function cadastrarChamadoCliente(event) {

    event.preventDefault();


    if (!clienteLogado) {

        alert(
            "Faça login para abrir um chamado."
        );

        return;

    }


    const nome =
        document.getElementById(
            "clienteNome"
        ).value.trim();


    const email =
        document.getElementById(
            "clienteEmail"
        ).value.trim();


    const telefone =
        document.getElementById(
            "clienteTelefone"
        ).value.trim();


    const categoria =
        document.getElementById(
            "clienteCategoria"
        ).value;


    const assunto =
        document.getElementById(
            "clienteAssunto"
        ).value.trim();


    const prioridade =
        document.getElementById(
            "clientePrioridade"
        ).value;


    const descricao =
        document.getElementById(
            "clienteDescricao"
        ).value.trim();


    const novoChamado = criarChamadoBase({

        cliente: nome,

        email: email,

        telefone: telefone,

        categoria: categoria,

        assunto: assunto,

        prioridade: prioridade,

        descricao: descricao,

        atendente: "",

        origem: "Cliente"

    });


    chamados.push(novoChamado);


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

}


/* =========================================================
   CRIAR CHAMADO BASE
========================================================= */

function criarChamadoBase(dados) {

    const agora =
        new Date();


    return {

        id:
            gerarIdChamado(),

        cliente:
            dados.cliente || "",

        email:
            dados.email || "",

        telefone:
            dados.telefone || "",

        categoria:
            dados.categoria || "Outro",

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
            dados.origem || "Administrativo",

        criadoEm:
            agora.toISOString(),

        atualizadoEm:
            agora.toISOString(),

        historico: [

            {

                data:
                    agora.toISOString(),

                acao:
                    "Chamado criado",

                descricao:
                    "Chamado cadastrado no sistema."

            }

        ]

    };

}


function gerarIdChamado() {

    if (chamados.length === 0)
        return 1;


    return Math.max(
        ...chamados.map(function (chamado) {

            return Number(chamado.id) || 0;

        })
    ) + 1;

}


/* =========================================================
   CADASTRAR CHAMADO ADMINISTRATIVO
========================================================= */

function cadastrarChamadoAdmin(event) {

    event.preventDefault();


    const cliente =
        document
            .getElementById("cliente")
            .value
            .trim();


    const email =
        document
            .getElementById("email")
            .value
            .trim();


    const assunto =
        document
            .getElementById("assunto")
            .value
            .trim();


    const prioridade =
        document
            .getElementById("prioridade")
            .value;


    const atendente =
        document
            .getElementById("atendente")
            .value;


    const descricao =
        document
            .getElementById("descricao")
            .value
            .trim();


    const novoChamado =
        criarChamadoBase({

            cliente: cliente,

            email: email,

            assunto: assunto,

            prioridade: prioridade,

            atendente: atendente,

            descricao: descricao,

            origem: "Administrativo"

        });


    chamados.push(novoChamado);


    salvarDados();


    adicionarNotificacao(

        "Novo chamado cadastrado",

        `O chamado #${novoChamado.id} foi cadastrado para ${cliente}.`

    );


    adicionarHistoricoGeral(

        "Chamado criado",

        `Chamado #${novoChamado.id} cadastrado para ${cliente}.`

    );


    event.target.reset();


    atualizarTudo();


    alert(
        `Chamado #${novoChamado.id} cadastrado com sucesso!`
    );

}


/* =========================================================
   DASHBOARD
========================================================= */

function atualizarDashboard() {

    const total =
        chamados.length;


    const abertos =
        chamados.filter(function (c) {

            return c.status === "Aberto";

        }).length;


    const andamento =
        chamados.filter(function (c) {

            return c.status === "Em andamento";

        }).length;


    const resolvidos =
        chamados.filter(function (c) {

            return c.status === "Resolvido";

        }).length;


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
        "chamadosResolvidos",
        resolvidos
    );


    const taxa =
        total > 0
            ? Math.round(
                (resolvidos / total) * 100
            )
            : 0;


    definirTexto(
        "taxaResolucao",
        taxa + "%"
    );


    const alta =
        chamados.filter(function (c) {

            return c.prioridade === "Alta";

        }).length;


    const media =
        chamados.filter(function (c) {

            return c.prioridade === "Média";

        }).length;


    const baixa =
        chamados.filter(function (c) {

            return c.prioridade === "Baixa";

        }).length;


    definirTexto(
        "prioridadeAlta",
        alta
    );


    definirTexto(
        "prioridadeMedia",
        media
    );


    definirTexto(
        "prioridadeBaixa",
        baixa
    );


    atualizarRelatorio();

}


/* =========================================================
   DASHBOARD CLIENTE
========================================================= */

function atualizarDashboardCliente() {

    if (!clienteLogado)
        return;


    const meusChamados =
        obterChamadosCliente();


    const total =
        meusChamados.length;


    const abertos =
        meusChamados.filter(function (c) {

            return c.status === "Aberto";

        }).length;


    const andamento =
        meusChamados.filter(function (c) {

            return c.status === "Em andamento";

        }).length;


    const resolvidos =
        meusChamados.filter(function (c) {

            return c.status === "Resolvido";

        }).length;


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
        "clienteChamadosResolvidos",
        resolvidos
    );


    renderizarChamadosRecentesCliente();

}


/* =========================================================
   CHAMADOS DO CLIENTE
========================================================= */

function obterChamadosCliente() {

    if (!clienteLogado)
        return [];


    return chamados.filter(function (chamado) {

        return (

            String(chamado.email)
                .toLowerCase()
                ===
            String(clienteLogado.email)
                .toLowerCase()

        );

    });

}


/* =========================================================
   LISTA DE CHAMADOS CLIENTE
========================================================= */

function renderizarChamadosCliente() {

    const container =
        document.getElementById(
            "listaMeusChamados"
        );


    if (!container)
        return;


    let lista =
        obterChamadosCliente();


    const pesquisa =
        document
            .getElementById(
                "pesquisaChamadosCliente"
            );


    const filtroStatus =
        document
            .getElementById(
                "filtroStatusCliente"
            );


    const filtroPrioridade =
        document
            .getElementById(
                "filtroPrioridadeCliente"
            );


    const termo =
        pesquisa
            ? pesquisa.value
                .toLowerCase()
                .trim()
            : "";


    const status =
        filtroStatus
            ? filtroStatus.value
            : "Todos";


    const prioridade =
        filtroPrioridade
            ? filtroPrioridade.value
            : "Todas";


    lista =
        lista.filter(function (chamado) {

            const correspondePesquisa =

                !termo ||

                String(chamado.id)
                    .includes(termo) ||

                chamado.assunto
                    .toLowerCase()
                    .includes(termo) ||

                chamado.descricao
                    .toLowerCase()
                    .includes(termo);


            const correspondeStatus =

                status === "Todos" ||

                chamado.status === status;


            const correspondePrioridade =

                prioridade === "Todas" ||

                chamado.prioridade === prioridade;


            return (

                correspondePesquisa &&

                correspondeStatus &&

                correspondePrioridade

            );

        });


    lista.sort(
        ordenarPorDataDesc
    );


    if (lista.length === 0) {

        container.innerHTML = `

            <div class="cliente-sem-chamados">

                <span>📭</span>

                <h3>Nenhum chamado encontrado</h3>

                <p>
                    Seus chamados aparecerão aqui depois
                    que você enviar uma solicitação.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        lista
            .map(
                criarCardChamadoCliente
            )
            .join("");

}


/* =========================================================
   CARD CHAMADO CLIENTE
========================================================= */

function criarCardChamadoCliente(chamado) {

    return `

        <div class="cliente-chamado-card">

            <div class="cliente-chamado-cabecalho">

                <div>

                    <span class="cliente-chamado-id">
                        #${chamado.id}
                    </span>

                    <h3>
                        ${escapeHTML(chamado.assunto)}
                    </h3>

                </div>

                <span class="status-badge ${classeStatus(chamado.status)}">
                    ${iconeStatus(chamado.status)}
                    ${escapeHTML(chamado.status)}
                </span>

            </div>


            <div class="cliente-chamado-info">

                <span>
                    📁 ${escapeHTML(chamado.categoria || "Outro")}
                </span>

                <span>
                    ${iconePrioridade(chamado.prioridade)}
                    ${escapeHTML(chamado.prioridade)}
                </span>

                <span>
                    📅 ${formatarData(chamado.criadoEm)}
                </span>

            </div>


            <p class="cliente-chamado-descricao">

                ${escapeHTML(
                    limitarTexto(
                        chamado.descricao,
                        180
                    )
                )}

            </p>


            <div class="cliente-chamado-rodape">

                <span>
                    🎧 ${
                        chamado.atendente
                            ? escapeHTML(chamado.atendente)
                            : "Aguardando atendente"
                    }
                </span>


                <button
                    type="button"
                    onclick="verDetalhesCliente(${chamado.id})"
                >
                    👁️ Ver detalhes
                </button>

            </div>

        </div>

    `;

}


/* =========================================================
   CHAMADOS RECENTES CLIENTE
========================================================= */

function renderizarChamadosRecentesCliente() {

    const container =
        document.getElementById(
            "clienteChamadosRecentes"
        );


    if (!container)
        return;


    const lista =
        obterChamadosCliente()
            .sort(ordenarPorDataDesc)
            .slice(0, 5);


    if (lista.length === 0) {

        container.innerHTML = `

            <div class="cliente-sem-chamados">

                <span>📭</span>

                <h3>Nenhum chamado encontrado</h3>

                <p>
                    Seus chamados recentes aparecerão aqui.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        lista
            .map(
                criarCardChamadoCliente
            )
            .join("");

}


/* =========================================================
   CHAMADOS ADMINISTRATIVO
========================================================= */

function renderizarChamados() {

    const container =
        document.getElementById(
            "listaChamados"
        );


    if (!container)
        return;


    let lista =
        [...chamados];


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


    const termo =
        pesquisa
            ? pesquisa.value
                .toLowerCase()
                .trim()
            : "";


    const status =
        filtroStatus
            ? filtroStatus.value
            : "Todos";


    const prioridade =
        filtroPrioridade
            ? filtroPrioridade.value
            : "Todas";


    lista =
        lista.filter(function (chamado) {

            const correspondePesquisa =

                !termo ||

                String(chamado.id)
                    .includes(termo) ||

                chamado.cliente
                    .toLowerCase()
                    .includes(termo) ||

                chamado.email
                    .toLowerCase()
                    .includes(termo) ||

                chamado.assunto
                    .toLowerCase()
                    .includes(termo);


            const correspondeStatus =

                status === "Todos" ||

                chamado.status === status;


            const correspondePrioridade =

                prioridade === "Todas" ||

                chamado.prioridade === prioridade;


            return (

                correspondePesquisa &&

                correspondeStatus &&

                correspondePrioridade

            );

        });


    lista.sort(
        ordenarPorDataDesc
    );


    if (lista.length === 0) {

        container.innerHTML = `

            <div class="sem-chamados">

                <h3>Nenhum chamado encontrado</h3>

                <p>
                    Cadastre um novo chamado para começar.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        lista
            .map(
                criarCardChamadoAdmin
            )
            .join("");

}


/* =========================================================
   CARD CHAMADO ADMIN
========================================================= */

function criarCardChamadoAdmin(chamado) {

    return `

        <article class="chamado-card">

            <div class="chamado-card-topo">

                <div>

                    <span class="chamado-id">
                        #${chamado.id}
                    </span>

                    <h3>
                        ${escapeHTML(chamado.assunto)}
                    </h3>

                </div>


                <span class="status-badge ${classeStatus(chamado.status)}">

                    ${iconeStatus(chamado.status)}

                    ${escapeHTML(chamado.status)}

                </span>

            </div>


            <div class="chamado-card-info">

                <p>
                    👤
                    <strong>Cliente:</strong>
                    ${escapeHTML(chamado.cliente)}
                </p>

                <p>
                    ✉️
                    <strong>E-mail:</strong>
                    ${escapeHTML(chamado.email)}
                </p>

                <p>
                    ${iconePrioridade(chamado.prioridade)}
                    <strong>Prioridade:</strong>
                    ${escapeHTML(chamado.prioridade)}
                </p>

                <p>
                    🎧
                    <strong>Atendente:</strong>
                    ${
                        chamado.atendente
                            ? escapeHTML(chamado.atendente)
                            : "Não atribuído"
                    }
                </p>

                <p>
                    📅
                    <strong>Criado:</strong>
                    ${formatarData(chamado.criadoEm)}
                </p>

            </div>


            <div class="chamado-card-descricao">

                ${escapeHTML(chamado.descricao)}

            </div>


            <div class="chamado-card-acoes">

                <button
                    type="button"
                    onclick="abrirDetalhes(${chamado.id})"
                >
                    👁️ Detalhes
                </button>


                <button
                    type="button"
                    onclick="abrirEdicao(${chamado.id})"
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

        </article>

    `;

}


/* =========================================================
   DETALHES DO CHAMADO
========================================================= */

function abrirDetalhes(id) {

    const chamado =
        encontrarChamado(id);


    if (!chamado)
        return;


    chamadoSelecionado =
        chamado.id;


    const modal =
        document.getElementById(
            "modalDetalhes"
        );


    const conteudo =
        document.getElementById(
            "conteudoDetalhes"
        );


    if (!modal || !conteudo)
        return;


    conteudo.innerHTML = `

        <div class="detalhes-chamado">

            <p>
                <strong>ID:</strong>
                #${chamado.id}
            </p>

            <p>
                <strong>Cliente:</strong>
                ${escapeHTML(chamado.cliente)}
            </p>

            <p>
                <strong>E-mail:</strong>
                ${escapeHTML(chamado.email)}
            </p>

            ${
                chamado.telefone
                    ? `
                    <p>
                        <strong>Telefone:</strong>
                        ${escapeHTML(chamado.telefone)}
                    </p>
                    `
                    : ""
            }

            <p>
                <strong>Categoria:</strong>
                ${escapeHTML(chamado.categoria || "Outro")}
            </p>

            <p>
                <strong>Assunto:</strong>
                ${escapeHTML(chamado.assunto)}
            </p>

            <p>
                <strong>Prioridade:</strong>
                ${iconePrioridade(chamado.prioridade)}
                ${escapeHTML(chamado.prioridade)}
            </p>

            <p>
                <strong>Status:</strong>
                ${iconeStatus(chamado.status)}
                ${escapeHTML(chamado.status)}
            </p>

            <p>
                <strong>Atendente:</strong>
                ${
                    chamado.atendente
                        ? escapeHTML(chamado.atendente)
                        : "Não atribuído"
                }
            </p>

            <p>
                <strong>Descrição:</strong>
            </p>

            <div class="descricao-detalhes">
                ${escapeHTML(chamado.descricao)}
            </div>

            <p>
                <strong>Criado em:</strong>
                ${formatarData(chamado.criadoEm)}
            </p>

        </div>

    `;


    renderizarHistoricoChamado(
        chamado
    );


    modal.style.display = "flex";

}


function fecharDetalhes() {

    const modal =
        document.getElementById(
            "modalDetalhes"
        );


    if (modal)
        modal.style.display = "none";


    chamadoSelecionado = null;


    const campo =
        document.getElementById(
            "novoHistorico"
        );


    if (campo)
        campo.value = "";

}


/* =========================================================
   DETALHES PARA CLIENTE
========================================================= */

function verDetalhesCliente(id) {

    const chamado =
        encontrarChamado(id);


    if (!chamado)
        return;


    const modal =
        document.getElementById(
            "modalDetalhes"
        );


    const conteudo =
        document.getElementById(
            "conteudoDetalhes"
        );


    if (!modal || !conteudo)
        return;


    chamadoSelecionado =
        chamado.id;


    conteudo.innerHTML = `

        <div class="detalhes-chamado">

            <p>
                <strong>Chamado:</strong>
                #${chamado.id}
            </p>

            <p>
                <strong>Assunto:</strong>
                ${escapeHTML(chamado.assunto)}
            </p>

            <p>
                <strong>Status:</strong>
                ${iconeStatus(chamado.status)}
                ${escapeHTML(chamado.status)}
            </p>

            <p>
                <strong>Prioridade:</strong>
                ${iconePrioridade(chamado.prioridade)}
                ${escapeHTML(chamado.prioridade)}
            </p>

            <p>
                <strong>Categoria:</strong>
                ${escapeHTML(chamado.categoria || "Outro")}
            </p>

            <p>
                <strong>Atendente:</strong>
                ${
                    chamado.atendente
                        ? escapeHTML(chamado.atendente)
                        : "Aguardando atendimento"
                }
            </p>

            <p>
                <strong>Descrição:</strong>
            </p>

            <div class="descricao-detalhes">
                ${escapeHTML(chamado.descricao)}
            </div>

            <p>
                <strong>Data:</strong>
                ${formatarData(chamado.criadoEm)}
            </p>

        </div>

    `;


    renderizarHistoricoChamado(
        chamado
    );


    /* Esconder campo de atualização para cliente */

    const campo =
        document.getElementById(
            "novoHistorico"
        );


    const label =
        document.querySelector(
            'label[for="novoHistorico"]'
        );


    const botao =
        document.querySelector(
            '#modalDetalhes button[onclick="adicionarHistorico()"]'
        );


    if (campo)
        campo.style.display = "none";

    if (label)
        label.style.display = "none";

    if (botao)
        botao.style.display = "none";


    modal.style.display = "flex";

}


/* =========================================================
   HISTÓRICO DO CHAMADO
========================================================= */

function renderizarHistoricoChamado(chamado) {

    const container =
        document.getElementById(
            "historicoChamado"
        );


    if (!container)
        return;


    const historico =
        chamado.historico || [];


    if (historico.length === 0) {

        container.innerHTML = `

            <p>
                Nenhum atendimento registrado.
            </p>

        `;

        return;

    }


    container.innerHTML =
        historico
            .slice()
            .reverse()
            .map(function (item) {

                return `

                    <div class="historico-item">

                        <strong>
                            ${escapeHTML(item.acao || "Atualização")}
                        </strong>

                        <p>
                            ${escapeHTML(item.descricao || "")}
                        </p>

                        <small>
                            ${formatarData(item.data)}
                        </small>

                    </div>

                `;

            })
            .join("");

}


/* =========================================================
   ADICIONAR HISTÓRICO
========================================================= */

function adicionarHistorico() {

    if (!chamadoSelecionado)
        return;


    const chamado =
        encontrarChamado(
            chamadoSelecionado
        );


    if (!chamado)
        return;


    const campo =
        document.getElementById(
            "novoHistorico"
        );


    if (!campo)
        return;


    const texto =
        campo.value.trim();


    if (!texto) {

        alert(
            "Digite uma atualização."
        );

        return;

    }


    if (!chamado.historico)
        chamado.historico = [];


    chamado.historico.push({

        data:
            new Date().toISOString(),

        acao:
            "Atualização de atendimento",

        descricao:
            texto

    });


    chamado.atualizadoEm =
        new Date().toISOString();


    adicionarHistoricoGeral(

        "Atualização de chamado",

        `O chamado #${chamado.id} recebeu uma nova atualização.`

    );


    adicionarNotificacao(

        "Chamado atualizado",

        `O chamado #${chamado.id} recebeu uma atualização.`

    );


    salvarDados();


    campo.value = "";


    renderizarHistoricoChamado(
        chamado
    );


    atualizarTudo();

}


/* =========================================================
   EDITAR CHAMADO
========================================================= */

function abrirEdicao(id) {

    const chamado =
        encontrarChamado(id);


    if (!chamado)
        return;


    chamadoEditando =
        chamado.id;


    preencherSelectAtendentes(
        "editarAtendente"
    );


    document.getElementById(
        "editarCliente"
    ).value = chamado.cliente;


    document.getElementById(
        "editarEmail"
    ).value = chamado.email;


    document.getElementById(
        "editarAssunto"
    ).value = chamado.assunto;


    document.getElementById(
        "editarDescricao"
    ).value = chamado.descricao;


    document.getElementById(
        "editarPrioridade"
    ).value = chamado.prioridade;


    document.getElementById(
        "editarStatus"
    ).value = chamado.status;


    document.getElementById(
        "editarAtendente"
    ).value = chamado.atendente || "";


    const modal =
        document.getElementById(
            "modalEditar"
        );


    if (modal)
        modal.style.display = "flex";

}


function salvarEdicao(event) {

    event.preventDefault();


    if (!chamadoEditando)
        return;


    const chamado =
        encontrarChamado(
            chamadoEditando
        );


    if (!chamado)
        return;


    const statusAnterior =
        chamado.status;


    chamado.cliente =
        document.getElementById(
            "editarCliente"
        ).value.trim();


    chamado.email =
        document.getElementById(
            "editarEmail"
        ).value.trim();


    chamado.assunto =
        document.getElementById(
            "editarAssunto"
        ).value.trim();


    chamado.descricao =
        document.getElementById(
            "editarDescricao"
        ).value.trim();


    chamado.prioridade =
        document.getElementById(
            "editarPrioridade"
        ).value;


    chamado.status =
        document.getElementById(
            "editarStatus"
        ).value;


    chamado.atendente =
        document.getElementById(
            "editarAtendente"
        ).value;


    chamado.atualizadoEm =
        new Date().toISOString();


    if (!chamado.historico)
        chamado.historico = [];


    chamado.historico.push({

        data:
            new Date().toISOString(),

        acao:
            "Chamado editado",

        descricao:
            "As informações do chamado foram alteradas."

    });


    if (
        statusAnterior !==
        chamado.status
    ) {

        chamado.historico.push({

            data:
                new Date().toISOString(),

            acao:
                "Status alterado",

            descricao:
                `Status alterado de "${statusAnterior}" para "${chamado.status}".`

        });


        adicionarNotificacao(

            "Status atualizado",

            `O chamado #${chamado.id} agora está "${chamado.status}".`

        );

    }


    adicionarHistoricoGeral(

        "Chamado editado",

        `O chamado #${chamado.id} foi atualizado.`

    );


    salvarDados();


    fecharEdicao();


    atualizarTudo();


    alert(
        "Chamado atualizado com sucesso!"
    );

}


function fecharEdicao() {

    const modal =
        document.getElementById(
            "modalEditar"
        );


    if (modal)
        modal.style.display = "none";


    chamadoEditando = null;

}


/* =========================================================
   EXCLUIR CHAMADO
========================================================= */

function excluirChamado(id) {

    const chamado =
        encontrarChamado(id);


    if (!chamado)
        return;


    const confirmar =
        confirm(
            `Deseja realmente excluir o chamado #${id}?`
        );


    if (!confirmar)
        return;


    chamados =
        chamados.filter(function (item) {

            return Number(item.id) !==
                Number(id);

        });


    adicionarHistoricoGeral(

        "Chamado excluído",

        `O chamado #${id} de ${chamado.cliente} foi excluído.`

    );


    adicionarNotificacao(

        "Chamado excluído",

        `O chamado #${id} foi removido do sistema.`

    );


    salvarDados();


    atualizarTudo();

}


/* =========================================================
   ATENDENTES
========================================================= */

function abrirNovoAtendente() {

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
        modal.style.display = "flex";

}


function salvarAtendente(event) {

    event.preventDefault();


    const nome =
        document.getElementById(
            "nomeAtendente"
        ).value.trim();


    const email =
        document.getElementById(
            "emailAtendente"
        ).value.trim();


    const funcao =
        document.getElementById(
            "funcaoAtendente"
        ).value;


    if (!nome || !email)
        return;


    const novoAtendente = {

        id:
            gerarIdAtendente(),

        nome:
            nome,

        email:
            email,

        funcao:
            funcao,

        criadoEm:
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


    fecharAtendente();


    atualizarTudo();


    alert(
        "Atendente cadastrado com sucesso!"
    );

}


function fecharAtendente() {

    const modal =
        document.getElementById(
            "modalAtendente"
        );


    if (modal)
        modal.style.display = "none";

}


function gerarIdAtendente() {

    if (atendentes.length === 0)
        return 1;


    return Math.max(
        ...atendentes.map(function (item) {

            return Number(item.id) || 0;

        })
    ) + 1;

}


function renderizarAtendentes() {

    const container =
        document.getElementById(
            "listaAtendentes"
        );


    if (!container)
        return;


    if (atendentes.length === 0) {

        container.innerHTML = `

            <div class="sem-atendentes">

                <h3>
                    Nenhum atendente cadastrado
                </h3>

                <p>
                    Cadastre um atendente para começar.
                </p>

            </div>

        `;

        preencherSelectAtendentes(
            "atendente"
        );

        preencherSelectAtendentes(
            "editarAtendente"
        );

        return;

    }


    container.innerHTML =
        atendentes
            .map(function (atendente) {

                return `

                    <div class="atendente-card">

                        <div class="atendente-avatar">
                            👤
                        </div>

                        <div class="atendente-info">

                            <h3>
                                ${escapeHTML(atendente.nome)}
                            </h3>

                            <p>
                                ✉️ ${escapeHTML(atendente.email)}
                            </p>

                            <span>
                                ${escapeHTML(atendente.funcao)}
                            </span>

                        </div>

                        <button
                            type="button"
                            onclick="excluirAtendente(${atendente.id})"
                        >
                            🗑️
                        </button>

                    </div>

                `;

            })
            .join("");


    preencherSelectAtendentes(
        "atendente"
    );


    preencherSelectAtendentes(
        "editarAtendente"
    );

}


function preencherSelectAtendentes(id) {

    const select =
        document.getElementById(id);


    if (!select)
        return;


    const valorAtual =
        select.value;


    let primeiraOpcao;


    if (id === "editarAtendente") {

        primeiraOpcao =
            `<option value="">Sem atendente</option>`;

    } else {

        primeiraOpcao =
            `<option value="">Selecione um atendente</option>`;

    }


    select.innerHTML =
        primeiraOpcao;


    atendentes.forEach(function (atendente) {

        const option =
            document.createElement("option");


        option.value =
            atendente.nome;


        option.textContent =
            `${atendente.nome} — ${atendente.funcao}`;


        select.appendChild(option);

    });


    select.value = valorAtual;

}


function excluirAtendente(id) {

    const atendente =
        atendentes.find(function (item) {

            return Number(item.id) ===
                Number(id);

        });


    if (!atendente)
        return;


    const confirmar =
        confirm(
            `Deseja excluir o atendente ${atendente.nome}?`
        );


    if (!confirmar)
        return;


    atendentes =
        atendentes.filter(function (item) {

            return Number(item.id) !==
                Number(id);

        });


    /* Remover atendente dos chamados */

    chamados.forEach(function (chamado) {

        if (
            chamado.atendente ===
            atendente.nome
        ) {

            chamado.atendente = "";

        }

    });


    adicionarHistoricoGeral(

        "Atendente excluído",

        `${atendente.nome} foi removido do sistema.`

    );


    salvarDados();


    atualizarTudo();

}


/* =========================================================
   SLA
========================================================= */

function atualizarSLA() {

    const agora =
        Date.now();


    let dentro = 0;

    let atencao = 0;

    let atrasados = 0;


    chamados
        .filter(function (chamado) {

            return chamado.status !== "Resolvido";

        })
        .forEach(function (chamado) {

            const criado =
                new Date(
                    chamado.criadoEm
                ).getTime();


            const horas =
                (
                    agora - criado
                ) / (
                    1000 * 60 * 60
                );


            /*

               SLA definido de forma
               simples para o projeto:

               até 24h = dentro
               24h até 48h = atenção
               acima de 48h = atrasado

            */


            if (horas <= 24) {

                dentro++;

            } else if (horas <= 48) {

                atencao++;

            } else {

                atrasados++;

            }

        });


    definirTexto(
        "slaDentro",
        dentro
    );


    definirTexto(
        "slaAtencao",
        atencao
    );


    definirTexto(
        "slaAtrasados",
        atrasados
    );

}


/* =========================================================
   NOTIFICAÇÕES
========================================================= */

function adicionarNotificacao(
    titulo,
    mensagem
) {

    notificacoes.unshift({

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

    });


    notificacoes =
        notificacoes.slice(0, 100);


    salvarDados();


    renderizarNotificacoes();

    renderizarNotificacoesCliente();

}


function renderizarNotificacoes() {

    const container =
        document.getElementById(
            "listaNotificacoes"
        );


    if (!container)
        return;


    if (notificacoes.length === 0) {

        container.innerHTML = `

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


    container.innerHTML =
        notificacoes
            .map(function (notificacao) {

                return `

                    <div class="notificacao-item ${
                        notificacao.lida
                            ? "lida"
                            : "nova"
                    }">

                        <div>

                            <strong>
                                🔔
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

                    </div>

                `;

            })
            .join("");

}


function renderizarNotificacoesCliente() {

    const container =
        document.getElementById(
            "listaNotificacoesCliente"
        );


    if (!container)
        return;


    if (!clienteLogado) {

        container.innerHTML = `

            <div class="cliente-sem-chamados">

                <span>🔔</span>

                <h3>Nenhuma notificação</h3>

                <p>
                    Faça login para acompanhar suas notificações.
                </p>

            </div>

        `;

        return;

    }


    const meusIds =
        obterChamadosCliente()
            .map(function (c) {

                return String(c.id);

            });


    const minhasNotificacoes =
        notificacoes.filter(function (notificacao) {

            const texto =
                (
                    notificacao.mensagem || ""
                ).toLowerCase();


            return meusIds.some(function (id) {

                return texto.includes(
                    "#" + id
                );

            });

        });


    if (minhasNotificacoes.length === 0) {

        container.innerHTML = `

            <div class="cliente-sem-chamados">

                <span>🔔</span>

                <h3>Nenhuma notificação</h3>

                <p>
                    Você não possui novas notificações.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        minhasNotificacoes
            .map(function (notificacao) {

                return `

                    <div class="notificacao-cliente-item">

                        <strong>
                            🔔
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

                `;

            })
            .join("");

}


function limparNotificacoes() {

    const confirmar =
        confirm(
            "Deseja limpar todas as notificações?"
        );


    if (!confirmar)
        return;


    notificacoes = [];


    salvarDados();


    renderizarNotificacoes();

    renderizarNotificacoesCliente();

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

        acao:
            acao,

        descricao:
            descricao,

        data:
            new Date().toISOString()

    });


    historicoGeral =
        historicoGeral.slice(0, 200);


    salvarDados();


    renderizarHistoricoGeral();

}


function renderizarHistoricoGeral() {

    const container =
        document.getElementById(
            "listaHistoricoGeral"
        );


    if (!container)
        return;


    if (historicoGeral.length === 0) {

        container.innerHTML = `

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


    container.innerHTML =
        historicoGeral
            .map(function (item) {

                return `

                    <div class="historico-geral-item">

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

                        </div>

                        <small>
                            ${formatarData(
                                item.data
                            )}
                        </small>

                    </div>

                `;

            })
            .join("");

}


function renderizarHistoricoCliente() {

    const container =
        document.getElementById(
            "listaHistoricoCliente"
        );


    if (!container)
        return;


    if (!clienteLogado) {

        return;

    }


    const meusChamados =
        obterChamadosCliente();


    const atividades = [];


    meusChamados.forEach(function (chamado) {

        (
            chamado.historico || []
        ).forEach(function (item) {

            atividades.push({

                data:
                    item.data,

                acao:
                    item.acao,

                descricao:
                    `Chamado #${chamado.id}: ${item.descricao}`

            });

        });

    });


    atividades.sort(function (a, b) {

        return new Date(b.data) -
            new Date(a.data);

    });


    if (atividades.length === 0) {

        container.innerHTML = `

            <div class="cliente-sem-chamados">

                <span>📜</span>

                <h3>
                    Nenhuma atividade registrada
                </h3>

                <p>
                    O histórico dos seus chamados aparecerá aqui.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        atividades
            .map(function (item) {

                return `

                    <div class="historico-cliente-item">

                        <strong>
                            ${escapeHTML(item.acao)}
                        </strong>

                        <p>
                            ${escapeHTML(item.descricao)}
                        </p>

                        <small>
                            ${formatarData(item.data)}
                        </small>

                    </div>

                `;

            })
            .join("");

}


function limparHistoricoGeral() {

    const confirmar =
        confirm(
            "Deseja realmente limpar todo o histórico?"
        );


    if (!confirmar)
        return;


    historicoGeral = [];


    salvarDados();


    renderizarHistoricoGeral();

}


/* =========================================================
   RELATÓRIO
========================================================= */

function atualizarRelatorio() {

    const total =
        chamados.length;


    const abertos =
        chamados.filter(function (c) {

            return c.status === "Aberto";

        }).length;


    const andamento =
        chamados.filter(function (c) {

            return c.status === "Em andamento";

        }).length;


    const resolvidos =
        chamados.filter(function (c) {

            return c.status === "Resolvido";

        }).length;


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


function imprimirRelatorio() {

    window.print();

}


/* =========================================================
   CHAMADOS RECENTES ADMIN
========================================================= */

function renderizarChamadosRecentes() {

    const container =
        document.getElementById(
            "chamadosRecentes"
        );


    if (!container)
        return;


    const lista =
        [...chamados]
            .sort(ordenarPorDataDesc)
            .slice(0, 5);


    if (lista.length === 0) {

        container.innerHTML = `

            <p class="sem-recentes">
                Nenhum chamado cadastrado.
            </p>

        `;

        return;

    }


    container.innerHTML =
        lista
            .map(function (chamado) {

                return `

                    <div class="chamado-recente">

                        <div>

                            <strong>
                                #${chamado.id}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    chamado.assunto
                                )}
                            </span>

                        </div>

                        <div>

                            <small>
                                ${escapeHTML(
                                    chamado.cliente
                                )}
                            </small>

                            <span class="status-badge ${classeStatus(chamado.status)}">
                                ${escapeHTML(
                                    chamado.status
                                )}
                            </span>

                        </div>

                    </div>

                `;

            })
            .join("");

}


/* =========================================================
   CONFIGURAÇÕES
========================================================= */

function carregarConfiguracoes() {

    const nomeSistema =
        document.getElementById(
            "nomeSistema"
        );


    const nomeEmpresa =
        document.getElementById(
            "nomeEmpresa"
        );


    const emailEmpresa =
        document.getElementById(
            "emailEmpresa"
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


function salvarConfiguracoes() {

    const nomeSistema =
        document
            .getElementById(
                "nomeSistema"
            )
            .value
            .trim();


    const nomeEmpresa =
        document
            .getElementById(
                "nomeEmpresa"
            )
            .value
            .trim();


    const emailEmpresa =
        document
            .getElementById(
                "emailEmpresa"
            )
            .value
            .trim();


    configuracoes = {

        nomeSistema:
            nomeSistema ||
            "Central de Atendimento",

        nomeEmpresa:
            nomeEmpresa ||
            "Sistema de Chamados",

        emailEmpresa:
            emailEmpresa

    };


    localStorage.setItem(

        "configuracoes",

        JSON.stringify(
            configuracoes
        )

    );


    aplicarConfiguracoes();


    adicionarHistoricoGeral(

        "Configurações alteradas",

        "As configurações do sistema foram atualizadas."

    );


    alert(
        "Configurações salvas com sucesso!"
    );

}


function aplicarConfiguracoes() {

    const nomeSistema =
        configuracoes.nomeSistema ||
        "Central de Atendimento";


    const nomeEmpresa =
        configuracoes.nomeEmpresa ||
        "Sistema de Chamados";


    definirTexto(
        "menuNomeSistema",
        nomeSistema
    );


    definirTexto(
        "logoNomeEmpresa",
        nomeSistema
    );


    definirTexto(
        "logoEmpresa",
        nomeEmpresa
    );


    definirTexto(
        "tituloSistema",
        "🎧 " + nomeSistema
    );


    document.title =
        nomeSistema;


}


/* =========================================================
   SALVAR DADOS
========================================================= */

function salvarDados() {

    localStorage.setItem(

        "chamados",

        JSON.stringify(
            chamados
        )

    );


    localStorage.setItem(

        "atendentes",

        JSON.stringify(
            atendentes
        )

    );


    localStorage.setItem(

        "notificacoes",

        JSON.stringify(
            notificacoes
        )

    );


    localStorage.setItem(

        "historicoGeral",

        JSON.stringify(
            historicoGeral
        )

    );

}


/* =========================================================
   ATUALIZAR TUDO
========================================================= */

function atualizarTudo() {

    atualizarDashboard();

    renderizarChamados();

    renderizarAtendentes();

    atualizarSLA();

    renderizarNotificacoes();

    renderizarHistoricoGeral();

    renderizarChamadosRecentes();

    atualizarRelatorio();

    atualizarDashboardCliente();

    renderizarChamadosCliente();

    renderizarNotificacoesCliente();

    renderizarHistoricoCliente();

}


/* =========================================================
   SAIR ADMINISTRATIVO
========================================================= */

function sairAdministrativo() {

    const confirmar =
        confirm(
            "Deseja sair da área administrativa?"
        );


    if (!confirmar)
        return;


    adicionarHistoricoGeral(

        "Logout administrativo",

        "O usuário saiu da área administrativa."

    );


    const sistema =
        document.getElementById(
            "sistema"
        );


    if (sistema)
        sistema.style.display = "none";


    voltarTelaEscolha();

}


/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */

function encontrarChamado(id) {

    return chamados.find(function (chamado) {

        return Number(chamado.id) ===
            Number(id);

    });

}


function definirTexto(id, valor) {

    const elemento =
        document.getElementById(id);


    if (elemento)
        elemento.textContent = valor;

}


function formatarData(data) {

    if (!data)
        return "—";


    const dataObj =
        new Date(data);


    if (isNaN(dataObj.getTime()))
        return "—";


    return dataObj.toLocaleString(
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


function ordenarPorDataDesc(a, b) {

    return new Date(
        b.criadoEm
    ) - new Date(
        a.criadoEm
    );

}


function classeStatus(status) {

    if (status === "Resolvido")
        return "status-resolvido";

    if (status === "Em andamento")
        return "status-andamento";

    return "status-aberto";

}


function iconeStatus(status) {

    if (status === "Resolvido")
        return "🔵";

    if (status === "Em andamento")
        return "🟡";

    return "🟢";

}


function iconePrioridade(prioridade) {

    if (prioridade === "Alta")
        return "🔴";

    if (prioridade === "Baixa")
        return "🟢";

    return "🟡";

}


function limitarTexto(texto, limite) {

    if (!texto)
        return "";


    if (texto.length <= limite)
        return texto;


    return texto.substring(
        0,
        limite
    ) + "...";

}


/* =========================================================
   SEGURANÇA HTML
========================================================= */

function escapeHTML(valor) {

    if (valor === null ||
        valor === undefined) {

        return "";

    }


    return String(valor)

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
   FECHAR MODAIS CLICANDO FORA
========================================================= */

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
            event.target ===
            modalDetalhes
        ) {

            fecharDetalhes();

        }


        if (
            event.target ===
            modalEditar
        ) {

            fecharEdicao();

        }


        if (
            event.target ===
            modalAtendente
        ) {

            fecharAtendente();

        }

    }
);


/* =========================================================
   ESC FECHA MODAIS
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Escape")
            return;


        fecharDetalhes();

        fecharEdicao();

        fecharAtendente();

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

window.mostrarTelaCliente =
    mostrarTelaCliente;

window.mostrarTelaClientePorId =
    mostrarTelaClientePorId;

window.abrirTelaNovoChamadoCliente =
    abrirTelaNovoChamadoCliente;

window.sairCliente =
    sairCliente;

window.abrirDetalhes =
    abrirDetalhes;

window.fecharDetalhes =
    fecharDetalhes;

window.adicionarHistorico =
    adicionarHistorico;

window.abrirEdicao =
    abrirEdicao;

window.fecharEdicao =
    fecharEdicao;

window.excluirChamado =
    excluirChamado;

window.abrirNovoAtendente =
    abrirNovoAtendente;

window.fecharAtendente =
    fecharAtendente;

window.excluirAtendente =
    excluirAtendente;

window.limparNotificacoes =
    limparNotificacoes;

window.limparHistoricoGeral =
    limparHistoricoGeral;

window.imprimirRelatorio =
    imprimirRelatorio;

window.verDetalhesCliente =
    verDetalhesCliente;