# IoT Gas Leak Detector

Sistema IoT para detecção de vazamento de gás utilizando ESP32, sensores MQ e comunicação MQTT, com monitoramento em dashboard web.

Veja a documentação completa (Aqui!)[https://github.com/nathanael-bueno/pi-iot/blob/main/docs/PI - Entrega 4.pdf]

Projeto Finalizado em 11 de Novembro de 2025

## Objetivo

Desenvolver um sistema de baixo custo capaz de detectar gases perigosos e emitir alertas locais e remotos, contribuindo para prevenção de acidentes domésticos e industriais.

O projeto está alinhado ao Objetivo de Desenvolvimento Sustentável 3 (Saúde e Bem-estar).

---

## Arquitetura do Sistema

Sensor de gás → ESP32 → MQTT Broker → Dashboard Web

Fluxo:

1. Sensor MQ-2 detecta concentração de gás
2. ESP32 processa os dados
3. Caso o nível ultrapasse o limiar:
   - LED vermelho é ativado
   - buzzer emite alerta sonoro
   - servo fecha a válvula
4. Dados são enviados ao broker MQTT
5. Dashboard web recebe e exibe os eventos

---

## Tecnologias Utilizadas

### Hardware
- ESP32
- Sensor MQ-2 / MQ-135
- Buzzer
- LED
- Servo motor
- Protoboard

### Software
- Arduino Framework
- MQTT
- HTML
- CSS
- JavaScript
- Firebase (armazenamento de eventos)

---

## Estrutura do Projeto

/esp-code.txt
→ código do ESP32 responsável pela leitura do sensor e comunicação MQTT

project/
→ interface web de monitoramento

docs/
→ documentação acadêmica do projeto

---

## Comunicação MQTT

Broker: HiveMQ Cloud

Tópicos utilizados:

gas/detecao
gas/status


Exemplo de mensagem publicada:
```bash
{
   "sensor_id": "gas-sensor-01",
   "gas_detectado": true,
   "valor_gas": 2800,
   "status": "ALERTA"
}
```


---

## Interface Web

O dashboard permite:

- monitorar sensores
- visualizar alertas
- registrar detecções recentes
- gerenciar dispositivos

---

# Como Executar

### Firmware

1. Abrir o código no Arduino IDE
2. Configurar WiFi
3. Configurar credenciais MQTT
4. Upload para ESP32

### Dashboard

Abrir:
project/index.html


Ou usar Live Server no VSCode.

---
## Authors

Projeto desenvolvido para disciplina de IoT.

Integrantes:

- Arthur Pierre de Oliveira
- [Nathanael Ferreira Bueno](https://github.com/nathanael-bueno)
- Pedro de Castro Rolim
- Pedro Ikson Bastos Correia
- [Sávio de Oliveira Sales Lopes](https://github.com/SavioSales76-dev)


## License

[MIT](https://github.com/nathanael-bueno/pi-iot/blob/main/LICENSE)
