const { gpsToCartesian } = require("../utils/gpsToCartesian");

const initProver = (x, y, proverKeys) => {

    // Encryptions des coordonnées
    let X = proverKeys.encryptWithFixedR(x);
    let Y = proverKeys.encryptWithFixedR(y);

    // Resultat à retourner au Verifier
    return { pk: proverKeys.publicKey, X: X, Y: Y };
}

module.exports = initProver;