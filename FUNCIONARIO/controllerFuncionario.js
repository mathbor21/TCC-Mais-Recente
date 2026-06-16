const FuncionarioService = require("./FuncionarioService");

/**
 * Classe responsável por controlar os endpoints da API REST para a entidade Funcionario.
 * 
 * Implementa métodos de CRUD e autenticação, utilizando injeção de dependência
 * para receber a instância de FuncionarioService, desacoplando a lógica de negócio
 * da camada de controle.
 */



module.exports = class FuncionarioControl {
    #funcionarioService;

    /**
     * Construtor da classe FuncionarioControl
     * @param {FuncionarioService} funcionarioServiceDependency - Instância do FuncionarioService
     * 
     * A injeção de dependência permite:
     * - Testes unitários fáceis com mocks;
     * - Troca de implementação do serviço sem alterar o controlador;
     * - Maior desacoplamento entre camadas.
     */
    constructor(funcionarioServiceDependency) {
        console.log("⬆️  FuncionarioControl.constructor()");
        this.#funcionarioService = funcionarioServiceDependency;
    }

    /**
     * Autentica um funcionário pelo email e senha.
     * @param {Object} request - Objeto da requisição Express.js contendo email e senha.
     * @param {Object} response - Objeto da resposta Express.js.
     * @param {Function} next - Middleware de tratamento de erros.
     * 
     * Retorna JSON com os dados do funcionário autenticado ou encaminha o erro.
     */
    login = async (request, response, next) => {
        console.log("🔵 FuncionarioControl.login()");
        try {
            const jsonFuncionario = request.body.funcionario;
            const resultado = await this.#funcionarioService.loginFuncionario(jsonFuncionario);

            response.status(200).json({
                success: true,
                message: "Login efetuado com sucesso!",
                data: resultado
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Cria um novo funcionário.
     * @param {Object} request - Objeto da requisição Express.js com os dados do funcionário.
     * @param {Object} response - Objeto da resposta Express.js.
     * @param {Function} next - Middleware de tratamento de erros.
     * 
     * Retorna JSON com o ID do funcionário criado e mensagem de sucesso.
     */
    store = async (request, response, next) => {
        console.log("🔵 FuncionarioControl.store()");
        try {
            const jsonFuncionario = request.body.funcionario;
            const resultado = await this.#funcionarioService.createFuncionario(jsonFuncionario);

            response.status(200).json({
                success: true,
                message: "Cadastro realizado com sucesso",
                data: { funcionario: resultado }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lista todos os funcionários cadastrados.
     * @param {Object} request - Objeto da requisição Express.js.
     * @param {Object} response - Objeto da resposta Express.js.
     * @param {Function} next - Middleware de tratamento de erros.
     * 
     * Retorna JSON com array de funcionários.
     */
    index = async (request, response, next) => {
        console.log("🔵 FuncionarioControl.index()");
        try {
            const listaFuncionarios = await this.#funcionarioService.findAll();

            response.status(200).json({
                success: true,
                message: "Executado com sucesso",
                data: { funcionarios: listaFuncionarios }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Busca um funcionário pelo ID.
     * @param {Object} request - Objeto da requisição Express.js.
     * @param {Object} response - Objeto da resposta Express.js.
     * @param {Function} next - Middleware de tratamento de erros.
     * 
     * Retorna JSON com os dados do funcionário encontrado.
     */
    show = async (request, response, next) => {
        console.log("🔵 FuncionarioControl.show()");
        try {
            const idFuncionario = request.params.idFuncionario;
            const funcionario = await this.#funcionarioService.findById(idFuncionario);

            response.status(200).json({
                success: true,
                message: "Executado com sucesso",
                data: funcionario
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Atualiza os dados de um funcionário existente.
     * @param {Object} request - Objeto da requisição Express.js com os dados atualizados.
     * @param {Object} response - Objeto da resposta Express.js.
     * @param {Function} next - Middleware de tratamento de erros.
     * 
     * Retorna JSON com os dados atualizados do funcionário ou encaminha o erro.
     */
    update = async (request, response, next) => {
        console.log("🔵 FuncionarioControl.update()");
        try {
            const idFuncionario = request.params.idFuncionario;
            const funcionarioAtualizado = await this.#funcionarioService.updateFuncionario(idFuncionario, request.body);

            response.status(200).json({
                success: true,
                message: "Atualizado com sucesso",
                data: {
                    funcionario: {
                        idFuncionario: parseInt(request.params.idFuncionario),
                        nomeFuncionario: request.body.funcionario.nomeFuncionario
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Remove um funcionário pelo ID.
     * @param {Object} request - Objeto da requisição Express.js.
     * @param {Object} response - Objeto da resposta Express.js.
     * @param {Function} next - Middleware de tratamento de erros.
     * 
     * Retorna status 204 se excluído com sucesso ou 404 se o funcionário não existir.
     */
    destroy = async (request, response, next) => {
        console.log("🔵 FuncionarioControl.destroy()");
        try {
            const idFuncionario = request.params.idFuncionario;
            const excluiu = await this.#funcionarioService.deleteFuncionario(idFuncionario);

            if (!excluiu) {
                return response.status(404).json({
                    success: false,
                    message: "Funcionário não encontrado",
                    error: { message: `Não existe funcionário com id ${idFuncionario}` }
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