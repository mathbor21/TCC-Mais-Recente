const bcrypt = require('bcrypt');

// 1. COLOQUE A SUA SENHA DE TESTE AQUI:
const senhaParaTeste = "Capivara20@";

async function gerarHashBcrypt() {
    // O número 10 é o "cost factor" (tempo que o algoritmo leva para processar)
    // Quanto maior, mais seguro, mas 10 é o padrão ideal para testes e produção.
    const saltRounds = 10; 

    console.log("Gerando hash, aguarde um segundo...");
    const hash = await bcrypt.hash(senhaParaTeste, saltRounds);

    console.log("\n====================================================");
    console.log(`Senha Original: ${senhaParaTeste}`);
    console.log(`Hash Bcrypt para o Banco:\n\n${hash}`);
    console.log("====================================================");
}

gerarHashBcrypt();