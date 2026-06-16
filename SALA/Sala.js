module.exports = class Sala {
// Atributos privados
#idSala;
#numSala;
get idSala() {
return this.#idSala;
}
set idSala(value) {
const parsed = Number(value); // Converte o valor para número
if (!Number.isInteger(parsed)) { // Verifica se é um número inteiro
throw new Error("idSala deve ser um número inteiro.");
}
if (parsed <= 0) {// Verifica se é maior que zero
throw new Error("idSala deve ser maior que zero.");
}
this.#idSala = parsed; // Atribui valor ao atributo privado
}
get numSala() {
return this.#numSala;
}
set numSala(value) {
if (typeof value !== "string") {// Verifica se é string
throw new Error("numSala deve ser uma string.");
}
// Remove espaços no início/fim
const numero = value.trim();
// Verifica comprimento mínimo
if (numero.length > 2) {
throw new Error("numSala deve ter menos de 3 caracteres.");
}
// Atribui valor ao atributo privado
this.#numSala = numero;
}
}
