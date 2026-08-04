 // ===========================
// Study Planner
// script.js
// ===========================

// ELEMENTOS
const menu = document.getElementById("menu");
const btnMenu = document.getElementById("btnMenu");

// MENU
btnMenu.addEventListener("click", () => {
    menu.classList.toggle("ativo");
});

// FECHAR MENU AO CLICAR FORA
document.addEventListener("click", (e) => {

    if (!menu.contains(e.target) && !btnMenu.contains(e.target)) {
        menu.classList.remove("ativo");
    }

});

// TROCAR DE PÁGINA
function abrirPagina(id) {

    const paginas = document.querySelectorAll(".pagina");

    paginas.forEach(pagina => {
        pagina.classList.add("escondido");
    });

    document.getElementById(id).classList.remove("escondido");

    menu.classList.remove("ativo");

    // Se abrir o quiz, carrega as infos
    if (id === 'quiz') {
        carregarQuizInfo();
    }

    // Se abrir o início, atualiza contagem
    if (id === 'inicio') {
        atualizarContagem();
        carregarLembretesInicio();
    }

}

// ===========================
// SALVAR RESUMO
// ===========================

function salvarResumo() {

    const texto = document.getElementById("resumo").value;

    localStorage.setItem("resumo", texto);

    alert("Resumo salvo com sucesso!");

}

// ===========================
// CARREGAR RESUMO E TEMA
// ===========================

window.addEventListener("load", () => {

    const texto = localStorage.getItem("resumo");

    if (texto) {
        document.getElementById("resumo").value = texto;
    }

    carregarTema();
    atualizarContagem();
    carregarLembretesInicio();

    // Pedir permissão de notificação
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
    }

});

// ===========================
// SORTEAR TEMA
// ===========================

function sortearTema() {

    const listaMaterias = Object.keys(materias);

    const indiceMateria = Math.floor(Math.random() * listaMaterias.length);

    const materiaSorteada = listaMaterias[indiceMateria];

    const listaTemas = materias[materiaSorteada];

    const indiceTema = Math.floor(Math.random() * listaTemas.length);

    const temaSorteado = listaTemas[indiceTema];

    document.getElementById("materiaEscolhida").innerHTML =
        "📚 " + materiaSorteada;

    document.getElementById("temaEscolhido").innerHTML =
        temaSorteado;

    // Salva com a data do sorteio
    const agora = new Date();

    localStorage.setItem("materiaSemana", materiaSorteada);
    localStorage.setItem("temaSemana", temaSorteado);
    localStorage.setItem("dataSorteio", agora.toISOString());

    atualizarContagem();

    alert("✅ Tema sorteado com sucesso!");

}

// ===========================
// CARREGAR TEMA
// ===========================

function carregarTema() {

    const materiaSalva = localStorage.getItem("materiaSemana");
    const temaSalvo = localStorage.getItem("temaSemana");

    if (materiaSalva && temaSalvo) {

        document.getElementById("materiaEscolhida").innerHTML =
            "📚 " + materiaSalva;

        document.getElementById("temaEscolhido").innerHTML =
            temaSalvo;

    }

}

// ===========================
// CONTAGEM DE DIAS
// ===========================

