/* =========================================================
   CENTRAL DE ATENDIMENTO
   SCRIPT.JS COMPLETO — PARTE 1/10

   Sistema de chamados
   Login cliente + administrativo
   Dashboard
   Assistente IA
========================================================= */


/* =========================================================
   DADOS DO SISTEMA
========================================================= */
/* =========================================================
   MODO DO SISTEMA
========================================================= */

let modoSistema =
    sessionStorage.getItem("modoSistema") || "portfolio";


/* =========================================================
   EMPRESA ATUAL
========================================================= */

let empresaAtual =
    sessionStorage.getItem("empresaAtual") || "empresa_001";


let empresasCadastradas =
    JSON.parse(
        localStorage.getItem("empresasCadastradas")
    ) || {
        empresa_001: "Empresa 001",
        empresa_002: "Empresa 002"
    };


function nomeEmpresaAtual() {

    return empresasCadastradas[empresaAtual]
        || empresaAtual;
}
function salvarNomeEmpresa() {

    const campoNome =
        document.getElementById("novoNomeEmpresa");

    if (!campoNome) {
        return;
    }

    const novoNome =
        campoNome.value.trim();

    if (!novoNome) {
        alert("Digite um nome para a empresa.");
        return;
    }

    empresasCadastradas[empresaAtual] =
        novoNome;

    localStorage.setItem(
        "empresasCadastradas",
        JSON.stringify(empresasCadastradas)
    );

    const empresaAtivaTexto =
        document.getElementById("empresaAtivaTexto");

    if (empresaAtivaTexto) {
        empresaAtivaTexto.textContent =
            "Empresa ativa: " + nomeEmpresaAtual();
    }

    const campoEmpresa =
        document.getElementById("empresaComercial");

    if (campoEmpresa) {

        const opcaoSelecionada =
            campoEmpresa.querySelector(
                `option[value="${empresaAtual}"]`
            );

        if (opcaoSelecionada) {
            opcaoSelecionada.textContent =
                novoNome;
        }
    }

    campoNome.value = "";

    console.log(
        "Nome da empresa atualizado:",
        novoNome
    );
}
function chaveModo(nome) {

    if (modoSistema === "portfolio") {
        return `portfolio_${nome}`;
    }

    return `${empresaAtual}_${nome}`;
}


/* =========================================================
   TROCAR EMPRESA
========================================================= */

function selecionarEmpresa(idEmpresa) {

    if (!idEmpresa) {
        console.error("Empresa inválida.");
        return;
    }

    empresaAtual = idEmpresa;
const empresaAtivaTexto =
    document.getElementById("empresaAtivaTexto");

if (empresaAtivaTexto) {

  empresaAtivaTexto.textContent =
    "Empresa ativa: " + nomeEmpresaAtual();
}
    sessionStorage.setItem(
        "empresaAtual",
        empresaAtual
    );

    carregarDadosDoModo();

    console.log(
        "Empresa atual:",
        empresaAtual
    );
}
window.selecionarEmpresa = selecionarEmpresa;
window.chaveModo = chaveModo;
window.salvarNomeEmpresa = salvarNomeEmpresa;
/* =========================================================
   CARREGAR DADOS DO MODO ATUAL
========================================================= */

function carregarDadosDoModo() {

    chamados =
        JSON.parse(
            localStorage.getItem(
                chaveModo("chamados")
            )
        ) || [];


    atendentes =
        JSON.parse(
            localStorage.getItem(
                chaveModo("atendentes")
            )
        ) || [];


    notificacoes =
        JSON.parse(
            localStorage.getItem(
                chaveModo("notificacoes")
            )
        ) || [];


    historicoGeral =
        JSON.parse(
            localStorage.getItem(
                chaveModo("historicoGeral")
            )
        ) || [];


    configuracoes =
        JSON.parse(
            localStorage.getItem(
                chaveModo("configuracoes")
            )
        ) || {

            nomeSistema:
                "Central de Atendimento",

            nomeEmpresa:
                modoSistema === "comercial"
                    ? "Empresa"
                    : "Demonstração Portfólio",

            emailEmpresa:
                ""

        };


    console.log(
        "Dados carregados do modo:",
        modoSistema
    );
}

/* =========================================================
   DADOS DO SISTEMA
========================================================= */

let chamados =
    JSON.parse(
        localStorage.getItem(
            chaveModo("chamados")
        )
    ) || [];


let atendentes =
    JSON.parse(
        localStorage.getItem(
            chaveModo("atendentes")
        )
    ) || [];


let notificacoes =
    JSON.parse(
        localStorage.getItem(
            chaveModo("notificacoes")
        )
    ) || [];


let historicoGeral =
    JSON.parse(
        localStorage.getItem(
            chaveModo("historicoGeral")
        )
    ) || [];


let configuracoes =
    JSON.parse(
        localStorage.getItem(
            chaveModo("configuracoes")
        )
    ) || {

        nomeSistema:
            "Central de Atendimento",

        nomeEmpresa:
            modoSistema === "comercial"
                ? "Empresa"
                : "Demonstração Portfólio",

        emailEmpresa:
            ""

    };

/* =========================================================
   SESSÃO DO CLIENTE
========================================================= */

/*
   IMPORTANTE:

   O cliente pode ter uma sessão salva no
   sessionStorage.

   Porém, a página NÃO vai abrir automaticamente
   o painel do cliente.

   O usuário precisará clicar em
   "Área do Cliente".

   Depois disso:
      sem login  → mostra login
      com login  → mostra painel
*/

let clienteLogado =
    JSON.parse(
        sessionStorage.getItem(
            "clienteLogado"
        )
    ) || null;


/* =========================================================
   VARIÁVEIS GLOBAIS
========================================================= */

let chamadoSelecionado =
    null;


let atendenteSelecionado =
    null;


let historicoAssistenteIA =
    [];


/* =========================================================
   URL DO ASSISTENTE IA
========================================================= */

const URL_ASSISTENTE_IA =
    "http://localhost:3000";

/* =========================================================
   ETAPA 1 — MODO DO SISTEMA
========================================================= */

/*
 * portfolio = versão pública para demonstração/portfólio
 * comercial = versão destinada à utilização por empresas
 *
 * Nesta etapa, a separação é de acesso e identificação.
 * A separação real dos dados por empresa será feita
 * posteriormente com backend e banco de dados.
 */


/* =========================================================
   SELECIONAR MODO PORTFÓLIO / COMERCIAL
========================================================= */

function selecionarModoSistema(modo) {

    if (
        modo !== "portfolio" &&
        modo !== "comercial"
    ) {

        console.error(
            "Modo de sistema inválido."
        );

        return;
    }


    modoSistema = modo;


    sessionStorage.setItem(
        "modoSistema",
        modoSistema
    );
carregarDadosDoModo();

    const selecaoModo =
        document.getElementById(
            "selecaoModoSistema"
        );


    const selecaoAcesso =
        document.getElementById(
            "selecaoAcessoSistema"
        );


    const textoModo =
        document.getElementById(
            "textoModoSistema"
        );


    const modoSelecionado =
        document.getElementById(
            "modoSistemaSelecionado"
        );


    const descricaoCliente =
        document.getElementById(
            "descricaoAcessoCliente"
        );


    const descricaoAdmin =
        document.getElementById(
            "descricaoAcessoAdmin"
        );
const selecaoEmpresa =
    document.getElementById("selecaoEmpresaComercial");

const campoEmpresa =
    document.getElementById("empresaComercial");

    if (selecaoModo)
        selecaoModo.style.display = "none";


    if (selecaoAcesso)
        selecaoAcesso.style.display = "flex";


    if (modo === "portfolio") {
if (selecaoEmpresa) {
    selecaoEmpresa.style.display = "none";
}
        if (textoModo) {

            textoModo.textContent =
                "Demonstração do sistema para portfólio.";
        }


        if (modoSelecionado) {

            modoSelecionado.innerHTML =
                "🟢 <strong>Modo Portfólio</strong> — Demonstração";
        }


        if (descricaoCliente) {

            descricaoCliente.textContent =
                "Acesse a demonstração da área do cliente";
        }


        if (descricaoAdmin) {

            descricaoAdmin.textContent =
                "Acesse a demonstração da área administrativa";
        }

        return;
    }
if (selecaoEmpresa) {
    selecaoEmpresa.style.display = "block";
}

if (campoEmpresa) {
    campoEmpresa.value = empresaAtual;
}

selecionarEmpresa(empresaAtual);

    if (textoModo) {

        textoModo.textContent =
            "Acesso ao sistema para utilização comercial.";
    }


    if (modoSelecionado) {

        modoSelecionado.innerHTML =
            "🔵 <strong>Modo Comercial</strong> — Sistema para empresas";
    }


    if (descricaoCliente) {

        descricaoCliente.textContent =
            "Acesse a área do cliente da empresa";
    }


    if (descricaoAdmin) {

        descricaoAdmin.textContent =
            "Acesse a área administrativa da empresa";
    }
}


/* =========================================================
   VOLTAR PARA ESCOLHA DO MODO
========================================================= */

function voltarSelecaoModo() {

    const selecaoModo =
        document.getElementById(
            "selecaoModoSistema"
        );


    const selecaoAcesso =
        document.getElementById(
            "selecaoAcessoSistema"
        );


    const textoModo =
        document.getElementById(
            "textoModoSistema"
        );


    if (selecaoAcesso)
        selecaoAcesso.style.display = "none";


    if (selecaoModo)
        selecaoModo.style.display = "flex";


    if (textoModo) {

        textoModo.textContent =
            "Escolha uma versão para continuar.";
    }


    modoSistema = null;


    sessionStorage.removeItem(
        "modoSistema"
    );
}



/* =========================================================
   UTILIDADES
========================================================= */

/* =========================================================
   SALVAR DADOS
========================================================= */

function salvarDados() {

    localStorage.setItem(
        chaveModo("chamados"),
        JSON.stringify(
            chamados
        )
    );


    localStorage.setItem(
        chaveModo("atendentes"),
        JSON.stringify(
            atendentes
        )
    );


    localStorage.setItem(
        chaveModo("notificacoes"),
        JSON.stringify(
            notificacoes
        )
    );


    localStorage.setItem(
        chaveModo("historicoGeral"),
        JSON.stringify(
            historicoGeral
        )
    );


    localStorage.setItem(
        chaveModo("configuracoes"),
        JSON.stringify(
            configuracoes
        )
    );
}

/* =========================================================
   GERAR ID
========================================================= */

function gerarId() {

    return (
        Date.now() +
        Math.floor(
            Math.random() * 1000
        )
    );
}


/* =========================================================
   FORMATAR DATA
========================================================= */

function formatarData(data) {

    if (!data) {
        return "-";
    }


    const dataConvertida =
        new Date(data);


    if (
        Number.isNaN(
            dataConvertida.getTime()
        )
    ) {

        return "-";
    }


    return dataConvertida.toLocaleString(
        "pt-BR"
    );
}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escaparHTML(texto) {

    if (
        texto === null ||
        texto === undefined
    ) {

        return "";
    }


    return String(texto)

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
   NORMALIZAR CLASSE
========================================================= */

function normalizarClasse(texto) {

    return String(
        texto || ""
    )

        .toLowerCase()

        .normalize(
            "NFD"
        )

        .replace(
            /[\u0300-\u036f]/g,
            ""
        )

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
   DEFINIR TEXTO DE ELEMENTO
========================================================= */

function definirTexto(
    id,
    valor
) {

    const elemento =
        document.getElementById(
            id
        );


    if (elemento) {

        elemento.textContent =
            valor;
    }
}


/* =========================================================
   PREPARAR TELA INICIAL
========================================================= */

function prepararTelaInicial() {

    /*
     * A tela inicial sempre será a primeira
     * tela exibida quando o sistema abrir.
     */

    esconderTudoPrincipal();


    const telaEscolha =
        document.getElementById(
            "telaEscolha"
        );


    if (telaEscolha) {

        telaEscolha.style.display =
            "flex";
    }


    /*
     * SEGURANÇA EXTRA:
     * nunca deixar o painel cliente aparecer
     * sozinho na inicialização.
     */

    const painelCliente =
        document.getElementById(
            "painelCliente"
        );


    if (painelCliente) {

        painelCliente.style.display =
            "none";
    }


    const loginCliente =
        document.getElementById(
            "loginCliente"
        );


    if (loginCliente) {

        loginCliente.style.display =
            "none";
    }
}


/* =========================================================
   ESCONDER TELAS PRINCIPAIS
========================================================= */

function esconderTudoPrincipal() {

    const ids = [

        "telaLogin",

        "telaEscolha",

        "areaCliente",

        "loginAdministrativo",

        "sistema"

    ];


    ids.forEach(
        function (id) {

            const elemento =
                document.getElementById(
                    id
                );


            if (elemento) {

                elemento.style.display =
                    "none";
            }
        }
    );


    /*
     * O painel cliente também é escondido
     * quando estamos fora da área cliente.
     */

    const painelCliente =
        document.getElementById(
            "painelCliente"
        );


    if (painelCliente) {

        painelCliente.style.display =
            "none";
    }
}


/* =========================================================
   VOLTAR PARA TELA DE ESCOLHA
========================================================= */

function voltarTelaEscolha() {

    esconderTudoPrincipal();


    const tela =
        document.getElementById(
            "telaEscolha"
        );


    if (tela) {

        tela.style.display =
            "flex";
    }
}


/* =========================================================
   ABRIR ÁREA ADMINISTRATIVA
========================================================= */

function abrirAreaAdministrativa() {

    esconderTudoPrincipal();


    const login =
        document.getElementById(
            "loginAdministrativo"
        );


    if (login) {

        login.style.display =
            "block";
    }
}


/* =========================================================
   FIM DA PARTE 1/10
========================================================= */
/* =========================================================
   LOGIN CLIENTE
========================================================= */

function configurarLoginCliente() {

    const form =
        document.getElementById(
            "formLoginCliente"
        );


    if (!form) {

        console.warn(
            "Formulário de login do cliente não encontrado."
        );

        return;
    }


    /*
     * Evita que o evento seja registrado
     * mais de uma vez.
     */

    if (
        form.dataset.loginConfigurado ===
        "true"
    ) {

        return;
    }


    form.dataset.loginConfigurado =
        "true";


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* =========================================
               PEGAR DADOS DO FORMULÁRIO
            ========================================= */

            const campoNome =
                document.getElementById(
                    "loginClienteNome"
                );


            const campoEmail =
                document.getElementById(
                    "loginClienteEmail"
                );


            const mensagem =
                document.getElementById(
                    "mensagemLoginCliente"
                );


            const nome =
                campoNome
                    ? campoNome.value.trim()
                    : "";


            const email =
                campoEmail
                    ? campoEmail.value.trim()
                    : "";


            /* =========================================
               VALIDAR NOME
            ========================================= */

            if (!nome) {

                if (mensagem) {

                    mensagem.textContent =
                        "Digite seu nome.";

                    mensagem.style.color =
                        "#dc2626";
                }


                if (campoNome) {

                    campoNome.focus();
                }


                return;
            }


            /* =========================================
               VALIDAR E-MAIL
            ========================================= */

            if (!email) {

                if (mensagem) {

                    mensagem.textContent =
                        "Digite seu e-mail.";

                    mensagem.style.color =
                        "#dc2626";
                }


                if (campoEmail) {

                    campoEmail.focus();
                }


                return;
            }


            /* =========================================
               VALIDAR FORMATO DO E-MAIL
            ========================================= */

            const emailValido =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    .test(email);


            if (!emailValido) {

                if (mensagem) {

                    mensagem.textContent =
                        "Digite um e-mail válido.";

                    mensagem.style.color =
                        "#dc2626";
                }


                if (campoEmail) {

                    campoEmail.focus();
                }


                return;
            }


            /* =========================================
               CRIAR SESSÃO DO CLIENTE
            ========================================= */

            clienteLogado = {

                nome:
                    nome,

                email:
                    email
            };


            /*
             * Salva somente durante a sessão
             * do navegador.
             */

            sessionStorage.setItem(
                "clienteLogado",
                JSON.stringify(
                    clienteLogado
                )
            );


            /* =========================================
               MENSAGEM DE SUCESSO
            ========================================= */

            if (mensagem) {

                mensagem.textContent =
                    "Login realizado com sucesso!";

                mensagem.style.color =
                    "#16a34a";
            }


            /* =========================================
               ABRIR PAINEL
            ========================================= */

            setTimeout(
                function () {

                    abrirAreaCliente();

                },
                200
            );

        }
    );
}


