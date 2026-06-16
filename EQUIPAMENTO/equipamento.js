const Sala = require("../SALA/Sala");

/**
 * Representa a entidade Equipamento do sistema.
 * 
 * Objetivo:
 * - Encapsular os dados de um equipamento.
 * - Garantir integridade dos atributos via getters e setters.
 * - Associar corretamente um equipamento a um Cargo.
 */
module.exports = class Equipamento {

    // Atributos privados
    #idEquipamento;
    #sala;
    #numeroEquipamento;
    #statusEquipamento;

    /**
     * Getter e Setter para idEquipamento
     * @returns {number} Identificador do equipamento
     */
    get idEquipamento() {
        return this.#idEquipamento;
    }

    /**
     * Define o ID do equipamento.
     *
     * 🔹 Regra de domínio: garante que o ID seja sempre um número inteiro positivo.
     *
     * @param {number} valor - Número inteiro positivo representando o ID do equipamento.
     * @throws {Error} - Lança erro se o valor não for número, não for inteiro ou for menor/igual a zero.
     *
     * @example
     * equipamento.idEquipamento = 10; // ✅ válido
     * equipamento.idEquipamento = -5; // ❌ lança erro
     * equipamento.idEquipamento = 0;  // ❌ lança erro
     * equipamento.idEquipamento = 3.14; // ❌ lança erro
     * equipamento.idEquipamento = null; // ❌ lança erro
     */
    set idEquipamento(valor) {
        // Converte o valor para número para aceitar tanto strings numéricas quanto numbers
        const parsed = Number(valor);

        // Verifica se é um inteiro
        if (!Number.isInteger(parsed)) {
            throw new Error("idEquipamento deve ser um número inteiro.");
        }

        // Verifica se é positivo
        if (parsed <= 0) {
            throw new Error("idEquipamento deve ser um número inteiro positivo.");
        }

        // Atribui valor válido ao atributo privado
        this.#idEquipamento = parsed;
    }

    /**
     * Getter e Setter para sala
     * @returns {Sala} Objeto Sala associado
     */
    get sala() {
        return this.#sala;
    }

    /**
     * Define o Sala do equipamento.
     *
     * 🔹 Regra de domínio: garante que sempre exista um Sala válido associado.
     *
     * @param {Sala} value - Instância válida da classe Sala.
     * @throws {Error} - Lança erro se o valor não for uma instância de Sala.
     *
     * @example
     * equipamento.equipamento = new Equipamento({ idEquipamento: 1, numeroEquipamento: "1" }); // ✅ válido
     * equipamento.equipamento = null;  // ❌ lança erro
     */
    set sala(value) {
        // Verifica se é instância válida de Sala
        if (!(value instanceof Sala)) {
            throw new Error("sala deve ser uma instância válida de Sala.");
        }

        // Atribui valor ao atributo privado
        this.#sala = value;
    }

    /**
     * Getter e Setter para numeroEquipamento
     * @returns {string} Nome do equipamento
     */
    get numeroEquipamento() {
        return this.#numeroEquipamento;
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
    set numeroEquipamento(value) {
        // Verifica se é string
        if (typeof value !== "string") {
            throw new Error("numeroEquipamento deve ser uma string.");
        }

        const nome = value.trim();

        // Verifica tamanho mínimo
        if (nome.length > 3) {
            throw new Error("numeroEquipamento deve ter menos de 3 caracteres.");
        }

        // Atribui valor ao atributo privado
        this.#numeroEquipamento = nome;
    }

    
    get statusEquipamento() {
        return this.#statusEquipamento;
    }

    /**
     * Define se o equipamento recebe vale transporte.
     *
     * 🔹 Regra de domínio: garante que o valor seja sempre 0 (não) ou 1 (sim).
     *
     * @param {number} value - 0 ou 1.
     * @throws {Error} - Lança erro se o valor não for 0 ou 1.
     *
     * @example
     * equipamento.statusEquipamento = 1; // ✅ válido
     * equipamento.statusEquipamento = 0; // ✅ válido
     * equipamento.statusEquipamento = null; // ❌ lança erro
     */
    set statusEquipamento(value) {
        // Verifica se é 0 ou 1
        if (![1, 2, 3].includes(value)) {
            throw new Error("statusEquipamento deve ser 1, 2 o 3.");
        }

        // Atribui valor ao atributo privado
        this.#statusEquipamento = value;
    }
}