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

}

// SALVAR RESUMO
function salvarResumo() {

    const texto = document.getElementById("resumo").value;

    localStorage.setItem("resumo", texto);

    alert("Resumo salvo com sucesso!");

}

// CARREGAR RESUMO
window.addEventListener("load", () => {

    const texto = localStorage.getItem("resumo");

    if (texto) {
        document.getElementById("resumo").value = texto;
    }

    carregarTema();

});

// SORTEAR TEMA
function sortearTema() {

    const listaMaterias = Object.keys(materias);

    const indiceMateria = Math.floor(Math.random() * listaMaterias.length);

    const materia = listaMaterias[indiceMateria];

    const listaTemas = materias[materia];

    const indiceTema = Math.floor(Math.random() * listaTemas.length);

    const tema = listaTemas[indiceTema];

    document.getElementById("materiaEscolhida").innerHTML =
        "📚 " + materia;

    document.getElementById("temaEscolhido").innerHTML =
        tema;

    localStorage.setItem("materiaSemana", materia);

    localStorage.setItem("temaSemana", tema);

}

// CARREGAR TEMA
function carregarTema() {

    const materia = localStorage.getItem("materiaSemana");

    const tema = localStorage.getItem("temaSemana");

    if (materia && tema) {

        document.getElementById("materiaEscolhida").innerHTML =
            "📚 " + materia;

        document.getElementById("temaEscolhido").innerHTML =
            tema;

    }

}