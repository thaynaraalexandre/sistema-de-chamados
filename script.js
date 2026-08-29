// ============================
// LOGIN
// ============================

const formLogin = document.getElementById("formLogin");
const telaLogin = document.getElementById("telaLogin");
const mensagemLogin = document.getElementById("mensagemLogin");

formLogin.addEventListener("submit", function(event) {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (usuario === "admin" && senha === "1234") {
        telaLogin.style.display = "none";
    } else {
        mensagemLogin.textContent = "Usuário ou senha incorretos.";
    }
});


// ============================
// DADOS
// ============================

let chamados =
    JSON.parse(localStorage.getItem("chamados")) || [];

let atendentes =
    JSON.parse(localStorage.getItem("atendentes")) || [];

let historicoGeral =
    JSON.parse(localStorage.getItem("historicoGeral")) || [];

let chamadoSelecionado = null;
let chamadoEditando = null;


// ============================
// ELEMENTOS
// ============================

const formulario =
    document.getElementById("formChamado");

const lista =
    document.getElementById("listaChamados");

const pesquisa =
    document.getElementById("pesquisa");

const filtroStatus =
    document.getElementById("filtroStatus");

const filtroPrioridade =
    document.getElementById("filtroPrioridade");


// ============================
// SALVAR DADOS
// ============================

function salvar() {

    localStorage.setItem(
        "chamados",
        JSON.stringify(chamados)
    );

    localStorage.setItem(
        "atendentes",
        JSON.stringify(atendentes)
    );
}


function salvarHistoricoGeral() {

    localStorage.setItem(
        "historicoGeral",
        JSON.stringify(historicoGeral)
    );
}


// ============================
// HISTÓRICO GERAL
// ============================

function registrarAtividade(
    icone,
    titulo,
    descricao
) {

    historicoGeral.unshift({

        id: Date.now(),

        icone: icone,

        titulo: titulo,

        descricao: descricao,

        data: new Date().toLocaleString("pt-BR")

    });

    historicoGeral =
        historicoGeral.slice(0, 50);

    salvarHistoricoGeral();

    mostrarHistoricoGeral();
}