/* =========================================================
   ABRIR ÁREA DO CLIENTE
========================================================= */

function abrirAreaCliente() {

    console.log(
        "Abrindo Área do Cliente..."
    );


    /*
     * Primeiro esconde todas as áreas.
     */

    esconderTudoPrincipal();


    const areaCliente =
        document.getElementById(
            "areaCliente"
        );


    const loginCliente =
        document.getElementById(
            "loginCliente"
        );


    const painelCliente =
        document.getElementById(
            "painelCliente"
        );


    /* =========================================
       VERIFICAR ÁREA DO CLIENTE
    ========================================= */

    if (!areaCliente) {

        console.error(
            "ERRO: #areaCliente não existe no HTML."
        );

        return;
    }


    /* =========================================
       MOSTRAR ÁREA CLIENTE
    ========================================= */

    areaCliente.style.display =
        "block";


    /* =========================================
       CLIENTE NÃO ESTÁ LOGADO
    ========================================= */

    if (!clienteLogado) {

        console.log(
            "Cliente não logado. Mostrando login."
        );


        /*
         * Login aparece.
         */

        if (loginCliente) {

            loginCliente.style.display =
                "block";
        }


        /*
         * Painel fica obrigatoriamente escondido.
         */

        if (painelCliente) {

            painelCliente.style.display =
                "none";
        }


        return;
    }


    /* =========================================
       CLIENTE ESTÁ LOGADO
    ========================================= */

    console.log(
        "Cliente autenticado:",
        clienteLogado.nome
    );


    /*
     * Esconde tela de login.
     */

    if (loginCliente) {

        loginCliente.style.display =
            "none";
    }


    /*
     * Mostra painel.
     */

    if (painelCliente) {

        painelCliente.style.display =
            "flex";
    }


    /*
     * Atualiza informações.
     */

    atualizarDadosCliente();

    atualizarDashboardCliente();

    renderizarChamadosCliente();

    renderizarNotificacoesCliente();

    renderizarHistoricoCliente();
}


/* =========================================================
   LOGOUT CLIENTE
========================================================= */

function sairCliente() {

    console.log(
        "Saindo da Área do Cliente..."
    );


    /*
     * Remove sessão.
     */

    clienteLogado =
        null;


    sessionStorage.removeItem(
        "clienteLogado"
    );


    /*
     * Limpa chamado selecionado.
     */

    chamadoSelecionado =
        null;


    /*
     * Esconde tudo.
     */

    esconderTudoPrincipal();


    /*
     * Volta para a tela inicial.
     */

    const telaEscolha =
        document.getElementById(
            "telaEscolha"
        );


    if (telaEscolha) {

        telaEscolha.style.display =
            "flex";
    }


    /*
     * Garante que o painel não apareça.
     */

    const painelCliente =
        document.getElementById(
            "painelCliente"
        );


    if (painelCliente) {

        painelCliente.style.display =
            "none";
    }


    /*
     * Limpa formulário de login.
     */

    const form =
        document.getElementById(
            "formLoginCliente"
        );


    if (form) {

        form.reset();
    }


    console.log(
        "Logout realizado."
    );
}


/* =========================================================
   ATUALIZAR DADOS DO CLIENTE
========================================================= */

function atualizarDadosCliente() {

    if (!clienteLogado) {

        return;
    }


    const nome =
        clienteLogado.nome ||
        "Cliente";


    const email =
        clienteLogado.email ||
        "";


    /*
     * Nome principal.
     */

    const elementosNome = [

        "clienteNome",

        "nomeCliente",

        "clienteNomePainel"

    ];


    elementosNome.forEach(
        function (id) {

            const elemento =
                document.getElementById(
                    id
                );


            if (elemento) {

                elemento.textContent =
                    nome;
            }
        }
    );


    /*
     * E-mail.
     */

    const elementosEmail = [

        "clienteEmail",

        "emailCliente",

        "clienteEmailPainel"

    ];


    elementosEmail.forEach(
        function (id) {

            const elemento =
                document.getElementById(
                    id
                );


            if (elemento) {

                elemento.textContent =
                    email;
            }
        }
    );
}


/* =========================================================
   VERIFICAR SESSÃO DO CLIENTE
========================================================= */

function verificarClienteLogado() {

    /*
     * IMPORTANTE:
     *
     * Esta função NÃO abre o painel.
     *
     * Ela apenas verifica se existe uma sessão.
     */

    const sessao =
        sessionStorage.getItem(
            "clienteLogado"
        );


    if (!sessao) {

        clienteLogado =
            null;

        return false;
    }


    try {

        const dados =
            JSON.parse(
                sessao
            );


        if (
            dados &&
            dados.nome &&
            dados.email
        ) {

            clienteLogado =
                dados;

            return true;
        }


    } catch (erro) {

        console.error(
            "Erro ao recuperar sessão:",
            erro
        );
    }


    clienteLogado =
        null;


    sessionStorage.removeItem(
        "clienteLogado"
    );


    return false;
}


/* =========================================================
   FIM DA PARTE 2/10
========================================================= */
/* =========================================================
   PARTE 3/10
   NOVO CHAMADO + INTELIGÊNCIA ARTIFICIAL
========================================================= */


/* =========================================================
   CONFIGURAR FORMULÁRIO DE NOVO CHAMADO
========================================================= */

function configurarFormularioChamado() {

    const form =
        document.getElementById(
            "formChamado"
        );


    if (!form) {

        return;
    }


    /*
     * Evita duplicar o evento.
     */

    if (
        form.dataset.configurado ===
        "true"
    ) {

        return;
    }


    form.dataset.configurado =
        "true";


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* =========================================
               VERIFICAR LOGIN
            ========================================= */

            if (!clienteLogado) {

                alert(
                    "Faça login como cliente primeiro."
                );

                abrirAreaCliente();

                return;
            }


            /* =========================================
               CAMPOS
            ========================================= */

            const assunto =
                document
                    .getElementById(
                        "clienteAssunto"
                    )
                    ?.value
                    .trim() || "";


            const categoria =
                document
                    .getElementById(
                        "clienteCategoria"
                    )
                    ?.value
                    .trim() || "";


            const prioridade =
                document
                    .getElementById(
                        "clientePrioridade"
                    )
                    ?.value
                    .trim() || "";


            const descricao =
                document
                    .getElementById(
                        "clienteDescricao"
                    )
                    ?.value
                    .trim() || "";


            /* =========================================
               VALIDAR
            ========================================= */

            if (
                !assunto ||
                !descricao
            ) {

                alert(
                    "Preencha o assunto e a descrição."
                );

                return;
            }


            /* =========================================
               ANALISAR COM IA
            ========================================= */

            let analiseIA =
                analisarChamadoComIA(
                    assunto,
                    descricao
                );


            /*
             * Se o cliente não escolheu categoria,
             * usamos a sugestão da IA.
             */

            const categoriaFinal =
                categoria ||
                analiseIA.categoria;


            /*
             * Se o cliente não escolheu prioridade,
             * usamos a sugestão da IA.
             */

            const prioridadeFinal =
                prioridade ||
                analiseIA.prioridade;


            /* =========================================
               CRIAR CHAMADO
            ========================================= */

            const agora =
                new Date().toISOString();


            const novoChamado = {

                id:
                    gerarId(),

                protocolo:
                    "CH-" +
                    Date.now(),

                clienteNome:
                    clienteLogado.nome,

                clienteEmail:
                    clienteLogado.email,

                assunto:
                    assunto,

                categoria:
                    categoriaFinal,

                prioridade:
                    prioridadeFinal,

                descricao:
                    descricao,

                status:
                    "Aberto",

                atendente:
                    "",

                criadoEm:
                    agora,

                atualizadoEm:
                    agora,

                mensagens:
                    [],

                historico:
                    [
                        {

                            data:
                                agora,

                            acao:
                                "Chamado criado",

                            usuario:
                                clienteLogado.nome
                        }
                    ],

                analiseIA:
                    {

                        categoria:
                            analiseIA.categoria,

                        prioridade:
                            analiseIA.prioridade,

                        solucao:
                            analiseIA.solucao,

                        confianca:
                            analiseIA.confianca,

                        analisadoEm:
                            agora
                    }
            };


            /* =========================================
               ADICIONAR CHAMADO
            ========================================= */

            chamados.push(
                novoChamado
            );


            /* =========================================
               HISTÓRICO GERAL
            ========================================= */
historicoGeral.push({

    id:
        gerarId(),

    chamadoId:
        novoChamado.id,

    protocolo:
        novoChamado.protocolo,

    acao:
        "Chamado criado",

    usuario:
        clienteLogado.nome,

    clienteEmail:
        clienteLogado.email,

    data:
        agora
});

            /* =========================================
               NOTIFICAÇÃO
            ========================================= */

            notificacoes.push({

                id:
                    gerarId(),

                clienteEmail:
                    clienteLogado.email,

                chamadoId:
                    novoChamado.id,

                titulo:
                    "Chamado criado",

                mensagem:
                    "Seu chamado " +
                    novoChamado.protocolo +
                    " foi criado com sucesso.",

                lida:
                    false,

                data:
                    agora
            });


            /* =========================================
               SALVAR
            ========================================= */

            salvarDados();


            /* =========================================
               LIMPAR FORMULÁRIO
            ========================================= */

            form.reset();


            /* =========================================
               ATUALIZAR SISTEMA
            ========================================= */

            atualizarDadosCliente();

            atualizarDashboardCliente();

            renderizarChamadosCliente();

            renderizarNotificacoesCliente();

            renderizarHistoricoCliente();


            /* =========================================
               MOSTRAR RESULTADO DA IA
            ========================================= */

            mostrarResultadoAnaliseIA(
                novoChamado
            );


            console.log(
                "Chamado criado:",
                novoChamado
            );

        }
    );
}


/* =========================================================
   FORMULÁRIO DE NOVO CHAMADO — CLIENTE
========================================================= */

function configurarFormularioChamadoCliente() {

    /*
     * Alguns HTMLs utilizam
     * formChamadoCliente em vez de formChamado.
     *
     * Se existir, configuramos também.
     */

    const form =
        document.getElementById(
            "formChamadoCliente"
        );


    if (!form) {

        return;
    }


    if (
        form.dataset.configurado ===
        "true"
    ) {

        return;
    }


    form.dataset.configurado =
        "true";


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (!clienteLogado) {

                alert(
                    "Faça login como cliente primeiro."
                );

                abrirAreaCliente();

                return;
            }


            const assunto =
                document
                    .getElementById(
                        "clienteAssunto"
                    )
                    ?.value
                    .trim() || "";


            const categoria =
                document
                    .getElementById(
                        "clienteCategoria"
                    )
                    ?.value
                    .trim() || "";


            const prioridade =
                document
                    .getElementById(
                        "clientePrioridade"
                    )
                    ?.value
                    .trim() || "";


            const descricao =
                document
                    .getElementById(
                        "clienteDescricao"
                    )
                    ?.value
                    .trim() || "";


            if (
                !assunto ||
                !descricao
            ) {

                alert(
                    "Preencha o assunto e a descrição."
                );

                return;
            }


            const analiseIA =
                analisarChamadoComIA(
                    assunto,
                    descricao
                );


            const agora =
                new Date().toISOString();


            const novoChamado = {

                id:
                    gerarId(),

                protocolo:
                    "CH-" +
                    Date.now(),

                clienteNome:
                    clienteLogado.nome,

                clienteEmail:
                    clienteLogado.email,

                assunto:
                    assunto,

                categoria:
                    categoria ||
                    analiseIA.categoria,

                prioridade:
                    prioridade ||
                    analiseIA.prioridade,

                descricao:
                    descricao,

                status:
                    "Aberto",

                atendente:
                    "",

                criadoEm:
                    agora,

                atualizadoEm:
                    agora,

                mensagens:
                    [],

                historico:
                    [
                        {

                            data:
                                agora,

                            acao:
                                "Chamado criado",

                            usuario:
                                clienteLogado.nome
                        }
                    ],

                analiseIA:
                    analiseIA
            };


            chamados.push(
                novoChamado
            );


            historicoGeral.push({

                id:
                    gerarId(),

                chamadoId:
                    novoChamado.id,

                protocolo:
                    novoChamado.protocolo,

                acao:
                    "Chamado criado",

                usuario:
                    clienteLogado.nome,

                data:
                    agora
            });


            notificacoes.push({

                id:
                    gerarId(),

                clienteEmail:
                    clienteLogado.email,

                chamadoId:
                    novoChamado.id,

                titulo:
                    "Chamado criado",

                mensagem:
                    "Seu chamado " +
                    novoChamado.protocolo +
                    " foi criado com sucesso.",

                lida:
                    false,

                data:
                    agora
            });


            salvarDados();


            form.reset();


            atualizarDadosCliente();

            atualizarDashboardCliente();

            renderizarChamadosCliente();

            renderizarNotificacoesCliente();

            renderizarHistoricoCliente();


            mostrarResultadoAnaliseIA(
                novoChamado
            );
        }
    );
}


/* =========================================================
   ANALISAR CHAMADO COM IA
========================================================= */

