const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");
const ErrorResponse = require("../utils/ErrorResponse");

const pastaFotosChamado = path.join(__dirname, "..", "fotos", "chamados");
fs.mkdirSync(pastaFotosChamado, { recursive: true });

const storage = multer.diskStorage({
    destination: (_request, _file, callback) => {
        callback(null, pastaFotosChamado);
    },
    filename: (_request, file, callback) => {
        const extensao = path.extname(file.originalname || "").toLowerCase();
        const nomeArquivo = `${crypto.randomUUID()}${extensao}`;
        callback(null, nomeArquivo);
    },
});

const uploadFotoChamado = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (request, file, callback) => {
        if (!file.mimetype || !file.mimetype.startsWith("image/")) {
            request.fileValidationError = "A foto deve ser uma imagem válida";
            return callback(null, false);
        }
        callback(null, true);
    },
});

/**
 * Classe responsável por configurar as rotas da entidade Equipamento.
 * 
 * Observações sobre injeção de dependência:
 * - O roteador não cria suas próprias instâncias de middlewares ou controladores.
 * - Ele recebe instâncias externas de JwtMiddleware, EquipamentoMiddleware e EquipamentoControle via construtor.
 * - Isso permite:
 *      - Testes unitários com mocks ou stubs;
 *      - Troca de implementações sem alterar o roteador;
 *      - Segue o princípio de inversão de dependência (SOLID).
 */
module.exports = class ChamadoRoteador {
    // Atributos privados
    #router;
    #ChamadoController;
    #chamadoMiddleware;
    #jwtMiddleware;
    #uploadMiddleware;

    /**
     * Construtor da classe ChamadoRoteador
     * 
     * Injeção de dependência:
     * @param {JwtMiddleware} jwtMiddleware - Middleware JWT externo injetado
     * @param {ChamadoMiddleware} chamadotoMiddleware - Middleware de validação de Chamado injetado
     * @param {ChamadoController} ChamadoController - Controlador de Chamado injetado
     */
    constructor(jwtMiddleware, chamadoMiddleware, ChamadoController) {
        console.log("⬆️  ChamadoRoteador.constructor()");
        this.#router = express.Router();

        // Armazenando as instâncias injetadas
        this.#jwtMiddleware = jwtMiddleware;
        this.#chamadoMiddleware = chamadoMiddleware;
        this.#ChamadoController = ChamadoController;
        this.#uploadMiddleware = uploadFotoChamado.single("foto");
    }

    enforceAuthenticatedFuncionario = (request, _response, next) => {
        const idFuncionario = Number(request.authUser?.idFuncionario);
        if (!Number.isInteger(idFuncionario) || idFuncionario <= 0) {
            return next(new ErrorResponse(401, "Não autorizado", { message: "Não foi possível identificar o funcionário autenticado" }));
        }

        if (!request.body.chamado || typeof request.body.chamado !== "object") {
            request.body.chamado = {};
        }

        request.body.chamado.funcionario = { idFuncionario };
        request.body.chamado.statusConserto = 1;

        next();
    }

    normalizeMultipartBody = (request, _response, next) => {
        try {
            if (request.fileValidationError) {
                return next(new ErrorResponse(400, "Erro na validação de dados", { message: request.fileValidationError }));
            }

            if (typeof request.body.chamado === "string") {
                request.body.chamado = JSON.parse(request.body.chamado);
            }

            if (!request.body.chamado || typeof request.body.chamado !== "object") {
                request.body.chamado = {};
            }

            if (request.file) {
                request.body.chamado.foto = `/fotos/chamados/${request.file.filename}`;
            }

            next();
        } catch (_error) {
            next(new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'chamado' deve ser um JSON válido" }));
        }
    }

    /**
     * Configura as rotas da API REST para a entidade Chamado.
     * 
     * Rotas configuradas:
     * POST "/login"                    -> Efetuar login do funcionário
     * POST "/"                          -> Criar um novo Chamado (validação JWT + body)
     * PUT "/:idChamado"             -> Atualizar Chamado por ID (validação JWT + id param + body)
     * DELETE "/:idChamado"          -> Deletar Chamado por ID (validação JWT + id param)
     * GET "/"                           -> Listar todos os Chamados (validação JWT)
     * GET "/:idChamado"             -> Buscar Chamado por ID (validação JWT + id param)
     * 
     * Todas as dependências (JWT, middleware de validação, controlador) são fornecidas externamente,
     * permitindo maior flexibilidade e testabilidade do código.
     * 
     * @returns {express.Router} Router configurado com todas as rotas de Chamado
     */
    createRoutes = () => {
        console.log("⬆️  ChamadoRoteador.createRoutes()");

        // ROTA: POST[/chamados]
        this.#router.post("/",
            this.#jwtMiddleware.validateToken,
            this.#uploadMiddleware,
            this.normalizeMultipartBody,
            this.enforceAuthenticatedFuncionario,
            this.#chamadoMiddleware.validateCreateBody,
            this.#ChamadoController.store
        );

        // ROTA: PUT[/chamados/:idChamado]
        this.#router.put("/:idChamado",
            this.#jwtMiddleware.validateToken,
            this.#chamadoMiddleware.validateIdParam,
            this.#chamadoMiddleware.validateStatusUpdatePermission,
            this.#chamadoMiddleware.validateCreateBody,
            this.#ChamadoController.update
        );

        // ROTA: DELETE[/chamados/:idChamado]
        this.#router.delete("/:idChamado",
            this.#jwtMiddleware.validateToken,
            this.#chamadoMiddleware.validateIdParam,
            this.#ChamadoController.destroy
        );

        // ROTA: GET[/chamados]
        this.#router.get("/",
            this.#jwtMiddleware.validateToken,
            this.#ChamadoController.index
        );

        // ROTA: GET[/chamados/:idChamado]
        this.#router.get("/:idChamado",
            this.#jwtMiddleware.validateToken,
            this.#chamadoMiddleware.validateIdParam,
            this.#ChamadoController.show
        );

        return this.#router;
    }
}