function mostrarHistoricoGeral() {

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

                <h3>Nenhuma atividade registrada</h3>

                <p>
                    As atividades do sistema aparecerão aqui.
                </p>

            </div>
        `;

        return;
    }

    lista.innerHTML =
        historicoGeral.map(function(item) {

            return `
                <div class="item-historico-geral">

                    <div class="icone-historico-geral">
                        ${item.icone}
                    </div>

                    <div class="conteudo-historico-geral">

                        <strong>
                            ${item.titulo}
                        </strong>

                        <p>
                            ${item.descricao}
                        </p>

                        <small>
                            ${item.data}
                        </small>

                    </div>

                </div>
            `;

        }).join("");
}


function limparHistoricoGeral() {

    if (historicoGeral.length === 0) {
        return;
    }

    if (
        !confirm(
            "Deseja realmente limpar todo o histórico?"
        )
    ) {
        return;
    }

    historicoGeral = [];

    salvarHistoricoGeral();

    mostrarHistoricoGeral();
}


// ============================
// ATUALIZAR SISTEMA
// ============================

function atualizar() {

    atualizarDashboard();

    mostrarChamados(
        pesquisa ? pesquisa.value : ""
    );

    mostrarAtendentes();

    atualizarSLA();

    atualizarNotificacoes();

    atualizarSelectsAtendentes();

    mostrarHistoricoGeral();
    atualizarDesempenhoAtendentes();
    mostrarPerfilAtendente();
}


// ============================
// DASHBOARD
// ============================

function atualizarDashboard() {

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


    document.getElementById(
        "totalChamados"
    ).textContent = total;

    document.getElementById(
        "chamadosAbertos"
    ).textContent = abertos;

    document.getElementById(
        "chamadosAndamento"
    ).textContent = andamento;

    document.getElementById(
        "chamadosResolvidos"
    ).textContent = resolvidos;


    const taxa =
        total === 0
            ? 0
            : Math.round(
                (resolvidos / total) * 100
            );


    document.getElementById(
        "taxaResolucao"
    ).textContent = taxa + "%";


    document.getElementById(
        "prioridadeAlta"
    ).textContent =
        chamados.filter(
            c => c.prioridade === "Alta"
        ).length;


    document.getElementById(
        "prioridadeMedia"
    ).textContent =
        chamados.filter(
            c => c.prioridade === "Média"
        ).length;


    document.getElementById(
        "prioridadeBaixa"
    ).textContent =
        chamados.filter(
            c => c.prioridade === "Baixa"
        ).length;


    const recentes =
        [...chamados]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);


    const recentesElemento =
        document.getElementById(
            "chamadosRecentes"
        );


    if (!recentesElemento) {
        return;
    }


    if (recentes.length === 0) {

        recentesElemento.innerHTML = `
            <p class="sem-recentes">
                Nenhum chamado cadastrado.
            </p>
        `;

    } else {

        recentesElemento.innerHTML =
            recentes.map(function(c) {

                return `
                    <div class="chamado-recente">

                        <div>

                            <strong>
                                ${c.assunto}
                            </strong>

                            <small>
                                ${c.cliente} • ${c.data}
                            </small>

                        </div>

                        <span class="mini-status">
                            ${c.status}
                        </span>

                    </div>
                `;

            }).join("");
    }


    // Relatório

    const relatorioTotal =
        document.getElementById(
            "relatorioTotal"
        );

    const relatorioAbertos =
        document.getElementById(
            "relatorioAbertos"
        );

    const relatorioAndamento =
        document.getElementById(
            "relatorioAndamento"
        );

    const relatorioResolvidos =
        document.getElementById(
            "relatorioResolvidos"
        );

    const relatorioTaxa =
        document.getElementById(
            "relatorioTaxa"
        );


    if (relatorioTotal) {
        relatorioTotal.textContent = total;
    }

    if (relatorioAbertos) {
        relatorioAbertos.textContent = abertos;
    }

    if (relatorioAndamento) {
        relatorioAndamento.textContent = andamento;
    }

    if (relatorioResolvidos) {
        relatorioResolvidos.textContent = resolvidos;
    }

    if (relatorioTaxa) {
        relatorioTaxa.textContent = taxa + "%";
    }
}


// ============================
// CADASTRAR CHAMADO
// ============================

formulario.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const chamado = {

            id: Date.now(),

            cliente:
                document.getElementById(
                    "cliente"
                ).value.trim(),

            email:
                document.getElementById(
                    "email"
                ).value.trim(),

            assunto:
                document.getElementById(
                    "assunto"
                ).value.trim(),

            descricao:
                document.getElementById(
                    "descricao"
                ).value.trim(),

            prioridade:
                document.getElementById(
                    "prioridade"
                ).value,

            atendenteId: null,

            atendenteNome: "",

            status: "Aberto",

            data:
                new Date().toLocaleDateString(
                    "pt-BR"
                ),

            dataHora: Date.now(),

            historico: []

        };


        const atendenteId =
            document.getElementById(
                "atendente"
            ).value;


        const atendente =
            atendentes.find(function(a) {

                return String(a.id) ===
                    String(atendenteId);

            });


        if (atendente) {

            chamado.atendenteId =
                atendente.id;

            chamado.atendenteNome =
                atendente.nome;
        }


        chamados.push(chamado);

        salvar();


        registrarAtividade(
            "🎫",
            "Chamado criado",
            "O chamado \"" +
            chamado.assunto +
            "\" foi cadastrado para " +
            chamado.cliente +
            "."
        );


        formulario.reset();

        atualizar();
    }
);


// ============================
// MOSTRAR CHAMADOS
// ============================

function mostrarChamados(filtro = "") {

    const status =
        filtroStatus.value;

    const prioridade =
        filtroPrioridade.value;


    const resultado =
        chamados.filter(function(c) {

            const pesquisaOK =
                c.cliente
                    .toLowerCase()
                    .includes(
                        filtro.toLowerCase()
                    ) ||

                c.assunto
                    .toLowerCase()
                    .includes(
                        filtro.toLowerCase()
                    );


            const statusOK =
                status === "Todos" ||
                c.status === status;


            const prioridadeOK =
                prioridade === "Todas" ||
                c.prioridade === prioridade;


            return (
                pesquisaOK &&
                statusOK &&
                prioridadeOK
            );

        });


    if (resultado.length === 0) {

        lista.innerHTML = `
            <div class="sem-chamados">

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


    lista.innerHTML = "";


    resultado.forEach(function(c) {

        const elemento =
            document.createElement("div");

        elemento.className =
            "card-chamado";


        elemento.innerHTML = `

            <div>

                <h3>
                    ${c.assunto}
                </h3>

                <p>
                    <strong>Cliente:</strong>
                    ${c.cliente}
                </p>

                <p>
                    <strong>E-mail:</strong>
                    ${c.email}
                </p>

                <p>
                    <strong>Descrição:</strong>
                    ${c.descricao}
                </p>

                <p>
                    <strong>Atendente:</strong>
                    ${c.atendenteNome || "Não definido"}
                </p>

                <p>
                    <strong>Data:</strong>
                    ${c.data}
                </p>

            </div>


            <div>

                <p>

                    <strong>
                        Prioridade:
                    </strong>

                    <span
                        class="prioridade prioridade-${c.prioridade.toLowerCase()}"
                    >
                        ${c.prioridade}
                    </span>

                </p>


                <label>
                    Status
                </label>


                <span
                    class="status status-${c.status.toLowerCase().replace(" ", "-")}"
                >
                    ${c.status}
                </span>


                <select
                    onchange="alterarStatus(${c.id}, this.value)"
                >

                    <option
                        value="Aberto"
                        ${c.status === "Aberto" ? "selected" : ""}
                    >
                        Aberto
                    </option>

                    <option
                        value="Em andamento"
                        ${c.status === "Em andamento" ? "selected" : ""}
                    >
                        Em andamento
                    </option>

                    <option
                        value="Resolvido"
                        ${c.status === "Resolvido" ? "selected" : ""}
                    >
                        Resolvido
                    </option>

                </select>


                <button
                    class="btn-detalhes"
                    onclick="verDetalhes(${c.id})"
                >
                    👁️ Ver detalhes
                </button>


                <button
                    class="btn-editar"
                    onclick="editarChamado(${c.id})"
                >
                    ✏️ Editar
                </button>


                <button
                    onclick="excluirChamado(${c.id})"
                >
                    🗑️ Excluir
                </button>

            </div>

        `;


        lista.appendChild(elemento);

    });
}