function analisarChamadoComIA(
    assunto,
    descricao
) {

    const texto =
        (
            String(assunto || "") +
            " " +
            String(descricao || "")
        )
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );


    let categoria =
        "Outros";


    let prioridade =
        "Média";


    let solucao =
        "Analisar o problema informado e realizar um diagnóstico técnico.";


    let confianca =
        "Média";


    /* =========================================
       HARDWARE
    ========================================= */

    if (
        texto.includes("computador") ||
        texto.includes("notebook") ||
        texto.includes("pc") ||
        texto.includes("teclado") ||
        texto.includes("mouse") ||
        texto.includes("monitor") ||
        texto.includes("impressora") ||
        texto.includes("tela") ||
        texto.includes("fonte") ||
        texto.includes("hardware")
    ) {

        categoria =
            "Hardware";


        solucao =
            "Verifique cabos, alimentação elétrica, conexões e componentes do equipamento. Se o problema continuar, encaminhe para diagnóstico técnico.";

        confianca =
            "Alta";
    }


    /* =========================================
       SOFTWARE
    ========================================= */

    else if (
        texto.includes("programa") ||
        texto.includes("software") ||
        texto.includes("aplicativo") ||
        texto.includes("sistema") ||
        texto.includes("erro no sistema") ||
        texto.includes("aplicacao")
    ) {

        categoria =
            "Software";


        solucao =
            "Verifique a mensagem de erro, reinicie o aplicativo e confirme se há atualizações disponíveis. Caso continue, realizar diagnóstico do sistema.";

        confianca =
            "Alta";
    }


    /* =========================================
       INTERNET / REDE
    ========================================= */

    else if (
        texto.includes("internet") ||
        texto.includes("wifi") ||
        texto.includes("wi-fi") ||
        texto.includes("rede") ||
        texto.includes("conexao") ||
        texto.includes("conexão") ||
        texto.includes("roteador") ||
        texto.includes("sinal")
    ) {

        categoria =
            "Rede";


        solucao =
            "Verifique a conexão física, reinicie o roteador e teste a conexão em outro dispositivo. Se o problema persistir, verificar a rede.";

        confianca =
            "Alta";
    }


    /* =========================================
       ACESSO / LOGIN
    ========================================= */

    else if (
        texto.includes("senha") ||
        texto.includes("login") ||
        texto.includes("acesso") ||
        texto.includes("usuario") ||
        texto.includes("usuário") ||
        texto.includes("bloqueado") ||
        texto.includes("entrar")
    ) {

        categoria =
            "Acesso";


        solucao =
            "Verifique usuário e senha, confirme se a conta está ativa e realize a recuperação ou redefinição de senha quando necessário.";

        confianca =
            "Alta";
    }


    /* =========================================
       E-MAIL
    ========================================= */

    else if (
        texto.includes("email") ||
        texto.includes("e-mail") ||
        texto.includes("correio") ||
        texto.includes("mensagem nao chega") ||
        texto.includes("mensagem não chega")
    ) {

        categoria =
            "E-mail";


        solucao =
            "Verifique conexão, caixa de entrada, spam e configurações da conta. Caso necessário, revisar as configurações do servidor de e-mail.";

        confianca =
            "Alta";
    }


    /* =========================================
       IMPRESSÃO
    ========================================= */

    if (
        texto.includes("imprimir") ||
        texto.includes("impressao") ||
        texto.includes("impressão") ||
        texto.includes("impressora")
    ) {

        categoria =
            "Impressão";


        solucao =
            "Verifique se a impressora está ligada, conectada e configurada corretamente. Confira também fila de impressão e disponibilidade de papel.";

        confianca =
            "Alta";
    }


    /* =========================================
       PRIORIDADE CRÍTICA
    ========================================= */

    if (
        texto.includes("urgente") ||
        texto.includes("parou tudo") ||
        texto.includes("empresa parada") ||
        texto.includes("todos parados") ||
        texto.includes("indisponivel") ||
        texto.includes("indisponível") ||
        texto.includes("sistema fora")
    ) {

        prioridade =
            "Crítica";
    }


    /* =========================================
       PRIORIDADE ALTA
    ========================================= */

    else if (
        texto.includes("nao consigo trabalhar") ||
        texto.includes("não consigo trabalhar") ||
        texto.includes("nao funciona") ||
        texto.includes("não funciona") ||
        texto.includes("sem acesso") ||
        texto.includes("erro grave") ||
        texto.includes("problema grave")
    ) {

        prioridade =
            "Alta";
    }


    /* =========================================
       PRIORIDADE BAIXA
    ========================================= */

    else if (
        texto.includes("duvida") ||
        texto.includes("dúvida") ||
        texto.includes("informacao") ||
        texto.includes("informação") ||
        texto.includes("como fazer") ||
        texto.includes("orientacao") ||
        texto.includes("orientação")
    ) {

        prioridade =
            "Baixa";
    }


    /* =========================================
       RETORNO DA IA
    ========================================= */

    return {

        categoria:
            categoria,

        prioridade:
            prioridade,

        solucao:
            solucao,

        confianca:
            confianca
    };
}


/* =========================================================
   MOSTRAR RESULTADO DA ANÁLISE DA IA
========================================================= */

function mostrarResultadoAnaliseIA(
    chamado
) {

    if (!chamado) {

        return;
    }


    const analise =
        chamado.analiseIA;


    if (!analise) {

        return;
    }


    const mensagem =

        "🤖 ANÁLISE AUTOMÁTICA\n\n" +

        "Chamado: " +
        chamado.protocolo +

        "\n\n" +

        "📂 Categoria sugerida:\n" +
        analise.categoria +

        "\n\n" +

        "⚡ Prioridade sugerida:\n" +
        analise.prioridade +

        "\n\n" +

        "💡 Possível solução:\n" +
        analise.solucao +

        "\n\n" +

        "🎯 Confiança da análise:\n" +
        (
            analise.confianca ||
            "Média"
        );


    alert(
        mensagem
    );
}


/* =========================================================
   ANALISAR CHAMADO EXISTENTE
========================================================= */

function analisarChamadoSelecionadoComIA() {

    if (!chamadoSelecionado) {

        alert(
            "Selecione um chamado primeiro."
        );

        return;
    }


    const analise =
        analisarChamadoComIA(
            chamadoSelecionado.assunto,
            chamadoSelecionado.descricao
        );


    chamadoSelecionado.analiseIA =
        {

            categoria:
                analise.categoria,

            prioridade:
                analise.prioridade,

            solucao:
                analise.solucao,

            confianca:
                analise.confianca,

            analisadoEm:
                new Date().toISOString()
        };


    salvarDados();


    mostrarResultadoAnaliseIA(
        chamadoSelecionado
    );
}


/* =========================================================
   FIM DA PARTE 3/10
========================================================= */
/* =========================================================
   PARTE 4/10
   DASHBOARD DO CLIENTE
   LISTA DE CHAMADOS
   DETALHES DO CHAMADO
========================================================= */


/* =========================================================
   ATUALIZAR DASHBOARD DO CLIENTE
========================================================= */

function atualizarDashboardCliente() {

    if (!clienteLogado) {
        return;
    }


    const meusChamados =
        chamados.filter(
            function (chamado) {

                return (
                    chamado.clienteEmail ===
                    clienteLogado.email
                );
            }
        );


    const total =
        meusChamados.length;


    const abertos =
        meusChamados.filter(
            function (chamado) {

                return (
                    chamado.status ===
                    "Aberto"
                );
            }
        ).length;


    const andamento =
        meusChamados.filter(
            function (chamado) {

                return (
                    chamado.status ===
                    "Em andamento"
                );
            }
        ).length;


    const resolvidos =
        meusChamados.filter(
            function (chamado) {

                return (
                    chamado.status ===
                    "Resolvido"
                );
            }
        ).length;


    /* =========================================
       ATUALIZAR NÚMEROS
    ========================================= */

    const elementos = {

        total:
            [
                "totalChamadosCliente",
                "clienteTotalChamados",
                "totalChamados"
            ],

        abertos:
            [
                "chamadosAbertosCliente",
                "clienteChamadosAbertos",
                "totalAbertos"
            ],

        andamento:
            [
                "chamadosAndamentoCliente",
                "clienteChamadosAndamento",
                "totalAndamento"
            ],

        resolvidos:
            [
                "chamadosResolvidosCliente",
                "clienteChamadosResolvidos",
                "totalResolvidos"
            ]
    };


    atualizarPrimeiroElemento(
        elementos.total,
        total
    );


    atualizarPrimeiroElemento(
        elementos.abertos,
        abertos
    );


    atualizarPrimeiroElemento(
        elementos.andamento,
        andamento
    );


    atualizarPrimeiroElemento(
        elementos.resolvidos,
        resolvidos
    );
}


/* =========================================================
   ATUALIZAR PRIMEIRO ELEMENTO ENCONTRADO
========================================================= */

function atualizarPrimeiroElemento(
    ids,
    valor
) {

    for (
        let i = 0;
        i < ids.length;
        i++
    ) {

        const elemento =
            document.getElementById(
                ids[i]
            );


        if (elemento) {

            elemento.textContent =
                valor;

            return;
        }
    }
}


/* =========================================================
   RENDERIZAR CHAMADOS DO CLIENTE
========================================================= */

function renderizarChamadosCliente() {

    if (!clienteLogado) {
        return;
    }


    const lista =
        document.getElementById(
            "listaChamadosCliente"
        );


    if (!lista) {
        return;
    }


    const meusChamados =
        chamados
            .filter(
                function (chamado) {

                    return (
                        chamado.clienteEmail ===
                        clienteLogado.email
                    );
                }
            )
            .sort(
                function (a, b) {

                    return (
                        new Date(
                            b.criadoEm ||
                            b.data
                        ) -
                        new Date(
                            a.criadoEm ||
                            a.data
                        )
                    );
                }
            );


    /* =========================================
       NENHUM CHAMADO
    ========================================= */

    if (
        meusChamados.length ===
        0
    ) {

        lista.innerHTML = `

            <div class="nenhum-chamado">

                <div
                    style="
                    font-size:40px;
                    margin-bottom:10px;
                    "
                >
                    📭
                </div>

                <h3>
                    Nenhum chamado encontrado
                </h3>

                <p>
                    Seus chamados aparecerão aqui.
                </p>

            </div>

        `;

        return;
    }


    /* =========================================
       RENDERIZAR
    ========================================= */

    lista.innerHTML =
        meusChamados
            .map(
                function (chamado) {

                    return criarCardChamadoCliente(
                        chamado
                    );

                }
            )
            .join("");
}


/* =========================================================
   CRIAR CARD DO CHAMADO
========================================================= */

function criarCardChamadoCliente(
    chamado
) {

    const status =
        chamado.status ||
        "Aberto";


    const prioridade =
        chamado.prioridade ||
        "Média";


    const categoria =
        chamado.categoria ||
        "Outros";


    const classeStatus =
        normalizarClasse(
            status
        );


    const classePrioridade =
        normalizarClasse(
            prioridade
        );


    return `

        <div
            class="card-chamado-cliente"
            data-id="${chamado.id}"
        >

            <div
                style="
                display:flex;
                justify-content:space-between;
                gap:15px;
                align-items:flex-start;
                "
            >

                <div>

                    <strong>
                        ${escaparHTML(
                            chamado.protocolo ||
                            "Sem protocolo"
                        )}
                    </strong>

                    <h3>
                        ${escaparHTML(
                            chamado.assunto ||
                            "Sem assunto"
                        )}
                    </h3>

                </div>


                <span
                    class="status ${classeStatus}"
                >
                    ${escaparHTML(status)}
                </span>

            </div>


            <p>
                ${escaparHTML(
                    limitarTexto(
                        chamado.descricao ||
                        "",
                        150
                    )
                )}
            </p>


            <div
                style="
                display:flex;
                flex-wrap:wrap;
                gap:8px;
                margin:10px 0;
                "
            >

                <span
                    class="badge-categoria"
                >
                    📂
                    ${escaparHTML(
                        categoria
                    )}
                </span>


                <span
                    class="badge-prioridade ${classePrioridade}"
                >
                    ⚡
                    ${escaparHTML(
                        prioridade
                    )}
                </span>

            </div>


            <small>

                Criado em:
                ${formatarData(
                    chamado.criadoEm ||
                    chamado.data
                )}

            </small>


            <div
                style="
                margin-top:15px;
                "
            >

                <button
                    type="button"
                    onclick="abrirDetalhesChamadoCliente(${chamado.id})"
                >
                    👁️ Ver detalhes
                </button>

            </div>

        </div>

    `;
}


/* =========================================================
   LIMITAR TEXTO
========================================================= */

function limitarTexto(
    texto,
    limite
) {

    texto =
        String(
            texto || ""
        );


    if (
        texto.length <=
        limite
    ) {

        return texto;
    }


    return (
        texto.substring(
            0,
            limite
        ) +
        "..."
    );
}


/* =========================================================
   ABRIR DETALHES DO CHAMADO
========================================================= */

function abrirDetalhesChamadoCliente(
    id
) {

    if (!clienteLogado) {

        alert(
            "Faça login como cliente."
        );

        abrirAreaCliente();

        return;
    }


    const chamado =
        chamados.find(
            function (item) {

                return (
                    Number(item.id) ===
                    Number(id)
                );
            }
        );


    if (!chamado) {

        alert(
            "Chamado não encontrado."
        );

        return;
    }


    /*
     * Segurança:
     * cliente só pode visualizar
     * seus próprios chamados.
     */

    if (
        chamado.clienteEmail !==
        clienteLogado.email
    ) {

        alert(
            "Você não tem permissão para visualizar este chamado."
        );

        return;
    }


    chamadoSelecionado =
        chamado;


    const analise =
        chamado.analiseIA;


    let texto =

        "📋 DETALHES DO CHAMADO\n\n" +

        "PROTOCOLO: " +
        (
            chamado.protocolo ||
            "-"
        ) +

        "\n\nASSUNTO: " +
        (
            chamado.assunto ||
            "-"
        ) +

        "\n\nCATEGORIA: " +
        (
            chamado.categoria ||
            "-"
        ) +

        "\n\nPRIORIDADE: " +
        (
            chamado.prioridade ||
            "-"
        ) +

        "\n\nSTATUS: " +
        (
            chamado.status ||
            "-"
        ) +

        "\n\nDESCRIÇÃO:\n" +
        (
            chamado.descricao ||
            "-"
        );


    if (chamado.atendente) {

        texto +=

            "\n\nATENDENTE: " +
            chamado.atendente;
    }


    /* =========================================
       ANÁLISE DA IA
    ========================================= */

    if (analise) {

        texto +=

            "\n\n" +

            "🤖 ANÁLISE DA IA\n\n" +

            "Categoria sugerida: " +
            (
                analise.categoria ||
                "-"
            ) +

            "\n\n" +

            "Prioridade sugerida: " +
            (
                analise.prioridade ||
                "-"
            ) +

            "\n\n" +

            "Possível solução:\n" +
            (
                analise.solucao ||
                "-"
            );

    }


    /* =========================================
       MENSAGENS
    ========================================= */

    const mensagens =
        chamado.mensagens ||
        [];


    if (
        mensagens.length >
        0
    ) {

        texto +=
            "\n\n💬 MENSAGENS:\n";


        mensagens.forEach(
            function (mensagem) {

                texto +=

                    "\n" +

                    (
                        mensagem.usuario ||
                        "Usuário"
                    ) +

                    ": " +

                    (
                        mensagem.texto ||
                        ""
                    );
            }
        );
    }


    /* =========================================
       HISTÓRICO
    ========================================= */

    const historico =
        chamado.historico ||
        [];


    if (
        historico.length >
        0
    ) {

        texto +=
            "\n\n📜 HISTÓRICO:\n";


        historico.forEach(
            function (item) {

                texto +=

                    "\n" +

                    formatarData(
                        item.data
                    ) +

                    " - " +

                    (
                        item.acao ||
                        ""
                    );
            }
        );
    }


    alert(
        texto
    );
}


/* =========================================================
   VER TODOS OS CHAMADOS DO CLIENTE
========================================================= */

