
const generatePolynomial = () => {
    // Génération d'un coefficient aléatoire a pour le polynôme de degré 1 P(x) = ax + b
    const a = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    return [a, b];
}

module.exports = generatePolynomial;