const verifyValue = (polynomial, commitment, x, y) => {
    // Calcul de la valeur attendue de P(x) en utilisant l'engagement et les coefficients du polynôme
    const expectedY = evaluatePolynomial(polynomial, x);
    // Vérification que la valeur attendue est égale à y
    return expectedY === y;
}

module.exports = verifyValue;