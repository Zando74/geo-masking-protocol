const SafeMultiplication = require('../utils/multiplication');
const Paillier = require('../utils/Paillier');

const computeComponent = (X, Y, CENTER, pk) => {

    // calcul des chiffré des deux composantes
    let C1 = Paillier.hMinus(X, CENTER.X, pk);
    let C2 = Paillier.hMinus(Y, CENTER.Y, pk);

    return { C1, C2 };
}


const initChallenge2 = (C1, safeMultiplicator) => {

    // initialisation du protocole de multiplication sûre application d'un masque
    let result = safeMultiplicator.applyMask(C1, C1);

    //retourne (c1: composante + r, c2: composante + s), composante etant le chiffré de C1 donc (x2 - x1)
    return result;
}

const initChallenge3 = (C2, safeMultiplicator) => {

    // initialisation du protocole de multiplication sûre application d'un masque
    let result = safeMultiplicator.applyMask(C2, C2);

    //retourne (c1: composante + r, c2: composante + s), composante etant le chiffré de OTHERCOMP donc (y2 - y1) selon le i choisit
    return result;
}

const answer2 = (proverKeys, resultMask) => {

    // Déchiffre les composantes
    let c1 = proverKeys.decrypt(resultMask.c1);
    let c2 = proverKeys.decrypt(resultMask.c2);

    // calcul le carré
    let c1c2 = c1.times(c2);

    // chiffre le résultat
    let C1SQUARED = proverKeys.encrypt(c1c2);

    // retourne la valeur au verifier
    return C1SQUARED;   
}

const answer3 = (proverKeys, resultMask) => {

    // Déchiffre les composantes
    let c1 = proverKeys.decrypt(resultMask.c1);
    let c2 = proverKeys.decrypt(resultMask.c2);

    // calcul le carré
    let c1c2 = c1.times(c2);

    // chiffre le résultat
    let C2SQUARED = proverKeys.encrypt(c1c2);

    // retourne la valeur au verifier
    return C2SQUARED;   
}


const verify2 = (C1SQUARED, C1, safeMultiplicator) => {

    // Retire le masque en utilisant les propriété homomorphique (x + r)(x + s) - sx - rx - rs -> x²
    let C = safeMultiplicator.removeMask(C1, C1, C1SQUARED);

    // retourne le chiffré de l'autre composante au carré
    return C
}

const verify3 = (C1SQUARED, C2, safeMultiplicator) => {

    // Retire le masque en utilisant les propriété homomorphique (x + r)(x + s) - sx - rx - rs -> x²
    let C = safeMultiplicator.removeMask(C2, C2, C1SQUARED);

    // retourne le chiffré de l'autre composante au carré
    return C
}

module.exports = { initChallenge2, answer2, verify2, initChallenge3, answer3, verify3, computeComponent };