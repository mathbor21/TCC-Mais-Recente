const Sala = require("./Sala");
const MysqlDatabase = require("../database/MysqlDatabase");

/**
 * Classe responsável por realizar operações no banco de dados
 * relacionadas à entidade Cargo.
 * 
 * Implementa métodos CRUD utilizando injeção de dependência
 * de uma instância de MysqlDatabase.
 */
module.exports = class SalaDAO {
    #database;

    /**
     * Construtor do DAO, recebe a instância de MysqlDatabase.
     * 
     * @param {MysqlDatabase} databaseInstance - Instância de MysqlDatabase injetada.
     */
    constructor(databaseInstance) {
        console.log("⬆️  SalaDAO.constructor()");
        this.#database = databaseInstance;
    }

    /**
     * Cria um novo cargo no banco de dados.
     * 
     * @param {Sala} objSalaModel - Objeto  Sala contendo os dados da Sala.
     * @returns {Promise<number>} ID da Sala criado.
     * @throws {Error} Caso a inserção falhe.
     */
    create = async (objSalaModel) => {
        console.log("🟢 SalaDAO.create()");

        const SQL = "INSERT INTO sala (numero_sala) VALUES (?);";
        const params = [objSalaModel.numSala];

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);

        if (!resultado.insertId) {
            throw new Error("Falha ao inserir Sala");
        }

        return resultado.insertId;
    };

    /**
     * Remove um sala do banco de dados pelo ID.
     * 
     * @param {Sala} objSalaModel - Objeto Sala contendo o ID da Sala a ser removido.
     * @returns {Promise<boolean>} True se a exclusão foi bem-sucedida.
     */
    delete = async (objSalaModel) => {
        console.log("🟢 SalaDAO.delete()");

        const SQL = "DELETE FROM sala WHERE id_sala = ?;";
        const params = [objSalaModel.idSala];

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);

        return resultado.affectedRows > 0;
    };

    /**
     * Atualiza os dados de uma Sala existente.
     * 
     * @param {Sala} objSalaModel - Objeto Sala contendo ID e novos dados da Sala.
     * @returns {Promise<boolean>} True se a atualização foi bem-sucedida.
     */
    update = async (objSalaModel) => {
        console.log("🟢 SalaDAO.update()");

        const SQL = "UPDATE sala SET numero_sala = ? WHERE id_sala = ?;";
        const params = [objSalaModel.numSala, objSalaModel.idSala];

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);

        return resultado.affectedRows > 0;
    };

    /**
     * Retorna todas as salas cadastrados no banco de dados.
     * 
     * @returns {Promise<Array>} Lista de salas.
     */
    findAll = async () => {
        console.log("🟢 SalaDAO.findAll()");

        const SQL = "SELECT * FROM sala;";

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL);

        return resultado;
    };

    /**
     * Busca uma sala pelo ID.
     * 
     * @param {number} idSala - ID da sala a ser buscado.
     * @returns {Promise<Cargo|null>} Objeto sala encontrado ou null.
     */
    findById = async (idSala) => {
        console.log("🟢 SalaDAO.findById()");

        const resultado = await this.findByField("id_sala", idSala);
        return resultado[0] || null;
    };

    /**
     * Busca cargos por um campo específico.
     * 
     * @param {string} field - Nome do campo para busca (permitidos: "idSala", "numSala").
     * @param {*} value - Valor a ser buscado.
     * @returns {Promise<Array>} Lista de cargos encontrados.
     * @throws {Error} Caso o campo informado não seja permitido.
     */
    findByField = async (field, value) => {
        console.log(`🟢 SalaDAO.findByField() - Campo: ${field}, Valor: ${value}`);

        const allowedFields = ["id_sala", "numero_sala"];
        if (!allowedFields.includes(field)) {
            throw new Error(`Campo inválido para busca: ${field}`);
        }

        const SQL = `SELECT * FROM sala WHERE ${field} = ?;`;
        const params = [value];

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);

        return resultado || [];
    };
};