function atualizarContagem() {

    const dataSorteio = localStorage.getItem("dataSorteio");
    const diasRestantesEl = document.getElementById("dias-restantes");

    if (!diasRestantesEl) return;

    if (!dataSorteio) {
        diasRestantesEl.innerHTML = "Nenhum sorteio ainda";
        diasRestantesEl.style.color = "#94a3b8";
        return;
    }

    const dataInicio = new Date(dataSorteio);
    const agora = new Date();

    // Calcula o próximo domingo após o sorteio
    const diaSemana = dataInicio.getDay(); // 0 = domingo
    let diasAteDomingo;

    if (diaSemana === 0) {
        diasAteDomingo = 7;
    } else {
        diasAteDomingo = 7 - diaSemana;
    }

    const dataFim = new Date(dataInicio);
    dataFim.setDate(dataFim.getDate() + diasAteDomingo);
    dataFim.setHours(23, 59, 59, 999);

    const diff = dataFim - agora;
    const diasRestantes = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (diasRestantes <= 0) {
        diasRestantesEl.innerHTML = "Acabou! 🎉<br><small>Faça um novo sorteio!</small>";
        diasRestantesEl.style.color = "#22c55e";
    } else if (diasRestantes === 1) {
        diasRestantesEl.innerHTML = diasRestantes + " dia";
        diasRestantesEl.style.color = "#ef4444";
    } else {
        diasRestantesEl.innerHTML = diasRestantes + " dias";
        diasRestantesEl.style.color = "#facc15";
    }

    // Se for o último dia, dispara notificação do quiz
    if (diasRestantes === 1 || diasRestantes === 0) {
        verificarNotificacaoQuiz();
    }

}

// ===========================
// NOTIFICAÇÃO DO QUIZ
// ===========================

function verificarNotificacaoQuiz() {

    const jaNotificou = localStorage.getItem("notificouQuiz");
    const hoje = new Date().toDateString();

    if (jaNotificou !== hoje) {

        // Notificação visual no app
        const aviso = document.getElementById("quiz-aviso");
        if (aviso) {
            aviso.innerHTML = "🔔 Lembre de responder o quiz do estudo da semana!";
        }

        // Notificação do navegador (se permitido)
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("📚 Study Planner", {
                body: "Lembre de responder o quiz do estudo da semana!",
                icon: "📚"
            });
        }

        localStorage.setItem("notificouQuiz", hoje);

    }

}

// ===========================
// LEMBRETES NA TELA INICIAL
// ===========================

function carregarLembretesInicio() {

    const listaInicio = document.getElementById("lista-lembretes-inicio");

    if (!listaInicio) return;

    // Pega os lembretes salvos
    const lembretesSalvos = JSON.parse(localStorage.getItem("lembretes")) || [];

    if (lembretesSalvos.length > 0) {

        listaInicio.innerHTML = "";

        lembretesSalvos.forEach(item => {
            listaInicio.innerHTML += `
                <li>📌 ${item.titulo} - ${item.data} às ${item.hora}</li>
            `;
        });

    }

}

// ===========================
// QUIZ
// ===========================

let perguntaAtual = null;
let alternativaSelecionada = null;

