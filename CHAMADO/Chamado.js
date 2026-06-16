const Equipamento = require("../EQUIPAMENTO/equipamento");
const Funcionario = require("../FUNCIONARIO/Funcionario");

/**
 * Representa a entidade Chamado do sistema.
 * 
 * Objetivo:
 * - Encapsular os dados de um chamado.
 * - Garantir integridade dos atributos via getters e setters.
 * - Associar corretamente um chamado a um Funcionario e a um Equipamento.
 */
module.exports = class Chamado {

    // Atributos privados
    #idChamado;
    #funcionario;
    #equipamento;
    #defeito;
    #relato;
    #caminhoFoto;
    #statusChamado;
    #horarioAbertura;

    /**
     * Getter e Setter para idChamado
     * @returns {number} Identificador do Chamado
     */
    get idChamado() {
        return this.#idChamado;
    }

    /**
     * Define o ID do chamado.
     *
     * 🔹 Regra de domínio: garante que o ID seja sempre um número inteiro positivo.
     *
     * @param {number} valor - Número inteiro positivo representando o ID do chamado.
     * @throws {Error} - Lança erro se o valor não for número, não for inteiro ou for menor/igual a zero.
     *
     * @example
     * chamado.idChamado = 10; // ✅ válido
     * chamado.idChamado = -5; // ❌ lança erro
     * chamado.idChamado = 0;  // ❌ lança erro
     * chamado.idChamado = 3.14; // ❌ lança erro
     * chamado.idChamado = null; // ❌ lança erro
     */
    set idChamado(valor) {
        // Converte o valor para número para aceitar tanto strings numéricas quanto numbers
        const parsed = Number(valor);

        // Verifica se é um inteiro
        if (!Number.isInteger(parsed)) {
            throw new Error("idChamado deve ser um número inteiro.");
        }

        // Verifica se é positivo
        if (parsed <= 0) {
            throw new Error("idChamado deve ser um número inteiro positivo.");
        }

        // Atribui valor válido ao atributo privado
        this.#idChamado = parsed;
    }

    /**
     * Getter e Setter para funcionario
     * @returns {Funcionario} Objeto Funcionario associado
     */
    get funcionario() {
        return this.#funcionario;
    }

    /**
     * Define o Funcionario do chamado.
     *
     * 🔹 Regra de domínio: garante que sempre exista um Funcionario válido associado.
     *
     * @param {Funcionario} value - Instância válida da classe Funcionario.
     * @throws {Error} - Lança erro se o valor não for uma instância de Funcionario.
     *
     * @example
     * chamado.funcionario = new Funcionario({ idFuncionario: 1, nome: "João" }); // ✅ válido
     * chamado.funcionario = null;  // ❌ lança erro
     */
    set funcionario(value) {
        // Verifica se é instância válida de Funcionario
        if (!(value instanceof Funcionario)) {
            throw new Error("funcionario deve ser uma instância válida de Funcionario.");
        }

        // Atribui valor ao atributo privado
        this.#funcionario = value;
    }

    /**
     * Getter e Setter para numeroEquipamento
     * @returns {string} Nome do equipamento
     */
    get equipamento() {
        return this.#equipamento;
    }

    set equipamento(value) {
        // Verifica se é instância válida de Equipamento
        if (!(value instanceof Equipamento)) {
            throw new Error("equipamento deve ser uma instância válida de Equipamento.");
        }
        this.#equipamento = value;
    }
    get defeito(){
        return this.#defeito;
    }
    /**
     * Define o nome do equipamento.
     *
     * 🔹 Regra de domínio: garante que o nome seja sempre uma string não vazia
     * e com pelo menos 3 caracteres.
     *
     * @param {string} value - Nome do equipamento.
     * @throws {Error} - Lança erro se o valor não for string, estiver vazio ou tiver menos de 3 caracteres.
     *
     * @example
     * equipamento.numeroEquipamento = "30"; // ✅ válido
     * equipamento.numeroEquipamento = "Al";        // ❌ lança erro
     * equipamento.numeroEquipamento = null;        // ❌ lança erro
     */
    set defeito(value) {
        // Verifica se é string
        if (typeof value !== "string") {
            throw new Error("defeito deve ser uma string.");
        }

        const defeito = value.trim();

        // Verifica tamanho mínimo
        if (defeito.length < 3) {
            throw new Error("defeito deve ter menos de 3 caracteres.");
        }

        // Atribui valor ao atributo privado
        this.#defeito = defeito;
    }
    get relato(){
        return this.#relato;
    }
    set relato(value) {
        // Verifica se é string
        if (typeof value !== "string") {
            throw new Error("relato deve ser uma string.");
        }
         const relato = value.trim();

        // Verifica tamanho mínimo
        if (relato.length > 255) {
            throw new Error("relato deve ter menos de 40 caracteres.");
        }
        this.#relato = value;
    }

    get caminhoFoto() {
        return this.#caminhoFoto;
    }
    set caminhoFoto(value) {
        // Verifica se é string
        if (typeof value !== "string") {
            throw new Error("caminhoFoto deve ser uma string.");
        }
         const caminhoFoto = value.trim();
         if (caminhoFoto.length < 10) {
            throw new Error("caminhoFoto deve ter pelo de 100 caracteres.");
        }
         if (caminhoFoto.length > 100) {
            throw new Error("caminhoFoto deve ter menos de 100 caracteres.");
        }
        this.#caminhoFoto = caminhoFoto;
    }

    get statusChamado() {
        return this.#statusChamado;
    }

    /**
     * Define o status do chamado.
     *
     * 🔹 Regra de domínio: garante que o valor seja sempre 1 (aberto), 2 (em andamento) ou 3 (fechado).
     *
     * @param {number} value - 1, 2 ou 3.
     * @throws {Error} - Lança erro se o valor não for 1, 2 ou 3.
     *
     * @example
     * equipamento.statusChamado = 1; // ✅ válido
     * equipamento.statusChamado = 2; // ✅ válido
     * equipamento.statusChamado = 3; // ✅ válido
     * equipamento.statusChamado = null; // ❌ lança erro
     */
    set statusChamado(value) {
        // Verifica se é 1, 2 ou 3
        if (![1, 2, 3].includes(value)) {
            throw new Error("statusChamado deve ser 1, 2 ou 3.");
        }

        // Atribui valor ao atributo privado
        this.#statusChamado = value;
    }
}