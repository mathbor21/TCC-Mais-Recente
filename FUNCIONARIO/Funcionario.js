
/**
 * Representa a entidade Funcionario do sistema.
 * 
 * Objetivo:
 * - Encapsular os dados de um funcionário.
 * - Garantir integridade dos atributos via getters e setters.
 */
module.exports = class Funcionario {

    // Atributos privados
    #idFuncionario;
    #nomeFuncionario;
    #senha;
    #coordenador;

    /**
     * Getter e Setter para idFuncionario
     * @returns {number} Identificador do funcionário
     */
    get idFuncionario() {
        return this.#idFuncionario;
    }

    /**
     * Define o ID do funcionário.
     *
     * 🔹 Regra de domínio: garante que o ID seja sempre um número inteiro positivo.
     *
     * @param {number} valor - Número inteiro positivo representando o ID do funcionário.
     * @throws {Error} - Lança erro se o valor não for número, não for inteiro ou for menor/igual a zero.
     *
     * @example
     * funcionario.idFuncionario = 10; // ✅ válido
     * funcionario.idFuncionario = -5; // ❌ lança erro
     * funcionario.idFuncionario = 0;  // ❌ lança erro
     * funcionario.idFuncionario = 3.14; // ❌ lança erro
     * funcionario.idFuncionario = null; // ❌ lança erro
     */
    set idFuncionario(valor) {
        // Converte o valor para número para aceitar tanto strings numéricas quanto numbers
        const parsed = Number(valor);

        // Verifica se é um inteiro
        if (!Number.isInteger(parsed)) {
            throw new Error("idFuncionario deve ser um número inteiro.");
        }

        // Verifica se é positivo
        if (parsed <= 0) {
            throw new Error("idFuncionario deve ser um número inteiro positivo.");
        }
        
        // Atribui valor válido ao atributo privado
        this.#idFuncionario = parsed;
    }

    get nomeFuncionario() {
        return this.#nomeFuncionario;
    }

    /**
     * Define o nome do funcionário.
     *
     * 🔹 Regra de domínio: garante que o nome seja sempre uma string não vazia
     * e com pelo menos 3 caracteres.
     *
     * @param {string} value - Nome do funcionário.
     * @throws {Error} - Lança erro se o valor não for string, estiver vazio ou tiver menos de 3 caracteres.
     *
     * @example
     * funcionario.nomeFuncionario = "João Silva"; // ✅ válido
     * funcionario.nomeFuncionario = "Al";        // ❌ lança erro
     * funcionario.nomeFuncionario = null;        // ❌ lança erro
     */
    set nomeFuncionario(value) {
        // Verifica se é string
        if (typeof value !== "string") {
            throw new Error("nomeFuncionario deve ser uma string.");
        }

        const nome = value.trim();

        // Verifica tamanho mínimo
        if (nome.length < 3) {
            throw new Error("nomeFuncionario deve ter pelo menos 3 caracteres.");
        }

        // Atribui valor ao atributo privado
        this.#nomeFuncionario = nome;
    }

    
    get senha() {
        return this.#senha;
    }

    /**
     * Define a senha do funcionário.
     *
     * 🔹 Regra de domínio: garante que a senha seja sempre uma string não vazia
     * e que atenda aos critérios de segurança (mínimo 6 caracteres, 1 número, 1 maiúscula, 1 caractere especial).
     *
     * @param {string} value - Senha do funcionário.
     * @throws {Error} - Lança erro se o valor não for string, estiver vazio ou não atender aos critérios de segurança.
     *
     * @example
     * funcionario.senha = "Senha@123"; // ✅ válido
     * funcionario.senha = "123";       // ❌ lança erro (menos de 6 caracteres)
     * funcionario.senha = "abcdef";    // ❌ lança erro (sem maiúscula, número ou caractere especial)
     * funcionario.senha = null;        // ❌ lança erro
     */
    set senha(value) {
        // Verifica se é string
        if (typeof value !== "string") {
            throw new Error("senha deve ser uma string.");
        }

        const senhaTrimmed = value.trim();

        // Verifica se não está vazia
        if (senhaTrimmed === "") {
            throw new Error("senha não pode ser vazia.");
        }

        // Verifica tamanho mínimo
        if (senhaTrimmed.length < 6) {
            throw new Error("senha deve ter pelo menos 6 caracteres.");
        }

        // Verifica se contém pelo menos uma letra maiúscula
        if (!/[A-Z]/.test(senhaTrimmed)) {
            throw new Error("senha deve conter pelo menos uma letra maiúscula.");
        }

        // Verifica se contém pelo menos um número
        if (!/[0-9]/.test(senhaTrimmed)) {
            throw new Error("senha deve conter pelo menos um número.");
        }

        // Verifica se contém pelo menos um caractere especial
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(senhaTrimmed)) {
            throw new Error("senha deve conter pelo menos um caractere especial.");
        }

        // Atribui valor ao atributo privado
        this.#senha = senhaTrimmed;
    }
    /**
     * Getter e Setter para recebeValeTransporte
     * @returns {number} 0 ou 1
     */
    get coordenador() {
        return this.#coordenador;
    }

    /**
     * Define se o funcionário recebe vale transporte.
     *
     * 🔹 Regra de domínio: garante que o valor seja sempre 0 (não) ou 1 (sim).
     *
     * @param {number} value - 0 ou 1.
     * @throws {Error} - Lança erro se o valor não for 0 ou 1.
     *
     * @example
     * funcionario.recebeValeTransporte = 1; // ✅ válido
     * funcionario.recebeValeTransporte = 0; // ✅ válido
     * funcionario.recebeValeTransporte = null; // ❌ lança erro
     */
    set coordenador(value) {
        // Verifica se é 0 ou 1
        if (![0, 1].includes(value)) {
            throw new Error("coordenador deve ser 0 ou 1.");
        }

        // Atribui valor ao atributo privado
        this.#coordenador = value;
    }
}