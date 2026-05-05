# Projeto "SharkWeed"
**Robô Autônomo de Baixo Custo para Controle Sustentável de Ervas Daninhas**

*Um projeto para a equipe CEFET Sharks.*

---

## 1. Resumo Executivo
O **SharkWeed** é uma proposta inovadora de um robô agrícola (AgriBot) focado em **Agricultura de Precisão**. Seu diferencial está em ser acessível (baixo custo) e inteligente. O robô navega pelas plantações utilizando Visão Computacional para identificar ervas daninhas e aplicar defensivos (ou soluções ecológicas, como vinagre agrícola de alta concentração) **apenas no alvo**, ao invés de pulverizar e encharcar o solo inteiro. 

Essa abordagem não apenas economiza recursos, mas também preserva o meio ambiente, e é perfeitamente exequível com componentes de prototipagem "maker" acessíveis.

## 2. A Inovação por trás do Simples
Em projetos acadêmicos e para aprovação de professores, a inovação não precisa vir de componentes industriais caríssimos de robótica, mas sim da **aplicação inteligente do que temos**. A inovação deste projeto baseia-se em 3 pilares:
1.  **Aplicação Localizada ("Spot Spraying"):** Ao invés de um carrinho com uma mangueira vazando constantemente, o robô entende *onde* está a planta e aciona um pequeno jato de forma pontual.
2.  **Processamento em Borda (Edge Computing):** Utilizando um Raspberry Pi (o "resbord"), a IA (Visão Computacional) não precisa de internet para funcionar. O "cérebro" processa em tempo real localmente.
3.  **Hardware Minimalista:** Design feito para ser leve, não compactar o solo e ser montado com componentes baratos e amplamente disponíveis.

---

## 3. Arquitetura e Componentes Necessários

### 3.1 Hardware (O que você vai precisar montar)
Para mantermos o custo baixíssimo, não vamos construir um trator. Usaremos uma estrutura simplificada:

*   **O Cérebro (Processamento):** Raspberry Pi (Zero 2 W, 3B+ ou 4). Ele receberá as imagens e fará pensar.
*   **Os Olhos (Sensor):** Câmera USB simples modelo WebCam (barata) ou Módulo Pi Camera (se usar raspberry).
*   **O Corpo (Locomoção):** Kit Chassi 2WD (2 rodas motorizadas + 1 roda boba de apoio, muito comum em Arduino). É leve e barato.
*   **Os Músculos (Atuadores):** 
    *   **Driver de Motor:** Módulo Ponte H (L298N) para controlar as rodas.
    *   **O "Atirador" (Remoção da Erva):** Uma Mini Bomba de Água submersível (do tipo usada em bicos de para-brisa de carro) conectada a um pequeno reservatório de plástico com mangueirinha e bocal na frente do robô. Modulo relé e transistor simples para acionar a bomba.
*   **Alimentação:** Bateria PowerBank para segurar o Raspberry Pi (limpo) e um pack de baterias/pilhas de Lithium (18650) ou Lipoly separadas para não dar interferência para os motores e para a bomba.

### 3.2 Software (A Inteligência - IA e OpenCV)
*   **Linguagem de Programação:** Python (pela ampla variedade de bibliotecas).
*   **A Abordagem Tradicional Computacional (Fácil / Recomendada ao Professor):** Usar a biblioteca **OpenCV**. Transforma-se a imagem da câmera do modelo de cores RGB para HSV. Configuram-se faixas de cores para mapear apenas o tom de *"Verde da Erva Daninha"* contrapeando o *"Marrom/Cinza da Terra"*. Em seguida detecta-se o centro de massa verde. O robô se alinha para que o centro da planta esteja na sua mira, para o pino e aciona a bomba.
*   **A Abordagem IA Pura (O "Tchan" do projeto):** É possível treinar uma Rede Neural levíssima, chamada de **Tensorflow Lite (MobileNet-SSD ou YOLOv8 Nano)**, que detectará não só a cor, mas a FORMA da erva daninha distinguindo da cultura plantada. Na apresentação para o seu professor, você pode explicar que o robô possui uma IA baseada em detecção de objetos (Object Detection).

---

## 4. Como funciona o Fluxo (Passo-a-Passo da Operação)

1.  **Patrulha:** O carrinho anda de forma autônoma (linha reta entre as plantações).
2.  **Visão:** A câmera aponta ligeiramente para o solo abaixo à frente (a um palmo de distância).
3.  **Identificação (IA/OpenCV):** O Raspberry nota um quadrado verde (ou a caixa delimitadora da Rede Neural identificou a planta alvo). O código Python calcula as coordenadas (X, Y) no frame.
4.  **Alinhamento:** Como o robô é basico, e não temos braços robóticos caros, o robô inteiro usa os motores das rodas para ir para frente ou girar até que as coordendas se alinhem com o centro onde o canudo/bico da bomba está mirando.
5.  **O Combate:** O robô para. A plataforma ativa a Relé, que liga a mini-bomba por 500 milissegundos. Um pequeno e letal jato de solução atinge exatamente o coração da erva daninha.
6.  **Retorno:** O robô volta à sua patrulha.

---

## 5. Justificativa Acadêmica (Para vender a ideia ao Professor)

> *"Professor, nosso projeto SharkWeed busca resolver o problema do desperdício de defensivos agrícolas usando conceitos da Indústria 4.0. Enquanto métodos tradicionais banham vastas áreas independentemente da presença da erva daninha (poluindo rios e o solo), nosso robô usa Inteligência Artificial e Visão Computacional Embarcada. Provamos por meio deste protótipo MVP (Minimum Viable Product) de baixo custo, que é possível utilizar microprocessadores como o Raspberry Pi gerando economia e redução de agentes químicos aplicados. O projeto une hardware, software e preocupação ambiental de maneira plausível."*

## 6. Próximos Passos e Dicas de Implementação

1.  **Fase 1 (Aviso de Ideia):** Consiga o kit básico chassi (2 rodas, base de acrilico) e Raspberry Pi (Se não com o Cefet, talvez emprestado).
2.  **Fase 2 (Visão Computacional Base):** Instalar OpenCV no Python do Raspberry Pi. Sem o carrinho físico ainda, tente usar o RPi sobre uma mesa e reconhecer recortes de papel verde versus fundo pardo para provar conceito via thresholding.
3.  **Fase 3 (Integração):** Fazer o RPi acender um led quando "vê" o verde.
4.  **Fase 4 (Mecânica):** Ligar os Motores à Ponte H controlada por GPIO. Programar para "se ver verde, parar. Se não ver, andar lentamente em frente."
5.  **Fase 5 (Bomba):** Adicione um reservatório plastico leve e uma micro-bomba, acionada em conjunto ao "freio" de quando encontra o alvo verde.

*Equipe CEFET Sharks! Vamos inovar na Agropecuária de precisão!*
