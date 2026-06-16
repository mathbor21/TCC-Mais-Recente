const express = require("express");
const JwtMiddleware = require("../JWT/JwtMiddleware");

const SalaMiddleware = require("./SalaMiddleware");
const SalaController = require("./controllerSala");

/**
 * Classe responsável por configurar as rotas da entidade Sala.
 * 
 * Observações sobre injeção de dependência:
 * - O roteador não cria suas próprias instâncias de middlewares ou controladores.
 * - Ele recebe instâncias externas de JwtMiddleware, SalaMiddleware e SalaControle via construtor.
 * - Isso permite flexibilidade: 
 *      - Testes unitários podem injetar mocks ou stubs;
 *      - É possível trocar implementações sem alterar o roteador;
 *      - Segue o princípio de inversão de dependência (SOLID).
 */
module.exports = class SalaRoteador {
    // Atributos privados
    #router;
    #salaMiddleware;
    #salaControl;
    #jwtMiddleware;

    /**
     * Construtor da classe SalaRoteador
     * 
     * Injeção de dependência:
     * @param {JwtMiddleware} jwtMiddlewareDependency - Middleware JWT externo injetado
     * @param {SalaMiddleware} salaMiddlewareDependency - Middleware de validação de Sala injetado
     * @param {SalaController} salaControllerDependency - Controlador de Sala injetado
     */
    constructor(routerDependency, jwtMiddlewareDependency,salaMiddlewareDependency, salaControllerDependency) {
        console.log("⬆️  SalaRoteador.constructor()");
        // Armazenando as instâncias injetadas
        this.#router = routerDependency;
        this.#jwtMiddleware = jwtMiddlewareDependency;
        this.#salaMiddleware = salaMiddlewareDependency;
        this.#salaControl = salaControllerDependency;
    }

    /**
     * Configura as rotas da API REST para a entidade SALA.
     * 
     * Rotas configuradas:
     * POST "/"           -> Criar um novo SALA (validação JWT + body)
     * GET "/"            -> Listar todos os SALAs (validação JWT)
     * GET "/:idSALA"    -> Buscar SALA por ID (validação JWT + id param)
     * PUT "/:idSALA"    -> Atualizar SALA por ID (validação JWT + id param + body)
     * DELETE "/:idSALA" -> Deletar SALA por ID (validação JWT + id param)
     * 
     * Todas as dependências (JWT, middleware de validação, controlador) são fornecidas externamente,
     * permitindo maior flexibilidade e testabilidade do código.
     * 
     * @returns {express.Router} Router configurado com todas as rotas de SALA
     */
    createRoutes = () => {
        console.log("⬆️  SalaRoteador.createRoutes()");

        this.#router.post("/",
            this.#jwtMiddleware.validateToken,
            this.#salaMiddleware.validateBody,
            this.#salaControl.store
        );

        this.#router.get("/",
            this.#jwtMiddleware.validateToken,
            this.#salaControl.index
        );

        this.#router.get("/:idSala",
            this.#jwtMiddleware.validateToken,           
            this.#salaMiddleware.validateIdParam,
            this.#salaControl.show
        );

        this.#router.put("/:idSala",
            this.#jwtMiddleware.validateToken,
            this.#salaMiddleware.validateIdParam,
            this.#salaMiddleware.validateBody,
            this.#salaControl.update
        );

        this.#router.delete("/:idSala",
            this.#jwtMiddleware.validateToken,
            this.#salaMiddleware.validateIdParam,
            this.#salaControl.destroy
        );

        return this.#router;
    }

}