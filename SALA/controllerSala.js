// Importa a classe Sala, que representa a entidade Sala do sistema
const SalaService = require("./SalaService");

/**
 * Classe responsável por controlar os endpoints da API REST para a entidade Sala.
 * 
 * Esta classe implementa métodos CRUD e utiliza injeção de dependência
 * para receber a instância de SalaService, desacoplando a lógica de negócio
 * da camada de controle.
 */
module.exports = class SalaControl {
    #salaService

    /**
     * Construtor da classe SalaControl
     * @param {SalaService} salaServiceDependency - Instância do SalaService
     * 
     * A injeção de dependência permite testar a classe separadamente
     * e trocar facilmente a implementação do serviço se necessário.
     */
    constructor(salaServiceDependency) {
        console.log("⬆️  SalaControl.constructor()");
        this.#salaService = salaServiceDependency;
    }

    /**
     * Cria um novo sala.
     * @param {Object} request - Objeto da requisição Express.js
     * @param {Object} response - Objeto da resposta Express.js
     * @param {Function} next - Middleware de tratamento de erros
     * 
     * Retorna JSON com o ID do cargo criado e mensagem de sucesso.
     */
    store = async (request, response, next) => {
        console.log("🔵 SalaControle.store()");
        try {
            const salaBodyRequest = request.body.sala;

            const novoId = await this.#salaService.createSala(salaBodyRequest);

            const objResposta = {
                success: true,
                message: "Cadastro realizado com sucesso",
                data: {
                    salas: [{
                        idSala: novoId,
                        numSala: salaBodyRequest.numSala
                    }]
                }
            };
            if (novoId) {
                response.status(201).send(objResposta);
            } else {
                throw new Error("Falha ao cadastrar nova sala");
            }
        } catch (error) {
            next(error); // Encaminha o erro para o middleware de tratamento
        }
    }

    /**
     * Lista todos os salas cadastrados.
     * @param {Object} request - Objeto da requisição Express.js
     * @param {Object} response - Objeto da resposta Express.js
     * @param {Function} next - Middleware de tratamento de erros
     * 
     * Retorna JSON com um array de salas.
     */
    index = async (request, response, next) => {
        console.log("🔵 SalaControle.index()");
        try {
            const arraySalas = await this.#salaService.findAll();

            response.status(200).send({
                success: true,
                message: "Busca realizada com sucesso",
                data: {
                    salas: arraySalas
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Busca um cargo pelo ID.
     * @param {Object} request - Objeto da requisição Express.js
     * @param {Object} response - Objeto da resposta Express.js
     * @param {Function} next - Middleware de tratamento de erros
     * 
     * Retorna JSON com o sala encontrado ou erro caso não exista.
     */
    show = async (request, response, next) => {
        console.log("🔵 SalaControle.show()");
        try {
            const salaId = request.params.idSala;
            const sala = await this.#salaService.findById(salaId);

            const objResposta = {
                success: true,
                message: "Executado com sucesso",
                data: {
                    salas: sala
                }
            }

            response.status(200).send(objResposta);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Atualiza os dados de um cargo existente.
     * @param {Object} request - Objeto da requisição Express.js
     * @param {Object} response - Objeto da resposta Express.js
     * @param {Function} next - Middleware de tratamento de erros
     * 
     * Retorna JSON com a sala atualizada ou encaminha o erro caso falhe.
     */
    update = async (request, response, next) => {
        console.log("🔵 SalaControle.update()");
        try {
            const salaId = request.params.idSala;
            const numSala = request.body.sala.numSala;
            const atualizou = await this.#salaService.updateSala(salaId, numSala);

            if (atualizou) {
                return response.status(200).send({
                    success: true,
                    message: 'Atualizado com sucesso',
                    data: {
                        salas: [{
                            idSala: salaId,
                            numSala: numSala
                        }]
                    }
                })
            } else {
                return response.status(404).send({
                    success: false,
                    message: 'Sala não encontrada para atualização',
                    data: {
                        salas: [{
                            idSala: salaId,
                            numSala: numSala
                        }]
                    }
                })
            }
        } catch (error) {
            next(error);
        }
    }

    /**
     * Remove um cargo pelo ID.
     * @param {Object} request - Objeto da requisição Express.js
     * @param {Object} response - Objeto da resposta Express.js
     * @param {Function} next - Middleware de tratamento de erros
     * 
     * Retorna status 204 se excluído com sucesso ou 404 se a sala não existir.
     */
    destroy = async (request, response, next) => {
        console.log("🔵 SalaControle.destroy()");
        try {
            const salaId = request.params.idSala;
            const excluiu = this.#salaService.deleteSala(salaId);

            if (excluiu) {
                return response.status(204).send({
                    success: true,
                    message: 'Excluido com sucesso com sucesso',
                    data: {
                        salas: [{
                            idSala: salaId
                        }]
                    }
                })
            } else {
                return response.status(404).send({
                    success: false,
                    message: 'Sala não encontrada para exclusão',
                    data: {
                        salas: [{
                            idSala: salaId,
                        }]
                    }
                })
            }

        } catch (error) {
            next(error);
        }
    }
}