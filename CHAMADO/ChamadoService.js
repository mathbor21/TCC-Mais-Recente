const FuncionarioDAO = require("../FUNCIONARIO/FuncionarioDAO");
const EquipamentoDAO = require("../EQUIPAMENTO/EquipamentoDAO");
const Funcionario = require("../FUNCIONARIO/Funcionario");
const Equipamento = require("../EQUIPAMENTO/equipamento");
const ErrorResponse = require("../utils/ErrorResponse");
const Chamado = require("./Chamado");
const ChamadoDAO = require("./ChamadoDAO");



/**
 * Classe responsável pela camada de serviço para a entidade Chamado.
 * 
 * Observações sobre injeção de dependência:
 * - O ChamadoService recebe uma instância de ChamadoDAO via construtor.
 * - Isso desacopla o serviço da implementação concreta do DAO.
 * - Facilita testes unitários e uso de mocks.
 */
module.exports = class ChamadoService {
    #ChamadoDAO;
    #FuncionarioDAO;
    #EquipamentoDAO;
    /**
     * Construtor da classe ChamadoService
     * @param {ChamadoDAO} ChamadoDAODependency - Instância de ChamadoDAO
     */
    constructor(EquipamentoDAODependency, FuncionarioDAODependency, ChamadoDAODependency) {
        console.log("⬆️  ChamadoService.constructor()");
        this.#ChamadoDAO = ChamadoDAODependency; // injeção de dependência
        this.#FuncionarioDAO = FuncionarioDAODependency;
        this.#EquipamentoDAO = EquipamentoDAODependency;
    }

    /**
     * Cria um novo chamado.
     *
     * @param {Object} jsonChamado - Objeto contendo dados do chamado
     * @param {Object} jsonChamado.chamado - Dados do chamado
     * @param {string} requestBody.chamado.defeito - Descrição do defeito
     * @param {string} requestBody.chamado.relato - Relato do chamado
     * @param {string} requestBody.chamado.foto - Caminho da foto
     * @param {string} requestBody.chamado.statusConserto - Status do conserto
     *
     * @returns {Promise<Funcionario>} - Objeto Funcionario criado com ID atribuído
     * @throws {ErrorResponse} - Em caso de validação de dados inválidos ou email já existente
     *
     * @example
     * const funcionario = await funcionarioService.createFuncionario({ funcionario: {...} });
     */
    createChamado = async (jsonChamado) => {
    console.log("🟣 ChamadoService.createChamado()");

    // ✅ criar objetos de funcionário e equipamento
    const objFuncionario = new Funcionario();
    objFuncionario.idFuncionario = jsonChamado.funcionario.idFuncionario;

    const objEquipamento = new Equipamento();
    objEquipamento.idEquipamento = jsonChamado.equipamento.idEquipamento;

    // ✅ criar o objeto chamado (estava faltando!)
    const objChamado = new Chamado();
    objChamado.funcionario = objFuncionario;
    objChamado.equipamento = objEquipamento;
    objChamado.defeito = jsonChamado.defeito;
    objChamado.relato = jsonChamado.relato;
    objChamado.caminhoFoto = jsonChamado.foto || null;
    objChamado.statusChamado = 1;

    // ✅ await faltando nas duas verificações
    const funcionarioExiste = await this.#FuncionarioDAO.findByField("id_funcionario", objFuncionario.idFuncionario);
    if (funcionarioExiste.length === 0) {
        throw new ErrorResponse(400, "O funcionário informado não existe", { message: "O funcionário informado não existe" });
    }

    const equipamentoExiste = await this.#EquipamentoDAO.findByField("id_equipamento", objEquipamento.idEquipamento);
    if (equipamentoExiste.length === 0) {
        throw new ErrorResponse(400, "O equipamento informado não existe", { message: "O equipamento informado não existe" });
    }

    // ✅ persiste e atribui ID
    objChamado.idChamado = await this.#ChamadoDAO.create(objChamado);

    return objChamado;
}
    findAll = async () => {
        console.log("🟣 ChamadoService.findAll()");
        return this.#ChamadoDAO.findAll();
    }

    /**
     * Retorna um chamado pelo ID
     * @param {number} idChamado - ID do chamado
     * @returns {Promise<Chamado>} - Objeto Chamado encontrado
     * @throws {ErrorResponse} - Em caso de ID inválido ou chamado não encontrado
     */
    findById = async (idChamado) => {
        const objChamado = new Chamado();
        objChamado.idChamado = idChamado; // regra de dominio

        const chamado = await this.#ChamadoDAO.findById(objChamado.idChamado);


        if (!chamado) {
            throw new ErrorResponse(404, "Chamado não encontrado", { message: `Não existe chamado com id ${idChamado}` });
        }

        return chamado;
    }

    /**
     * Atualiza um chamado
     * @param {number} idChamado - ID do chamado
     * @param {Object} requestBody - Dados atualizados do chamado
     * @returns {Promise<Chamado>} - Objeto Chamado atualizado
     * @throws {ErrorResponse} - Em caso de dados inválidos
     */
    updateChamado = async (idChamado, requestBody) => {
        console.log("🟣 ChamadoService.updateChamado()");
        const jsonChamado = requestBody.chamado;

        const objFuncionario = new Funcionario();
        objFuncionario.idFuncionario = jsonChamado.funcionario.idFuncionario;


        const objEquipamento = new Equipamento();
        objEquipamento.idEquipamento = jsonChamado.equipamento.idEquipamento;


        //validação das regras de dominio
        const objChamado = new Chamado();


        objChamado.idChamado = idChamado;
        objChamado.funcionario = objFuncionario;
        objChamado.equipamento = objEquipamento;
        objChamado.defeito = jsonChamado.defeito;
        objChamado.relato = jsonChamado.relato;
        objChamado.caminhoFoto = jsonChamado.foto || null;
        objChamado.statusChamado = jsonChamado.statusConserto;

        //envia um objeto valido de chamado para atualizar
        return await this.#ChamadoDAO.update(objChamado);
    }

    /**
     * Exclui um chamado
     * @param {number} idChamado - ID do chamado
     * @returns {Promise<boolean>} - True se excluído com sucesso
     * @throws {ErrorResponse} - Em caso de ID inválido
     */
    deleteChamado = async (idChamado) => {

        const chamado = new Chamado();
        chamado.idChamado = idChamado
        return await this.#ChamadoDAO.delete(chamado);
    }
}