const evaluatePolynomial = (polynomial, x) => {
    // Récupération des coefficients a et b
    const [a, b] = polynomial;
    // Évaluation de P(x)
    return a * x + b;
}

module.exports = evaluatePolynomial;