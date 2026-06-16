const EquipamentoService = require("./EquipamentoService");

/**
 * Classe responsável por controlar os endpoints da API REST para a entidade Equipamento.
 * 
 * Implementa métodos de CRUD e autenticação, utilizando injeção de dependência
 * para receber a instância de EquipamentoService, desacoplando a lógica de negócio
 * da camada de controle.
 */
module.exports = class EquipamentoControl {
    #equipamentoService;

    /**
     * Construtor da classe EquipamentoControl
     * @param {EquipamentoService} equipamentoServiceDependency - Instância do EquipamentoService
     * 
     * A injeção de dependência permite:
     * - Testes unitários fáceis com mocks;
     * - Troca de implementação do serviço sem alterar o controlador;
     * - Maior desacoplamento entre camadas.
     */
    constructor(equipamentoServiceDependency) {
        console.log("⬆️  EquipamentoControl.constructor()");
        this.#equipamentoService = equipamentoServiceDependency;
    }

    /**
     * Autentica um equipamento pelo numero e status.
     * @param {Object} request - Objeto da requisição Express.js contendo numero e status.
     * @param {Object} response - Objeto da resposta Express.js.
     * @param {Function} next - Middleware de tratamento de erros.
     * 
     * Retorna JSON com os dados do equipamento autenticado ou encaminha o erro.
     */
    
    /**
     * Cria um novo funcionário.
     * @param {Object} request - Objeto da requisição Express.js com os dados do funcionário.
     * @param {Object} response - Objeto da resposta Express.js.
     * @param {Function} next - Middleware de tratamento de erros.
     * 
     * Retorna JSON com o ID do funcionário criado e mensagem de sucesso.
     */
    store = async (request, response, next) => {
        console.log("🔵 EquipamentoControl.store()");
        try {
            const jsonEquipamento = request.body.equipamento;
            const resultado = await this.#equipamentoService.createEquipamento(jsonEquipamento);

            response.status(200).json({
                success: true,
                message: "Cadastro realizado com sucesso",
                data: { equipamento: resultado }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lista todos os equipamentos cadastrados.
     * @param {Object} request - Objeto da requisição Express.js.
     * @param {Object} response - Objeto da resposta Express.js.
     * @param {Function} next - Middleware de tratamento de erros.
     * 
     * Retorna JSON com array de equipamentos.
     */
    index = async (request, response, next) => {
        console.log("🔵 EquipamentoControl.index()");
        try {
            const listaEquipamentos = await this.#equipamentoService.findAll();

            response.status(200).json({
                success: true,
                message: "Executado com sucesso",
                data: { equipamentos: listaEquipamentos }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Busca um equipamento pelo ID.
     * @param {Object} request - Objeto da requisição Express.js.
     * @param {Object} response - Objeto da resposta Express.js.
     * @param {Function} next - Middleware de tratamento de erros.
     * 
     * Retorna JSON com os dados do equipamento encontrado.
     */
    show = async (request, response, next) => {
        console.log("🔵 EquipamentoControl.show()");
        try {
            const idEquipamento = request.params.idEquipamento;
            const equipamento = await this.#equipamentoService.findById(idEquipamento);

            response.status(200).json({
                success: true,
                message: "Executado com sucesso",
                data: equipamento
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Atualiza os dados de um equipamento existente.
     * @param {Object} request - Objeto da requisição Express.js com os dados atualizados.
     * @param {Object} response - Objeto da resposta Express.js.
     * @param {Function} next - Middleware de tratamento de erros.
     * 
     * Retorna JSON com os dados atualizados do equipamento ou encaminha o erro.
     */
    update = async (request, response, next) => {
        console.log("🔵 EquipamentoControl.update()");
        try {
            const idEquipamento = request.params.idEquipamento;
            const equipamentoAtualizado = await this.#equipamentoService.updateEquipamento(idEquipamento, request.body);

            response.status(200).json({
                success: true,
                message: "Atualizado com sucesso",
                data: {
                    equipamento: {
                        idEquipamento: parseInt(request.params.idEquipamento),
                        numeroEquipamento: request.body.equipamento.numeroEquipamento
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Remove um equipamento pelo ID.
     * @param {Object} request - Objeto da requisição Express.js.
     * @param {Object} response - Objeto da resposta Express.js.
     * @param {Function} next - Middleware de tratamento de erros.
     * 
     * Retorna status 204 se excluído com sucesso ou 404 se o equipamento não existir.
     */
    destroy = async (request, response, next) => {
        console.log("🔵 EquipamentoControl.destroy()");
        try {
            const idEquipamento = request.params.idEquipamento;
            const excluiu = await this.#equipamentoService.deleteEquipamento(idEquipamento);

            if (!excluiu) {
                return response.status(404).json({
                    success: false,
                    message: "Equipamento não encontrado",
                    error: { message: `Não existe equipamento com id ${idEquipamento}` }
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