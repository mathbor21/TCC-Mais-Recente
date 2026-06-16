const Chamado = require("./Chamado");
const Equipamento = require("../EQUIPAMENTO/equipamento");
const Funcionario = require("../FUNCIONARIO/Funcionario");
const MysqlDatabase = require("../database/MysqlDatabase");

/**
 * Classe responsável por gerenciar operações CRUD e autenticação
 * para a entidade Funcionario no banco de dados.
 * 
 * Esta classe utiliza a injeção de dependência da classe MysqlDatabase,
 * garantindo flexibilidade, reutilização de código e facilitando testes unitários.
 */
module.exports = class ChamadoDAO {
    #database;

    /**
     * Construtor da classe FuncionarioDAO.
     * @param {MysqlDatabase} databaseInstance - Instância de MysqlDatabase para acesso ao banco.
     */
    constructor(databaseInstance) {
        console.log("⬆️  ChamadoDAO.constructor()");
        this.#database = databaseInstance;
    }

    /**
     * Cria um novo chamado no banco de dados.
     * 
     * @param {Chamado} objChamadoModel - Objeto Chamado a ser inserido.
     * @returns {number} ID do chamado inserido.
     * @throws {Error} Caso a inserção falhe.
     */
    create = async (objChamadoModel) => {
        console.log("🟢 ChamadoDAO.create()");

        const SQL = `
            INSERT INTO chamado 
            (code_funcionario, code_equipamento, defeito, relato, foto, status_conserto) 
            VALUES (?, ?, ?, ?, ?, ?);`;
        const params = [
            objChamadoModel.funcionario.idFuncionario,
            objChamadoModel.equipamento.idEquipamento,
            objChamadoModel.defeito,
            objChamadoModel.relato,
            objChamadoModel.caminhoFoto,
            objChamadoModel.statusChamado
        ];

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);

        if (!resultado.insertId) {
            throw new Error("Falha ao inserir equipamento");
        }

        return resultado.insertId;
    };

    /**
     * Remove um chamado pelo ID.
     * 
     * @param {number} objChamadoModel - ID do chamado a ser removido.
     * @returns {boolean} true se a exclusão foi bem-sucedida.
     */
    delete = async (objChamadoModel) => {
        console.log("🟢 ChamadoDAO.delete()");

        const SQL = "DELETE FROM chamado WHERE id_chamado = ?;";
        const params = [objChamadoModel.idChamado];

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);

        return resultado.affectedRows > 0;
    };

    /**
     * Atualiza os dados de um chamado existente.
     * Se a senha for informada, será criptografada antes da atualização.
     * 
     * @param {Chamado} objChamadoModel - Objeto Chamado com dados atualizados.
     * @returns {boolean} true se a atualização foi bem-sucedida.
     */
    update = async (objChamadoModel) => {
        console.log("🟢 ChamadoDAO.update()");
        let SQL;
        let params;

            SQL = `
                UPDATE chamado 
                SET code_funcionario=?, code_equipamento=?, defeito=?, relato=?, foto=?, status_conserto=? 
                WHERE id_chamado=?;`;
                
            params = [
                objChamadoModel.funcionario.idFuncionario,
                objChamadoModel.equipamento.idEquipamento,
                objChamadoModel.defeito,
                objChamadoModel.relato,
                objChamadoModel.caminhoFoto,
                objChamadoModel.statusChamado,
                objChamadoModel.idChamado
            ];
                
         

        const pool = await this.#database.getPool();
        const [resultado] = await pool.execute(SQL, params);

        return resultado.affectedRows > 0;
    };

    /**
     * Retorna todos os chamados cadastrados no banco de dados,
     * incluindo os dados do funcionário e equipamento associados.
     * 
     * @returns {Array} Lista de objetos Chamado.
     */
    findAll = async () => {
        console.log("🟢 ChamadoDAO.findAll()");

        const SQL = `
            SELECT id_chamado, code_funcionario, code_equipamento, defeito, relato, foto, status_conserto,horario
            FROM chamado`;

        const pool = await this.#database.getPool();
        const [matrizDados] = await pool.execute(SQL);

        return matrizDados.map(row => ({
            idChamado: row.id_chamado,
            funcionario: {
                idFuncionario: row.code_funcionario
            },
            equipamento: {
                idEquipamento: row.code_equipamento
            },
            defeito: row.defeito,
            relato: row.relato,
            caminhoFoto: row.foto,
            statusChamado: row.status_conserto,
            horario: row.horario
        }));
    };

        
    /**
     * Busca um chamado pelo ID.
     * 
     * @param {number} idChamado - ID do chamado.
     * @returns {Chamado|null} Objeto Chamado encontrado ou null se não existir.
     */
    findById = async (idChamado) => {
        console.log("🟢 ChamadoDAO.findById()");

        const resultado = await this.findByField("id_chamado", idChamado);
        return resultado[0] || null;
    };

    /**
     * Busca chamados por um campo específico.
     * 
     * @param {string} field - Nome do campo a ser pesquisado. 
     *                         Valores permitidos: "id_chamado", "code_funcionario", "code_equipamento", "status_conserto".
     * @param {*} value - Valor a ser buscado.
     * @returns {Array} Lista de chamados encontrados.
     * @throws {Error} Caso o campo informado seja inválido.
     */
    findByField = async (field, value) => {
        console.log(`🟢 ChamadoDAO.findByField() - Campo: ${field}, Valor: ${value}`);

        const allowedFields = ["id_chamado", "code_funcionario", "code_equipamento","defeito","relato", "foto","status_conserto"];
        if (!allowedFields.includes(field)) {
            throw new Error("Campo inválido para busca");
        }

        const SQL = `SELECT * FROM chamado WHERE ${field} = ?;`;
        const params = [value];

        const pool = await this.#database.getPool();
        const [rows] = await pool.execute(SQL, params);

        return rows || [];
    };

};