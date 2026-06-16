const express = require("express");
const path = require("path");
const ErrorResponse = require("./utils/ErrorResponse");

// Banco
const MysqlDatabase = require("./database/MysqlDatabase");

// ===== Funcionários =====
const FuncionarioDAO = require("./FUNCIONARIO/FuncionarioDAO");
const FuncionarioService = require("./FUNCIONARIO/FuncionarioService");
const FuncionarioControl = require("./FUNCIONARIO/controllerFuncionario");
const FuncionarioMiddleware = require("./FUNCIONARIO/FuncionarioMiddleware");
const FuncionarioRoteador = require("./FUNCIONARIO/FuncionarioRouter");
const JwtMiddleware = require("./JWT/JwtMiddleware");
// ===== Salas =====
const SalaDAO = require("./SALA/SalaDAO");
const SalaService = require("./SALA/SalaService");
const SalaControl = require("./SALA/controllerSala");
const SalaMiddleware = require("./SALA/SalaMiddleware");
const SalaRoteador = require("./SALA/SalaRouter");
// ===== Equipamentos =====
const EquipamentoDAO = require("./EQUIPAMENTO/EquipamentoDAO");
const EquipamentoService = require("./EQUIPAMENTO/equipamentoService");
const EquipamentoControl = require("./EQUIPAMENTO/controllerEquipamento");
const EquipamentoMiddleware = require("./EQUIPAMENTO/EquipamentoMiddleware");
const EquipamentoRoteador = require("./EQUIPAMENTO/EquipamentoRouter");
// ===== Chamados =====
const ChamadoDAO = require("./CHAMADO/ChamadoDAO");
const ChamadoService = require("./CHAMADO/ChamadoService");
const ChamadoControl = require("./CHAMADO/controllerChamado");
const ChamadoMiddleware = require("./CHAMADO/ChamadoMiddleware");
const ChamadoRoteador = require("./CHAMADO/ChamadoRouter");

module.exports = class Server {
  #porta;
  #app;

  #database;

  // Funcionários
  #funcionarioDAO;
  #funcionarioService;
  #funcionarioControl;
  #funcionarioMiddleware;
  #funcionarioRoteador;

  #jwtMiddleware;
  // Salas
  #salaDAO;
  #salaService;
  #salaControl;
  #salaMiddleware;
  #salaRoteador;
  // Equipamentos
  #equipamentoDAO;
  #equipamentoService;
  #equipamentoControl ;
  #equipamentoMiddleware;
  #equipamentoRoteador;

  // Chamados
  #chamadoDAO;
  #chamadoService;
  #chamadoControl;
  #chamadoMiddleware;
  #chamadoRoteador;

  constructor(porta) {
    this.#porta = porta ?? 3000;
  }

  init = async () => {
    this.#app = express();

    this.#app.use(express.json());
    this.beforeRouting();

    // Ajuste credenciais conforme seu ambiente
    this.#database = new MysqlDatabase({
      host: "localhost",
      user: "root",
      password: "",
      database: "TCC",
      port: 3306,
      waitForConnections: true,
      connectionLimit: 50,
      queueLimit: 10,
    });

    this.#database.connect();

    this.setupFuncionarios();
    this.setupSalas();
    this.setupEquipamentos();
    this.setupInterfaceChamados();
    this.setupChamados();
    this.setupErrorMiddleware();
  };

  beforeRouting = () => {
    this.#app.use((req, res, next) => {
      console.log("------------------------------------------------------------------");
      next();
    });
  };

  setupFuncionarios = () => {
    this.#funcionarioDAO = new FuncionarioDAO(this.#database);
    this.#funcionarioService = new FuncionarioService(this.#funcionarioDAO);
    this.#funcionarioControl = new FuncionarioControl(this.#funcionarioService);
    this.#funcionarioMiddleware = new FuncionarioMiddleware();
    this.#jwtMiddleware = new JwtMiddleware();

    const router = express.Router();
    this.#funcionarioRoteador = new FuncionarioRoteador(
      this.#jwtMiddleware,
      this.#funcionarioMiddleware,
      this.#funcionarioControl
    );

    this.#app.use("/funcionarios", this.#funcionarioRoteador.createRoutes());
  
  };

  setupSalas = () => {
    this.#salaDAO = new SalaDAO(this.#database);
    this.#salaService = new SalaService(this.#salaDAO);
    this.#salaControl = new SalaControl(this.#salaService);
    this.#salaMiddleware = new SalaMiddleware();

    const router = express.Router();
    this.#salaRoteador = new SalaRoteador(
      router,
      this.#jwtMiddleware, 
      this.#salaMiddleware,
      this.#salaControl
    );

    this.#app.use("/salas", this.#salaRoteador.createRoutes());
  };
  setupEquipamentos = () => {
    this.#equipamentoDAO = new EquipamentoDAO(this.#database);
    this.#equipamentoService = new EquipamentoService(this.#equipamentoDAO, this.#salaDAO);
    this.#equipamentoControl = new EquipamentoControl(this.#equipamentoService);
    this.#equipamentoMiddleware = new EquipamentoMiddleware();
    this.#equipamentoRoteador = new EquipamentoRoteador(
      this.#jwtMiddleware,
      this.#equipamentoMiddleware,
      this.#equipamentoControl
    );

    this.#app.use("/equipamentos", this.#equipamentoRoteador.createRoutes());
  };

  setupInterfaceChamados = () => {
    this.#app.use("/ui", express.static(path.join(__dirname, "docs")));
    this.#app.use("/fotos", express.static(path.join(__dirname, "fotos")));

    this.#app.get("/login", (request, response) => {
      response.redirect("/ui/login.html");
    });

    this.#app.get("/chamados/cadastro", (request, response) => {
      response.redirect("/ui/chamados-cadastro.html");
    });
  };

    setupChamados = () => {
        this.#chamadoDAO = new ChamadoDAO(this.#database);
        this.#chamadoService = new ChamadoService(this.#equipamentoDAO, this.#funcionarioDAO, this.#chamadoDAO);
        this.#chamadoControl = new ChamadoControl(this.#chamadoService);
        this.#chamadoMiddleware = new ChamadoMiddleware();
        this.#chamadoRoteador = new ChamadoRoteador(
            this.#jwtMiddleware,
            this.#chamadoMiddleware,
            this.#chamadoControl
        );
        this.#app.use("/chamados", this.#chamadoRoteador.createRoutes());
    };

  setupErrorMiddleware = () => {
    this.#app.use((error, request, response, next) => {
      const resposta = { success: false };

      if (error instanceof ErrorResponse) {
        resposta.message = error.message;
        resposta.error = error.error;
        return response.status(error.httpCode).json(resposta);
      }

      resposta.message = "Ocorreu um erro interno no servidor";
      resposta.error = {
        message: error.message || "Erro interno",
        code: error.code,
        stack: error.stack,
      };

      console.error("❌ Erro capturado:", resposta);
      return response.status(500).json(resposta);
    });
  };

  run = () => {
    this.#app.listen(this.#porta, () => {
      console.log(`🚀 Server rodando em http://localhost:${this.#porta}/`);
    });
  };
};