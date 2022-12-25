const crypto = require('crypto');

function hash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

const generateCommitment = (polynomial) => {
    // Hashage des coefficients du polynôme pour générer l'engagement
    return hash(polynomial.join(','));
}

module.exports = generateCommitment;