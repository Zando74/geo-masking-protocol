const obliviousTransfert = require('../utils/oblivious-transfer');
const Paillier = require('../utils/Paillier');

const initChallenge1 = async (i, verifierKeys) => {

    // Initialisation d'un transfert inconscient de la coordonnée 
    //i ∈ (0,1) # 0 pour x, 1 pour y
    let verifier = new obliviousTransfert.Requester(i, verifierKeys) 

    // émission du choix (encryption de i) masque le choix au prover
    let choice = verifier.submitChoice(); 

    // Résultats à fournir au prover
    return choice;
    
}

const answer1 = async (choice, x, y) => {
    // Coordonnées inconnu du verifier
    let prover = new obliviousTransfert.Revealer(x,y); 

    // Applique le masque sur les données (masque une valeur et en découvre une autre inconsciemment)
    let { R0, R1 } = prover.applyMask(choice.pk, choice.I); 

    // Résultats à fournir au Verifier
    return { R0, R1 };
}

const verify1 = async (result, i, pk, r, candidate, verifierKeys) => {
 
    // choix selon i de la bonne composante à décrypter
    let R;
    switch(i) {
        case 0:
            R = result.R0;
            break;
        case 1:
            R = result.R1;
            break;
    }

    // décryption de la coordonnée
    let revealed = obliviousTransfert.Requester.result(R, verifierKeys);

    //Vérifie que E(revealed) == E(X) | E(Y) selon le choix de i
    let check = Paillier.encryptExternal(pk, revealed, r).eq(candidate)

    //Retourne le resultat pour continuer le protocole ou pas
    return { status: check, result: revealed };

}

module.exports = { initChallenge1, answer1, verify1 };