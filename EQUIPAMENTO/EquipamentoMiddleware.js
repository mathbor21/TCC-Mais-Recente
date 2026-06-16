const ErrorResponse = require("../utils/ErrorResponse");

/**
 * Middleware para validação de requisições relacionadas à entidade Equipamento.
 * 
 * Objetivo:
 * - Garantir que os dados obrigatórios estejam presentes antes de chamar
 *   os métodos do Controller ou Service.
 * - Lançar erros padronizados usando ErrorResponse quando a validação falhar.
 */
module.exports = class EquipamentoMiddleware {

    /**
     * Valida o corpo da requisição para criação de um novo equipamento.
     * 
     * Verifica:
     * - Se o objeto 'equipamento' existe
     * - Campos obrigatórios: numeroEquipamento, statusEquipamento, sala
     * - Tipo e valor de statusEquipamento (true ou false)
     * - Objeto 'sala' presente e válido
     * - idSala é um inteiro positivo
     * 
     * @param {Request} request - Objeto de requisição do Express
     * @param {Response} response - Objeto de resposta do Express
     * @param {Function} next - Função next() para passar para o próximo middleware
     * 
     * Lança ErrorResponse com código HTTP 400 em caso de validação falha.
     */
    validateCreateBody = (request, response, next) => {
        console.log("🔷 EquipamentoMiddleware.validateCreateBody()");
        const body = request.body;

        if (!body.equipamento) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'equipamento' é obrigatório!" });
        }

        const equipamento = body.equipamento;

        const camposObrigatorios = ["numeroEquipamento", "statusEquipamento", "sala"];
        for (const campo of camposObrigatorios) {
            if (equipamento[campo] === undefined || equipamento[campo] === null || equipamento[campo] === "") {
                throw new ErrorResponse(400, "Erro na validação de dados", { message: `O campo '${campo}' é obrigatório!` });
            }
        }

        if (![1, 2, 3].includes(equipamento.statusEquipamento)) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'statusEquipamento' deve ser 1, 2 ou 3" });
        }

        if (!equipamento.sala || typeof equipamento.sala !== "object") {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'sala' é obrigatório e deve ser um objeto" });
        }

        if (!Number.isInteger(equipamento.sala.idSala) || equipamento.sala.idSala <= 0) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'idSala' deve ser um número inteiro positivo" });
        }

        next();
    }

    /**
     * Valida o corpo da requisição para login de um equipamento.
     * 
     * Verifica:
     * - Se o objeto 'equipamento' existe
     * 
     * @param {Request} request - Objeto de requisição do Express
     * @param {Response} response - Objeto de resposta do Express
     * @param {Function} next - Função next() para passar para o próximo middleware
     * 
     * Lança ErrorResponse com código HTTP 400 em caso de validação falha.
     */
    
    validateIdParam = (request, response, next) => {
        console.log("🔷 EquipamentoMiddleware.validateIdParam()");
        const { idEquipamento } = request.params;

        if (!idEquipamento) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O parâmetro 'idEquipamento' é obrigatório!" });
        }

        next();
    };
}