// ============================
// ALTERAR STATUS
// ============================

function alterarStatus(
    id,
    novoStatus
) {

    const chamado =
        chamados.find(function(c) {

            return c.id === id;

        });


    if (!chamado) {
        return;
    }


    const statusAnterior =
        chamado.status;


    chamado.status =
        novoStatus;


    salvar();


    registrarAtividade(
        "🔄",
        "Status alterado",
        "O chamado \"" +
        chamado.assunto +
        "\" mudou de \"" +
        statusAnterior +
        "\" para \"" +
        novoStatus +
        "\"."
    );


    atualizar();
}


// ============================
// EXCLUIR CHAMADO
// ============================

function excluirChamado(id) {

    const chamado =
        chamados.find(function(c) {

            return c.id === id;

        });


    if (!chamado) {
        return;
    }


    if (
        !confirm(
            "Deseja realmente excluir este chamado?"
        )
    ) {
        return;
    }


    chamados =
        chamados.filter(function(c) {

            return c.id !== id;

        });


    salvar();


    registrarAtividade(
        "🗑️",
        "Chamado excluído",
        "O chamado \"" +
        chamado.assunto +
        "\" foi excluído."
    );


    atualizar();
}


// ============================
// DETALHES
// ============================

function verDetalhes(id) {

    chamadoSelecionado =
        chamados.find(function(c) {

            return c.id === id;

        });


    if (!chamadoSelecionado) {
        return;
    }


    const conteudo =
        document.getElementById(
            "conteudoDetalhes"
        );


    conteudo.innerHTML = `

        <div class="detalhe-item">
            <strong>Cliente</strong>
            <span>
                ${chamadoSelecionado.cliente}
            </span>
        </div>

        <div class="detalhe-item">
            <strong>E-mail</strong>
            <span>
                ${chamadoSelecionado.email}
            </span>
        </div>

        <div class="detalhe-item">
            <strong>Assunto</strong>
            <span>
                ${chamadoSelecionado.assunto}
            </span>
        </div>

        <div class="detalhe-item">
            <strong>Descrição</strong>
            <span>
                ${chamadoSelecionado.descricao}
            </span>
        </div>

        <div class="detalhe-item">
            <strong>Atendente</strong>
            <span>
                ${chamadoSelecionado.atendenteNome || "Não definido"}
            </span>
        </div>

        <div class="detalhe-item">
            <strong>Prioridade</strong>
            <span>
                ${chamadoSelecionado.prioridade}
            </span>
        </div>

        <div class="detalhe-item">
            <strong>Status</strong>
            <span>
                ${chamadoSelecionado.status}
            </span>
        </div>

        <div class="detalhe-item">
            <strong>Data de abertura</strong>
            <span>
                ${chamadoSelecionado.data}
            </span>
        </div>

    `;


    mostrarHistorico();


    document.getElementById(
        "modalDetalhes"
    ).style.display = "flex";
}


function fecharDetalhes() {

    document.getElementById(
        "modalDetalhes"
    ).style.display = "none";
}


// ============================
// HISTÓRICO DO CHAMADO
// ============================

function mostrarHistorico() {

    const elemento =
        document.getElementById(
            "historicoChamado"
        );


    if (!elemento || !chamadoSelecionado) {
        return;
    }


    const historico =
        chamadoSelecionado.historico || [];


    if (historico.length === 0) {

        elemento.innerHTML = `
            <p>
                Nenhum atendimento registrado.
            </p>
        `;

        return;
    }


    elemento.innerHTML =
        historico.map(function(item) {

            return `
                <div class="historico-item">

                    <small>
                        ${item.data}
                    </small>

                    <div>
                        ${item.texto}
                    </div>

                </div>
            `;

        }).join("");
}


