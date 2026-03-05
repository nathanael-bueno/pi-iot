if (document.getElementById("alerta")) {
    let alerta = document.getElementById("alerta");
    const alertaSonoro = new Audio("../alerta.mp3");
}

let dadosSalvos = localStorage.getItem("meus_detectores");


let lista_de_dados;

if (dadosSalvos) {
    lista_de_dados = JSON.parse(dadosSalvos);
} else {
    lista_de_dados = [
        { device: "8084", loc: "Rua da casa, 07" }
    ];

    localStorage.setItem("meus_detectores", JSON.stringify(lista_de_dados));
}

let indiceEdicao = null;


function salvarDados() {
    localStorage.setItem("meus_detectores", JSON.stringify(lista_de_dados));
}

function renderizarCards() {
    let detectores = document.getElementById("list-detecoes");
    if (!detectores) return;

    detectores.innerHTML = ""; 

    lista_de_dados.forEach((item, index) => {
        detectores.innerHTML += detector(item.device, item.loc, index);
    });

    atribuirEventosBotoes();
}

function salvarCard() {
    let deviceInput = document.getElementById("id-device");
    let locInput = document.getElementById("loc");

    if (deviceInput.value.trim() === "" || locInput.value.trim() === "") {
        alert("Preencha todos os campos!");
        return;
    }

    if (indiceEdicao === null) {
        // MODO CRIAR
        const novoDetector = {
            device: deviceInput.value,
            loc: locInput.value
        };
        lista_de_dados.push(novoDetector);
    } else {
        // MODO EDITAR
        lista_de_dados[indiceEdicao].device = deviceInput.value;
        lista_de_dados[indiceEdicao].loc = locInput.value;
        indiceEdicao = null;
    }

    salvarDados();
    renderizarCards();
    closeForm();
}

function prepararEdicao(index) {
    const item = lista_de_dados[index];
    
    document.getElementById("id-device").value = item.device;
    document.getElementById("loc").value = item.loc;
    
    indiceEdicao = index;
    
    document.getElementById("add-device").innerText = "Salvar Alteração";
    
    openForm();
}

function removerCard(index) {
    if (confirm("Tem certeza que deseja excluir este dispositivo?")) {
        lista_de_dados.splice(index, 1);
        salvarDados();
        renderizarCards();
    }
}

// --- FUNÇÕES VISUAIS (ABRIR/FECHAR MODAL) ---
function closeForm() {
    let form = document.getElementById("form");
    let over = document.getElementById("overlay");

    if (form) form.classList.add("hidden");
    if (over) over.classList.add("hidden");
    
    // Limpa inputs
    document.getElementById("id-device").value = "";
    document.getElementById("loc").value = "";
    
    // Reseta estado de edição
    indiceEdicao = null;
    let btnSalvar = document.getElementById("add-device");
    if(btnSalvar) btnSalvar.innerText = "Adicionar";
}

function openForm() {
    let form = document.getElementById("form");
    let over = document.getElementById("overlay");

    if (form) form.classList.remove("hidden");
    if (over) over.classList.remove("hidden");
}

function atribuirEventosBotoes() {
    // Botões Excluir
    document.querySelectorAll('.btn-excluir').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault(); // Evita recarregar se for link
            let index = button.getAttribute('data-index');
            removerCard(index);
        });
    });

    // Botões Editar
    document.querySelectorAll('.btn-editar').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            let index = button.getAttribute('data-index');
            prepararEdicao(index);
        });
    });
}

// --- TEMPLATE DO CARD (ADAPTADO AO SEU HTML) ---
function detector(device, loc, index) {
    return `
        <div id="detector-${device}" class="card-01 flex flex-col rounded-[24px] bg-[#1B1C1F] shadow-md items-center w-65 p-4 transition hover:scale-105 duration-300">
            <div class="circ h-40 w-40 rounded-full flex justify-center items-center text-center text-white bg-gray-800 mb-4">
                <span>Nenhum Gás Detectado!</span>
            </div>

            <div class="inf flex flex-col items-center gap-4 w-full mb-4">

                <div class="inf-group flex flex-col gap-1 w-full px-4">
                    <span class="text-xs text-gray-500 uppercase font-bold">Identificador:</span>
                    <p class="text-gray-300 font-mono">#${device}</p>
                </div>
                <div class="inf-group flex flex-col gap-1 w-full px-4">
                    <span class="text-xs text-gray-500 uppercase font-bold">Localização:</span>
                    <p class="text-gray-300">${loc}</p>
                </div>
            </div>

            <div class="btns flex flex-col w-full gap-2">
                <a href="page_02.html?id=${device}">
                    <button class="cursor-pointer p-3 w-full text-blue-500 dark:text-blue-200 bg-blue-700 dark:bg-blue-600/30 rounded-[8px] font-bold hover:bg-blue-600/50 transition-colors duration-300">
                    Saiba mais
                    </button>
                </a>
                
                <div class="flex gap-2 w-full">
                    <!-- Botão Editar -->
                    <button data-index="${index}" class="btn-editar cursor-pointer flex-1 p-3 text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20 rounded-[8px] font-bold transition-colors duration-300 flex justify-center items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                        Editar
                    </button>

                    <!-- Botão Excluir -->
                    <button data-index="${index}" class="btn-excluir cursor-pointer  flex-1 p-3 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-[8px] font-bold transition-colors duration-300 flex justify-center items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    `;
}

// --- INICIALIZAÇÃO ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Renderiza o que está salvo
    renderizarCards();

    // 2. Configura intervalo de verificação de gás (se o input existir)
    if (document.getElementById("gas")) {
        setInterval(verificarGas, 5000);
    }
    
    // 3. Evento: Abrir Modal
    let addBtn = document.getElementById("add");
    if (addBtn) {
        addBtn.addEventListener("click", () => {
            // Garante que abre limpo para criar novo
            closeForm(); 
            openForm(); 
        });
    }

    // 4. Evento: Fechar Modal (X)
    let closeBtn = document.getElementById("closeForm");
    if (closeBtn) {
        closeBtn.addEventListener("click", closeForm);
    }
    
    // 5. Evento: Fechar Modal (Clicar fora/Overlay)
    let overlay = document.getElementById("overlay");
    if (overlay) {
        overlay.addEventListener("click", closeForm);
    }

    // 6. Evento: Salvar (Adicionar ou Editar)
    let btnSalvar = document.getElementById("add-device");
    if (btnSalvar) {
        btnSalvar.addEventListener("click", salvarCard);
    }
});