function verTodosChamadosCliente() {

    if (!clienteLogado) {

        abrirAreaCliente();

        return;
    }


    renderizarChamadosCliente();


    const lista =
        document.getElementById(
            "listaChamadosCliente"
        );


    if (lista) {

        lista.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


/* =========================================================
   ABRIR FORMULÁRIO DE NOVO CHAMADO
========================================================= */

function abrirNovoChamadoCliente() {

    if (!clienteLogado) {

        alert(
            "Faça login para abrir um chamado."
        );

        abrirAreaCliente();

        return;
    }


    /*
     * Procura possíveis containers
     * utilizados pelo HTML.
     */

    const ids = [

        "formNovoChamadoCliente",

        "novoChamadoCliente",

        "modalNovoChamado",

        "areaNovoChamado"

    ];


    let encontrado =
        false;


    ids.forEach(
        function (id) {

            const elemento =
                document.getElementById(
                    id
                );


            if (
                elemento &&
                !encontrado
            ) {

                elemento.style.display =
                    "block";

                encontrado =
                    true;
            }
        }
    );


    if (!encontrado) {

        /*
         * Caso o HTML já esteja mostrando
         * o formulário diretamente, apenas
         * tenta localizar o formulário.
         */

        const form =
            document.getElementById(
                "formChamadoCliente"
            ) ||
            document.getElementById(
                "formChamado"
            );


        if (form) {

            form.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            return;
        }


        alert(
            "Formulário de novo chamado não encontrado."
        );
    }
}


/* =========================================================
   FECHAR FORMULÁRIO DE NOVO CHAMADO
========================================================= */

function fecharNovoChamadoCliente() {

    const ids = [

        "formNovoChamadoCliente",

        "novoChamadoCliente",

        "modalNovoChamado",

        "areaNovoChamado"

    ];


    ids.forEach(
        function (id) {

            const elemento =
                document.getElementById(
                    id
                );


            if (elemento) {

                elemento.style.display =
                    "none";
            }
        }
    );
}


/* =========================================================
   ATUALIZAR TUDO DO CLIENTE
========================================================= */

function atualizarTudoCliente() {

    if (!clienteLogado) {

        return;
    }


    atualizarDadosCliente();

    atualizarDashboardCliente();

    renderizarChamadosCliente();

    renderizarNotificacoesCliente();

    renderizarHistoricoCliente();
}


/* =========================================================
   FIM DA PARTE 4/10
========================================================= */
/* =========================================================
   PARTE 5/10
   NOTIFICAÇÕES + HISTÓRICO + MENSAGENS
========================================================= */


/* =========================================================
   RENDERIZAR NOTIFICAÇÕES DO CLIENTE
========================================================= */

function renderizarNotificacoesCliente() {

    const lista =
        document.getElementById(
            "listaNotificacoesCliente"
        );


    if (!lista) {
        return;
    }


    if (!clienteLogado) {

        lista.innerHTML = `

            <div class="cliente-sem-chamados">

                <span>🔒</span>

                <h3>
                    Faça login
                </h3>

                <p>
                    Entre na Área do Cliente
                    para visualizar suas notificações.
                </p>

            </div>

        `;

        return;
    }


    const minhasNotificacoes =
        notificacoes
            .filter(
                function (notificacao) {

                    return (

                        notificacao.clienteEmail ===
                        clienteLogado.email

                        ||

                        notificacao.cliente ===
                        clienteLogado.email

                    );
                }
            )
            .sort(
                function (a, b) {

                    return (

                        new Date(
                            b.data
                        ) -

                        new Date(
                            a.data
                        )
                    );
                }
            );


    /* =========================================
       NENHUMA NOTIFICAÇÃO
    ========================================= */

    if (
        minhasNotificacoes.length ===
        0
    ) {

        lista.innerHTML = `

            <div class="cliente-sem-chamados">

                <span>🔔</span>

                <h3>
                    Nenhuma notificação
                </h3>

                <p>
                    Você não possui novas notificações.
                </p>

            </div>

        `;

        return;
    }


    /* =========================================
       LISTA
    ========================================= */

    lista.innerHTML =
        minhasNotificacoes
            .map(
                function (notificacao) {

                    return `

                        <div
                            class="cliente-notificacao-item"
                            style="
                            padding:16px;
                            border-bottom:1px solid #e5e7eb;
                            "
                        >

                            <div
                                style="
                                display:flex;
                                justify-content:space-between;
                                gap:10px;
                                "
                            >

                                <strong>
                                    🔔
                                    ${escaparHTML(
                                        notificacao.titulo ||
                                        "Atualização"
                                    )}
                                </strong>


                                ${
                                    notificacao.lida
                                        ? ""
                                        : `
                                            <span
                                                style="
                                                font-size:12px;
                                                font-weight:bold;
                                                "
                                            >
                                                NOVA
                                            </span>
                                        `
                                }

                            </div>


                            <p>
                                ${escaparHTML(
                                    notificacao.mensagem ||
                                    ""
                                )}
                            </p>


                            <small>
                                ${formatarData(
                                    notificacao.data
                                )}
                            </small>

                        </div>

                    `;

                }
            )
            .join("");
}


/* =========================================================
   MARCAR NOTIFICAÇÕES COMO LIDAS
========================================================= */

function marcarNotificacoesComoLidas() {

    if (!clienteLogado) {
        return;
    }


    notificacoes.forEach(
        function (notificacao) {

            const pertence =

                notificacao.clienteEmail ===
                clienteLogado.email

                ||

                notificacao.cliente ===
                clienteLogado.email;


            if (pertence) {

                notificacao.lida =
                    true;
            }
        }
    );


    salvarDados();


    renderizarNotificacoesCliente();
}


/* =========================================================
   RENDERIZAR HISTÓRICO DO CLIENTE
========================================================= */

function renderizarHistoricoCliente() {

    const lista =
        document.getElementById(
            "listaHistoricoCliente"
        );


    if (!lista) {
        return;
    }


    if (!clienteLogado) {

        lista.innerHTML = `

            <div class="cliente-sem-chamados">

                <span>🔒</span>

                <h3>
                    Faça login
                </h3>

                <p>
                    Entre na Área do Cliente
                    para visualizar seu histórico.
                </p>

            </div>

        `;

        return;
    }


    /* =========================================
       BUSCAR CHAMADOS DO CLIENTE
    ========================================= */

    const meusChamados =
        chamados.filter(
            function (chamado) {

                return (

                    chamado.clienteEmail ===
                    clienteLogado.email

                    ||

                    chamado.email ===
                    clienteLogado.email

                );
            }
        );


    const atividades =
        [];


    /* =========================================
       MONTAR HISTÓRICO
    ========================================= */

    meusChamados.forEach(
        function (chamado) {

            const historico =
                chamado.historico ||
                [];


            historico.forEach(
                function (item) {

                    atividades.push({

                        chamadoId:
                            chamado.id,

                        protocolo:
                            chamado.protocolo,

                        assunto:
                            chamado.assunto,

                        acao:
                            item.acao ||
                            item.texto ||
                            "Atualização",

                        usuario:
                            item.usuario ||
                            "Sistema",

                        data:
                            item.data ||
                            chamado.criadoEm

                    });

                }
            );


            /*
             * Se o chamado não possuir histórico,
             * cria uma atividade inicial.
             */

            if (
                historico.length ===
                0
            ) {

                atividades.push({

                    chamadoId:
                        chamado.id,

                    protocolo:
                        chamado.protocolo,

                    assunto:
                        chamado.assunto,

                    acao:
                        "Chamado registrado",

                    usuario:
                        clienteLogado.nome,

                    data:
                        chamado.criadoEm

                });
            }

        }
    );


    /* =========================================
       ORDENAR POR DATA
    ========================================= */

    atividades.sort(
        function (a, b) {

            return (

                new Date(
                    b.data
                ) -

                new Date(
                    a.data
                )
            );
        }
    );


    /* =========================================
       NENHUM HISTÓRICO
    ========================================= */

    if (
        atividades.length ===
        0
    ) {

        lista.innerHTML = `

            <div class="cliente-sem-chamados">

                <span>📜</span>

                <h3>
                    Nenhuma atividade registrada
                </h3>

                <p>
                    O histórico dos seus chamados
                    aparecerá aqui.
                </p>

            </div>

        `;

        return;
    }


    /* =========================================
       RENDERIZAR HISTÓRICO
    ========================================= */

    lista.innerHTML =
        atividades
            .map(
                function (item) {

                    return `

                        <div
                            class="cliente-historico-item"
                            style="
                            padding:16px;
                            border-bottom:1px solid #e5e7eb;
                            "
                        >

                            <strong>
                                📋
                                ${escaparHTML(
                                    item.protocolo ||
                                    (
                                        "Chamado #" +
                                        item.chamadoId
                                    )
                                )}
                            </strong>


                            <p>
                                ${escaparHTML(
                                    item.acao
                                )}
                            </p>


                            <small>

                                👤
                                ${escaparHTML(
                                    item.usuario
                                )}

                                &nbsp; • &nbsp;

                                ${formatarData(
                                    item.data
                                )}

                            </small>


                            ${
                                item.assunto
                                    ? `
                                        <div
                                            style="
                                            margin-top:6px;
                                            font-size:13px;
                                            "
                                        >
                                            ${escaparHTML(
                                                item.assunto
                                            )}
                                        </div>
                                    `
                                    : ""
                            }

                        </div>

                    `;

                }
            )
            .join("");
}


/* =========================================================
   ADICIONAR HISTÓRICO AO CHAMADO
========================================================= */

function adicionarHistoricoChamado(
    chamado,
    acao,
    usuario
) {

    if (!chamado) {
        return;
    }


    if (
        !Array.isArray(
            chamado.historico
        )
    ) {

        chamado.historico =
            [];
    }


    const item = {

        data:
            new Date().toISOString(),

        acao:
            acao,

        usuario:
            usuario ||
            "Sistema"

    };

historicoGeral.push({

    id:
        gerarId(),

    chamadoId:
        chamado.id,

    protocolo:
        chamado.protocolo,

    acao:
        acao,

    usuario:
        usuario ||
        "Sistema",

    clienteEmail:
        chamado.clienteEmail,

    data:
        item.data

});

    salvarDados();


    /*
     * Atualizar tela caso o cliente esteja logado.
     */

    if (clienteLogado) {

        renderizarHistoricoCliente();
    }
}


/* =========================================================
   ADICIONAR NOTIFICAÇÃO AO CLIENTE
========================================================= */

function adicionarNotificacaoCliente(
    chamado,
    titulo,
    mensagem
) {

    if (!chamado) {
        return;
    }


    const email =
        chamado.clienteEmail ||
        chamado.email ||
        "";


    if (!email) {
        return;
    }


    notificacoes.push({

        id:
            gerarId(),

        clienteEmail:
            email,

        cliente:
            email,

        chamadoId:
            chamado.id,

        protocolo:
            chamado.protocolo,

        titulo:
            titulo ||
            "Atualização do chamado",

        mensagem:
            mensagem ||
            "Seu chamado foi atualizado.",

        lida:
            false,

        data:
            new Date().toISOString()

    });


    salvarDados();


    if (
        clienteLogado &&
        clienteLogado.email ===
        email
    ) {

        renderizarNotificacoesCliente();
    }
}


/* =========================================================
   ADICIONAR MENSAGEM AO CHAMADO
========================================================= */

function adicionarMensagemChamado(
    chamado,
    texto,
    usuario,
    tipo
) {

    if (!chamado) {
        return false;
    }


    texto =
        String(
            texto || ""
        ).trim();


    if (!texto) {
        return false;
    }


    if (
        !Array.isArray(
            chamado.mensagens
        )
    ) {

        chamado.mensagens =
            [];
    }


    const mensagem = {

        id:
            gerarId(),

        texto:
            texto,

        usuario:
            usuario ||
            "Sistema",

        tipo:
            tipo ||
            "sistema",

        data:
            new Date().toISOString()

    };


    chamado.mensagens.push(
        mensagem
    );


    chamado.atualizadoEm =
        mensagem.data;


    salvarDados();


    return true;
}


/* =========================================================
   ENVIAR MENSAGEM DO CLIENTE
========================================================= */

function enviarMensagemCliente() {

    if (!clienteLogado) {

        alert(
            "Faça login para enviar uma mensagem."
        );

        abrirAreaCliente();

        return;
    }


    if (!chamadoSelecionado) {

        alert(
            "Selecione um chamado primeiro."
        );

        return;
    }


    /*
     * Segurança:
     * cliente só pode responder
     * seus próprios chamados.
     */

    const pertence =

        chamadoSelecionado.clienteEmail ===
        clienteLogado.email

        ||

        chamadoSelecionado.email ===
        clienteLogado.email;


    if (!pertence) {

        alert(
            "Você não tem permissão para alterar este chamado."
        );

        return;
    }


    const campo =
        document.getElementById(
            "mensagemCliente"
        );


    if (!campo) {

        alert(
            "Campo de mensagem não encontrado."
        );

        return;
    }


    const texto =
        campo.value.trim();


    if (!texto) {

        alert(
            "Digite uma mensagem."
        );

        campo.focus();

        return;
    }


    const adicionada =
        adicionarMensagemChamado(
            chamadoSelecionado,
            texto,
            clienteLogado.nome,
            "cliente"
        );


    if (!adicionada) {
        return;
    }


    adicionarHistoricoChamado(
        chamadoSelecionado,
        "Cliente enviou uma mensagem.",
        clienteLogado.nome
    );


    adicionarNotificacaoCliente(
        chamadoSelecionado,
        "Nova mensagem",
        "Sua mensagem foi adicionada ao chamado " +
        chamadoSelecionado.protocolo +
        "."
    );


    campo.value =
        "";


    salvarDados();


    alert(
        "Mensagem enviada com sucesso!"
    );


    atualizarTudoCliente();
}


/* =========================================================
   RENDERIZAR MENSAGENS DO CHAMADO
========================================================= */

function renderizarMensagensChamado(
    chamado
) {

    const lista =
        document.getElementById(
            "listaMensagensChamado"
        );


    if (!lista) {
        return;
    }


    if (!chamado) {

        lista.innerHTML =
            "";

        return;
    }


    const mensagens =
        chamado.mensagens ||
        [];


    if (
        mensagens.length ===
        0
    ) {

        lista.innerHTML = `

            <div
                style="
                padding:15px;
                text-align:center;
                "
            >

                💬
                Nenhuma mensagem ainda.

            </div>

        `;

        return;
    }


    lista.innerHTML =
        mensagens
            .map(
                function (mensagem) {

                    return `

                        <div
                            class="mensagem-chamado"
                            style="
                            padding:12px;
                            margin-bottom:10px;
                            border-radius:8px;
                            "
                        >

                            <strong>
                                ${escaparHTML(
                                    mensagem.usuario ||
                                    "Usuário"
                                )}
                            </strong>


                            <p>
                                ${escaparHTML(
                                    mensagem.texto
                                )}
                            </p>


                            <small>
                                ${formatarData(
                                    mensagem.data
                                )}
                            </small>

                        </div>

                    `;

                }
            )
            .join("");
}


/* =========================================================
   ATUALIZAR DADOS COMPLETOS DO CLIENTE
========================================================= */

function atualizarDadosCompletosCliente() {

    if (!clienteLogado) {
        return;
    }


    atualizarDadosCliente();

    atualizarDashboardCliente();

    renderizarChamadosCliente();

    renderizarNotificacoesCliente();

    renderizarHistoricoCliente();


    if (chamadoSelecionado) {

        renderizarMensagensChamado(
            chamadoSelecionado
        );
    }
}


/* =========================================================
   FIM DA PARTE 5/10
========================================================= */
/* =========================================================
   PARTE 6/10
   MENU DA ÁREA DO CLIENTE
========================================================= */


/* =========================================================
   MOSTRAR TELA DO CLIENTE
========================================================= */

function mostrarTelaCliente(
    idTela,
    botao
) {

    /* =========================================
       VERIFICAR LOGIN
    ========================================= */

    if (!clienteLogado) {

        alert(
            "Faça login para acessar a Área do Cliente."
        );

        abrirAreaCliente();

        return;
    }


    /* =========================================
       LISTA DE TELAS
    ========================================= */

    const telas = [

        "clienteDashboard",

        "abrirChamadoCliente",

        "meusChamadosCliente",

        "notificacoesCliente",

        "historicoCliente",

        "perfilCliente"

    ];


    /* =========================================
       ESCONDER TODAS AS TELAS
    ========================================= */

    telas.forEach(
        function (id) {

            const tela =
                document.getElementById(
                    id
                );


            if (tela) {

                tela.style.display =
                    "none";

                tela.classList.remove(
                    "ativo"
                );
            }
        }
    );


    /* =========================================
       MOSTRAR TELA SELECIONADA
    ========================================= */

    const telaSelecionada =
        document.getElementById(
            idTela
        );


    if (!telaSelecionada) {

        console.warn(
            "Tela do cliente não encontrada:",
            idTela
        );

        return;
    }


    telaSelecionada.style.display =
        "block";


    telaSelecionada.classList.add(
        "ativo"
    );


    /* =========================================
       ATUALIZAR BOTÕES DO MENU
    ========================================= */

    const botoes =
        document.querySelectorAll(
            ".cliente-menu-link"
        );


    botoes.forEach(
        function (item) {

            item.classList.remove(
                "ativo"
            );
        }
    );


    if (botao) {

        botao.classList.add(
            "ativo"
        );
    }


    /* =========================================
       ATUALIZAÇÕES ESPECÍFICAS
    ========================================= */

    if (
        idTela ===
        "clienteDashboard"
    ) {

        atualizarDashboardCliente();

        renderizarChamadosCliente();
    }


    if (
        idTela ===
        "abrirChamadoCliente"
    ) {

        prepararFormularioNovoChamado();
    }


    if (
        idTela ===
        "meusChamadosCliente"
    ) {

        renderizarChamadosCliente();
    }


    if (
        idTela ===
        "notificacoesCliente"
    ) {

        renderizarNotificacoesCliente();
    }


    if (
        idTela ===
        "historicoCliente"
    ) {

        renderizarHistoricoCliente();
    }


    if (
        idTela ===
        "perfilCliente"
    ) {

        atualizarDadosCliente();

        atualizarPerfilCliente();
    }


    /* =========================================
       VOLTAR PARA O TOPO
    ========================================= */

    const conteudo =
        document.querySelector(
            ".cliente-conteudo"
        );


    if (conteudo) {

        conteudo.scrollTop =
            0;
    }

    window.scrollTo(
        0,
        0
    );
}


/* =========================================================
   ABRIR NOVO CHAMADO PELO MENU
========================================================= */

function abrirTelaNovoChamadoCliente() {

    if (!clienteLogado) {

        alert(
            "Faça login para abrir um chamado."
        );

        abrirAreaCliente();

        return;
    }


    const botoes =
        document.querySelectorAll(
            ".cliente-menu-link"
        );


    let botaoNovoChamado =
        null;


    botoes.forEach(
        function (botao) {

            const texto =
                botao.textContent
                    .toLowerCase();


            if (
                texto.includes(
                    "abrir chamado"
                )
            ) {

                botaoNovoChamado =
                    botao;
            }
        }
    );


    mostrarTelaCliente(
        "abrirChamadoCliente",
        botaoNovoChamado
    );
}


/* =========================================================
   PREPARAR FORMULÁRIO DE NOVO CHAMADO
========================================================= */

function prepararFormularioNovoChamado() {

    if (!clienteLogado) {

        return;
    }


    /*
     * Coloca os dados do cliente,
     * caso existam campos no HTML.
     */

    const campoNome =
        document.getElementById(
            "clienteNomeChamado"
        );


    if (campoNome) {

        campoNome.value =
            clienteLogado.nome;
    }


    const campoEmail =
        document.getElementById(
            "clienteEmailChamado"
        );


    if (campoEmail) {

        campoEmail.value =
            clienteLogado.email;
    }


    /*
     * Foco no assunto.
     */

    const assunto =
        document.getElementById(
            "clienteAssunto"
        );


    if (assunto) {

        setTimeout(
            function () {

                assunto.focus();

            },
            100
        );
    }
}


/* =========================================================
   ATUALIZAR PERFIL DO CLIENTE
========================================================= */

function atualizarPerfilCliente() {

    if (!clienteLogado) {

        return;
    }


    const nome =
        clienteLogado.nome ||
        "Cliente";


    const email =
        clienteLogado.email ||
        "";


    const camposNome = [

        "perfilClienteNome",

        "nomePerfilCliente",

        "clientePerfilNome"

    ];


    camposNome.forEach(
        function (id) {

            const elemento =
                document.getElementById(
                    id
                );


            if (elemento) {

                elemento.textContent =
                    nome;
            }
        }
    );


    const camposEmail = [

        "perfilClienteEmail",

        "emailPerfilCliente",

        "clientePerfilEmail"

    ];


    camposEmail.forEach(
        function (id) {

            const elemento =
                document.getElementById(
                    id
                );


            if (elemento) {

                elemento.textContent =
                    email;
            }
        }
    );
}


/* =========================================================
   PROTEGER ÁREA DO CLIENTE
========================================================= */

function protegerAreaCliente() {

    const painel =
        document.getElementById(
            "painelCliente"
        );


    if (!painel) {

        return;
    }


    /*
     * Sem login:
     * painel nunca pode aparecer.
     */

    if (!clienteLogado) {

        painel.style.display =
            "none";

        return;
    }


    /*
     * Com login:
     * painel pode aparecer.
     */

    painel.style.display =
        "flex";
}


/* =========================================================
   ATUALIZAR MENU DO CLIENTE
========================================================= */

function atualizarMenuCliente() {

    if (!clienteLogado) {

        return;
    }


    const nome =
        clienteLogado.nome ||
        "Cliente";


    const elementoTopo =
        document.getElementById(
            "nomeClienteTopo"
        );


    if (elementoTopo) {

        elementoTopo.textContent =
            nome;
    }


    const elementoLogado =
        document.getElementById(
            "nomeClienteLogado"
        );


    if (elementoLogado) {

        elementoLogado.textContent =
            nome;
    }
}


/* =========================================================
   ABRIR DASHBOARD CLIENTE
========================================================= */

function abrirDashboardCliente() {

    if (!clienteLogado) {

        abrirAreaCliente();

        return;
    }


    const botao =
        document.querySelector(
            ".cliente-menu-link"
        );


    mostrarTelaCliente(
        "clienteDashboard",
        botao
    );
}


/* =========================================================
   ABRIR MEUS CHAMADOS
========================================================= */

function abrirMeusChamadosCliente() {

    if (!clienteLogado) {

        abrirAreaCliente();

        return;
    }


    mostrarTelaCliente(
        "meusChamadosCliente"
    );
}


/* =========================================================
   ABRIR NOTIFICAÇÕES
========================================================= */

function abrirNotificacoesCliente() {

    if (!clienteLogado) {

        abrirAreaCliente();

        return;
    }


    mostrarTelaCliente(
        "notificacoesCliente"
    );


    renderizarNotificacoesCliente();
}


/* =========================================================
   ABRIR HISTÓRICO
========================================================= */

function abrirHistoricoCliente() {

    if (!clienteLogado) {

        abrirAreaCliente();

        return;
    }


    mostrarTelaCliente(
        "historicoCliente"
    );


    renderizarHistoricoCliente();
}


/* =========================================================
   ABRIR PERFIL
========================================================= */

function abrirPerfilCliente() {

    if (!clienteLogado) {

        abrirAreaCliente();

        return;
    }


    mostrarTelaCliente(
        "perfilCliente"
    );


    atualizarPerfilCliente();
}


/* =========================================================
   FIM DA PARTE 6/10
========================================================= */
/* =========================================================
   PARTE 7/10
   SEGURANÇA DA ÁREA DO CLIENTE
   PERFIL
   LOGOUT
========================================================= */


/* =========================================================
   VERIFICAR SE CLIENTE ESTÁ LOGADO
========================================================= */

function clienteEstaLogado() {

    /*
     * Primeiro verifica a variável atual.
     */

    if (clienteLogado) {

        return true;
    }


    /*
     * Depois tenta recuperar a sessão.
     */

    const sessao =
        sessionStorage.getItem(
            "clienteLogado"
        );


    if (!sessao) {

        return false;
    }


    try {

        const dados =
            JSON.parse(
                sessao
            );


        if (
            dados &&
            dados.nome &&
            dados.email
        ) {

            clienteLogado =
                dados;

            return true;
        }

    } catch (erro) {

        console.error(
            "Erro ao recuperar login do cliente:",
            erro
        );

        sessionStorage.removeItem(
            "clienteLogado"
        );
    }


    return false;
}


/* =========================================================
   PROTEGER PAINEL DO CLIENTE
========================================================= */

function protegerPainelCliente() {

    const area =
        document.getElementById(
            "areaCliente"
        );

    const login =
        document.getElementById(
            "loginCliente"
        );

    const painel =
        document.getElementById(
            "painelCliente"
        );


    /*
     * Se não existe a área no HTML,
     * não faz nada.
     */

    if (!area) {

        return;
    }


    /*
     * CLIENTE NÃO LOGADO
     */

    if (
        !clienteEstaLogado()
    ) {

        if (painel) {

            painel.style.display =
                "none";
        }


        if (login) {

            login.style.display =
                "block";
        }

        return;
    }


    /*
     * CLIENTE LOGADO
     */

    if (login) {

        login.style.display =
            "none";
    }


    if (painel) {

        painel.style.display =
            "flex";
    }
}


/* =========================================================
   ABRIR ÁREA DO CLIENTE COM SEGURANÇA
========================================================= */

function abrirAreaClienteSegura() {

    esconderTudoPrincipal();


    const area =
        document.getElementById(
            "areaCliente"
        );


    const login =
        document.getElementById(
            "loginCliente"
        );


    const painel =
        document.getElementById(
            "painelCliente"
        );


    if (!area) {

        console.error(
            "Área do cliente não encontrada."
        );

        return;
    }


    area.style.display =
        "block";


    /*
     * SEM LOGIN
     */

    if (
        !clienteEstaLogado()
    ) {

        if (login) {

            login.style.display =
                "block";
        }


        if (painel) {

            painel.style.display =
                "none";
        }


        /*
         * Limpa telas internas
         * para evitar que o painel
         * apareça por trás do login.
         */

        esconderTelasCliente();


        return;
    }


    /*
     * COM LOGIN
     */

    if (login) {

        login.style.display =
            "none";
    }


    if (painel) {

        painel.style.display =
            "flex";
    }


    atualizarDadosCliente();

    atualizarMenuCliente();

    atualizarDashboardCliente();

    renderizarChamadosCliente();

    renderizarNotificacoesCliente();

    renderizarHistoricoCliente();


    /*
     * Abre a página inicial do cliente.
     */

    mostrarTelaClientePorId(
        "clienteDashboard"
    );
}


/* =========================================================
   ESCONDER TELAS INTERNAS DO CLIENTE
========================================================= */

function esconderTelasCliente() {

    const telas =
        document.querySelectorAll(
            ".cliente-tela"
        );


    telas.forEach(
        function (tela) {

            tela.style.display =
                "none";

            tela.classList.remove(
                "ativo"
            );
        }
    );
}


/* =========================================================
   LOGOUT DO CLIENTE
========================================================= */

function sairCliente() {

    const confirmou =
        confirm(
            "Deseja realmente sair da Área do Cliente?"
        );


    if (!confirmou) {

        return;
    }


    /*
     * Apaga a sessão.
     */

    clienteLogado =
        null;


    sessionStorage.removeItem(
        "clienteLogado"
    );


    /*
     * Limpa o chamado selecionado.
     */

    chamadoSelecionado =
        null;


    /*
     * Esconde o painel.
     */

    const painel =
        document.getElementById(
            "painelCliente"
        );


    if (painel) {

        painel.style.display =
            "none";
    }


    /*
     * Fecha assistente de IA,
     * caso exista.
     */

    if (
        typeof fecharAssistenteIA ===
        "function"
    ) {

        fecharAssistenteIA();
    }


    /*
     * Volta para a tela inicial.
     */

    voltarTelaEscolha();
}


/* =========================================================
   ALTERAR DADOS DO PERFIL
========================================================= */

function salvarPerfilCliente() {

    if (
        !clienteEstaLogado()
    ) {

        alert(
            "Faça login para alterar seu perfil."
        );

        abrirAreaClienteSegura();

        return;
    }


    const nome =
        document
            .getElementById(
                "perfilNomeInput"
            )
            ?.value
            .trim();


    const email =
        document
            .getElementById(
                "perfilEmailInput"
            )
            ?.value
            .trim();


    /*
     * Se os campos não existirem,
     * não interrompe o sistema.
     */

    const novoNome =
        nome ||
        clienteLogado.nome;


    const novoEmail =
        email ||
        clienteLogado.email;


    if (!novoNome) {

        alert(
            "Informe seu nome."
        );

        return;
    }


    if (!novoEmail) {

        alert(
            "Informe seu e-mail."
        );

        return;
    }


    const emailAnterior =
        clienteLogado.email;


    /*
     * Atualiza sessão.
     */

    clienteLogado = {

        nome:
            novoNome,

        email:
            novoEmail
    };


    sessionStorage.setItem(
        "clienteLogado",
        JSON.stringify(
            clienteLogado
        )
    );


    /*
     * Atualiza os chamados antigos
     * caso o e-mail tenha sido alterado.
     */

    if (
        emailAnterior !==
        novoEmail
    ) {

        chamados.forEach(
            function (chamado) {

                if (
                    chamado.clienteEmail ===
                    emailAnterior
                ) {

                    chamado.clienteEmail =
                        novoEmail;
                }


                if (
                    chamado.email ===
                    emailAnterior
                ) {

                    chamado.email =
                        novoEmail;
                }

            }
        );


        /*
         * Atualiza notificações.
         */

        notificacoes.forEach(
            function (notificacao) {

                if (
                    notificacao.clienteEmail ===
                    emailAnterior
                ) {

                    notificacao.clienteEmail =
                        novoEmail;
                }


                if (
                    notificacao.cliente ===
                    emailAnterior
                ) {

                    notificacao.cliente =
                        novoEmail;
                }

            }
        );
    }


    salvarDados();


    atualizarDadosCliente();

    atualizarMenuCliente();

    atualizarPerfilCliente();


    alert(
        "Perfil atualizado com sucesso!"
    );
}


/* =========================================================
   PREENCHER CAMPOS DO PERFIL
========================================================= */

function preencherPerfilCliente() {

    if (
        !clienteEstaLogado()
    ) {

        return;
    }


    const campoNome =
        document.getElementById(
            "perfilNomeInput"
        );


    const campoEmail =
        document.getElementById(
            "perfilEmailInput"
        );


    if (campoNome) {

        campoNome.value =
            clienteLogado.nome;
    }


    if (campoEmail) {

        campoEmail.value =
            clienteLogado.email;
    }


    const nome =
        document.getElementById(
            "perfilNomeCliente"
        );


    const email =
        document.getElementById(
            "perfilEmailCliente"
        );


    if (nome) {

        nome.textContent =
            clienteLogado.nome;
    }


    if (email) {

        email.textContent =
            clienteLogado.email;
    }
}


/* =========================================================
   ATUALIZAR PERFIL
========================================================= */

function atualizarPerfilCliente() {

    if (
        !clienteEstaLogado()
    ) {

        return;
    }


    preencherPerfilCliente();
}


/* =========================================================
   BLOQUEAR ACESSO DIRETO ÀS TELAS
========================================================= */

function verificarAcessoCliente(
    tela
) {

    if (
        !clienteEstaLogado()
    ) {

        alert(
            "Você precisa fazer login para acessar esta área."
        );

        abrirAreaClienteSegura();

        return false;
    }


    if (!tela) {

        return true;
    }


    return true;
}


/* =========================================================
   MOSTRAR TELA DO CLIENTE — VERSÃO PROTEGIDA
========================================================= */

function mostrarTelaClienteProtegida(
    id,
    botao
) {

    /*
     * Toda tela interna exige login.
     */

    if (
        !verificarAcessoCliente(
            id
        )
    ) {

        return;
    }


    /*
     * Esconde as demais telas.
     */

    esconderTelasCliente();


    const tela =
        document.getElementById(
            id
        );


    if (!tela) {

        console.warn(
            "Tela não encontrada:",
            id
        );

        return;
    }


    tela.style.display =
        "block";


    tela.classList.add(
        "ativo"
    );


    /*
     * Atualizar botão ativo.
     */

    document
        .querySelectorAll(
            ".cliente-menu-link"
        )
        .forEach(
            function (item) {

                item.classList.remove(
                    "ativo"
                );
            }
        );


    if (botao) {

        botao.classList.add(
            "ativo"
        );
    }


    /*
     * Atualizações.
     */

    if (
        id ===
        "clienteDashboard"
    ) {

        atualizarDashboardCliente();

        renderizarChamadosCliente();
    }


    if (
        id ===
        "abrirChamadoCliente"
    ) {

        prepararFormularioNovoChamado();
    }


    if (
        id ===
        "meusChamadosCliente"
    ) {

        renderizarChamadosCliente();
    }


    if (
        id ===
        "notificacoesCliente"
    ) {

        renderizarNotificacoesCliente();
    }


    if (
        id ===
        "historicoCliente"
    ) {

        renderizarHistoricoCliente();
    }


    if (
        id ===
        "perfilCliente"
    ) {

        atualizarPerfilCliente();
    }
}


/* =========================================================
   ATUALIZAR SESSÃO AUTOMATICAMENTE
========================================================= */

function restaurarSessaoCliente() {

    const sessao =
        sessionStorage.getItem(
            "clienteLogado"
        );


    if (!sessao) {

        clienteLogado =
            null;

        return;
    }


    try {

        const dados =
            JSON.parse(
                sessao
            );


        if (
            dados &&
            dados.nome &&
            dados.email
        ) {

            clienteLogado =
                dados;

        } else {

            clienteLogado =
                null;

            sessionStorage.removeItem(
                "clienteLogado"
            );
        }

    } catch (erro) {

        console.error(
            "Erro na sessão do cliente:",
            erro
        );

        clienteLogado =
            null;

        sessionStorage.removeItem(
            "clienteLogado"
        );
    }
}


/* =========================================================
   INICIALIZAÇÃO DA PROTEÇÃO
========================================================= */

function iniciarProtecaoCliente() {

    restaurarSessaoCliente();


    /*
     * Se não estiver logado,
     * o painel obrigatoriamente fica escondido.
     */

    if (
        !clienteLogado
    ) {

        const painel =
            document.getElementById(
                "painelCliente"
            );


        if (painel) {

            painel.style.display =
                "none";
        }
    }
}


/* =========================================================
   FIM DA PARTE 7/10
========================================================= */
/* =========================================================
   PARTE 8/10
   INICIALIZAÇÃO E CONTROLE DE ACESSO
========================================================= */


/* =========================================================
   INICIALIZAR SISTEMA
========================================================= */

function inicializarSistema() {

    console.log(
        "Inicializando Central de Atendimento..."
    );


    /*
     * Recupera a sessão do cliente.
     */

    restaurarSessaoCliente();


    /*
     * Aplica as configurações salvas.
     */

    if (
        typeof aplicarConfiguracoes ===
        "function"
    ) {

        aplicarConfiguracoes();
    }


    /*
     * Garante que nenhuma área protegida
     * apareça antes do login.
     */

    bloquearAreasSemLogin();


    /*
     * Atualiza os dados gerais.
     */

    if (
        typeof atualizarTudo ===
        "function"
    ) {

        atualizarTudo();
    }


    /*
     * Atualiza dados do cliente somente
     * se existir uma sessão válida.
     */

    if (clienteLogado) {

        atualizarDadosCliente();

        atualizarMenuCliente();
    }


    /*
     * IMPORTANTE:
     * o sistema começa na tela de escolha.
     */

    abrirTelaInicial();
}


/* =========================================================
   ABRIR TELA INICIAL
========================================================= */

function abrirTelaInicial() {

    /*
     * Esconde todas as áreas.
     */

    const ids = [

        "areaCliente",

        "loginCliente",

        "painelCliente",

        "loginAdministrativo",

        "sistema"

    ];


    ids.forEach(
        function (id) {

            const elemento =
                document.getElementById(
                    id
                );


            if (elemento) {

                elemento.style.display =
                    "none";
            }
        }
    );


    /*
     * Mostra somente a tela de escolha.
     */

    const tela =
        document.getElementById(
            "telaEscolha"
        );


    if (tela) {

        tela.style.display =
            "flex";
    }
}


/* =========================================================
   BLOQUEAR ÁREAS SEM LOGIN
========================================================= */

function bloquearAreasSemLogin() {

    const areaCliente =
        document.getElementById(
            "areaCliente"
        );


    const painelCliente =
        document.getElementById(
            "painelCliente"
        );


    const sistema =
        document.getElementById(
            "sistema"
        );


    /*
     * =========================================
     * CLIENTE
     * =========================================
     */

    if (!clienteLogado) {

        if (painelCliente) {

            painelCliente.style.display =
                "none";
        }
    }


    /*
     * =========================================
     * ADMINISTRATIVO
     * =========================================
     *
     * O sistema administrativo também
     * não pode ficar visível na abertura.
     */

    if (sistema) {

        sistema.style.display =
            "none";
    }


    /*
     * A área do cliente inteira
     * também começa escondida.
     */

    if (areaCliente) {

        areaCliente.style.display =
            "none";
    }
}


/* =========================================================
   ABRIR ÁREA CLIENTE
========================================================= */

function abrirAreaCliente() {

    console.log(
        "Abrindo Área do Cliente..."
    );


    /*
     * Esconde tudo.
     */

    const telaEscolha =
        document.getElementById(
            "telaEscolha"
        );


    const areaCliente =
        document.getElementById(
            "areaCliente"
        );


    const loginCliente =
        document.getElementById(
            "loginCliente"
        );


    const painelCliente =
        document.getElementById(
            "painelCliente"
        );


    const sistema =
        document.getElementById(
            "sistema"
        );


    if (telaEscolha) {

        telaEscolha.style.display =
            "none";
    }


    if (sistema) {

        sistema.style.display =
            "none";
    }


    /*
     * Mostra a área do cliente.
     */

    if (!areaCliente) {

        console.error(
            "ERRO: #areaCliente não existe."
        );

        return;
    }


    areaCliente.style.display =
        "block";


    /*
     * =========================================
     * SEM LOGIN
     * =========================================
     */

    if (!clienteEstaLogado()) {

        console.log(
            "Cliente não está logado."
        );


        if (loginCliente) {

            loginCliente.style.display =
                "block";
        }


        if (painelCliente) {

            painelCliente.style.display =
                "none";
        }


        /*
         * Garante que nenhuma tela
         * interna apareça.
         */

        esconderTelasCliente();


        return;
    }


    /*
     * =========================================
     * COM LOGIN
     * =========================================
     */

    console.log(
        "Cliente autenticado:",
        clienteLogado.nome
    );


    if (loginCliente) {

        loginCliente.style.display =
            "none";
    }


    if (painelCliente) {

        painelCliente.style.display =
            "flex";
    }
/* =========================================================
   MOSTRAR EMPRESA ATIVA NO PAINEL DO CLIENTE
========================================================= */

const empresaAtivaCliente =
    document.getElementById("empresaAtivaCliente");

const nomeEmpresaCliente =
    document.getElementById("nomeEmpresaCliente");

if (modoSistema === "comercial") {

    if (empresaAtivaCliente) {
        empresaAtivaCliente.style.display = "block";
    }

    if (nomeEmpresaCliente) {
        nomeEmpresaCliente.textContent =
            nomeEmpresaAtual();
    }

} else {

    if (empresaAtivaCliente) {
        empresaAtivaCliente.style.display = "none";
    }

}

    /*
     * Atualiza informações.
     */

    atualizarDadosCliente();

    atualizarMenuCliente();


    /*
     * Abre dashboard.
     */

    mostrarTelaCliente(
        "clienteDashboard"
    );
}


/* =========================================================
   ABRIR ÁREA ADMINISTRATIVA
========================================================= */
/* =========================================================
   ABRIR SISTEMA ADMINISTRATIVO
========================================================= */

function abrirSistemaAdministrativo() {

    console.log(
        "Login administrativo autorizado."
    );


    /*
     * Esconde tudo.
     */

    const telaEscolha =
        document.getElementById(
            "telaEscolha"
        );


    const areaCliente =
        document.getElementById(
            "areaCliente"
        );


    const login =
        document.getElementById(
            "loginAdministrativo"
        );


    const sistema =
        document.getElementById(
            "sistema"
        );


    if (telaEscolha) {

        telaEscolha.style.display =
            "none";
    }


    if (areaCliente) {

        areaCliente.style.display =
            "none";
    }


    if (login) {

        login.style.display =
            "none";
    }


    if (sistema) {

        sistema.style.display =
            "block";
    }


    /*
     * Atualiza o painel administrativo.
     */

    if (
        typeof atualizarTudo ===
        "function"
    ) {

        atualizarTudo();

    }


    /*
     * Atualiza a lista de chamados
     * depois que o painel estiver visível.
     */

    if (
        typeof renderizarChamadosAdmin ===
        "function"
    ) {

        renderizarChamadosAdmin();

    }

}


/* =========================================================
   VOLTAR PARA TELA DE ESCOLHA
========================================================= */

function voltarTelaEscolha() {

    console.log(
        "Voltando para tela inicial..."
    );


    /*
     * Esconde todas as áreas.
     */

    const ids = [

        "areaCliente",

        "loginCliente",

        "painelCliente",

        "loginAdministrativo",

        "sistema"

    ];


    ids.forEach(
        function (id) {

            const elemento =
                document.getElementById(
                    id
                );


            if (elemento) {

                elemento.style.display =
                    "none";
            }
        }
    );


    /*
     * Mostra tela inicial.
     */

    const tela =
        document.getElementById(
            "telaEscolha"
        );


    if (tela) {

        tela.style.display =
            "flex";
    }
}


/* =========================================================
   ESCONDER TUDO PRINCIPAL
========================================================= */

function esconderTudoPrincipal() {

    const ids = [

        "telaEscolha",

        "areaCliente",

        "loginCliente",

        "painelCliente",

        "loginAdministrativo",

        "sistema"

    ];


    ids.forEach(
        function (id) {

            const elemento =
                document.getElementById(
                    id
                );


            if (elemento) {

                elemento.style.display =
                    "none";
            }
        }
    );
}


/* =========================================================
   GARANTIR LOGIN ANTES DE ABRIR MENU
========================================================= */

function acessarMenuCliente(
    idTela,
    botao
) {

    /*
     * Sem login não entra.
     */

    if (!clienteEstaLogado()) {

        alert(
            "Você precisa fazer login para acessar esta área."
        );


        abrirAreaCliente();

        return;
    }


    /*
     * Com login, abre normalmente.
     */

    mostrarTelaCliente(
        idTela,
        botao
    );
}


/* =========================================================
   FIM DA PARTE 8/10
========================================================= */
/* =========================================================
   PARTE 9/10
   LOGIN ADMINISTRATIVO + INICIALIZAÇÃO FINAL
========================================================= */


/* =========================================================
   CONFIGURAR LOGIN ADMINISTRATIVO
========================================================= */

function configurarLoginAdmin() {

    const form =
        document.getElementById(
            "formLoginAdmin"
        );


    if (!form) {

        console.warn(
            "Formulário administrativo não encontrado."
        );

        return;
    }


    /*
     * Evita cadastrar o evento duas vezes.
     */

    if (
        form.dataset.loginConfigurado ===
        "true"
    ) {

        return;
    }


    form.dataset.loginConfigurado =
        "true";


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const usuario =
                document
                    .getElementById(
                        "loginAdminUsuario"
                    )
                    ?.value
                    .trim();


            const senha =
                document
                    .getElementById(
                        "loginAdminSenha"
                    )
                    ?.value;


            const mensagem =
                document.getElementById(
                    "mensagemLoginAdmin"
                );


            /* =========================================
               VALIDAR CAMPOS
            ========================================= */

            if (
                !usuario ||
                !senha
            ) {

                if (mensagem) {

                    mensagem.textContent =
                        "Preencha usuário e senha.";

                    mensagem.style.color =
                        "#dc2626";
                }

                return;
            }


            /* =========================================
               ACESSO ADMINISTRATIVO
               
               USUÁRIO: admin
               SENHA: admin123
            ========================================= */

            if (
                usuario === "admin" &&
                senha === "admin123"
            ) {

                /*
                 * Cria sessão administrativa.
                 */

                sessionStorage.setItem(
                    "adminLogado",
                    "true"
                );


                if (mensagem) {

                    mensagem.textContent =
                        "Login realizado com sucesso!";

                    mensagem.style.color =
                        "#16a34a";
                }


                /*
                 * Abre o sistema.
                 */

                setTimeout(
                    function () {

                        abrirSistemaAdministrativo();

                    },
                    300
                );


            } else {

                /*
                 * Login incorreto.
                 */

                if (mensagem) {

                    mensagem.textContent =
                        "Usuário ou senha incorretos.";

                    mensagem.style.color =
                        "#dc2626";
                }

            }

        }
    );
}


