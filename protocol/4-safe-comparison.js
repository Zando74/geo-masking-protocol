const Paillier = require("../utils/Paillier");
const bigInt = require('big-integer');

// Idea: R² - ((x2 - x1)² + (y2 - y1)²) > 0 ?


const initChallenge4 = async (C1, C2, radius, pk) => {

    // calcul homomorphiquement S = (x2 - x1)² + (y2 - y1)²
    let S = Paillier.hAdd(C1,C2, pk);

    // Génération d'un n aléatoire et encryption
    let n = bigInt.randBetween(1, bigInt.one.shiftLeft(512) );
    let N = Paillier.encryptExternal(pk, n);

    //calcul C = [radius²] * S^-1 # c = radius² - f
    let R2 = Paillier.encryptExternal(pk,(radius ** 2));
    let C = Paillier.hMinus(R2,S,pk);
    
    // Intuition, si C ∊ [0, radius²], le prover dit vrai. si C < 0, le prover Ment.

    // masquage de C, F = C * [n] # C + n
    let F = Paillier.hAdd(C,N,pk);

    // renvoi F pour décryption et n aléatoire pour démasquage
    return { F, n };
}

const answer4 = async (F, proverKeys) => {
    const f = proverKeys.decrypt(F);
    return f;
}

const verify4 = async(f, radius, n) => {
    let finalCheck = bigInt(f).minus(n);
    return ((finalCheck >= 0) && (finalCheck <= (radius ** 2)))
}



module.exports = { initChallenge4, answer4, verify4 };