const SalaDAO = require("../SALA/SalaDAO");
const EquipamentoDAO = require("./EquipamentoDAO");
const Sala = require("../SALA/Sala");
const Equipamento = require("./Equipamento");
const ErrorResponse = require("../utils/ErrorResponse");


/**
 * Classe responsável pela camada de serviço para a entidade Equipamento.
 * 
 * Observações sobre injeção de dependência:
 * - O EquipamentoService recebe uma instância de EquipamentoDAO via construtor.
 * - Isso desacopla o serviço da implementação concreta do DAO.
 * - Facilita testes unitários e uso de mocks.
 */
module.exports = class EquipamentoService {
    #EquipamentoDAO;
    #SalaDAO;
    /**
     * Construtor da classe EquipamentoService
     * @param {EquipamentoDAO} EquipamentoDAODependency - Instância de EquipamentoDAO
     * @param {SalaDAO} SalaDAODependency - Instância de SalaDAO
     */
    constructor(EquipamentoDAODependency, SalaDAODependency) {
        console.log("⬆️  EquipamentoService.constructor()");
        this.#EquipamentoDAO = EquipamentoDAODependency; // injeção de dependência
        this.#SalaDAO = SalaDAODependency;
    }

    /**
     * Cria um novo equipamento.
     *
     * @param {Object} jsonEquipamento - Objeto contendo dados do equipamento
     * @param {Object} jsonEquipamento.equipamento - Dados do equipamento
     * @param {string} requestBody.equipamento.numeroEquipamento - Nome do equipamento
     * @param {boolean} requestBody.equipamento.statusEquipamento - Se recebe vale transporte
     * @param {Object} requestBody.equipamento.sala - Objeto sala
     * @param {number} requestBody.equipamento.sala.idSala - ID da sala
     *
     * @returns {Promise<Funcionario>} - Objeto Funcionario criado com ID atribuído
     * @throws {ErrorResponse} - Em caso de validação de dados inválidos ou email já existente
     *
     * @example
     * const funcionario = await funcionarioService.createFuncionario({ funcionario: {...} });
     */
    createEquipamento = async (jsonEquipamento) => {
        console.log("🟣 EquipamentoService.createEquipamento()");

        //criar o sala que será utilizado pelo funcionário
        const objetoSala = new Sala();
        objetoSala.idSala = jsonEquipamento.sala.idSala // regra de dominio

        // Criação da instância Funcionario
        const objEquipamento = new Equipamento();

        //aplica regra de dominio pq chama os sets da classe funcionário para inserir valores 
        objEquipamento.numeroEquipamento = jsonEquipamento.numeroEquipamento; // regra de dominio
        objEquipamento.statusEquipamento = jsonEquipamento.statusEquipamento; // regra de dominio
        objEquipamento.sala = objetoSala; // regra de dominio

        //regra de negocio => verificar se cargo fornecido existe antes de cadastrar
        const salaExiste = this.#SalaDAO.findByField("id_sala", objEquipamento.sala.idSala);
        if (salaExiste.length == 0) {
            throw new ErrorResponse(
                400,
                "A sala informada não existe",
                { message: `A sala informada não existe` }
            );
        }

        //regra de negocio => Verificação de email duplicado
        
        // Persistência e atribuição de ID
        objEquipamento.idEquipamento = await this.#EquipamentoDAO.create(objEquipamento);

        return objEquipamento;
    }

    findAll = async () => {
        console.log("🟣 EquipamentoService.findAll()");
        return this.#EquipamentoDAO.findAll();
    }

    /**
     * Retorna um equipamento pelo ID
     * @param {number} idEquipamento - ID do equipamento
     * @returns {Promise<Equipamento>} - Objeto Equipamento encontrado
     * @throws {ErrorResponse} - Em caso de ID inválido ou equipamento não encontrado
     */
    findById = async (idEquipamento) => {
        const objEquipamento = new Equipamento();
        objEquipamento.idEquipamento = idEquipamento; // regra de dominio

        const equipamento = await this.#EquipamentoDAO.findById(objEquipamento.idEquipamento);


        if (!equipamento) {
            throw new ErrorResponse(404, "Equipamento não encontrado", { message: `Não existe equipamento com id ${idEquipamento}` });
        }

        return equipamento;
    }

    /**
     * Atualiza um equipamento
     * @param {number} idEquipamento - ID do equipamento
     * @param {Object} requestBody - Dados atualizados do equipamento
     * @returns {Promise<Equipamento>} - Objeto Equipamento atualizado
     * @throws {ErrorResponse} - Em caso de dados inválidos
     */
    updateEquipamento = async (idEquipamento, requestBody) => {
        console.log("🟣 EquipamentoService.updateEquipamento()");
        const jsonEquipamento = requestBody.equipamento;

        const objSala = new Sala();
        objSala.idSala = jsonEquipamento.sala.idSala;

        //validação das regras de dominio
        const objEquipamento = new Equipamento();


        objEquipamento.idEquipamento = idEquipamento,
            objEquipamento.numeroEquipamento = jsonEquipamento.numeroEquipamento,
            objEquipamento.statusEquipamento = jsonEquipamento.statusEquipamento,
            objEquipamento.sala = objSala

        //envia um objeto valido de equipamento para atualizar
        return await this.#EquipamentoDAO.update(objEquipamento);
    }

    /**
     * Exclui um equipamento
     * @param {number} idEquipamento - ID do equipamento
     * @returns {Promise<boolean>} - True se excluído com sucesso
     * @throws {ErrorResponse} - Em caso de ID inválido
     */
    deleteEquipamento = async (idEquipamento) => {

        const equipamento = new Equipamento();
        equipamento.idEquipamento = idEquipamento
        return await this.#EquipamentoDAO.delete(equipamento);
    }
}