/* =========================================================
   VERIFICAR LOGIN ADMINISTRATIVO
========================================================= */

function adminEstaLogado() {

    return (
        sessionStorage.getItem(
            "adminLogado"
        ) === "true"
    );
}


/* =========================================================
   ABRIR SISTEMA ADMINISTRATIVO COM PROTEÇÃO
========================================================= */

function abrirSistemaAdministrativoSeguro() {

    /*
     * Sem login:
     * mostra somente o login administrativo.
     */

    if (!adminEstaLogado()) {

        abrirAreaAdministrativa();

        return;
    }


    /*
     * Com login:
     * abre a central.
     */

    abrirSistemaAdministrativo();
}


/* =========================================================
   SAIR DO ADMINISTRATIVO
========================================================= */

function sairAdministrativo() {

    /*
     * Remove sessão.
     */

    sessionStorage.removeItem(
        "adminLogado"
    );


    /*
     * Fecha o sistema.
     */

    const sistema =
        document.getElementById(
            "sistema"
        );


    if (sistema) {

        sistema.style.display =
            "none";
    }


    /*
     * Volta para tela inicial.
     */

    voltarTelaEscolha();
}


/* =========================================================
   CORRIGIR BOTÃO SAIR ADMIN
========================================================= */

function configurarBotaoSairAdmin() {

    const btn =
        document.getElementById(
            "btnSair"
        );


    if (!btn) {

        return;
    }


    /*
     * Evita evento duplicado.
     */

    if (
        btn.dataset.sairConfigurado ===
        "true"
    ) {

        return;
    }


    btn.dataset.sairConfigurado =
        "true";


    btn.addEventListener(
        "click",
        function () {

            sairAdministrativo();

        }
    );
}


