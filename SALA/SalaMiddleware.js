const ErrorResponse = require("../utils/ErrorResponse");


/**
 * Middleware para validação de requisições relacionadas à entidade Sala.
 * 
 * Objetivo:
 * - Garantir que os dados obrigatórios estejam presentes antes de chamar
 *   os métodos do Controller ou Service.
 * - Lançar erros padronizados usando ErrorResponse quando a validação falhar.
 */
module.exports = class SalaMiddleware {

    /**
     * Valida o corpo da requisição (request.body) para operações de Sala.
     * 
     * Verifica:
     * - Se o objeto 'sala' existe
     * - Se o campo obrigatório 'nomeSala' está presente e não é vazio
     * 
     * @param {Request} request - Objeto de requisição do Express
     * @param {Response} response - Objeto de resposta do Express
     * @param {Function} next - Função next() para passar para o próximo middleware
     * 
     * Lança ErrorResponse com código HTTP 400 em caso de validação falha.
     */
    validateBody = (request, response, next) => {
        console.log("🔷 SalaMiddleware.validateBody()");
        const body = request.body;

        if (!body.sala) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'sala' é obrigatório!" });
        }

        const sala = body.sala;

        if (!sala.numSala || sala.numSala.trim() === "") {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'numSala' é obrigatório!" });
        }

        next(); // Passa para o próximo middleware ou controller
    }

    /**
     * Valida o parâmetro de rota 'idSala' em requisições que necessitam de identificação do sala.
     * 
     * Verifica:
     * - Se o parâmetro 'idSala' foi passado na URL
     * 
     * @param {Request} request - Objeto de requisição do Express
     * @param {Response} response - Objeto de resposta do Express
     * @param {Function} next - Função next() para passar para o próximo middleware
     * 
     * Lança ErrorResponse com código HTTP 400 caso 'idSala' não seja fornecido.
     */
    validateIdParam = (request, response, next) => {
        console.log("🔷 SalaMiddleware.validateIdParam()");
        const { idSala } = request.params;

        if (!idSala) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O parâmetro 'idSala' é obrigatório!" });
        }

        next(); // Passa para o próximo middleware ou controller
    }
}