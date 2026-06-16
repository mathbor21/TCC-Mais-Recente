const ErrorResponse = require("../utils/ErrorResponse");

/**
 * Middleware para validação de requisições relacionadas à entidade Chamado.
 * 
 * Objetivo:
 * - Garantir que os dados obrigatórios estejam presentes antes de chamar
 *   os métodos do Controller ou Service.
 * - Lançar erros padronizados usando ErrorResponse quando a validação falhar.
 */
module.exports = class ChamadoMiddleware {

    /**
     * Valida o corpo da requisição para criação de um novo chamado.
     * 
     * Verifica:
     * - Se o objeto 'chamado' existe
     * - Campos obrigatórios: funcionario, equipamento, defeito, relato
     * - Objeto 'funcionario' presente e válido
     * - Objeto 'equipamento' presente e válido
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
        console.log("🔷 ChamadoMiddleware.validateCreateBody()");
        const body = request.body;

        if (!body.chamado) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'chamado' é obrigatório!" });
        }

        const chamado = body.chamado;

        const camposObrigatorios = [ "defeito", "relato", "foto"];
        for (const campo of camposObrigatorios) {
            if (chamado[campo] === undefined || chamado[campo] === null || chamado[campo] === "") {
                throw new ErrorResponse(400, "Erro na validação de dados", { message: `O campo '${campo}' é obrigatório!` });
            }
        }

        if (!chamado.funcionario || typeof chamado.funcionario !== "object") {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'funcionario' é obrigatório e deve ser um objeto" });
        }

        if (!chamado.equipamento || typeof chamado.equipamento !== "object") {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'equipamento' é obrigatório e deve ser um objeto" });
        }

        if (!Number.isInteger(chamado.funcionario.idFuncionario) || chamado.funcionario.idFuncionario <= 0) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'idFuncionario' deve ser um número inteiro positivo" });
        }
         if (!Number.isInteger(chamado.equipamento.idEquipamento) || chamado.equipamento.idEquipamento <= 0) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'idEquipamento' deve ser um número inteiro positivo" });
        }

        next();
    }

    validateStatusUpdatePermission = (request, _response, next) => {
        console.log("🔷 ChamadoMiddleware.validateStatusUpdatePermission()");
        const chamado = request.body?.chamado;

        if (!chamado || typeof chamado !== "object" || chamado.statusConserto === undefined) {
            return next();
        }

        if (!request.authUser?.coordenador) {
            throw new ErrorResponse(403, "Acesso negado", { message: "Somente coordenador pode alterar o status do conserto" });
        }

        if (![1, 2, 3].includes(chamado.statusConserto)) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O campo 'statusConserto' deve ser 1, 2 ou 3" });
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
        console.log("🔷 ChamadoMiddleware.validateIdParam()");
        const { idChamado } = request.params;

        if (!idChamado) {
            throw new ErrorResponse(400, "Erro na validação de dados", { message: "O parâmetro 'idChamado' é obrigatório!" });
        }

        next();
    };
}