/* =========================================================
   PROTEGER SISTEMA ADMINISTRATIVO
========================================================= */

function protegerSistemaAdministrativo() {

    const sistema =
        document.getElementById(
            "sistema"
        );


    if (!sistema) {

        return;
    }


    /*
     * Se não estiver logado,
     * o sistema administrativo permanece oculto.
     */

    if (!adminEstaLogado()) {

        sistema.style.display =
            "none";
    }
}


/* =========================================================
   PROTEGER ÁREA CLIENTE AO CARREGAR
========================================================= */

function protegerClienteAoCarregar() {

    restaurarSessaoCliente();


    const painel =
        document.getElementById(
            "painelCliente"
        );


    const area =
        document.getElementById(
            "areaCliente"
        );


    /*
     * Sem sessão:
     * tudo fica fechado.
     */

    if (!clienteLogado) {

        if (painel) {

            painel.style.display =
                "none";
        }


        if (area) {

            area.style.display =
                "none";
        }

        return;
    }


    /*
     * Com sessão:
     * painel pode ser aberto somente
     * quando o usuário clicar na Área Cliente.
     */

    if (painel) {

        painel.style.display =
            "none";
    }


    if (area) {

        area.style.display =
            "none";
    }
}


/* =========================================================
   CORRIGIR ESTADO INICIAL DAS TELAS
========================================================= */

