
const Equipamento = require("./equipamento");
const Sala = require("../SALA/Sala");
const MysqlDatabase = require("../database/MysqlDatabase");

/**
 * Classe responsável por gerenciar operações CRUD e autenticação
 * para a entidade Funcionario no banco de dados.
 * 
 * Esta classe utiliza a injeção de dependência da classe MysqlDatabase,
 * garantindo flexibilidade, reutilização de código e facilitando testes unitários.
 */
module.exports = class EquipamentoDAO {
    #database;

    /**
     * Construtor da classe FuncionarioDAO.
     * @param {MysqlDatabase} databaseInstance - Instância de MysqlDatabase para acesso ao banco.
     */
    constructor(databaseInstance) {
        console.log("⬆️  EquipamentoDAO.constructor()");
        this.#database = databaseInstance;
    }

    /**
     * Cria um novo equipamento no banco de dados.
     * Antes de salvar, a senha é criptografada com bcrypt.
     * 
     * @param {Equipamento} objEquipamentoModel - Objeto Equipamento a ser inserido.
     * @returns {number} ID do equipamento inserido.
     * @throws {Error} Caso a inserção falhe.
     */
    create = async (objEquipamentoModel) => {
        console.log("🟢 EquipamentoDAO.create()");

        const SQL = `
            INSERT INTO equipamento 
            (numero_equipamento, status_equipamento, code_sala) 
            VALUES (?, ?, ?);`;
        const params = [
            objEquipamentoModel.numeroEquipamento,
            objEquipamentoModel.statusEquipamento,
            objEquipamentoModel.sala.idSala,
        ];

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);

        if (!resultado.insertId) {
            throw new Error("Falha ao inserir equipamento");
        }

        return resultado.insertId;
    };

    /**
     * Remove um equipamento pelo ID.
     * 
     * @param {number} objEquipamentoModel - ID do equipamento a ser removido.
     * @returns {boolean} true se a exclusão foi bem-sucedida.
     */
    delete = async (objEquipamentoModel) => {
        console.log("🟢 EquipamentoDAO.delete()");

        const SQL = "DELETE FROM equipamento WHERE id_equipamento = ?;";
        const params = [objEquipamentoModel.idEquipamento];

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);

        return resultado.affectedRows > 0;
    };

    /**
     * Atualiza os dados de um equipamento existente.
     * Se a senha for informada, será criptografada antes da atualização.
     * 
     * @param {Equipamento} objEquipamentoModel - Objeto Equipamento com dados atualizados.
     * @returns {boolean} true se a atualização foi bem-sucedida.
     */
    update = async (objEquipamentoModel) => {
        console.log("🟢 EquipamentoDAO.update()");

        let SQL;
        let params;

            SQL = `
                UPDATE equipamento 
                SET numero_equipamento=?, status_equipamento=?, code_Sala=? 
                WHERE id_equipamento=?;`;
            params = [
                objEquipamentoModel.numeroEquipamento,
                objEquipamentoModel.statusEquipamento,
                objEquipamentoModel.sala.idSala,
                objEquipamentoModel.idEquipamento,
            ];
         

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);

        return resultado.affectedRows > 0;
    };

    /**
     * Retorna todos os equipamentos cadastrados no banco de dados,
     * incluindo os dados do sala associado.
     * 
     * @returns {Array} Lista de objetos Equipamento.
     */
    findAll = async () => {
        console.log("🟢 EquipamentoDAO.findAll()");

        const SQL = `
            SELECT id_equipamento, numero_equipamento, status_equipamento, id_sala, numero_sala 
            FROM equipamento
            JOIN sala ON equipamento.code_Sala = id_sala;`;

        const pool = await this.#database.getPool();
        const [matrizDados] = await pool.execute(SQL);

        return matrizDados.map(row => ({
            idEquipamento: row.id_equipamento,
            numeroEquipamento: row.numero_equipamento,
            statusEquipamento: row.status_equipamento,
            sala: {
                idSala: row.id_sala,
                numeroSala: row.numero_sala,
            }
        }));
    };

    /**
     * Busca um equipamento pelo ID.
     * 
     * @param {number} idEquipamento - ID do equipamento.
     * @returns {Equipamento|null} Objeto Equipamento encontrado ou null se não existir.
     */
    findById = async (idEquipamento) => {
        console.log("🟢 EquipamentoDAO.findById()");

        const resultado = await this.findByField("id_equipamento", idEquipamento);
        return resultado[0] || null;
    };

    /**
     * Busca equipamentos por um campo específico.
     * 
     * @param {string} field - Nome do campo a ser pesquisado. 
     *                         Valores permitidos: "id_equipamento", "numero_equipamento", "status_equipamento", "code_sala".
     * @param {*} value - Valor a ser buscado.
     * @returns {Array} Lista de equipamentos encontrados.
     * @throws {Error} Caso o campo informado seja inválido.
     */
    findByField = async (field, value) => {
        console.log(`🟢 EquipamentoDAO.findByField() - Campo: ${field}, Valor: ${value}`);

        const allowedFields = ["id_equipamento", "numero_equipamento", "status_equipamento", "code_sala"];
        if (!allowedFields.includes(field)) {
            throw new Error("Campo inválido para busca");
        }

        const SQL = `SELECT * FROM equipamento WHERE ${field} = ?;`;
        const params = [value];

        const pool = await this.#database.getPool();
        const [rows] = await pool.execute(SQL, params);

        return rows || [];
    };

};