function adicionarHistorico() {

    if (!chamadoSelecionado) {
        return;
    }


    const campo =
        document.getElementById(
            "novoHistorico"
        );


    const texto =
        campo.value.trim();


    if (!texto) {
        return;
    }


    if (!chamadoSelecionado.historico) {

        chamadoSelecionado.historico = [];

    }


    chamadoSelecionado.historico.push({

        texto: texto,

        data:
            new Date().toLocaleString(
                "pt-BR"
            )

    });


    salvar();


    registrarAtividade(
        "📝",
        "Atualização adicionada",
        "Foi adicionada uma atualização ao chamado \"" +
        chamadoSelecionado.assunto +
        "\"."
    );


    campo.value = "";

    mostrarHistorico();
}


// ============================
// EDITAR CHAMADO
// ============================

function editarChamado(id) {

    chamadoEditando =
        chamados.find(function(c) {

            return c.id === id;

        });


    if (!chamadoEditando) {
        return;
    }


    document.getElementById(
        "editarCliente"
    ).value =
        chamadoEditando.cliente;


    document.getElementById(
        "editarEmail"
    ).value =
        chamadoEditando.email;


    document.getElementById(
        "editarAssunto"
    ).value =
        chamadoEditando.assunto;


    document.getElementById(
        "editarDescricao"
    ).value =
        chamadoEditando.descricao;


    document.getElementById(
        "editarPrioridade"
    ).value =
        chamadoEditando.prioridade;


    document.getElementById(
        "editarStatus"
    ).value =
        chamadoEditando.status;


    atualizarSelectEdicao();


    document.getElementById(
        "editarAtendente"
    ).value =
        chamadoEditando.atendenteId || "";


    document.getElementById(
        "modalEditar"
    ).style.display = "flex";
}


// ============================
// SALVAR EDIÇÃO
// ============================

function salvarEdicao() {

    if (!chamadoEditando) {
        return;
    }


    const atendenteId =
        document.getElementById(
            "editarAtendente"
        ).value;


    const atendente =
        atendentes.find(function(a) {

            return String(a.id) ===
                String(atendenteId);

        });


    chamadoEditando.cliente =
        document.getElementById(
            "editarCliente"
        ).value.trim();


    chamadoEditando.email =
        document.getElementById(
            "editarEmail"
        ).value.trim();


    chamadoEditando.assunto =
        document.getElementById(
            "editarAssunto"
        ).value.trim();


    chamadoEditando.descricao =
        document.getElementById(
            "editarDescricao"
        ).value.trim();


    chamadoEditando.prioridade =
        document.getElementById(
            "editarPrioridade"
        ).value;


    chamadoEditando.status =
        document.getElementById(
            "editarStatus"
        ).value;


    chamadoEditando.atendenteId =
        atendente
            ? atendente.id
            : null;


    chamadoEditando.atendenteNome =
        atendente
            ? atendente.nome
            : "";


    salvar();


    registrarAtividade(
        "✏️",
        "Chamado editado",
        "O chamado \"" +
        chamadoEditando.assunto +
        "\" foi atualizado."
    );


    fecharEdicao();

    atualizar();


    alert(
        "Chamado atualizado com sucesso!"
    );


    chamadoEditando = null;
}


function fecharEdicao() {

    document.getElementById(
        "modalEditar"
    ).style.display = "none";

    chamadoEditando = null;
}


// ============================
// ATENDENTES
// ============================

function mostrarAtendentes() {

    const lista =
        document.getElementById(
            "listaAtendentes"
        );


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


    lista.innerHTML =
        atendentes.map(function(a) {

            return `
                <div class="card-atendente">

                    <h3>
                        👤 ${a.nome}
                    </h3>

                    <p>
                        <strong>E-mail:</strong>
                        ${a.email}
                    </p>

                    <p>
                        <strong>Função:</strong>
                        ${a.funcao}
                    </p>

                    <div class="acoes-atendente">

                        <button
                            class="excluir-atendente"
                            onclick="excluirAtendente(${a.id})"
                        >
                            🗑️ Excluir
                        </button>

                    </div>

                </div>
            `;

        }).join("");
}


function atualizarSelectsAtendentes() {

    const select =
        document.getElementById(
            "atendente"
        );


    if (!select) {
        return;
    }


    const valorAtual =
        select.value;


    select.innerHTML = `
        <option value="">
            Selecione um atendente
        </option>
    `;


    atendentes.forEach(function(a) {

        const option =
            document.createElement("option");

        option.value = a.id;

        option.textContent =
            a.nome;

        select.appendChild(option);

    });


    select.value = valorAtual;
}


