const ChamadoService = require("./ChamadoService");

/**
 * Classe responsável por controlar os endpoints da API REST para a entidade Chamado.
 * 
 * Implementa métodos de CRUD e autenticação, utilizando injeção de dependência
 * para receber a instância de ChamadoService, desacoplando a lógica de negócio
 * da camada de controle.
 */
module.exports = class ChamadoControl {
    #chamadoService;

    /**
     * Construtor da classe ChamadoControl
     * @param {ChamadoService} chamadoServiceDependency - Instância do ChamadoService
     * 
     * A injeção de dependência permite:
     * - Testes unitários fáceis com mocks;
     * - Troca de implementação do serviço sem alterar o controlador;
     * - Maior desacoplamento entre camadas.
     */
    constructor(chamadoServiceDependency) {
        console.log("⬆️  ChamadoControl.constructor()");
        this.#chamadoService = chamadoServiceDependency;
    }

    /**
     * Autentica um chamado pelo numero e status.
     * @param {Object} request - Objeto da requisição Express.js contendo numero e status.
     * @param {Object} response - Objeto da resposta Express.js.
     * @param {Function} next - Middleware de tratamento de erros.
     * 
     * Retorna JSON com os dados do chamado autenticado ou encaminha o erro.
     */
    
    /**
     * Cria um novo chamado.
     * @param {Object} request - Objeto da requisição Express.js com os dados do chamado.
     * @param {Object} response - Objeto da resposta Express.js.
     * @param {Function} next - Middleware de tratamento de erros.
     * 
     * Retorna JSON com o ID do chamado criado e mensagem de sucesso.
     */
    store = async (request, response, next) => {
        console.log("🔵 ChamadoControl.store()");
        try {
            const jsonChamado = request.body.chamado;
            const resultado = await this.#chamadoService.createChamado(jsonChamado);

            response.status(200).json({
                success: true,
                message: "Cadastro realizado com sucesso",
                data: { chamado: resultado }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lista todos os chamados cadastrados.
     * @param {Object} request - Objeto da requisição Express.js.
     * @param {Object} response - Objeto da resposta Express.js.
     * @param {Function} next - Middleware de tratamento de erros.
     * 
     * Retorna JSON com array de chamados.
     */
    index = async (request, response, next) => {
        console.log("🔵 ChamadoControl.index()");
        try {
            const listaChamados = await this.#chamadoService.findAll();

            response.status(200).json({
                success: true,
                message: "Executado com sucesso",
                data: { chamados: listaChamados }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Busca um chamado pelo ID.
     * @param {Object} request - Objeto da requisição Express.js.
     * @param {Object} response - Objeto da resposta Express.js.
     * @param {Function} next - Middleware de tratamento de erros.
     * 
     * Retorna JSON com os dados do chamado encontrado.
     */
    show = async (request, response, next) => {
        console.log("🔵 ChamadoControl.show()");
        try {
            const idChamado = request.params.idChamado;
            const chamado = await this.#chamadoService.findById(idChamado);

            response.status(200).json({
                success: true,
                message: "Executado com sucesso",
                data: chamado
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Atualiza os dados de um chamado existente.
     * @param {Object} request - Objeto da requisição Express.js com os dados atualizados.
     * @param {Object} response - Objeto da resposta Express.js.
     * @param {Function} next - Middleware de tratamento de erros.
     * 
     * Retorna JSON com os dados atualizados do chamado ou encaminha o erro.
     */
    update = async (request, response, next) => {
        console.log("🔵 ChamadoControl.update()");
        try {
            const idChamado = request.params.idChamado;
            const chamadoAtualizado = await this.#chamadoService.updateChamado(idChamado, request.body);

            response.status(200).json({
                success: true,
                message: "Atualizado com sucesso",
                data: {
                    chamado: {
                        idChamado: parseInt(request.params.idChamado),
                        titulo: request.body.chamado.titulo
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Remove um chamado pelo ID.
     * @param {Object} request - Objeto da requisição Express.js.
     * @param {Object} response - Objeto da resposta Express.js.
     * @param {Function} next - Middleware de tratamento de erros.
     * 
     * Retorna status 204 se excluído com sucesso ou 404 se o chamado não existir.
     */
    destroy = async (request, response, next) => {
        console.log("🔵 ChamadoControl.destroy()");
        try {
            const idChamado = request.params.idChamado;
            const excluiu = await this.#chamadoService.deleteChamado(idChamado);

            if (!excluiu) {
                return response.status(404).json({
                    success: false,
                    message: "Chamado não encontrado",
                    error: { message: `Não existe chamado com id ${idChamado}` }
                });
            }

            response.status(204).json({
                success: true,
                message: "Excluído com sucesso"
            });
        } catch (error) {
            next(error);
        }
    }
}