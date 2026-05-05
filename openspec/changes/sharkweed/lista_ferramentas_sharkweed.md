# Checklist Definitivo do SharkWeed
**Versão:** Híbrida (PC + Arduino)
Este é o resumo de todas as ferramentas (Físicas e Digitais) que vocês estarão usando no projeto. Ideal para colocar no relatório escrito pro CEFET!

---

## 💻 1. Ferramentas Digitais (Software & IA)
Tudo aqui roda no Notebook de um de vocês e é **100% Gratuito**.

*   **Google Teachable Machine (Site):** Ferramenta web do Google onde a equipe vai subir as fotos das ervas daninhas e treinar o "cérebro". Ele vai gerar o modelo de IA.
*   **Linguagem Python:** A linguagem de programação que processará as informações no Notebook.
*   **VS Code (Visual Studio Code):** O programa (IDE) onde vocês escreverão e rodarão os códigos Python e Arduino no PC.
*   **Bibliotecas do Python (Essenciais):**
    *   `OpenCV` (Para o Python dar "play" na imagem da webcam e abri-la na tela).
    *   `Tensorflow / Keras` (Para o Python conseguir ler o arquivo de "cérebro" treinado lá do Google).
    *   `PySerial` (Para o Python conseguir mandar a mensagem pro fio do USB dizendo "Atira Arduino!").
*   **IDE do Arduino:** Programa oficial da placa Arduino para passar o nosso código C++ (`sharkweed_arduino.ino`) lá para dentro do robozinho.

---

## 🤖 2. Ferramentas Físicas (Hardware & Mecânica)
A parte onde a fita isolante e o parafuso entram. Peguem nos laboratórios da faculdade o que der!

**"O Cérebro" (Fica sob controle humano off-board)**
*   **Notebook com Bateria Boa:** Processará a IA.
*   **WebCam USB Simples:** Presa no "focinho" do robô usando um cabo de extensão longo conectada ao notebook da equipe do lado de fora (ou se preferir e tiver, usar um smartphone como webcam via Wi-Fi usando o App *Iriun Webcam*).

**"O Corpo e Músculo" (A estrutura do robô embarcado)**
*   **Placa Arduino (Uno ou Nano):** O operário que recebe ordens do Notebook através de um Cabo USB Azul longo.
*   **Kit Chassi 2WD "Robô Seguidor de Linha":** A base de acrílico amarela mais comum das aulas de robótica, com 2 motores DC amarelos e a rodinha de apoio lá atrás.
*   **Módulo Ponte H L298N (Placa Vermelha):** Ligado no Arduino, é ele quem de fato empurra energia pros dois motores do pneu, ditando se eles andam, freiam ou dão ré.

**"O Sistema Endócrino - Ataque da Erva!"**
*   **Mini Bomba D'água submersível 5V:** Uma bomba cilíndrica muito barata (do tamanho de um dedão de adulto) que é usada comumente com relé.
*   **Módulo Relé (1 Canal - 5V):** O "interruptor" que o Arduino aperta pra fazer a água da bomba jorrar. Uma ponta liga no Arduino, a outra fecha os fios da bomba.
*   **Canudinho de silicone ou de Suco:** Acoplado no bico da bomba e apontando para o chão entre as rodas para ter precisão cirúrgica de onde o veneno/água cai.
*   **Potinho Leve (Reservatório de Vinagre):** Um copinho plástico furado de café amarrado com fita na garupa, com a mini bomba submersa lá dentro.

**"Energia (Muito Importante para não desmaiar o Arduino!)"**
*   **Bateria de Lithium 18650 (No mínimo duas, que dá ~7.4v):** É um perigo ligar tudo no coitado do Arduino. Usem o pack de baterias **ligado direto na Ponte H** para girar as rodonas e a bomba sem travar a placa principal. O próprio Arduino estará vivo graças à energia que vem do cabo USB conectado ao Notebook de vocês!