function atualizarSelectEdicao() {

    const select =
        document.getElementById(
            "editarAtendente"
        );


    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            Sem atendente
        </option>
    `;


    atendentes.forEach(function(a) {

        const option =
            document.createElement("option");

        option.value = a.id;

        option.textContent =
            a.nome;

        select.appendChild(option);

    });
}


// Novo atendente

const btnNovoAtendente =
    document.getElementById(
        "btnNovoAtendente"
    );


if (btnNovoAtendente) {

    btnNovoAtendente.addEventListener(
        "click",
        function() {

            document.getElementById(
                "modalAtendente"
            ).style.display = "flex";

        }
    );
}


// Formulário atendente

const formAtendente =
    document.getElementById(
        "formAtendente"
    );


if (formAtendente) {

    formAtendente.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const atendente = {

                id: Date.now(),

                nome:
                    document.getElementById(
                        "nomeAtendente"
                    ).value.trim(),

                email:
                    document.getElementById(
                        "emailAtendente"
                    ).value.trim(),

                funcao:
                    document.getElementById(
                        "funcaoAtendente"
                    ).value

            };


            atendentes.push(atendente);

            salvar();


            registrarAtividade(
                "👤",
                "Atendente cadastrado",
                "O atendente \"" +
                atendente.nome +
                "\" foi cadastrado."
            );


            formAtendente.reset();

            fecharAtendente();

            atualizar();

        }
    );
}


function fecharAtendente() {

    const modal =
        document.getElementById(
            "modalAtendente"
        );


    if (modal) {
        modal.style.display = "none";
    }
}


function excluirAtendente(id) {

    const atendente =
        atendentes.find(function(a) {

            return a.id === id;

        });


    if (!atendente) {
        return;
    }


    if (
        !confirm(
            "Deseja excluir este atendente?"
        )
    ) {
        return;
    }


    atendentes =
        atendentes.filter(function(a) {

            return a.id !== id;

        });


    chamados.forEach(function(c) {

        if (c.atendenteId === id) {

            c.atendenteId = null;

            c.atendenteNome = "";

        }

    });


    salvar();


    registrarAtividade(
        "🗑️",
        "Atendente excluído",
        "O atendente \"" +
        atendente.nome +
        "\" foi excluído."
    );


    atualizar();
}


// ============================
// PESQUISA E FILTROS
// ============================

pesquisa.addEventListener(
    "input",
    function() {

        mostrarChamados(
            this.value
        );

    }
);


filtroStatus.addEventListener(
    "change",
    function() {

        mostrarChamados(
            pesquisa.value
        );

    }
);


filtroPrioridade.addEventListener(
    "change",
    function() {

        mostrarChamados(
            pesquisa.value
        );

    }
);


// ============================
// ============================
// ETAPA 17
// DESEMPENHO DOS ATENDENTES
// ============================

function atualizarDesempenhoAtendentes() {

    const lista = document.getElementById(
        "listaDesempenhoAtendentes"
    );

    if (!lista) {
        return;
    }

    if (atendentes.length === 0) {

        lista.innerHTML = `
            <div class="sem-desempenho">

                <h3>
                    Nenhum atendente cadastrado
                </h3>

                <p>
                    Cadastre um atendente para visualizar o desempenho.
                </p>

            </div>
        `;

        return;
    }


    lista.innerHTML = atendentes.map(function(atendente) {

        const chamadosAtendente =
            chamados.filter(function(chamado) {

                return String(chamado.atendenteId) ===
                       String(atendente.id);

            });


        const total =
            chamadosAtendente.length;


        const abertos =
            chamadosAtendente.filter(function(chamado) {

                return chamado.status === "Aberto";

            }).length;


        const andamento =
            chamadosAtendente.filter(function(chamado) {

                return chamado.status === "Em andamento";

            }).length;


        const resolvidos =
            chamadosAtendente.filter(function(chamado) {

                return chamado.status === "Resolvido";

            }).length;


        const taxa =
            total === 0
                ? 0
                : Math.round(
                    (resolvidos / total) * 100
                );


        return `

            <div class="card-desempenho-atendente">

                <div class="desempenho-topo">

                    <div>

                        <h3>
                            👤 ${atendente.nome}
                        </h3>

                        <p>
                            ${atendente.funcao || "Atendente"}
                        </p>

                    </div>

                    <strong>
                        ${taxa}%
                    </strong>

                </div>


                <div class="desempenho-numeros">

                    <div>

                        <strong>
                            ${total}
                        </strong>

                        <span>
                            Total
                        </span>

                    </div>


                    <div>

                        <strong>
                            ${abertos}
                        </strong>

                        <span>
                            Abertos
                        </span>

                    </div>


                    <div>

                        <strong>
                            ${andamento}
                        </strong>

                        <span>
                            Em andamento
                        </span>

                    </div>


                    <div>

                        <strong>
                            ${resolvidos}
                        </strong>

                        <span>
                            Resolvidos
                        </span>

                    </div>

                </div>


                <div class="barra-desempenho">

                    <div
                        style="width: ${taxa}%"
                    ></div>

                </div>


                <small>
                    Taxa de resolução: ${taxa}%
                </small>

            </div>

        `;

    }).join("");

}// ============================
// ETAPA 19
// PERFIL DO ATENDENTE
// ============================

function mostrarPerfilAtendente() {

    const perfil = document.getElementById(
        "perfilAtendente"
    );

    if (!perfil) {
        return;
    }

    if (atendentes.length === 0) {

        perfil.innerHTML = `
            <div class="sem-perfil">

                <h3>
                    Nenhum atendente cadastrado
                </h3>

                <p>
                    Cadastre um atendente para visualizar o perfil.
                </p>

            </div>
        `;

        return;
    }


    perfil.innerHTML = `

        <div class="selecao-perfil">

            <label for="selecaoAtendentePerfil">
                Selecione o atendente
            </label>

            <select
                id="selecaoAtendentePerfil"
                onchange="carregarPerfilSelecionado()"
            >

                <option value="">
                    Selecione um atendente
                </option>

                ${atendentes.map(function(atendente) {

                    return `
                        <option value="${atendente.id}">
                            ${atendente.nome}
                        </option>
                    `;

                }).join("")}

            </select>

        </div>


        <div id="dadosPerfilAtendente">

            <div class="sem-perfil">

                <h3>
                    👤 Selecione um atendente
                </h3>

                <p>
                    Escolha um atendente acima para visualizar os dados.
                </p>

            </div>

        </div>

    `;
}


// ============================
// CARREGAR PERFIL SELECIONADO
// ============================

function carregarPerfilSelecionado() {

    const select =
        document.getElementById(
            "selecaoAtendentePerfil"
        );

    const dados =
        document.getElementById(
            "dadosPerfilAtendente"
        );


    if (!select || !dados) {
        return;
    }


    const atendente =
        atendentes.find(function(a) {

            return String(a.id) ===
                String(select.value);

        });


    if (!atendente) {

        dados.innerHTML = `
            <div class="sem-perfil">

                <h3>
                    👤 Selecione um atendente
                </h3>

                <p>
                    Escolha um atendente acima para visualizar os dados.
                </p>

            </div>
        `;

        return;
    }


    const chamadosAtendente =
        chamados.filter(function(chamado) {

            return String(chamado.atendenteId) ===
                String(atendente.id);

        });


    const total =
        chamadosAtendente.length;


    const abertos =
        chamadosAtendente.filter(function(chamado) {

            return chamado.status === "Aberto";

        }).length;


    const andamento =
        chamadosAtendente.filter(function(chamado) {

            return chamado.status === "Em andamento";

        }).length;


    const resolvidos =
        chamadosAtendente.filter(function(chamado) {

            return chamado.status === "Resolvido";

        }).length;


    const taxa =
        total === 0
            ? 0
            : Math.round(
                (resolvidos / total) * 100
            );


    dados.innerHTML = `

        <div class="dados-perfil">

            <div class="perfil-identificacao">

                <div class="avatar-perfil">
                    👤
                </div>

                <div>

                    <h3>
                        ${atendente.nome}
                    </h3>

                    <p>
                        ${atendente.funcao || "Atendente"}
                    </p>

                    <span>
                        📧 ${atendente.email}
                    </span>

                </div>

            </div>


            <div class="perfil-estatisticas">

                <div>

                    <strong>
                        ${total}
                    </strong>

                    <span>
                        🎫 Total
                    </span>

                </div>


                <div>

                    <strong>
                        ${abertos}
                    </strong>

                    <span>
                        🟢 Abertos
                    </span>

                </div>


                <div>

                    <strong>
                        ${andamento}
                    </strong>

                    <span>
                        🟡 Em andamento
                    </span>

                </div>


                <div>

                    <strong>
                        ${resolvidos}
                    </strong>

                    <span>
                        🔵 Resolvidos
                    </span>

                </div>


                <div>

                    <strong>
                        ${taxa}%
                    </strong>

                    <span>
                        📈 Taxa de resolução
                    </span>

                </div>

            </div>


            <div class="perfil-progresso">

                <div class="perfil-progresso-topo">

                    <strong>
                        Taxa de resolução
                    </strong>

                    <span>
                        ${taxa}%
                    </span>

                </div>

                <div class="perfil-barra">

                    <div
                        style="width: ${taxa}%"
                    ></div>

                </div>

            </div>

        </div>

    `;
}


// ============================
// INICIALIZAR PERFIL
// ============================

mostrarPerfilAtendente();
// ============================
// ETAPA 20

// ============================
// ETAPA 26
// MENU DE NAVEGAÇÃO
// ============================

function irParaSecao(id) {

    const elemento =
        document.getElementById(id);

    if (!elemento) {

        alert(
            "A seção '" + id + "' não foi encontrada."
        );

        return;
    }


    const alturaMenu =
        document.querySelector(
            ".menu-lateral"
        )?.offsetHeight || 0;


    const posicao =
        elemento.getBoundingClientRect().top +
        window.scrollY -
        20;


    window.scrollTo({

        top: posicao,

        behavior: "smooth"

    });

}


// ============================
// DESTACAR BOTÃO ATIVO
// ============================

function atualizarMenuAtivo() {

    const secoes = [

        "dashboard",

        "chamados",

        "atendentes",

        "sla",

        "notificacoes",

        "historico-geral",

        "relatorio",

        "configuracoes"

    ];


    const botoes =
        document.querySelectorAll(
            ".menu-navegacao button"
        );


    let secaoAtual = "";


    secoes.forEach(function(id) {

        const secao =
            document.getElementById(id);


        if (!secao) {
            return;
        }


        const distancia =
            secao.getBoundingClientRect().top;


        if (distancia <= 150) {

            secaoAtual = id;

        }

    });


    botoes.forEach(function(botao) {

        botao.classList.remove(
            "menu-ativo"
        );


        const acao =
            botao.getAttribute(
                "onclick"
            );


        if (
            acao &&
            acao.includes(
                "irParaSecao('" +
                secaoAtual +
                "')"
            )
        ) {

            botao.classList.add(
                "menu-ativo"
            );

        }

    });

}


// ============================
// EVENTOS
// ============================

window.addEventListener(
    "scroll",
    atualizarMenuAtivo
);


window.addEventListener(
    "load",
    atualizarMenuAtivo
);


// ============================
// MENU MOBILE
// ============================

function fecharMenu() {

    const menu =
        document.getElementById(
            "menuLateral"
        );


    if (!menu) {
        return;
    }


    menu.classList.remove(
        "menu-aberto"
    );

}
// ============================
// ETAPA 21
// MODO ESCURO
// ============================

const btnTema = document.getElementById("btnTema");

if (btnTema) {

    const temaSalvo =
        localStorage.getItem("tema");

    if (temaSalvo === "escuro") {

        document.body.classList.add(
            "modo-escuro"
        );

        btnTema.textContent =
            "☀️ Modo claro";
    }


    btnTema.addEventListener(
        "click",
        function() {

            document.body.classList.toggle(
                "modo-escuro"
            );


            const escuro =
                document.body.classList.contains(
                    "modo-escuro"
                );


            if (escuro) {

                localStorage.setItem(
                    "tema",
                    "escuro"
                );

                btnTema.textContent =
                    "☀️ Modo claro";

            } else {

                localStorage.setItem(
                    "tema",
                    "claro"
                );

                btnTema.textContent =
                    "🌙 Modo escuro";
            }

        }

    );
}
// ============================
// ============================
// ETAPA 22
// BACKUP E RESTAURAÇÃO
// ============================

const btnExportarBackup =
    document.getElementById("btnExportarBackup");

const btnRestaurarBackup =
    document.getElementById("btnRestaurarBackup");


// ============================
// EXPORTAR BACKUP
// ============================

if (btnExportarBackup) {

    btnExportarBackup.onclick = function() {

        const backup = {

            chamados: chamados,

            atendentes: atendentes,

            historicoGeral: historicoGeral

        };


        localStorage.setItem(
            "backupSistemaChamados",
            JSON.stringify(backup)
        );


        alert(
            "✅ Backup realizado com sucesso!"
        );

    };

}


// ============================
// RESTAURAR BACKUP
// ============================

if (btnRestaurarBackup) {

    btnRestaurarBackup.onclick = function() {

        const backupSalvo =
            localStorage.getItem(
                "backupSistemaChamados"
            );


        if (!backupSalvo) {

            alert(
                "⚠️ Você ainda não possui um backup."
            );

            return;

        }


        if (
            !confirm(
                "Deseja restaurar o último backup?"
            )
        ) {

            return;

        }


        const backup =
            JSON.parse(
                backupSalvo
            );


        chamados =
            backup.chamados || [];


        atendentes =
            backup.atendentes || [];


        historicoGeral =
            backup.historicoGeral || [];


        salvar();

        salvarHistoricoGeral();

        atualizar();


        alert(
            "✅ Backup restaurado com sucesso!"
        );

    };

}// ============================
// ETAPA 23
// CONFIGURAÇÕES DO SISTEMA
// ============================

const nomeSistema =
    document.getElementById("nomeSistema");

const nomeEmpresa =
    document.getElementById("nomeEmpresa");

const emailEmpresa =
    document.getElementById("emailEmpresa");

const btnSalvarConfiguracoes =
    document.getElementById(
        "btnSalvarConfiguracoes"
    );


// ============================
// CARREGAR CONFIGURAÇÕES
// ============================

const configuracoesSalvas =
    JSON.parse(
        localStorage.getItem(
            "configuracoesSistema"
        )
    ) || {};

if (nomeSistema) {

    nomeSistema.value =
        configuracoesSalvas.nomeSistema || "";

}

if (nomeEmpresa) {

    nomeEmpresa.value =
        configuracoesSalvas.nomeEmpresa || "";

}

if (emailEmpresa) {

    emailEmpresa.value =
        configuracoesSalvas.emailEmpresa || "";

}


// ============================
// SALVAR CONFIGURAÇÕES
// ============================

if (btnSalvarConfiguracoes) {

    btnSalvarConfiguracoes.addEventListener(
        "click",
        function() {

            const configuracoes = {

                nomeSistema:
                    nomeSistema.value.trim(),

                nomeEmpresa:
                    nomeEmpresa.value.trim(),

                emailEmpresa:
                    emailEmpresa.value.trim()

            };


            localStorage.setItem(
                "configuracoesSistema",
                JSON.stringify(
                    configuracoes
                )
            );


            alert(
                "✅ Configurações salvas com sucesso!"
            );

        }
    );

}// ============================
// ATUALIZAR TÍTULO DO SISTEMA
// ============================

// ============================
// ETAPA 23
// TÍTULO PERSONALIZADO
// ============================

function atualizarTituloSistema() {

    const titulo =
        document.getElementById(
            "tituloSistema"
        );

    const campo =
        document.getElementById(
            "nomeSistema"
        );

    if (!titulo || !campo) {
        return;
    }


    if (campo.value.trim() !== "") {

        titulo.textContent =
            "🎧 " + campo.value.trim();

    } else {

        titulo.textContent =
            "🎧 Central de Atendimento";

    }
}


// Atualiza enquanto digita

const campoNomeSistema =
    document.getElementById(
        "nomeSistema"
    );

if (campoNomeSistema) {

    campoNomeSistema.addEventListener(
        "input",
        atualizarTituloSistema
    );

}


// Atualiza ao carregar

atualizarTituloSistema();// ============================
// ETAPA 24
// NOME DA EMPRESA
// ============================

function atualizarNomeEmpresa() {

    const subtitulo =
        document.getElementById(
            "subtituloSistema"
        );

    const campo =
        document.getElementById(
            "nomeEmpresa"
        );

    if (!subtitulo || !campo) {
        return;
    }

    const empresa =
        campo.value.trim();

    if (empresa !== "") {

        subtitulo.textContent =
            empresa +
            " • Gerenciamento de chamados e suporte técnico";

    } else {

        subtitulo.textContent =
            "Gerenciamento de chamados e suporte técnico";

    }
}


// Atualizar enquanto digita

const campoEmpresa =
    document.getElementById(
        "nomeEmpresa"
    );

if (campoEmpresa) {

    campoEmpresa.addEventListener(
        "input",
        atualizarNomeEmpresa
    );

}


// Atualizar ao carregar

atualizarNomeEmpresa();// ============================
// ETAPA 25
// LOGO DA EMPRESA
// ============================

function atualizarLogoEmpresa() {

    const logoNome =
        document.getElementById(
            "logoNomeEmpresa"
        );

    const logoEmpresa =
        document.getElementById(
            "logoEmpresa"
        );

    const campoEmpresa =
        document.getElementById(
            "nomeEmpresa"
        );

    const campoSistema =
        document.getElementById(
            "nomeSistema"
        );


    if (
        !logoNome ||
        !logoEmpresa
    ) {
        return;
    }


    const empresa =
        campoEmpresa
            ? campoEmpresa.value.trim()
            : "";

    const sistema =
        campoSistema
            ? campoSistema.value.trim()
            : "";


    logoNome.textContent =
        empresa ||
        "Central de Atendimento";


    logoEmpresa.textContent =
        sistema ||
        "Sistema de Chamados";

}


// ============================
// ATUALIZAR EM TEMPO REAL
// ============================

if (campoEmpresa) {

    campoEmpresa.addEventListener(
        "input",
        atualizarLogoEmpresa
    );

}


if (campoNomeSistema) {

    campoNomeSistema.addEventListener(
        "input",
        atualizarLogoEmpresa
    );

}


// ============================
// CARREGAR AO INICIAR
// ============================

atualizarLogoEmpresa();