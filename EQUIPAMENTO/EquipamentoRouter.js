const express = require("express");
const SalaMiddleware = require("../SALA/SalaMiddleware");
const EquipamentoMiddleware = require("./EquipamentoMiddleware");
const EquipamentoController = require("./controllerEquipamento");
const JwtMiddleware = require("../JWT/JwtMiddleware");

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
module.exports = class EquipamentoRoteador {
    // Atributos privados
    #router;
    #EquipamentoController;
    #equipamentoMiddleware;
    #jwtMiddleware;

    /**
     * Construtor da classe EquipamentoRoteador
     * 
     * Injeção de dependência:
     * @param {JwtMiddleware} jwtMiddleware - Middleware JWT externo injetado
     * @param {EquipamentoMiddleware} equipamentoMiddleware - Middleware de validação de Equipamento injetado
     * @param {EquipamentoController} EquipamentoController - Controlador de Equipamento injetado
     */
    constructor(jwtMiddleware, equipamentoMiddleware, EquipamentoController) {
        console.log("⬆️  EquipamentoRoteador.constructor()");
        this.#router = express.Router();

        // Armazenando as instâncias injetadas
        this.#jwtMiddleware = jwtMiddleware;
        this.#equipamentoMiddleware = equipamentoMiddleware;
        this.#EquipamentoController = EquipamentoController;
    }

    /**
     * Configura as rotas da API REST para a entidade Equipamento.
     * 
     * Rotas configuradas:
     * POST "/login"                    -> Efetuar login do funcionário
     * POST "/"                          -> Criar um novo Equipamento (validação JWT + body)
     * PUT "/:idEquipamento"             -> Atualizar Equipamento por ID (validação JWT + id param + body)
     * DELETE "/:idEquipamento"          -> Deletar Equipamento por ID (validação JWT + id param)
     * GET "/"                           -> Listar todos os Equipamentos (validação JWT)
     * GET "/:idEquipamento"             -> Buscar Equipamento por ID (validação JWT + id param)
     * 
     * Todas as dependências (JWT, middleware de validação, controlador) são fornecidas externamente,
     * permitindo maior flexibilidade e testabilidade do código.
     * 
     * @returns {express.Router} Router configurado com todas as rotas de Equipamento
     */
    createRoutes = () => {
        console.log("⬆️  EquipamentoRoteador.createRoutes()");

        // ROTA: POST[/equipamentos]
        this.#router.post("/",
            this.#jwtMiddleware.validateToken,
            this.#equipamentoMiddleware.validateCreateBody,
            this.#EquipamentoController.store
        );

        // ROTA: PUT[/equipamentos/:idEquipamento]
        this.#router.put("/:idEquipamento",
            this.#jwtMiddleware.validateToken,
            this.#equipamentoMiddleware.validateIdParam,
            this.#equipamentoMiddleware.validateCreateBody,
            this.#EquipamentoController.update
        );

        // ROTA: DELETE[/equipamentos/:idEquipamento]
        this.#router.delete("/:idEquipamento",
            this.#jwtMiddleware.validateToken,
            this.#equipamentoMiddleware.validateIdParam,
            this.#EquipamentoController.destroy
        );

        // ROTA: GET[/equipamentos]
        this.#router.get("/",
            this.#jwtMiddleware.validateToken,
            this.#EquipamentoController.index
        );

        // ROTA: GET[/equipamentos/:idEquipamento]
        this.#router.get("/:idEquipamento",
            this.#jwtMiddleware.validateToken,
            this.#equipamentoMiddleware.validateIdParam,
            this.#EquipamentoController.show
        );

        return this.#router;
    }
}