"use client";

import { useState, useEffect } from "react";
import { Cliente } from "../../domain/entities/Cliente";
import { Nome } from "../../domain/value-objects/Nome";
import { Email } from "../../domain/value-objects/Email";
import { Documento } from "../../domain/value-objects/Documento";
import { DomainError } from "../../domain/errors/DomainError";

type Tab = "sandbox" | "domain-concepts" | "clean-arch";

export default function ArchitecturePresentation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("sandbox");

  // Estados do Sandbox
  const [inputNome, setInputNome] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputDocumento, setInputDocumento] = useState("");

  // Resultados das validações individuais dos Value Objects
  const [nomeError, setNomeError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [documentoError, setDocumentoError] = useState<string | null>(null);

  // Entidade Cliente instanciada final
  const [clienteJson, setClienteJson] = useState<string | null>(null);
  const [domainException, setDomainException] = useState<string | null>(null);

  // Executa validação em tempo real (Fail-Fast Validation) à medida que o apresentador digita
  useEffect(() => {
    let currentNomeVo: Nome | null = null;
    let currentEmailVo: Email | null = null;
    let currentDocumentoVo: Documento | null = null;

    // 1. Validar Nome
    if (inputNome.trim() === "") {
      setNomeError("Aguardando preenchimento...");
    } else {
      try {
        currentNomeVo = Nome.create(inputNome);
        setNomeError(null);
      } catch (err: any) {
        setNomeError(err.message || "Erro de validação");
      }
    }

    // 2. Validar E-mail
    if (inputEmail.trim() === "") {
      setEmailError("Aguardando preenchimento...");
    } else {
      try {
        currentEmailVo = Email.create(inputEmail);
        setEmailError(null);
      } catch (err: any) {
        setEmailError(err.message || "Erro de validação");
      }
    }

    // 3. Validar Documento (CPF/CNPJ)
    if (inputDocumento.replace(/\D/g, "").trim() === "") {
      setDocumentoError("Aguardando preenchimento...");
    } else {
      try {
        currentDocumentoVo = Documento.create(inputDocumento);
        setDocumentoError(null);
      } catch (err: any) {
        setDocumentoError(err.message || "Erro de validação");
      }
    }

    // Tentar criar a Entidade Cliente se tudo estiver teoricamente preenchido
    if (inputNome && inputEmail && inputDocumento) {
      try {
        const cliente = Cliente.create({
          nome: inputNome,
          email: inputEmail,
          documento: inputDocumento,
          documentoUrl: null,
        });
        setClienteJson(JSON.stringify(cliente.toJSON(), null, 2));
        setDomainException(null);
      } catch (err: any) {
        setClienteJson(null);
        if (err instanceof DomainError) {
          setDomainException(`${err.name}: ${err.message}`);
        } else {
          setDomainException(`Erro Geral: ${err.message}`);
        }
      }
    } else {
      setClienteJson(null);
      setDomainException("Aguardando o preenchimento de todos os campos...");
    }
  }, [inputNome, inputEmail, inputDocumento]);

  const togglePanel = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* Botão flutuante para abrir o painel */}
      <button
        onClick={togglePanel}
        className="presentation-fab"
        aria-label="Abrir Painel de Apresentação de Arquitetura"
      >
        <span className="fab-icon">📊</span>
        <span className="fab-text">Modo Apresentação: DDD</span>
      </button>

      {/* Drawer Overlay (Backdrop) */}
      {isOpen && (
        <div className="presentation-backdrop" onClick={togglePanel} />
      )}

      {/* Painel lateral (Drawer) */}
      <aside className={`presentation-drawer ${isOpen ? "open" : ""}`} role="dialog" aria-label="Painel de Arquitetura">
        <div className="drawer-header">
          <div className="drawer-title-group">
            <span className="drawer-badge">DevMode</span>
            <h2 className="drawer-title">Arquitetura de Domínio & DDD</h2>
          </div>
          <button onClick={togglePanel} className="drawer-close" aria-label="Fechar painel">
            &times;
          </button>
        </div>

        {/* Abas de Navegação */}
        <nav className="drawer-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === "sandbox"}
            onClick={() => setActiveTab("sandbox")}
            className={`tab-btn ${activeTab === "sandbox" ? "active" : ""}`}
          >
            🧪 Sandbox DDD
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "domain-concepts"}
            onClick={() => setActiveTab("domain-concepts")}
            className={`tab-btn ${activeTab === "domain-concepts" ? "active" : ""}`}
          >
            🛡️ Peças do Domínio
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "clean-arch"}
            onClick={() => setActiveTab("clean-arch")}
            className={`tab-btn ${activeTab === "clean-arch" ? "active" : ""}`}
          >
            📐 Clean Architecture
          </button>
        </nav>

        {/* Conteúdo da Aba */}
        <div className="drawer-content">
          {/* ABA 1: SANDBOX INTERATIVO */}
          {activeTab === "sandbox" && (
            <div className="tab-pane">
              <p className="tab-description">
                Este sandbox interativo inst instancia as classes reais do domínio 
                (<strong>Value Objects</strong> e <strong>Entidades</strong>) à medida que você digita,
                demonstrando a validação antecipada (<em>Fail-Fast</em>).
              </p>

              <div className="sandbox-form">
                {/* Campo Nome */}
                <div className="sandbox-field-group">
                  <label htmlFor="sandbox-nome">Nome (Mín. 3 chars)</label>
                  <input
                    id="sandbox-nome"
                    type="text"
                    placeholder="Ex: Ana Clara"
                    value={inputNome}
                    onChange={(e) => setInputNome(e.target.value)}
                    className={nomeError && inputNome ? "input-err" : inputNome && !nomeError ? "input-ok" : ""}
                  />
                  {inputNome && (
                    <span className={`sandbox-feedback ${nomeError ? "error" : "success"}`}>
                      {nomeError ? `❌ ${nomeError}` : "✅ Nome válido!"}
                    </span>
                  )}
                </div>

                {/* Campo E-mail */}
                <div className="sandbox-field-group">
                  <label htmlFor="sandbox-email">E-mail (Regex de validação)</label>
                  <input
                    id="sandbox-email"
                    type="email"
                    placeholder="Ex: ana@provedor.com"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    className={emailError && inputEmail ? "input-err" : inputEmail && !emailError ? "input-ok" : ""}
                  />
                  {inputEmail && (
                    <span className={`sandbox-feedback ${emailError ? "error" : "success"}`}>
                      {emailError ? `❌ ${emailError}` : "✅ E-mail válido!"}
                    </span>
                  )}
                </div>

                {/* Campo Documento */}
                <div className="sandbox-field-group">
                  <label htmlFor="sandbox-documento">CPF / CNPJ (Dígitos verificadores)</label>
                  <input
                    id="sandbox-documento"
                    type="text"
                    placeholder="Ex: CPF ou CNPJ real"
                    value={inputDocumento}
                    onChange={(e) => setInputDocumento(e.target.value)}
                    className={documentoError && inputDocumento ? "input-err" : inputDocumento && !documentoError ? "input-ok" : ""}
                  />
                  {inputDocumento && (
                    <span className={`sandbox-feedback ${documentoError ? "error" : "success"}`}>
                      {documentoError ? `❌ ${documentoError}` : "✅ Documento válido!"}
                    </span>
                  )}
                </div>
              </div>

              {/* Console de Saída */}
              <div className="sandbox-console">
                <div className="console-header">
                  <span className="console-title">🖥️ Console do Domínio (Real-time)</span>
                  <span className={`console-badge ${clienteJson ? "success" : "warning"}`}>
                    {clienteJson ? "Instanciado com Sucesso" : "Estado Pendente"}
                  </span>
                </div>
                <div className="console-body">
                  {clienteJson ? (
                    <div>
                      <p className="console-log-text">
                        🎉 Instância de <code className="code-highlight">Cliente</code> criada com sucesso no domínio!
                      </p>
                      <pre className="console-code">
                        <code>{clienteJson}</code>
                      </pre>
                    </div>
                  ) : (
                    <div>
                      <p className="console-log-text text-yellow">
                        ⚠️ Aguardando preenchimento válido dos Value Objects...
                      </p>
                      {domainException && (
                        <div className="console-error-box">
                          <strong>Erro de Domínio capturado:</strong>
                          <pre className="console-code-error">{domainException}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ABA 2: PEÇAS DO DOMÍNIO */}
          {activeTab === "domain-concepts" && (
            <div className="tab-pane">
              <p className="tab-description">
                Entenda como cada conceito tático do Domain-Driven Design (DDD) é implementado em arquivos isolados no código do projeto:
              </p>

              <div className="concept-cards">
                {/* Cartão de Entidades */}
                <div className="concept-card">
                  <div className="concept-card-title">
                    <span>🛡️</span>
                    <h3>Entidades (Entities)</h3>
                  </div>
                  <p className="concept-card-text">
                    Classes que possuem identidade única que persiste além de mudanças de atributos.
                  </p>
                  <div className="concept-files">
                    <a href="file:///c:/Users/Matheus/Desktop/Cjteste/frontend/src/domain/entities/Cliente.ts" target="_blank" rel="noopener noreferrer" className="file-link-item">
                      📄 Cliente.ts
                    </a>
                    <a href="file:///c:/Users/Matheus/Desktop/Cjteste/frontend/src/domain/entities/Contratacao.ts" target="_blank" rel="noopener noreferrer" className="file-link-item">
                      📄 Contratacao.ts
                    </a>
                  </div>
                </div>

                {/* Cartão de Value Objects */}
                <div className="concept-card">
                  <div className="concept-card-title">
                    <span>💎</span>
                    <h3>Value Objects</h3>
                  </div>
                  <p className="concept-card-text">
                    Valores sem identidade definidos inteiramente por suas propriedades. São imutáveis e autocontidos (validam a si mesmos na criação).
                  </p>
                  <div className="concept-files">
                    <a href="file:///c:/Users/Matheus/Desktop/Cjteste/frontend/src/domain/value-objects/Nome.ts" target="_blank" rel="noopener noreferrer" className="file-link-item">
                      📄 Nome.ts
                    </a>
                    <a href="file:///c:/Users/Matheus/Desktop/Cjteste/frontend/src/domain/value-objects/Email.ts" target="_blank" rel="noopener noreferrer" className="file-link-item">
                      📄 Email.ts
                    </a>
                    <a href="file:///c:/Users/Matheus/Desktop/Cjteste/frontend/src/domain/value-objects/Documento.ts" target="_blank" rel="noopener noreferrer" className="file-link-item">
                      📄 Documento.ts
                    </a>
                  </div>
                </div>

                {/* Cartão de Erros de Domínio */}
                <div className="concept-card">
                  <div className="concept-card-title">
                    <span>⚠️</span>
                    <h3>Erros de Domínio</h3>
                  </div>
                  <p className="concept-card-text">
                    Exceções de negócio explícitas que herdam de uma classe base común, evitando o uso de exceções genéricas.
                  </p>
                  <div className="concept-files">
                    <a href="file:///c:/Users/Matheus/Desktop/Cjteste/frontend/src/domain/errors/DomainError.ts" target="_blank" rel="noopener noreferrer" className="file-link-item">
                      📄 DomainError.ts
                    </a>
                  </div>
                </div>

                {/* Cartão de Repositórios */}
                <div className="concept-card">
                  <div className="concept-card-title">
                    <span>🔌</span>
                    <h3>Repositórios (Interfaces)</h3>
                  </div>
                  <p className="concept-card-text">
                    Interfaces abstratas que ditam como a aplicação se comunica com fontes de dados, mantendo o domínio agnóstico de tecnologias externas.
                  </p>
                  <div className="concept-files">
                    <a href="file:///c:/Users/Matheus/Desktop/Cjteste/frontend/src/domain/repositories/IAuthRepository.ts" target="_blank" rel="noopener noreferrer" className="file-link-item">
                      📄 IAuthRepository.ts
                    </a>
                    <a href="file:///c:/Users/Matheus/Desktop/Cjteste/frontend/src/domain/repositories/IContratacaoRepository.ts" target="_blank" rel="noopener noreferrer" className="file-link-item">
                      📄 IContratacaoRepository.ts
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABA 3: CLEAN ARCHITECTURE */}
          {activeTab === "clean-arch" && (
            <div className="tab-pane">
              <p className="tab-description">
                A aplicação está estruturada de acordo com as camadas da <strong>Clean Architecture</strong>. 
                As dependências de código apontam estritamente de fora para dentro.
              </p>

              {/* Diagrama Visual */}
              <div className="architecture-diagram">
                <div className="arch-circle layer-infrastructure">
                  <div className="layer-label">Infraestrutura (Externo)</div>
                  <div className="layer-desc">HTTP Clientes, Storage, API Adapters</div>
                  
                  <div className="arch-circle layer-presentation">
                    <div className="layer-label">Apresentação (React/Next)</div>
                    <div className="layer-desc">Componentes, Hooks, Globals CSS</div>

                    <div className="arch-circle layer-application">
                      <div className="layer-label">Aplicação (Use Cases)</div>
                      <div className="layer-desc">Orquestração, SolicitarContratacao</div>

                      <div className="arch-circle layer-domain">
                        <div className="layer-label font-bold text-blue">Domínio (Core)</div>
                        <div className="layer-desc">Entidades, Value Objects, Erros</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explicação das Camadas */}
              <div className="architecture-explanation">
                <div className="arch-step">
                  <span className="arch-step-num">1</span>
                  <div>
                    <strong>Camada de Apresentação</strong>: Captura os dados da UI e chama o Caso de Uso correspondente.
                  </div>
                </div>
                <div className="arch-step">
                  <span className="arch-step-num">2</span>
                  <div>
                    <strong>Caso de Uso (Aplicação)</strong>: Orquestra o fluxo de dados, chama a validação de domínio e persiste delegando para a interface do Repositório.
                  </div>
                </div>
                <div className="arch-step">
                  <span className="arch-step-num">3</span>
                  <div>
                    <strong>Domínio (Core)</strong>: Valida as regras de integridade. Se falhar, lança `DomainError` de imediato (Fail-Fast).
                  </div>
                </div>
                <div className="arch-step">
                  <span className="arch-step-num">4</span>
                  <div>
                    <strong>Infraestrutura (Externo)</strong>: Executa o envio HTTP real para o backend. Se a API estiver offline, a camada de aplicação reverte localmente (Rollback).
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
