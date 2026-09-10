const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


/* =========================================================
   TESTE DO SERVIDOR
========================================================= */

app.get("/", (req, res) => {

    res.json({

        status: "online",

        mensagem:
            "Backend da Central de Atendimento funcionando!"

    });

});


/* =========================================================
   ASSISTENTE IA
========================================================= */

app.post("/api/assistente", async (req, res) => {

    try {
console.log("MENSAGEM:", req.body.mensagem);
console.log("CLIENTE:", req.body.cliente);
console.log("CHAMADOS:", req.body.chamados);
        const mensagem =
            req.body.mensagem;

        const historico =
            req.body.historico || [];

        const cliente =
            req.body.cliente || null;

        const chamados =
            req.body.chamados || [];

const notificacoes =
    req.body.notificacoes || [];
    
    const historicoGeral =
    req.body.historicoGeral || [];
        /* =================================================
           VERIFICAR MENSAGEM
        ================================================= */

        if (!mensagem) {

            return res.status(400).json({

                erro:
                    "Mensagem não informada."

            });

        }


        /* =================================================
           NORMALIZAR TEXTO
        ================================================= */

        const texto =
            mensagem
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");


        let resposta = "";


        /* =================================================
           SAUDAÇÕES
        ================================================= */

        if (
            texto.includes("ola") ||
            texto.includes("oi") ||
            texto.includes("bom dia") ||
            texto.includes("boa tarde") ||
            texto.includes("boa noite")
        ) {

            resposta =
                "Olá! 👋 Sou o Assistente IA da Central de Atendimento. Posso ajudar você com chamados, status, notificações, histórico e utilização do sistema.";

        }


        /* =================================================
           AJUDA
        ================================================= */

        else if (
            texto.includes("preciso de ajuda") ||
            texto.includes("me ajuda") ||
            texto.includes("ajuda")
        ) {

            resposta =
                "Claro! 😊 Posso ajudar com abertura de chamados, consulta de status, acompanhamento de solicitações, notificações e histórico. O que você precisa fazer?";

        }


        /* =================================================
           CONSULTAR CHAMADOS
        ================================================= */

        else if (
            texto.includes("meus chamados") ||
            texto.includes("quais chamados") ||
            texto.includes("quais sao meus chamados") ||
            texto.includes("lista de chamados") ||
            texto.includes("listar chamados") ||
            texto.includes("tenho chamados") ||
            texto.includes("chamados que tenho") ||
            texto.includes("chamados abertos") ||
            texto.includes("chamado aberto")
        ) {

            if (!cliente) {

                resposta =
                    "Você precisa estar conectado à Área do Cliente para consultar seus chamados.";

            } else {

                const emailCliente =
                    String(cliente.email || "")
                        .toLowerCase()
                        .trim();


                const chamadosCliente =
                    chamados.filter(chamado => {

                        const emailChamado =
                            String(
                                chamado.email ||
                                chamado.clienteEmail ||
                                chamado.usuarioEmail ||
                                chamado.emailCliente ||
                                ""
                            )
                            .toLowerCase()
                            .trim();

                        return (
                            emailChamado !== "" &&
                            emailChamado === emailCliente
                        );

                    });


                if (chamadosCliente.length === 0) {

                    resposta =
                        "Não encontrei chamados cadastrados para o seu e-mail.";

                } else {

                    resposta =
                        "Encontrei " +
                        chamadosCliente.length +
                        " chamado(s) para você:\n\n";


                    chamadosCliente.forEach(
                        (chamado, indice) => {

                            const assunto =
                                chamado.assunto ||
                                chamado.titulo ||
                                chamado.nome ||
                                chamado.descricao ||
                                "Sem assunto";


                            const status =
                                chamado.status ||
                                "Sem status";


                            resposta +=
                                (indice + 1) +
                                ". " +
                                assunto +
                                " — Status: " +
                                status +
                                "\n";

                        }
                    );

                }

            }

        }
/* =================================================
   DETALHES DOS CHAMADOS
================================================= */

else if (
    texto.includes("detalhes do meu chamado") ||
    texto.includes("detalhes do chamado") ||
    texto.includes("detalhe do meu chamado") ||
    texto.includes("informacoes do meu chamado") ||
    texto.includes("informações do meu chamado") ||
    texto.includes("qual a prioridade") ||
    texto.includes("quem esta atendendo") ||
    texto.includes("quem está atendendo") ||
    texto.includes("quando abri")
) {

    if (!cliente) {

        resposta =
            "Você precisa estar conectado à Área do Cliente para consultar os detalhes dos seus chamados.";

    } else {

        const emailCliente =
            String(cliente.email || "")
                .toLowerCase()
                .trim();


        const chamadosCliente =
            chamados.filter(chamado => {

                const emailChamado =
                    String(
                        chamado.email ||
                        chamado.clienteEmail ||
                        chamado.usuarioEmail ||
                        chamado.emailCliente ||
                        ""
                    )
                    .toLowerCase()
                    .trim();

                return (
                    emailChamado !== "" &&
                    emailChamado === emailCliente
                );

            });


        if (chamadosCliente.length === 0) {

            resposta =
                "Não encontrei chamados cadastrados para o seu e-mail.";

        } else if (chamadosCliente.length === 1) {

            const chamado =
                chamadosCliente[0];


            const assunto =
                chamado.assunto ||
                chamado.titulo ||
                chamado.nome ||
                chamado.descricao ||
                "Não informado";


            const status =
                chamado.status ||
                "Não informado";


            const prioridade =
                chamado.prioridade ||
                "Não informada";


            const atendente =
                chamado.atendente ||
                chamado.atendenteNome ||
                "Ainda não atribuído";


            const data =
                chamado.data ||
                chamado.dataCriacao ||
                chamado.criadoEm ||
                "Não informada";


            resposta =
                "📋 Detalhes do seu chamado:\n\n" +
                "🎫 Assunto: " + assunto + "\n" +
                "📊 Status: " + status + "\n" +
                "⚠️ Prioridade: " + prioridade + "\n" +
                "👨‍💻 Atendente: " + atendente + "\n" +
              "📅 Data de abertura: " +
dataFormatada;
        } else {

            resposta =
                "Você possui " +
                chamadosCliente.length +
                " chamados cadastrados.\n\n" +
                "Para consultar os detalhes, informe o assunto ou número do chamado.";

        }

    }

}/* =================================================
   LOCALIZAR CHAMADO ESPECÍFICO
================================================= */

else if (
    texto.includes("chamado sobre") ||
    texto.includes("chamado do") ||
    texto.includes("chamado referente") ||
    texto.includes("status do chamado sobre")
) {

    if (!cliente) {

        resposta =
            "Você precisa estar conectado à Área do Cliente para consultar seus chamados.";

    } else {

        const emailCliente =
            String(cliente.email || "")
                .toLowerCase()
                .trim();


        const chamadosCliente =
            chamados.filter(chamado => {

                const emailChamado =
                    String(
                        chamado.email ||
                        chamado.clienteEmail ||
                        chamado.usuarioEmail ||
                        chamado.emailCliente ||
                        ""
                    )
                    .toLowerCase()
                    .trim();

                return (
                    emailChamado !== "" &&
                    emailChamado === emailCliente
                );

            });


        if (chamadosCliente.length === 0) {

            resposta =
                "Não encontrei chamados cadastrados para o seu e-mail.";

        } else {

            const palavras =
                texto
                    .replace(
                        /chamado|sobre|referente|status|do|da|o|a|meu|minha|meus|minhas/gi,
                        " "
                    )
                    .trim()
                    .split(/\s+/)
                    .filter(palavra => palavra.length > 2);


            const chamadoEncontrado =
                chamadosCliente.find(chamado => {

                    const assunto =
                        String(
                            chamado.assunto ||
                            chamado.titulo ||
                            chamado.nome ||
                            chamado.descricao ||
                            ""
                        )
                        .toLowerCase();


                    return palavras.some(
                        palavra =>
                            assunto.includes(palavra)
                    );

                });


            if (!chamadoEncontrado) {

                resposta =
                    "Não consegui identificar qual chamado você quis consultar. Tente informar uma palavra do assunto do chamado.";

            } else {

                const assunto =
                    chamadoEncontrado.assunto ||
                    chamadoEncontrado.titulo ||
                    chamadoEncontrado.nome ||
                    "Sem assunto";


                const status =
                    chamadoEncontrado.status ||
                    "Sem status";


                const prioridade =
                    chamadoEncontrado.prioridade ||
                    "Não informada";


                const atendente =
                    chamadoEncontrado.atendente ||
                    chamadoEncontrado.atendenteNome ||
                    "Ainda não atribuído";


                resposta =
                    "🎫 Encontrei seu chamado:\n\n" +
                    "📌 Assunto: " + assunto + "\n" +
                    "📊 Status: " + status + "\n" +
                    "⚠️ Prioridade: " + prioridade + "\n" +
                    "👨‍💻 Atendente: " + atendente;

            }

        }

    }

}/* =================================================
   CONSULTAR NOTIFICAÇÕES DO CLIENTE
================================================= */

else if (
    texto.includes("minhas notificacoes") ||
    texto.includes("minhas notificações") ||
    texto.includes("quais notificacoes") ||
    texto.includes("quais notificações") ||
    texto.includes("tenho notificacoes") ||
    texto.includes("tenho notificações") ||
    texto.includes("notificacoes novas") ||
    texto.includes("notificações novas")
) {

    if (!cliente) {

        resposta =
            "Você precisa estar conectado à Área do Cliente para consultar suas notificações.";

    } else {

        const emailCliente =
            String(cliente.email || "")
                .toLowerCase()
                .trim();


        const notificacoesCliente =
            notificacoes.filter(notificacao => {

                const emailNotificacao =
                    String(
                        notificacao.email ||
                        notificacao.clienteEmail ||
                        notificacao.usuarioEmail ||
                        notificacao.emailCliente ||
                        ""
                    )
                    .toLowerCase()
                    .trim();

                return (
                    emailNotificacao !== "" &&
                    emailNotificacao === emailCliente
                );

            });


        if (notificacoesCliente.length === 0) {

            resposta =
                "Você não possui notificações no momento.";

        } else {

            resposta =
                "🔔 Você possui " +
                notificacoesCliente.length +
                " notificação(ões):\n\n";


            notificacoesCliente.forEach(
                (notificacao, indice) => {

                    const mensagemNotificacao =
                        notificacao.mensagem ||
                        notificacao.texto ||
                        notificacao.titulo ||
                        notificacao.descricao ||
                        "Notificação sem mensagem";


                    resposta +=
                        (indice + 1) +
                        ". " +
                        mensagemNotificacao +
                        "\n";

                }
            );

        }

    }

}/* =================================================
   BUSCAR CHAMADO PELO PROTOCOLO
================================================= */

else if (
    texto.includes("ch-") ||
    texto.includes("protocolo")
) {

    if (!cliente) {

        resposta =
            "Você precisa estar conectado à Área do Cliente para consultar um chamado.";

    } else {

        const emailCliente =
            String(cliente.email || "")
                .toLowerCase()
                .trim();


        const chamadosCliente =
            chamados.filter(chamado => {

                const emailChamado =
                    String(
                        chamado.email ||
                        chamado.clienteEmail ||
                        chamado.usuarioEmail ||
                        chamado.emailCliente ||
                        ""
                    )
                    .toLowerCase()
                    .trim();


                return (
                    emailChamado !== "" &&
                    emailChamado === emailCliente
                );

            });


        /* =============================================
           EXTRAIR PROTOCOLO DA MENSAGEM
        ============================================= */

        const protocoloEncontrado =
            mensagem.match(
                /CH-\d+/i
            );


        if (!protocoloEncontrado) {

            resposta =
                "Informe o protocolo do chamado, por exemplo: CH-1788225378418.";

        } else {

            const protocolo =
                protocoloEncontrado[0]
                    .toUpperCase();


            const chamadoEncontrado =
                chamadosCliente.find(
                    chamado =>
                        String(
                            chamado.protocolo || ""
                        ).toUpperCase() === protocolo
                );


            if (!chamadoEncontrado) {

                resposta =
                    "Não encontrei um chamado com o protocolo " +
                    protocolo +
                    " vinculado à sua conta.";

            } else {

                const assunto =
                    chamadoEncontrado.assunto ||
                    chamadoEncontrado.titulo ||
                    chamadoEncontrado.nome ||
                    chamadoEncontrado.descricao ||
                    "Não informado";


                const status =
                    chamadoEncontrado.status ||
                    "Não informado";


                const prioridade =
                    chamadoEncontrado.prioridade ||
                    "Não informada";


                const atendente =
                    chamadoEncontrado.atendente ||
                    chamadoEncontrado.atendenteNome ||
                    chamadoEncontrado.nomeAtendente ||
                    "Ainda não atribuído";


                const dataCriacao =
                    chamadoEncontrado.data ||
                    chamadoEncontrado.dataCriacao ||
                    chamadoEncontrado.criadoEm ||
                    chamadoEncontrado.createdAt ||
                    null;


                const dataFormatada =
                    dataCriacao
                        ? new Date(
                            dataCriacao
                        ).toLocaleString(
                            "pt-BR",
                            {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            }
                        )
                        : "Não informada";


                resposta =
                    "🎫 Detalhes do chamado\n\n" +
                    "📌 Protocolo: " +
                    protocolo +
                    "\n" +
                    "📝 Assunto: " +
                    assunto +
                    "\n" +
                    "📊 Status: " +
                    status +
                    "\n" +
                    "⚠️ Prioridade: " +
                    prioridade +
                    "\n" +
                    "👨‍💻 Atendente: " +
                    atendente +
                    "\n" +
                    "📅 Data de abertura: " +
                    dataFormatada;

            }

        }

    }

}
        /* =================================================
           NOVO CHAMADO
        ================================================= */

        else if (
            texto.includes("abrir chamado") ||
            texto.includes("novo chamado") ||
            texto.includes("criar chamado")
        ) {

            resposta =
                "Para abrir um novo chamado, acesse a opção 'Novo Chamado' na Área do Cliente e preencha o assunto, categoria, prioridade e descrição do problema.";

        }

/* =================================================
   STATUS E DETALHES DO CHAMADO
================================================= */

else if (
    texto.includes("status") ||
    texto.includes("andamento") ||
    texto.includes("situacao") ||
    texto.includes("qual a prioridade") ||
    texto.includes("quem esta atendendo") ||
    texto.includes("quem está atendendo") ||
    texto.includes("quando foi criado") ||
    texto.includes("quando abri") ||
    texto.includes("detalhes do meu chamado") ||
    texto.includes("detalhes do chamado")
) {

    if (!cliente) {

        resposta =
            "Você precisa estar conectado à Área do Cliente para consultar seus chamados.";

    } else {

        const emailCliente =
            String(cliente.email || "")
                .toLowerCase()
                .trim();


        /* =============================================
           CHAMADOS DO CLIENTE
        ============================================= */

        const chamadosCliente =
            chamados.filter(chamado => {

                const emailChamado =
                    String(
                        chamado.email ||
                        chamado.clienteEmail ||
                        chamado.usuarioEmail ||
                        chamado.emailCliente ||
                        ""
                    )
                    .toLowerCase()
                    .trim();


                return (
                    emailChamado !== "" &&
                    emailChamado === emailCliente
                );

            });


        if (chamadosCliente.length === 0) {

            resposta =
                "Não encontrei chamados cadastrados para o seu e-mail.";

        } else {

            /* =========================================
               SE TIVER APENAS UM CHAMADO
            ========================================= */

            if (chamadosCliente.length === 1) {

                const chamado =
                    chamadosCliente[0];


                const protocolo =
                    chamado.protocolo ||
                    "Não informado";


                const assunto =
                    chamado.assunto ||
                    chamado.titulo ||
                    chamado.nome ||
                    chamado.descricao ||
                    "Não informado";


                const status =
                    chamado.status ||
                    "Não informado";


                const prioridade =
                    chamado.prioridade ||
                    "Não informada";


                const atendente =
                    chamado.atendente ||
                    chamado.atendenteNome ||
                    chamado.nomeAtendente ||
                    "Ainda não atribuído";


                const dataCriacao =
                    chamado.data ||
                    chamado.dataCriacao ||
                    chamado.criadoEm ||
                    chamado.createdAt ||
                    null;


                const dataFormatada =
                    dataCriacao
                        ? new Date(
                            dataCriacao
                        ).toLocaleString(
                            "pt-BR",
                            {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            }
                        )
                        : "Não informada";


                resposta =
                    "🎫 Detalhes do seu chamado\n\n" +
                    "📌 Protocolo: " +
                    protocolo +
                    "\n" +
                    "📝 Assunto: " +
                    assunto +
                    "\n" +
                    "📊 Status: " +
                    status +
                    "\n" +
                    "⚠️ Prioridade: " +
                    prioridade +
                    "\n" +
                    "👨‍💻 Atendente: " +
                    atendente +
                    "\n" +
                    "📅 Criado em: " +
                    dataFormatada;

            }

            /* =========================================
               MAIS DE UM CHAMADO
            ========================================= */

            else {

                resposta =
                    "🎫 Você possui " +
                    chamadosCliente.length +
                    " chamados:\n\n";


                chamadosCliente.forEach(
                    (chamado, indice) => {

                        const protocolo =
                            chamado.protocolo ||
                            "Sem protocolo";


                        const assunto =
                            chamado.assunto ||
                            chamado.titulo ||
                            chamado.nome ||
                            "Sem assunto";


                        const status =
                            chamado.status ||
                            "Sem status";


                        resposta +=
                            (indice + 1) +
                            ". 📌 " +
                            protocolo +
                            "\n" +
                            "   📝 " +
                            assunto +
                            "\n" +
                            "   📊 Status: " +
                            status +
                            "\n\n";

                    }
                );

            }

        }

    }

}

        /* =================================================
           NOTIFICAÇÕES
        ================================================= */

        else if (
            texto.includes("notificacao") ||
            texto.includes("notificacoes")
        ) {

            resposta =
                "As notificações informam atualizações importantes dos seus chamados, como mudanças de status, mensagens e alterações no atendimento.";

        }


/* =================================================
   HISTÓRICO REAL DOS CHAMADOS
================================================= */

else if (
    texto.includes("historico") ||
    texto.includes("historico do chamado") ||
    texto.includes("historico dos meus chamados") ||
    texto.includes("o que aconteceu com meu chamado") ||
    texto.includes("atualizacoes do meu chamado") ||
    texto.includes("atualizacoes do chamado")
) {

    if (!cliente) {

        resposta =
            "Você precisa estar conectado à Área do Cliente para consultar o histórico dos seus chamados.";

    } else {

        const emailCliente =
            String(cliente.email || "")
                .toLowerCase()
                .trim();


        /* =============================================
           ENCONTRAR CHAMADOS DO CLIENTE
        ============================================= */

        const chamadosCliente =
            chamados.filter(chamado => {

                const emailChamado =
                    String(
                        chamado.email ||
                        chamado.clienteEmail ||
                        chamado.usuarioEmail ||
                        chamado.emailCliente ||
                        ""
                    )
                    .toLowerCase()
                    .trim();


                return (
                    emailChamado !== "" &&
                    emailChamado === emailCliente
                );

            });


        if (chamadosCliente.length === 0) {

            resposta =
                "Não encontrei chamados cadastrados para o seu e-mail.";

        } else {

            /* =========================================
               PEGAR OS IDs DOS CHAMADOS DO CLIENTE
            ========================================= */

            const idsChamadosCliente =
                chamadosCliente.map(
                    chamado => chamado.id
                );


            /* =========================================
               ENCONTRAR HISTÓRICO PELO ID DO CHAMADO
            ========================================= */

            const historicoCliente =
                historicoGeral.filter(item => {

                    return idsChamadosCliente.includes(
                        item.chamadoId
                    );

                });


            if (historicoCliente.length === 0) {

                resposta =
                    "Encontrei seus chamados, mas ainda não existem registros de histórico disponíveis para eles.";

            } else {

                resposta =
                    "📜 Histórico dos seus chamados:\n\n";


                historicoCliente.forEach(
                    (item, indice) => {

                        const protocolo =
                            item.protocolo ||
                            "Sem protocolo";


                        const acao =
                            item.acao ||
                            "Atualização";


                        const usuario =
                            item.usuario ||
                            "Sistema";

const data =
    item.data
        ? new Date(item.data).toLocaleString(
            "pt-BR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        )
        : "Data não informada";
resposta +=
    (indice + 1) +
    ". 🎫 Protocolo: " +
    protocolo +
    "\n" +
    "   📝 Ação: " +
    acao +
    "\n" +
    "   👤 Usuário: " +
    usuario +
    "\n" +
    "   📅 Data: " +
    data +
    "\n\n";
                    }
                );

            }

        }

    }

}
        /* =================================================
           ATENDENTE
        ================================================= */

        else if (
            texto.includes("atendente") ||
            texto.includes("quem esta atendendo")
        ) {

            resposta =
                "Quando um atendente for atribuído ao seu chamado, o nome dele poderá ser consultado nos detalhes da solicitação.";

        }


        /* =================================================
           LOGIN
        ================================================= */

        else if (
            texto.includes("login") ||
            texto.includes("entrar") ||
            texto.includes("acessar")
        ) {

            resposta =
                "Para acessar sua Área do Cliente, informe seu nome e e-mail no formulário de login. Depois disso, o painel do cliente será exibido.";

        }


        /* =================================================
           PROBLEMA NO SISTEMA
        ================================================= */

        else if (
            texto.includes("erro") ||
            texto.includes("bug") ||
            texto.includes("nao funciona")
        ) {

            resposta =
                "Entendi. Para ajudar a resolver o problema, descreva o que aconteceu e qual função ou tela apresentou o erro.";

        }


        /* =================================================
           AGRADECIMENTO
        ================================================= */

        else if (
            texto.includes("obrigado") ||
            texto.includes("obrigada") ||
            texto.includes("valeu")
        ) {

            resposta =
                "Por nada! 😊 Estou à disposição caso precise de mais alguma coisa.";

        }


        /* =================================================
           RESPOSTA PADRÃO
        ================================================= */

        else {

            resposta =
                "Entendi sua mensagem. 😊 Posso ajudar com chamados, status, notificações, histórico, login e utilização da Central de Atendimento. Pode me explicar um pouco mais o que você precisa?";

        }


        /* =================================================
           RETORNAR RESPOSTA
        ================================================= */

        res.json({

            resposta:
                resposta,

            historicoRecebido:
                historico.length,

            cliente:
                cliente
                    ? cliente.nome
                    : null

        });

    }


    catch (erro) {

        console.error(
            "Erro no Assistente IA:",
            erro
        );


        res.status(500).json({

            erro:
                "Erro interno do servidor."

        });

    }

});


/* =========================================================
   INICIAR SERVIDOR
========================================================= */

const PORT = 3000;


app.listen(PORT, () => {

    console.log(
        "===================================="
    );

    console.log(
        "BACKEND DA CENTRAL DE ATENDIMENTO"
    );

    console.log(
        "Servidor rodando em:"
    );

    console.log(
        "http://localhost:" + PORT
    );

    console.log(
        "===================================="
    );

});