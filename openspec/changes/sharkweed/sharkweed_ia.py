import cv2
import numpy as np
from tensorflow.keras.models import load_model

# IMPORTANTE: Se for rodar no Raspberry Pi de verdade, instalaremos a biblioteca RPi.GPIO
# import RPi.GPIO as GPIO

# --- Configuração dos Pinos Virtuais (Robô) ---
PinoBomba = 18 # Pino GPIO que vai ligar o relé da bomba
# GPIO.setmode(GPIO.BCM)
# GPIO.setup(PinoBomba, GPIO.OUT)

# 1. Carregando a sua Inteligência Artificial 
# (Estes arquivos você fará o download no Google Teachable Machine)
print("Carregando o Cérebro do SharkWeed...")
# Descomente a linha abaixo quando colocar o arquivo keras_model.h5 na mesma pasta
# modelo = load_model("keras_model.h5", compile=False)
# classes = open("labels.txt", "r").readlines()

# 2. Ligando o Olho do Robô (Webcam)
camera = cv2.VideoCapture(0)

# Tamanho que a IA pede para analisar a imagem
tamanho_ia = (224, 224)

print("Sistema Mapeando o Solo... Pressione 'q' para sair.")

while True:
    sucesso, imagem = camera.read()
    if not sucesso:
        continue

    # Aqui preparamos a imagem como o Teachable Machine gosta
    imagem_redimensionada = cv2.resize(imagem, tamanho_ia, interpolation=cv2.INTER_AREA)
    imagem_array = np.asarray(imagem_redimensionada, dtype=np.float32).reshape(1, 224, 224, 3)
    imagem_normalizada = (imagem_array / 127.5) - 1

    # --- A MÁGICA DA IA ACONTECE AQUI ---
    # Descomente as linhas abaixo quando o modelo estiver pronto
    
    # previsao = modelo.predict(imagem_normalizada)
    # indice_vencedor = np.argmax(previsao)
    # nome_classe = classes[indice_vencedor].strip()
    # certeza = previsao[0][indice_vencedor] * 100
    
    # --- SIMULAÇÃO (APAGUE QUANDO A IA FOR CONECTADA ACIMA) ---
    nome_classe = "1 Erva Daninha" # Simulando que encontrou
    certeza = 95.0
    # -----------------------------------------------------------

    # Mostrando na tela do PC
    cv2.putText(imagem, f"{nome_classe}: {certeza:.1f}%", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.imshow("Acampamento Base - CEFET Sharks", imagem)

    # 3. O Ataque! (A Lógica do Robô)
    if "Erva Daninha" in nome_classe and certeza > 85.0:
        print("ALVO DETECTADO! Acionando Bomba...")
        # GPIO.output(PinoBomba, GPIO.HIGH) # Liga a bomba e joga veneno/vinagre
    else:
        # GPIO.output(PinoBomba, GPIO.LOW) # Desliga a bomba se for "Cultura" ou "Terra"
        pass

    # Sai do programa se apertar 'q'
    if cv2.waitKey(1) == ord('q'):
        break

camera.release()
cv2.destroyAllWindows()
# GPIO.cleanup()