function corrigirEstadoInicial() {

    const telaEscolha =
        document.getElementById(
            "telaEscolha"
        );


    const areaCliente =
        document.getElementById(
            "areaCliente"
        );


    const painelCliente =
        document.getElementById(
            "painelCliente"
        );


    const loginAdmin =
        document.getElementById(
            "loginAdministrativo"
        );


    const sistema =
        document.getElementById(
            "sistema"
        );


    /*
     * =========================================
     * TELA INICIAL
     * =========================================
     */

    if (telaEscolha) {

        telaEscolha.style.display =
            "flex";
    }


    /*
     * =========================================
     * CLIENTE
     * =========================================
     */

    if (areaCliente) {

        areaCliente.style.display =
            "none";
    }


    if (painelCliente) {

        painelCliente.style.display =
            "none";
    }


    /*
     * =========================================
     * ADMIN
     * =========================================
     */

    if (loginAdmin) {

        loginAdmin.style.display =
            "none";
    }


    if (sistema) {

        sistema.style.display =
            "none";
    }
}


/* =========================================================
   INICIALIZAÇÃO ÚNICA
========================================================= */

function iniciarAplicacao() {

    console.log(
        "================================="
    );

    console.log(
        "CENTRAL DE ATENDIMENTO"
    );

    console.log(
        "Inicializando aplicação..."
    );


    /*
     * Corrige estado visual.
     */

    corrigirEstadoInicial();


    /*
     * Recupera sessão do cliente.
     */

    restaurarSessaoCliente();


    /*
     * Protege as áreas.
     */

    protegerClienteAoCarregar();

    protegerSistemaAdministrativo();


    /*
     * Configura formulários.
     */

    configurarLoginCliente();

    configurarLoginAdmin();

    configurarBotaoSairAdmin();


    /*
     * Formulários do sistema.
     */

    if (
        typeof configurarFormularioChamado ===
        "function"
    ) {

        configurarFormularioChamado();
    }


    if (
        typeof configurarFormularioChamadoCliente ===
        "function"
    ) {

        configurarFormularioChamadoCliente();
    }


    if (
        typeof configurarFormularioAtendente ===
        "function"
    ) {

        configurarFormularioAtendente();
    }


    if (
        typeof configurarFormularioEdicao ===
        "function"
    ) {

        configurarFormularioEdicao();
    }


    if (
        typeof configurarFiltros ===
        "function"
    ) {

        configurarFiltros();
    }


    if (
        typeof configurarMenu ===
        "function"
    ) {

        configurarMenu();
    }


    /*
     * Configurações.
     */

    if (
        typeof aplicarConfiguracoes ===
        "function"
    ) {

        aplicarConfiguracoes();
    }


    /*
     * Atualiza dados.
     */

    if (
        typeof atualizarTudo ===
        "function"
    ) {

        atualizarTudo();
    }


    /*
     * Se existe cliente logado,
     * atualiza os dados dele,
     * mas NÃO abre automaticamente
     * a Área do Cliente.
     */

    if (clienteLogado) {

        atualizarDadosCliente();

        atualizarMenuCliente();
    }


    console.log(
        "Sistema inicializado com sucesso."
    );
}


/* =========================================================
   INICIAR QUANDO O HTML TERMINAR DE CARREGAR
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarAplicacao
    );

} else {

    iniciarAplicacao();
}


/* =========================================================
   FIM DA PARTE 9/10
========================================================= */



/* =========================================================
   ABRIR ASSISTENTE IA
========================================================= */

function abrirAssistenteIA() {

    /*
     * A IA só pode ser utilizada
     * dentro de uma sessão válida.
     */

    if (
        !clienteEstaLogado() &&
        !adminEstaLogado()
    ) {

        alert(
            "Faça login para utilizar o Assistente IA."
        );

        return;
    }


    /*
     * Se já estiver aberto,
     * apenas coloca o cursor no campo.
     */

    const existente =
        document.getElementById(
            "janelaAssistenteIA"
        );


    if (existente) {

        document
            .getElementById(
                "entradaAssistenteIA"
            )
            ?.focus();

        return;
    }


    /*
     * Cria a janela.
     */

    const janela =
        document.createElement(
            "div"
        );


    janela.id =
        "janelaAssistenteIA";


    janela.innerHTML = `

        <div class="assistente-ia-janela">

            <div class="assistente-ia-topo">

                <div
                    class="assistente-ia-topo-info"
                >

                    <div
                        class="assistente-ia-avatar"
                    >
                        🤖
                    </div>

                    <div>

                        <strong>
                            Assistente IA
                        </strong>

                        <small>
                            Online
                        </small>

                    </div>

                </div>


                <button
                    type="button"
                    class="assistente-ia-fechar"
                    onclick="fecharAssistenteIA()"
                    aria-label="Fechar"
                >
                    ×
                </button>

            </div>


            <div
                id="assistenteIAMensagens"
                class="assistente-ia-mensagens"
            >

                <div
                    class="mensagem-ia mensagem-ia-bot"
                >

                    <div
                        class="mensagem-ia-avatar"
                    >
                        🤖
                    </div>

                    <div
                        class="mensagem-ia-balao"
                    >

                        Olá! 👋

                        <br><br>

                        Sou o Assistente IA da
                        Central de Atendimento.

                        <br><br>

                        Posso ajudar com dúvidas
                        sobre chamados, status,
                        notificações e utilização
                        do sistema.

                    </div>

                </div>

            </div>


            <form
                id="formAssistenteIA"
                class="assistente-ia-form"
            >

                <input
                    type="text"
                    id="entradaAssistenteIA"
                    placeholder="Digite sua pergunta..."
                    autocomplete="off"
                    maxlength="1000"
                    required
                >


                <button
                    type="submit"
                    class="btn-enviar-ia"
                    aria-label="Enviar"
                >
                    ➤
                </button>

            </form>


            <div
                class="assistente-ia-rodape"
            >

                🤖 Assistente virtual

            </div>

        </div>

    `;


    document.body.appendChild(
        janela
    );


    adicionarEstiloAssistenteIA();


    const form =
        document.getElementById(
            "formAssistenteIA"
        );


    if (form) {

        form.addEventListener(
            "submit",
            enviarMensagemAssistenteIA
        );
    }


    document
        .getElementById(
            "entradaAssistenteIA"
        )
        ?.focus();
}
/* =========================================================
   ENVIAR PERGUNTA PARA IA
========================================================= */

async function enviarMensagemAssistenteIA(event) {

    event.preventDefault();

    const campo = document.getElementById("entradaAssistenteIA");
    const botao = document.querySelector(".btn-enviar-ia");

    if (!campo || !botao) {
        return;
    }

    const texto = campo.value.trim();

    if (!texto) {
        return;
    }

    adicionarMensagemIA("user", texto);

    historicoAssistenteIA.push({
        role: "user",
        content: texto
    });

    campo.value = "";
    campo.disabled = true;
    botao.disabled = true;

    const digitando = adicionarDigitandoIA();

    try {

        const resposta = await consultarAssistenteIA(texto);

        if (digitando) {
            digitando.remove();
        }

        adicionarMensagemIA("bot", resposta);

        historicoAssistenteIA.push({
            role: "assistant",
            content: resposta
        });

    } catch (erro) {

        console.error("Erro ao conectar com o backend:", erro);

        if (digitando) {
            digitando.remove();
        }

        adicionarMensagemIA(
            "bot",
            "Não foi possível conectar ao servidor da IA."
        );

    } finally {

        campo.disabled = false;
        botao.disabled = false;
        campo.focus();

    }
}


/* =========================================================
   CONSULTAR BACKEND DA IA
=/* =========================================================
   CONSULTAR ASSISTENTE IA
========================================================= */
async function consultarAssistenteIA(texto) {

    const resposta =
        await fetch(
            URL_ASSISTENTE_IA + "/api/assistente",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    mensagem:
                        texto,

                    historico:
                        historicoAssistenteIA,

                    cliente:
                        clienteLogado,

                    chamados:
                        chamados,

                    notificacoes:
                        notificacoes,

                    historicoGeral:
                        historicoGeral

                })

            }
        );


    if (!resposta.ok) {

        throw new Error(
            "Erro ao consultar servidor da IA."
        );

    }


    const dados =
        await resposta.json();


    if (
        !dados ||
        !dados.resposta
    ) {

        throw new Error(
            "Resposta inválida da IA."
        );

    }


    return dados.resposta;

}

/* =========================================================
   RESPOSTAS LOCAIS DA IA
========================================================= */

function gerarRespostaLocalIA(
    pergunta
) {

    const texto =
        String(
            pergunta || ""
        )
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );


    /* =========================================
       SAUDAÇÃO
    ========================================= */

    if (
        texto.includes("oi") ||
        texto.includes("ola") ||
        texto.includes("bom dia") ||
        texto.includes("boa tarde") ||
        texto.includes("boa noite")
    ) {

        return `
            Olá! 👋

            Posso ajudar você com dúvidas
            sobre seus chamados, status,
            notificações, histórico e utilização
            da Central de Atendimento.
        `;
    }


    /* =========================================
       NOVO CHAMADO
    ========================================= */

    if (
        texto.includes("abrir chamado") ||
        texto.includes("novo chamado") ||
        texto.includes("criar chamado")
    ) {

        return `
            Para abrir um chamado, acesse
            <strong>🎫 Abrir chamado</strong>
            no menu da Área do Cliente.

            Depois preencha os dados da solicitação
            e envie o formulário.
        `;
    }


    /* =========================================
       MEUS CHAMADOS
    ========================================= */

    if (
        texto.includes("meus chamados") ||
        texto.includes("chamados")
    ) {

        return `
            Para consultar suas solicitações,
            acesse <strong>📋 Meus chamados</strong>.

            Lá você poderá acompanhar os chamados
            associados ao seu e-mail.
        `;
    }


    /* =========================================
       NOTIFICAÇÕES
    ========================================= */

    if (
        texto.includes("notificacao") ||
        texto.includes("notificacoes")
    ) {

        return `
            As atualizações dos seus chamados
            aparecem em <strong>🔔 Notificações</strong>.
        `;
    }


    /* =========================================
       HISTÓRICO
    ========================================= */

    if (
        texto.includes("historico")
    ) {

        return `
            O menu <strong>📜 Histórico</strong>
            mostra as atividades relacionadas
            aos seus chamados.
        `;
    }


    /* =========================================
       PERFIL
    ========================================= */

    if (
        texto.includes("perfil") ||
        texto.includes("meus dados") ||
        texto.includes("meu cadastro")
    ) {

        return `
            Seus dados de acesso podem ser consultados
            em <strong>👤 Meu perfil</strong>.
        `;
    }


    /* =========================================
       STATUS ABERTO
    ========================================= */

    if (
        texto.includes("aberto") ||
        texto.includes("abertos")
    ) {

        return `
            <strong>Aberto</strong> significa que
            o chamado foi registrado e ainda aguarda
            atendimento ou andamento.
        `;
    }


    /* =========================================
       STATUS EM ANDAMENTO
    ========================================= */

    if (
        texto.includes("em andamento") ||
        texto.includes("andamento")
    ) {

        return `
            <strong>Em andamento</strong> significa
            que o chamado está sendo analisado
            ou atendido pela equipe responsável.
        `;
    }


    /* =========================================
       STATUS RESOLVIDO
    ========================================= */

    if (
        texto.includes("resolvido") ||
        texto.includes("resolvidos")
    ) {

        return `
            <strong>Resolvido</strong> significa que
            o atendimento foi concluído.
        `;
    }


    /* =========================================
       LOGIN
    ========================================= */

    if (
        texto.includes("login") ||
        texto.includes("entrar") ||
        texto.includes("acesso")
    ) {

        return `
            Para acessar a Área do Cliente,
            informe seu <strong>nome</strong> e
            <strong>e-mail</strong> na tela de login.

            Depois clique em
            <strong>🔐 Entrar na minha área</strong>.
        `;
    }


    /* =========================================
       RESPOSTA PADRÃO
    ========================================= */

    return `
        Entendi sua pergunta. 🤖

        Posso ajudar com:

        • Abrir um chamado
        • Consultar meus chamados
        • Ver notificações
        • Consultar histórico
        • Consultar meu perfil
        • Entender o status de um chamado
        • Utilizar a Área do Cliente

        Tente fazer uma pergunta sobre um desses
        assuntos.
    `;
}


/* =========================================================
   ADICIONAR MENSAGEM NA IA
========================================================= */

function adicionarMensagemIA(
    tipo,
    texto
) {

    const mensagens =
        document.getElementById(
            "assistenteIAMensagens"
        );


    if (!mensagens) {

        return;
    }


    const elemento =
        document.createElement(
            "div"
        );


    elemento.className =
        tipo === "user"
            ? "mensagem-ia mensagem-ia-cliente"
            : "mensagem-ia mensagem-ia-bot";


    if (
        tipo ===
        "user"
    ) {

        const balao =
            document.createElement(
                "div"
            );


        balao.className =
            "mensagem-ia-balao";


        balao.textContent =
            texto;


        elemento.appendChild(
            balao
        );


    } else {

        elemento.innerHTML = `

            <div
                class="mensagem-ia-avatar"
            >
                🤖
            </div>

            <div
                class="mensagem-ia-balao"
            >

                ${formatarRespostaIA(
                    texto
                )}

            </div>

        `;
    }


    mensagens.appendChild(
        elemento
    );


    rolarChatIA();


    return elemento;
}


/* =========================================================
   INDICADOR DIGITANDO
========================================================= */

function adicionarDigitandoIA() {

    const mensagens =
        document.getElementById(
            "assistenteIAMensagens"
        );


    if (!mensagens) {

        return null;
    }


    const elemento =
        document.createElement(
            "div"
        );


    elemento.className =
        "mensagem-ia mensagem-ia-bot";


    elemento.innerHTML = `

        <div
            class="mensagem-ia-avatar"
        >
            🤖
        </div>

        <div
            class="mensagem-ia-balao ia-digitando"
        >

            <span></span>
            <span></span>
            <span></span>

        </div>

    `;


    mensagens.appendChild(
        elemento
    );


    rolarChatIA();


    return elemento;
}


/* =========================================================
   FORMATAR RESPOSTA IA
========================================================= */