// Banco de perguntas
const perguntasQuiz = {
    "Matemática": {
        "Equação do 1º Grau": [
            {
                pergunta: "Qual o valor de x em: 2x + 4 = 10?",
                alternativas: ["x = 2", "x = 3", "x = 4", "x = 5"],
                correta: 1
            },
            {
                pergunta: "Resolva: 3x - 6 = 0",
                alternativas: ["x = 1", "x = 2", "x = 3", "x = 6"],
                correta: 1
            }
        ],
        "Equação do 2º Grau": [
            {
                pergunta: "Qual a fórmula de Bhaskara?",
                alternativas: [
                    "x = -b ± √(b²-4ac) / 2a",
                    "x = -b ± √(b²+4ac) / 2a",
                    "x = b ± √(b²-4ac) / 2a",
                    "x = -b ± √(b-4ac) / 2a"
                ],
                correta: 0
            }
        ],
        "Porcentagem": [
            {
                pergunta: "Quanto é 20% de 150?",
                alternativas: ["20", "25", "30", "35"],
                correta: 2
            }
        ],
        "Frações": [
            {
                pergunta: "Quanto é 1/2 + 1/4?",
                alternativas: ["1/6", "2/6", "3/4", "2/4"],
                correta: 2
            }
        ]
    },
    "Português": {
        "Interpretação de Texto": [
            {
                pergunta: "O que é a ideia principal de um texto?",
                alternativas: [
                    "O título do texto",
                    "A mensagem central",
                    "O primeiro parágrafo",
                    "A conclusão"
                ],
                correta: 1
            }
        ],
        "Crase": [
            {
                pergunta: "Qual frase está correta?",
                alternativas: [
                    "Vou à escola",
                    "Vou a escola",
                    "Vou à escola amanhã",
                    "A e C estão corretas"
                ],
                correta: 3
            }
        ],
        "Verbos": [
            {
                pergunta: "Qual o tempo verbal de 'eu estudarei'?",
                alternativas: ["Presente", "Pretérito", "Futuro", "Imperativo"],
                correta: 2
            }
        ]
    },
    "Biologia": {
        "Célula": [
            {
                pergunta: "Qual organela é responsável pela respiração celular?",
                alternativas: ["Ribossomo", "Mitocôndria", "Núcleo", "Lisossomo"],
                correta: 1
            }
        ],
        "DNA": [
            {
                pergunta: "Qual a função do DNA?",
                alternativas: [
                    "Produzir energia",
                    "Armazenar informação genética",
                    "Transportar oxigênio",
                    "Digerir alimentos"
                ],
                correta: 1
            }
        ]
    },
    "Química": {
        "Tabela Periódica": [
            {
                pergunta: "Qual o símbolo do Oxigênio?",
                alternativas: ["O", "Ox", "Og", "Om"],
                correta: 0
            }
        ],
        "pH": [
            {
                pergunta: "Qual o valor do pH neutro?",
                alternativas: ["0", "1", "7", "14"],
                correta: 2
            }
        ]
    },
    "Física": {
        "Cinemática": [
            {
                pergunta: "Qual a fórmula da velocidade média?",
                alternativas: ["v = d/t", "v = t/d", "v = a.t", "v = d.t"],
                correta: 0
            }
        ],
        "Leis de Newton": [
            {
                pergunta: "Qual a primeira lei de Newton?",
                alternativas: [
                    "F = m.a",
                    "Ação e reação",
                    "Inércia",
                    "Gravidade"
                ],
                correta: 2
            }
        ]
    }
};

function gerarPerguntaGenerica(materiaNome, temaNome) {
    return [
        {
            pergunta: `O que você aprendeu sobre "${temaNome}" em ${materiaNome}?`,
            alternativas: [
                "Estudei bastante e entendi bem",
                "Estudei um pouco",
                "Ainda tenho dúvidas",
                "Não estudei ainda"
            ],
            correta: 0
        },
        {
            pergunta: `Qual a principal aplicação de "${temaNome}"?`,
            alternativas: [
                "Aplicações práticas no dia a dia",
                "Apenas teoria",
                "Não tem aplicação",
                "Não sei"
            ],
            correta: 0
        }
    ];
}

function carregarQuizInfo() {

    const materiaSalva = localStorage.getItem("materiaSemana");
    const temaSalvo = localStorage.getItem("temaSemana");

    document.getElementById("quiz-materia").innerHTML = materiaSalva || "Nenhuma";
    document.getElementById("quiz-tema").innerHTML = temaSalvo || "Nenhum";

    const btnIniciar = document.getElementById("btn-iniciar-quiz");
    const perguntaArea = document.getElementById("pergunta-area");
    const aviso = document.getElementById("quiz-aviso");

    if (!materiaSalva || !temaSalvo) {
        btnIniciar.style.display = "block";
        btnIniciar.innerHTML = "⚠️ Faça um sorteio primeiro";
        btnIniciar.disabled = true;
        perguntaArea.classList.add("escondido");
        if (aviso) aviso.innerHTML = "⚠️ Você precisa sortear um tema primeiro!";
        return;
    }

    btnIniciar.style.display = "block";
    btnIniciar.innerHTML = "🚀 Iniciar Quiz";
    btnIniciar.disabled = false;

    // Verifica se já respondeu hoje
    const hoje = new Date().toDateString();
    const ultimoQuiz = localStorage.getItem("ultimoQuizData");

    if (ultimoQuiz === hoje) {
        if (aviso) aviso.innerHTML = "✅ Você já respondeu o quiz hoje! Volte amanhã.";
        btnIniciar.innerHTML = "✅ Quiz concluído";
        btnIniciar.disabled = true;
    } else {
        if (aviso) aviso.innerHTML = "";
    }

}

