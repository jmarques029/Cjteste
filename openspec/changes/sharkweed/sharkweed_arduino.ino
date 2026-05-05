// 🤖 CEFET Sharks - SharkWeed (Versão Arduino Escravo)
//---------------------------------------------------------

// --- Pinos do Chassi (Motores - Ponte H L298N) ---
const int MotorEsquerdoFrente = 5;
const int MotorEsquerdoTras = 4;
const int MotorDireitoFrente = 6;
const int MotorDireitoTras = 7;

// --- Pino do "Mata Mato" (Relé da Bomba D'água) ---
const int PinoBomba = 8;

void setup() {
  // Inicia a comunicação Serial com o Notebook (USB ou Bluetooth)
  Serial.begin(9600); 
  
  // Avisa pro Arduino que esses pinos enviarão energia (OUTPUT)
  pinMode(MotorEsquerdoFrente, OUTPUT);
  pinMode(MotorEsquerdoTras, OUTPUT);
  pinMode(MotorDireitoFrente, OUTPUT);
  pinMode(MotorDireitoTras, OUTPUT);
  pinMode(PinoBomba, OUTPUT);

  // Todo mundo começa parado
  pararMotores();
  digitalWrite(PinoBomba, LOW);
}

void loop() {
  // Verifica se o seu Notebook enviou alguma mensagem
  if (Serial.available() > 0) {
    char comandoDoPC = Serial.read(); // Lê a letra que chegou
    
    if (comandoDoPC == 'W') {
      andarParaFrente();
    } 
    else if (comandoDoPC == 'S') {
      pararMotores();
    }
    // A MÁGICA: O PC gritou "Fogo!" (Letra F enviada pelo código no PC)
    else if (comandoDoPC == 'F') { 
      pararMotores();            // Robô trava pra ter precisão
      delay(300);                // Espera parar de chacoalhar
      
      digitalWrite(PinoBomba, HIGH); // LIGA A BOMBA! 💦🌿
      delay(800);                    // Esguicha por 800 milissegundos
      digitalWrite(PinoBomba, LOW);  // DESLIGA
      
      // Opcional: retoma viagem automática após atirar (descomente pra testar)
      // andarParaFrente(); 
    }
  }
}

// ---- Funções Auxiliares de Movimento ---- 
void andarParaFrente() {
  digitalWrite(MotorEsquerdoFrente, HIGH);
  digitalWrite(MotorEsquerdoTras, LOW);
  digitalWrite(MotorDireitoFrente, HIGH);
  digitalWrite(MotorDireitoTras, LOW);
}

void pararMotores() {
  digitalWrite(MotorEsquerdoFrente, LOW);
  digitalWrite(MotorEsquerdoTras, LOW);
  digitalWrite(MotorDireitoFrente, LOW);
  digitalWrite(MotorDireitoTras, LOW);
}
