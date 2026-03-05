const urlParams = new URLSearchParams(window.location.search);
const id_device = Number(urlParams.get('id'));
console.log(`Configurando monitoramento para o dispositivo ID: ${id_device}`);

const hostMqtt = "wss://db04ef61b687429c98c21e8de8cd7e4a.s1.eu.hivemq.cloud:8884/mqtt";
const usuarioMqtt = "gasoso";
const senhaMqtt = "Senha1234";
const topico = "gas/detecao"; // Tópico corrigido para match com ESP32

const estado = {};
let alertaSonoro = new Audio("alerta.mp3");
let gasDetectado = false;
let alertaAtivo = false;

// Elementos DOM
let alerta = null;
let tabela = null;

const cliente = mqtt.connect(hostMqtt, {
    username: usuarioMqtt,
    password: senhaMqtt
});

cliente.on("connect", () => {
    cliente.subscribe(topico);
    console.log("MQTT conectado com sucesso");
});

cliente.on("message", (topic, mensagem) => {  
    try {
        const dados = JSON.parse(mensagem.toString());

        if (id_device != 8084) {
            return;
        }
        console.log("Dados recebidos:", dados);
        
        estado.sensor = dados;
        
        processarDadosSensor(dados);
        
    } catch (e) { 
        console.warn("JSON inválido:", mensagem.toString(), e);
    }
});

cliente.on("error", (error) => {
    console.error("Erro MQTT:", error);
});

cliente.on("close", () => {
    console.log("Conexão MQTT fechada");
});

function processarDadosSensor(dados) {
    const gasDetectado = dados.gas_detectado || 
                        (dados.valor_gas && dados.valor_gas > dados.limiar) || 
                        dados.valor_digital === 0;
    
    exibirAlerta(gasDetectado);
    
    if (gasDetectado && !alertaAtivo) {
        adicionarNaTabela(dados.valor_analogico);
        alertaAtivo = true;
    } else if (!gasDetectado) {
        alertaAtivo = false;
    }
    
    atualizarDadosInterface(dados);
}

function exibirAlerta(temGas) {
    if (!alerta) {
        alerta = document.getElementById("alerta");
        if (!alerta) {
            console.error("Elemento 'alerta' não encontrado");
            return;
        }
    }
    
    if (temGas) {
        alerta.classList.add("temgas");
        alerta.innerHTML = "<span>GÁS DETECTADO</span>";
        alertaSonoro.pause();
        
        alertaSonoro.play().catch(error => {
            console.warn("Não foi possível reproduzir áudio:", error);
        });
        
    } else {
        alerta.classList.remove("temgas");
        alerta.innerHTML = "<span>Nenhum Gás Detectado</span>";
        
        if (alertaSonoro) {
            alertaSonoro.pause();
            alertaSonoro.currentTime = 0;
        }
    }
}

function atualizarDadosInterface(dados) {
    const elementos = {
        'valor-gas': dados.valor_gas,
        'valor-analogico': dados.valor_analogico,
        'valor-digital': dados.valor_digital,
        'limiar': dados.limiar,
        'sensor-id': dados.sensor_id,
        'status': dados.status
    };
    
    Object.keys(elementos).forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento && elementos[id] !== undefined) {
            elemento.textContent = elementos[id];
        }
    });

    const timestampElement = document.getElementById('timestamp');
    if (timestampElement) {
        const agora = new Date();
        timestampElement.textContent = agora.toLocaleTimeString();
    }
}

function adicionarNaTabela(valor_analogico) {
    if (!tabela) {
        tabela = document.getElementById("tabela");
        if (!tabela) {
            console.warn("Tabela não encontrada");
            return;
        }
    }
    
    const data = new Date();
    const dia = `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
    const horario = `${data.getHours()}:${data.getMinutes().toString().padStart(2, '0')}`;
    
    const linha = document.createElement("tr");
    linha.innerHTML = `
        <td>${dia}</td>
        <td>${horario}</td>
        <td>Gás Detectado</td>
        <td>${valor_analogico ? valor_analogico : 'N/A'}</td>
    `;
    
    tabela.appendChild(linha);

    const linhas = tabela.querySelectorAll('tr');
    if (linhas.length > 50) {
        linhas[linhas.length - 1].remove();
    }
}

function verificarConexao() {
        if (cliente.connected) {
            console.log("Conectado");
        } else {
            console.log("Desconectado");
        }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Sistema de monitoramento inicializado");

    if (document.getElementById("alerta") && document.getElementById("tabela")) {
        tabela = document.getElementById("tabela");
        alerta = document.getElementById("alerta");
        alerta.innerHTML = "<span>Nenhum Gás Detectado</span>";
    }
    
    if (id_device == 8084) {
        setInterval(verificarConexao, 10000);
    }
    
    setInterval(() => {
        if (estado.sensor) {
            processarDadosSensor(estado.sensor);
        }
    }, 75000);


});