function iniciarQuiz() {

    const materiaSalva = localStorage.getItem("materiaSemana");
    const temaSalvo = localStorage.getItem("temaSemana");

    if (!materiaSalva || !temaSalvo) {
        alert("Faça um sorteio primeiro!");
        return;
    }

    let perguntas = [];

    // Busca perguntas específicas
    if (perguntasQuiz[materiaSalva] && perguntasQuiz[materiaSalva][temaSalvo]) {
        perguntas = perguntasQuiz[materiaSalva][temaSalvo];
    } else if (perguntasQuiz[materiaSalva]) {
        // Pega perguntas de qualquer tema da matéria
        const temas = Object.keys(perguntasQuiz[materiaSalva]);
        if (temas.length > 0) {
            perguntas = perguntasQuiz[materiaSalva][temas[0]];
        }
    }

    // Se não encontrou, gera genérica
    if (perguntas.length === 0) {
        perguntas = gerarPerguntaGenerica(materiaSalva, temaSalvo);
    }

    // Escolhe uma pergunta aleatória
    const indice = Math.floor(Math.random() * perguntas.length);
    perguntaAtual = perguntas[indice];
    alternativaSelecionada = null;

    // Mostra a pergunta
    document.getElementById("pergunta-texto").innerHTML = "❓ " + perguntaAtual.pergunta;

    const alternativasDiv = document.getElementById("alternativas");
    alternativasDiv.innerHTML = "";

    perguntaAtual.alternativas.forEach((alt, i) => {
        const div = document.createElement("div");
        div.className = "alternativa";
        div.innerHTML = alt;
        div.onclick = () => selecionarAlternativa(i, div);
        alternativasDiv.appendChild(div);
    });

    document.getElementById("pergunta-area").classList.remove("escondido");
    document.getElementById("resultado-quiz").innerHTML = "";
    document.getElementById("btn-responder").style.display = "block";
    document.getElementById("btn-iniciar-quiz").style.display = "none";

}

function selecionarAlternativa(indice, elemento) {

    // Remove seleção anterior
    document.querySelectorAll(".alternativa").forEach(el => {
        el.classList.remove("selecionada");
    });

    elemento.classList.add("selecionada");
    alternativaSelecionada = indice;

}

function verificarResposta() {

    if (alternativaSelecionada === null) {
        alert("Selecione uma alternativa!");
        return;
    }

    const alternativas = document.querySelectorAll(".alternativa");
    const resultado = document.getElementById("resultado-quiz");

    alternativas.forEach((el, i) => {
        el.style.pointerEvents = "none";
        if (i === perguntaAtual.correta) {
            el.classList.add("correta");
        }
    });

    if (alternativaSelecionada === perguntaAtual.correta) {
        resultado.innerHTML = "✅ Parabéns! Resposta correta!";
        resultado.style.color = "#22c55e";
    } else {
        resultado.innerHTML = "❌ Resposta incorreta. Continue estudando!";
        resultado.style.color = "#ef4444";
        alternativas[alternativaSelecionada].classList.add("errada");
    }

    document.getElementById("btn-responder").style.display = "none";
    document.getElementById("btn-iniciar-quiz").style.display = "block";
    document.getElementById("btn-iniciar-quiz").innerHTML = "🔄 Tentar outra pergunta";

    // Salva que respondeu hoje
    const hoje = new Date().toDateString();
    localStorage.setItem("ultimoQuizData", hoje);
    localStorage.removeItem("notificouQuiz");

    // Atualiza aviso
    const aviso = document.getElementById("quiz-aviso");
    if (aviso) aviso.innerHTML = "✅ Quiz respondido! Volte amanhã para mais perguntas.";

}

// ===========================
// ATUALIZA CONTAGEM A CADA HORA
// ===========================

setInterval(atualizarContagem, 3600000); // a cada 1 hora