const MeuTokenJWT = require("../JWT/MeuTokenJWT");
const FuncionarioDAO = require("./FuncionarioDAO");
const Funcionario = require("./Funcionario");

const ErrorResponse = require("../utils/ErrorResponse");


/**
 * Classe responsável pela camada de serviço para a entidade Funcionario.
 * 
 * Observações sobre injeção de dependência:
 * - O FuncionarioService recebe uma instância de FuncionarioDAO via construtor.
 * - Isso desacopla o serviço da implementação concreta do DAO.
 * - Facilita testes unitários e uso de mocks.
 */
module.exports = class FuncionarioService {
    #funcionarioDAO;
    /**
     * Construtor da classe FuncionarioService
     * @param {FuncionarioDAO} funcionarioDAODependency - Instância de FuncionarioDAO
     */
    constructor(funcionarioDAODependency) {
        console.log("⬆️  FuncionarioService.constructor()");
        this.#funcionarioDAO = funcionarioDAODependency; // injeção de dependência
    }

    /**
     * Cria um novo funcionário.
     *
     * @param {Object} jsonFuncionario - Objeto contendo dados do funcionário
     * @param {Object} jsonFuncionario.funcionario - Dados do funcionário
     * @param {string} requestBody.funcionario.nomeFuncionario - Nome do funcionário
     * @param {string} requestBody.funcionario.senha - Senha do funcionário
     * @param {boolean} requestBody.funcionario.coordenador - Se recebe vale transporte
     
     *
     * @returns {Promise<Funcionario>} - Objeto Funcionario criado com ID atribuído
     * @throws {ErrorResponse} - Em caso de validação de dados inválidos ou email já existente
     *
     * @example
     * const funcionario = await funcionarioService.createFuncionario({ funcionario: {...} });
     */
    createFuncionario = async (jsonFuncionario) => {
        console.log("🟣 FuncionarioService.createFuncionario()");


        // Criação da instância Funcionario
        const objFuncionario = new Funcionario();

        //aplica regra de dominio pq chama os sets da classe funcionário para inserir valores
        objFuncionario.idFuncionario = jsonFuncionario.idFuncionario;
        objFuncionario.nomeFuncionario = jsonFuncionario.nomeFuncionario; // regra de dominio
        objFuncionario.senha = jsonFuncionario.senha; // regra de dominio
        objFuncionario.coordenador = jsonFuncionario.coordenador; // regra de dominio

        
        //regra de negocio => Verificação de código duplicado
        const idFuncionarioExiste = await this.#funcionarioDAO.findByField("id_funcionario", objFuncionario.idFuncionario);
        if (idFuncionarioExiste.length > 0) {
            throw new ErrorResponse(
                400,
                "´Já existe um Funcionário com o codigo fornecido",
                { message: `O código ${objFuncionario.idFuncionario} já está cadastrado` }
            );
        }

        // Persistência e atribuição de ID
        await this.#funcionarioDAO.create(objFuncionario);

        return objFuncionario;
    }


    /**
     * Realiza o login de um funcionário.
     *
     * 🔹 Regra de aplicação: valida as credenciais do usuário e retorna um token JWT.
     *
     * @param {Object} jsonFuncionario - Objeto contendo os dados de login.
     * @param {Object} jsonFuncionario.funcionario - Dados do funcionário para login.
     * @param {string} requestBody.funcionario.idFuncionario - codigo do funcionário.
     * @param {string} requestBody.funcionario.senha - Senha do funcionário.
     *
     * @returns {Promise<Object>} - Retorna um objeto contendo:
     *                              { user: { idFuncionario, name, codigo, role }, token }
     *
     * @throws {ErrorResponse} - Lança erro 401 se usuário ou senha forem inválidos,
     *                            ou erro 500 em caso de falha interna.
     *
     * @example
     * const resultado = await funcionarioService.loginFuncionario({
     *   funcionario: { codigo 654321, senha: "123456" }
     * });
     * console.log(resultado.user, resultado.token);
     */
    loginFuncionario = async (jsonFuncionario) => {
        console.log("🟣 FuncionarioService.loginFuncionario()");


        const objetoFuncionario = new Funcionario();
        objetoFuncionario.idFuncionario = jsonFuncionario.idFuncionario;
        objetoFuncionario.senha = jsonFuncionario.senha


        // Consulta no DAO 
        const encontrado = await this.#funcionarioDAO.login(objetoFuncionario);

        if (!encontrado) {
            throw new ErrorResponse(401, "Usuário ou senha inválidos", { message: "Não foi possível realizar autenticação" });
        }

        // Geração de token JWT
        const jwt = new MeuTokenJWT();
        const user = {
            funcionario: {
                idFuncionario: encontrado.idFuncionario,
                name: encontrado.nomeFuncionario || null,
                coordenador:encontrado.coordenador || null
            }
        };

        return { user, token: jwt.gerarToken(user.funcionario) };
    }

    /**
     * Retorna todos os funcionários
     * @returns {Promise<Funcionario[]>} - Lista de funcionários
     */
    findAll = async () => {
        console.log("🟣 FuncionarioService.findAll()");
        return this.#funcionarioDAO.findAll();
    }

    /**
     * Retorna um funcionário pelo ID
     * @param {number} idFuncionario - ID do funcionário
     * @returns {Promise<Funcionario>} - Objeto Funcionario encontrado
     * @throws {ErrorResponse} - Em caso de ID inválido ou funcionário não encontrado
     */
    findById = async (idFuncionario) => {
        const objFuncionario = new Funcionario();
        objFuncionario.idFuncionario = idFuncionario;

        const funcionario = await this.#funcionarioDAO.findById(objFuncionario.idFuncionario);


        if (!funcionario) {
            throw new ErrorResponse(404, "Funcionário não encontrado", { message: `Não existe funcionário com id ${idFuncionario}` });
        }

        return funcionario;
    }

    /**
     * Atualiza um funcionário
     * @param {number} idFuncionario - ID do funcionário
     * @param {Object} requestBody - Dados atualizados do funcionário
     * @returns {Promise<Funcionario>} - Objeto Funcionario atualizado
     * @throws {ErrorResponse} - Em caso de dados inválidos
     */
    updateFuncionario = async (idFuncionario, requestBody) => {
        console.log("🟣 FuncionarioService.updateFuncionario()");
        const jsonFuncionario = requestBody.funcionario;


        //validação das regras de dominio
        const objFuncionario = new Funcionario();


        objFuncionario.idFuncionario = idFuncionario,
            objFuncionario.nomeFuncionario = jsonFuncionario.nomeFuncionario,   
            objFuncionario.senha = jsonFuncionario.senha,
            objFuncionario.coordenador = jsonFuncionario.coordenador

        //envia um objeto valido de funcionario para atualizar
        return await this.#funcionarioDAO.update(objFuncionario);
    }

    /**
     * Exclui um funcionário
     * @param {number} idFuncionario - ID do funcionário
     * @returns {Promise<boolean>} - True se excluído com sucesso
     * @throws {ErrorResponse} - Em caso de ID inválido
     */
    deleteFuncionario = async (idFuncionario) => {

        const funcionario = new Funcionario();
        funcionario.idFuncionario = idFuncionario
        return await this.#funcionarioDAO.delete(funcionario);
    }
}