function formatarRespostaIA(
    texto
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        texto;


    return div.innerHTML

        .replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        )

        .replace(
            /\n/g,
            "<br>"
        );
}


/* =========================================================
   ROLAR CHAT IA
========================================================= */

function rolarChatIA() {

    const mensagens =
        document.getElementById(
            "assistenteIAMensagens"
        );


    if (mensagens) {

        mensagens.scrollTop =
            mensagens.scrollHeight;
    }
}


/* =========================================================
   FECHAR IA
========================================================= */

function fecharAssistenteIA() {

    const janela =
        document.getElementById(
            "janelaAssistenteIA"
        );


    if (janela) {

        janela.remove();
    }
}


/* =========================================================
   ESTILO DO ASSISTENTE IA
========================================================= */

function adicionarEstiloAssistenteIA() {

    if (
        document.getElementById(
            "estiloAssistenteIA"
        )
    ) {

        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "estiloAssistenteIA";


    style.textContent = `

        #janelaAssistenteIA {

            position: fixed;

            right: 25px;

            bottom: 25px;

            width: 390px;

            max-width:
                calc(100vw - 30px);

            z-index: 99999;

            font-family:
                Arial,
                Helvetica,
                sans-serif;
        }


        .assistente-ia-janela {

            background: #fff;

            border-radius: 18px;

            overflow: hidden;

            box-shadow:
                0 15px 45px
                rgba(0,0,0,.20);

            border:
                1px solid #e5e7eb;

            display: flex;

            flex-direction: column;

            height: 570px;

            max-height:
                calc(100vh - 50px);
        }


        .assistente-ia-topo {

            padding:
                16px 18px;

            display: flex;

            align-items: center;

            justify-content:
                space-between;

            background: #f8fafc;

            border-bottom:
                1px solid #e5e7eb;
        }


        .assistente-ia-topo-info {

            display: flex;

            align-items: center;

            gap: 12px;
        }


        .assistente-ia-avatar {

            width: 42px;

            height: 42px;

            border-radius: 50%;

            display: flex;

            align-items: center;

            justify-content: center;

            background: #eef2ff;

            font-size: 22px;
        }


        .assistente-ia-topo-info strong {

            display: block;

            font-size: 15px;

            color: #111827;
        }


        .assistente-ia-topo-info small {

            display: block;

            margin-top: 3px;

            color: #16a34a;

            font-size: 12px;
        }


        .assistente-ia-fechar {

            border: none;

            background: transparent;

            font-size: 28px;

            cursor: pointer;

            color: #64748b;
        }


        .assistente-ia-mensagens {

            flex: 1;

            overflow-y: auto;

            padding: 18px;

            background: #f8fafc;
        }


        .mensagem-ia {

            display: flex;

            margin-bottom: 15px;

            gap: 9px;
        }


        .mensagem-ia-cliente {

            justify-content: flex-end;
        }


        .mensagem-ia-bot {

            justify-content: flex-start;
        }


        .mensagem-ia-balao {

            max-width: 82%;

            padding:
                11px 14px;

            border-radius: 14px;

            line-height: 1.5;

            font-size: 14px;

            background: #fff;

            border:
                1px solid #e5e7eb;
        }


        .mensagem-ia-cliente
        .mensagem-ia-balao {

            background: #eef2ff;
        }


        .mensagem-ia-avatar {

            width: 30px;

            height: 30px;

            min-width: 30px;

            border-radius: 50%;

            display: flex;

            align-items: center;

            justify-content: center;

            background: #eef2ff;
        }


        .assistente-ia-form {

            display: flex;

            gap: 8px;

            padding: 12px;

            background: #fff;

            border-top:
                1px solid #e5e7eb;
        }


        .assistente-ia-form input {

            flex: 1;

            min-width: 0;

            border:
                1px solid #d1d5db;

            border-radius: 10px;

            padding:
                11px 12px;

            outline: none;

            font-size: 14px;
        }


        .assistente-ia-form input:focus {

            border-color:
                #6366f1;
        }


        .btn-enviar-ia {

            width: 44px;

            border: none;

            border-radius: 10px;

            cursor: pointer;

            font-size: 18px;
        }


        .btn-enviar-ia:disabled {

            opacity: .5;

            cursor: not-allowed;
        }


        .assistente-ia-rodape {

            text-align: center;

            padding:
                8px;

            font-size: 11px;

            color: #64748b;

            background: #fff;
        }


        .ia-digitando {

            display: flex;

            align-items: center;

            gap: 4px;
        }


        .ia-digitando span {

            width: 6px;

            height: 6px;

            border-radius: 50%;

            background: #94a3b8;

            animation:
                iaDigitando 1.2s
                infinite ease-in-out;
        }


        .ia-digitando span:nth-child(2) {

            animation-delay:
                .15s;
        }


        .ia-digitando span:nth-child(3) {

            animation-delay:
                .30s;
        }


        @keyframes iaDigitando {

            0%,
            60%,
            100% {

                transform:
                    translateY(0);

                opacity: .5;
            }

            30% {

                transform:
                    translateY(-4px);

                opacity: 1;
            }
        }


        @media (max-width: 600px) {

            #janelaAssistenteIA {

                right: 10px;

                bottom: 10px;

                width:
                    calc(100vw - 20px);
            }


            .assistente-ia-janela {

                height: 520px;
            }
        }

    `;


    document.head.appendChild(
        style
    );
}


/* =========================================================
   PROTEÇÃO CONTRA HTML
========================================================= */

function escaparHTML(
    texto
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        texto ?? "";


    return div.innerHTML;
}


/* =========================================================
   FECHAR MODAIS AO CLICAR FORA
========================================================= */

window.addEventListener(
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
   FUNÇÕES GLOBAIS
   NECESSÁRIAS PELO HTML
========================================================= */

window.selecionarModoSistema =
    selecionarModoSistema;

window.voltarSelecaoModo =
    voltarSelecaoModo;

window.abrirAreaCliente =
    abrirAreaCliente;


window.abrirAreaAdministrativa =
    abrirAreaAdministrativa;


window.voltarTelaEscolha =
    voltarTelaEscolha;


window.sairCliente =
    sairCliente;


window.mostrarTelaCliente =
    mostrarTelaCliente;


window.mostrarTelaClientePorId =
    mostrarTelaClientePorId;


window.abrirTelaNovoChamadoCliente =
    abrirTelaNovoChamadoCliente;


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


window.excluirAtendente =
    excluirAtendente;


window.fecharAtendente =
    fecharAtendente;


window.limparNotificacoes =
    limparNotificacoes;


window.limparHistoricoGeral =
    limparHistoricoGeral;


window.imprimirRelatorio =
    imprimirRelatorio;


window.abrirAssistenteIA =
    abrirAssistenteIA;


window.fecharAssistenteIA =
    fecharAssistenteIA;


window.enviarMensagemAssistenteIA =
    enviarMensagemAssistenteIA;


window.mostrarTelaClienteProtegida =
    mostrarTelaClienteProtegida;


window.abrirAreaClienteSegura =
    abrirAreaClienteSegura;


window.abrirSistemaAdministrativoSeguro =
    abrirSistemaAdministrativoSeguro;


/* =========================================================
   ÚLTIMA VERIFICAÇÃO
========================================================= */

console.log(
    "========================================"
);

console.log(
    "CENTRAL DE ATENDIMENTO"
);

console.log(
    "Script carregado com sucesso."
);

console.log(
    "Área do Cliente protegida."
);

console.log(
    "Área Administrativa protegida."
);

console.log(
    "Assistente IA carregado."
);

console.log(
    "========================================"
);


/* =========================================================
   FIM DO SCRIPT — PARTE 10/10
========================================================= *//* =========================================================
   RENDERIZAR CHAMADOS — PAINEL DO ATENDENTE
========================================================= */

function renderizarChamadosAdmin() {

    const lista =
        document.getElementById(
            "listaChamados"
        );


    if (!lista) {
        return;
    }


    let chamadosExibidos =
        [...chamados];


    /* =====================================================
       PESQUISA
    ===================================================== */

    const pesquisa =
        document.getElementById(
            "pesquisa"
        )?.value
        ?.toLowerCase()
        ?.trim() || "";


    if (pesquisa) {

        chamadosExibidos =
            chamadosExibidos.filter(
                function (chamado) {

                    const textoChamado =
                        (
                            chamado.protocolo +
                            " " +
                            chamado.assunto +
                            " " +
                            chamado.clienteNome +
                            " " +
                            chamado.clienteEmail
                        )
                        .toLowerCase();


                    return textoChamado.includes(
                        pesquisa
                    );

                }
            );

    }


    /* =====================================================
       FILTRO DE STATUS
    ===================================================== */

    const filtroStatus =
        document.getElementById(
            "filtroStatus"
        )?.value || "Todos";


    if (
        filtroStatus !==
        "Todos"
    ) {

        chamadosExibidos =
            chamadosExibidos.filter(
                function (chamado) {

                    return (
                        chamado.status ===
                        filtroStatus
                    );

                }
            );

    }


    /* =====================================================
       FILTRO DE PRIORIDADE
    ===================================================== */

    const filtroPrioridade =
        document.getElementById(
            "filtroPrioridade"
        )?.value || "Todas";


    if (
        filtroPrioridade !==
        "Todas"
    ) {

        chamadosExibidos =
            chamadosExibidos.filter(
                function (chamado) {

                    return (
                        chamado.prioridade ===
                        filtroPrioridade
                    );

                }
            );

    }


    /* =====================================================
       NENHUM CHAMADO
    ===================================================== */

    if (
        chamadosExibidos.length ===
        0
    ) {

        lista.innerHTML = `

            <div class="sem-chamados">

                <div
                    style="
                    font-size:40px;
                    margin-bottom:10px;
                    "
                >
                    📭
                </div>

                <h3>
                    Nenhum chamado encontrado
                </h3>

                <p>
                    Cadastre um novo chamado para começar.
                </p>

            </div>

        `;

        return;
    }


    /* =====================================================
       RENDERIZAR CHAMADOS
    ===================================================== */

    lista.innerHTML =
        chamadosExibidos
            .map(
                function (chamado) {

                    return criarCardChamadoAdmin(
                        chamado
                    );

                }
            )
            .join("");

}/* =========================================================
   CARD DO CHAMADO — PAINEL DO ATENDENTE
========================================================= */

function criarCardChamadoAdmin(
    chamado
) {

    const status =
        chamado.status ||
        "Aberto";


    const prioridade =
        chamado.prioridade ||
        "Média";


    const atendente =
        chamado.atendente ||
        "Não atribuído";


    const dataCriacao =
        chamado.criadoEm ||
        chamado.data ||
        null;


    const dataFormatada =
        dataCriacao
            ? formatarData(
                dataCriacao
            )
            : "Não informada";


    const classeStatus =
        normalizarClasse(
            status
        );


    const classePrioridade =
        normalizarClasse(
            prioridade
        );


    return `

        <div
            class="card-chamado"
            data-id="${chamado.id}"
        >

            <div
                style="
                display:flex;
                justify-content:space-between;
                gap:15px;
                align-items:flex-start;
                "
            >

                <div>

                    <strong>
                        ${escaparHTML(
                            chamado.protocolo ||
                            "Sem protocolo"
                        )}
                    </strong>

                    <h3>
                        ${escaparHTML(
                            chamado.assunto ||
                            "Sem assunto"
                        )}
                    </h3>

                </div>


                <span
                    class="status ${classeStatus}"
                >
                    ${escaparHTML(
                        status
                    )}
                </span>

            </div>


            <p>
                👤 Cliente:
                ${escaparHTML(
                    chamado.clienteNome ||
                    "Não informado"
                )}
            </p>


            <p>
                📧 E-mail:
                ${escaparHTML(
                    chamado.clienteEmail ||
                    "Não informado"
                )}
            </p>


            <div
                style="
                display:flex;
                flex-wrap:wrap;
                gap:8px;
                margin:10px 0;
                "
            >

                <span
                    class="badge-prioridade ${classePrioridade}"
                >
                    ⚡
                    ${escaparHTML(
                        prioridade
                    )}
                </span>


                <span>
                    👨‍💻
                    ${escaparHTML(
                        atendente
                    )}
                </span>

            </div>


            <small>
                📅 Criado em:
                ${escaparHTML(
                    dataFormatada
                )}
            </small>


            <div
                style="
                margin-top:15px;
                display:flex;
                gap:8px;
                flex-wrap:wrap;
                "
            >

                <button
                    type="button"
onclick="abrirDetalhesChamadoAdmin('${chamado.id}')"
                >
                    👁️ Ver detalhes
                </button>

            </div>

        </div>

    `;

}
/* =========================================================
   ATUALIZAR LISTA DO PAINEL
========================================================= */

function atualizarListaChamadosAdmin() {

    renderizarChamadosAdmin();

}document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderizarChamadosAdmin();

    }
);document.addEventListener("DOMContentLoaded", function () {

    renderizarChamadosAdmin();

});console.log("TOTAL DE CHAMADOS:", chamados.length);
console.log("CHAMADOS:", chamados);console.log("TOTAL DE CHAMADOS:", chamados.length);
console.log("CHAMADOS:", chamados);
/* =========================================================
   ATUALIZAR PAINEL ADMINISTRATIVO
========================================================= */
function atualizarTudo() {

    renderizarChamadosAdmin();

}
/* =========================================================
   ABRIR DETALHES DO CHAMADO — ADMIN
========================================================= */

function abrirDetalhesChamadoAdmin(id) {

    const chamado = chamados.find(function(item) {

        return String(item.id) === String(id);

    });

    if (!chamado) {

        alert("Chamado não encontrado.");

        return;
    }

    const statusAtual =
        chamado.status || "Aberto";

    const opcao = prompt(
        "Status atual: " +
        statusAtual +
        "\n\n" +
        "Digite uma opção:\n\n" +
        "1 - Aberto\n" +
        "2 - Em andamento\n" +
        "3 - Resolvido"
    );

    if (opcao === null) {

        return;
    }

    const escolha =
        opcao.trim();

    let novoStatus = "";

    if (escolha === "1") {

        novoStatus = "Aberto";

    } else if (escolha === "2") {

        novoStatus = "Em andamento";

    } else if (escolha === "3") {

        novoStatus = "Resolvido";

    } else {

        alert(
            "Opção inválida. Digite 1, 2 ou 3."
        );

        return;
    }

    if (novoStatus === statusAtual) {

        alert(
            "O chamado já está com esse status."
        );

        return;
    }

    const agora =
        new Date().toISOString();

    chamado.status =
        novoStatus;

    chamado.atualizadoEm =
        agora;

    if (!Array.isArray(chamado.historico)) {

        chamado.historico = [];

    }

    chamado.historico.push({

        data: agora,

        acao:
            "Status alterado para " +
            novoStatus,

        usuario:
            "Administrador"

    });

    historicoGeral.push({

        id: gerarId(),

        chamadoId:
            chamado.id,

        protocolo:
            chamado.protocolo,

        acao:
            "Status alterado para " +
            novoStatus,

        usuario:
            "Administrador",

        data: agora

    });

    notificacoes.push({

        id: gerarId(),

        clienteEmail:
            chamado.clienteEmail,

        chamadoId:
            chamado.id,

        titulo:
            "Atualização do chamado",

        mensagem:
            "O status do chamado " +
            chamado.protocolo +
            " foi alterado para " +
            novoStatus +
            ".",

        lida: false,

        data: agora

    });

    salvarDados();

    renderizarChamadosAdmin();

    alert(
        "Chamado atualizado para: " +
        novoStatus
    );

}