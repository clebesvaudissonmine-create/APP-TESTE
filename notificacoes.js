// ===========================
// Study Planner
// notificacoes.js
// ===========================

let lembretes = JSON.parse(
    localStorage.getItem("lembretes")
) || [];


// SALVAR LEMBRETES

function salvarLembretes(){

    localStorage.setItem(
        "lembretes",
        JSON.stringify(lembretes)
    );

}


// ADICIONAR LEMBRETE

function adicionarLembrete(){

    const titulo =
    document.getElementById("tituloLembrete").value;

    const data =
    document.getElementById("dataLembrete").value;

    const hora =
    document.getElementById("horaLembrete").value;


    if(
        titulo === "" ||
        data === "" ||
        hora === ""
    ){

        alert("Preencha todos os campos!");

        return;

    }


    const novoLembrete = {

        titulo: titulo,

        data: data,

        hora: hora

    };


    lembretes.push(novoLembrete);


    salvarLembretes();


    document.getElementById("tituloLembrete").value="";
    document.getElementById("dataLembrete").value="";
    document.getElementById("horaLembrete").value="";


    mostrarLembretes();


}


// MOSTRAR LEMBRETES

function mostrarLembretes(){

    const lista =
    document.getElementById("listaLembretes");


    if(!lista) return;


    lista.innerHTML="";


    if(lembretes.length === 0){

        lista.innerHTML =
        "<p>Nenhum lembrete criado.</p>";

        return;

    }


    lembretes.forEach((item,index)=>{


        lista.innerHTML += `

        <div class="cardLembrete">

            <h3>
            📚 ${item.titulo}
            </h3>

            <p>
            📅 ${item.data}
            </p>

            <p>
            ⏰ ${item.hora}
            </p>


            <button onclick="editarLembrete(${index})">

            ✏️ Editar

            </button>


            <button onclick="excluirLembrete(${index})">

            🗑️ Excluir

            </button>


        </div>

        `;


    });


}


// EXCLUIR

function excluirLembrete(index){


    lembretes.splice(index,1);


    salvarLembretes();


    mostrarLembretes();


}


// EDITAR

function editarLembrete(index){


    let novoTitulo =
    prompt(
        "Digite o novo título:",
        lembretes[index].titulo
    );


    if(novoTitulo){

        lembretes[index].titulo =
        novoTitulo;


        salvarLembretes();


        mostrarLembretes();

    }

}


// INICIAR

window.addEventListener(
"load",
mostrarLembretes
);