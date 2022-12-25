const revealProof = (polynomial, x) => {
    // Calcul de la valeur de P(x)
    const y = evaluatePolynomial(polynomial, x);
    // Renvoi de la valeur de x et de y au Vérificateur
    return { x, y };
}

module.exports = revealProof;