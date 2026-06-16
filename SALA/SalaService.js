const SalaDAO = require("./SalaDAO");
const Sala = require("./Sala");
const ErrorResponse = require("../utils/ErrorResponse");

/**
 * Classe responsável pela camada de serviço para a entidade Sala.
 * 
 * Observações sobre injeção de dependência:
 * - O SalaService **recebe uma instância de SalaDAO via construtor**.
 * - Isso segue o padrão de injeção de dependência, tornando o serviço desacoplado
 *   do DAO concreto, facilitando testes unitários e substituição por mocks.
 */
module.exports = class SalaService {
    #salaDAO;

    /**
     * Construtor da classe SalaService
     * @param {SalaDAO} salaDAODependency - Instância de SalaDAO
     */
    constructor(salaDAODependency) {
        console.log("⬆️  SalaService.constructor()");
        this.#salaDAO = salaDAODependency; // injeção de dependência
    }

    /**
     * Cria um novo sala
     * @param {Object} salaJson - Dados do sala { nomeSala }
     * @returns {Promise<number>} - ID do novo sala criado
     * 
     * Validações:
     * - nomeSala não pode estar vazio
     * - Não pode existir outro Sala com mesmo nome
     */
    createSala = async (salaJson) => {
        console.log("🟣 SalaService.createSala()");

        const sala = new Sala();
       
        //valida regra de dominimo
        sala.numSala = salaJson.numSala;

        //valida regra de negócio
        const resultado = await this.#salaDAO.findByField("numero_sala", sala.numSala);

        if (resultado.length > 0) {
            throw new ErrorResponse(
                400, 
                "Esta sala já existe",
                { message: `A sala ${sala.numSala} já existe` }
            );
        }

        return this.#salaDAO.create(sala);
    }

    /**
     * Retorna todos os Salas
     */
    findAll = async () => {
        console.log("🟣 SalaService.findAll()");
        return this.#salaDAO.findAll();
    }

    /**
     * Retorna uma sala por ID
     * @param {number} idSala
     */
    findById = async (idSala) => {
        console.log("🟣 SalaService.findById()");
        const sala = new Sala();
        
        //passa pela validação de regra de dominio.
        sala.idSala = idSala;
      
        return this.#salaDAO.findById(sala.idSala);
    }

    /**
     * Atualiza uma sala já existente.
     *
     * 🔹 Regra de domínio: o idSala deve ser um número inteiro positivo.
     *
     * @param {number} idSala - Identificador da sala ser atualizada.
     * @param {Object} numSala - Objeto contendo os dados da sala.
     * @param {string} numSala.numSala - Numero da sala (deve ser string não vazia).
     *
     * @returns {Promise<Sala>} - Objeto sala atualizado.
     * @throws {Error} - Se idSala for inválido ou numSala não atender às regras de domínio.
     *
     * @example
     * const salaAtualizado = await salaService.updateSala(3, { numSala: "12" });
     */
    updateSala = async (idSala, numSala) => {
        console.log("🟣 SalaService.updateSala()");
       
        const sala = new Sala();

        //validação de regras de dominio
        sala.idSala = idSala;
        sala.numSala = numSala;

        return this.#salaDAO.update(sala);
    }


    /**
     * Deleta um sala por ID
     * @param {number} idSala
     */
    deleteSala = async (idSala) => {
        console.log("🟣 SalaService.deleteSala()");


        const sala = new Sala();
        sala.idSala = idSala;    //validação de regra de dominio

        //passa como parametro objeto que será excluido
        return this.#salaDAO.delete(sala);
    }
}