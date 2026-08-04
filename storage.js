// ===========================
// Study Planner
// storage.js
// ===========================


// SALVAR DADOS

function salvarDado(chave, valor){

    localStorage.setItem(
        chave,
        JSON.stringify(valor)
    );

}


// BUSCAR DADOS

function buscarDado(chave){

    const dado =
    localStorage.getItem(chave);


    if(dado){

        return JSON.parse(dado);

    }


    return null;

}


// REMOVER DADOS

function removerDado(chave){

    localStorage.removeItem(chave);

}


// LIMPAR TODOS OS DADOS

function limparAplicativo(){

    const confirmar =
    confirm(
        "Deseja apagar todos os dados?"
    );


    if(confirmar){

        localStorage.clear();

        alert(
        "Dados apagados!"
        );

        location.reload();

    }

}


// ===========================
// RESUMO DE ESTUDOS
// ===========================

function salvarResumoStorage(texto){

    salvarDado(
        "resumoEstudos",
        texto
    );

}


function pegarResumoStorage(){

    return buscarDado(
        "resumoEstudos"
    );

}


// ===========================
// TEMA DA SEMANA
// ===========================

function salvarTemaSemana(
materia,
tema
){

    salvarDado(
        "temaSemana",
        {
            materia:materia,
            tema:tema
        }
    );

}


function pegarTemaSemana(){

    return buscarDado(
        "temaSemana"
    );

}


// ===========================
// CONFIGURAÇÕES
// ===========================

function salvarConfiguracao(
nome,
valor
){

    salvarDado(
        nome,
        valor
    );

}


function pegarConfiguracao(nome){

    return buscarDado(nome);

}