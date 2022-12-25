const obliviousTransfert = require('./utils/oblivious-transfer');
const Paillier = require("./utils/Paillier");
const bigInt = require('big-integer');
const gp = require('./utils/gpsToCartesian');
const SafeMultiplication = require('./utils/multiplication');

distance = (a,b) => {
  return Math.floor(Math.sqrt( ((a.x - b.x) ** 2) + ((a.y - b.y) ** 2) ));
}

main = async () => {

  /** Distance calculator */

  /*let cLat = 45.7179136;
  let cLon = 4.8922624;

  let inLat = 45.714908216595624;
  let inLon = 4.887860719442041;

  let arasLat = 45.716005763269266;
  let arasLon = 4.881233906931066;

  let outLat = 45.72348442436203;
  let outLon = 4.904758971692367;

  let maxLat = 45.71845326360392;
  let maxLon = 4.903936052383111;

  let center = gp.gpsToCartesian(cLat, cLon);
  let inn = gp.gpsToCartesian( inLat,inLon);
  let aras = gp.gpsToCartesian( arasLat, arasLon);
  let out = gp.gpsToCartesian(outLat, outLon);
  let max = gp.gpsToCartesian(maxLat, maxLon);
  console.log(center, inn, out, max);

  console.log('Max distance =', distance(max,center) );
  console.log('aras =', distance(aras, center));
  console.log( 'in =', distance(inn,center) );
  console.log( 'out =', distance(out,center) );*/



  // CONSTANT CENTER POS
  const cLat = 45.7179136;
  const cLon = 4.8922624;
  const center = gp.gpsToCartesian(cLat, cLon);

  const maxLat = 45.71845326360392;
  const maxLon = 4.903936052383111;
  const max = gp.gpsToCartesian(maxLat, maxLon);
  const rayon = distance(max,center);

  /** STEP 1 */

  // Prover
  
  // génère la paire de clé Paillier
  let proverKeys = new Paillier();
  await proverKeys.genKeys();

  // coordonnée GPS du Prover
  let lat = 45.714908216595624;
  let lon = 4.887860719442041;
  
  // Coordonnée cartésiennes du Prover
  const { x, y } = gp.gpsToCartesian(lat,lon);

  console.log("coordonnées du prover :", x, y);

  // Encryptions des coordonnées
  let X = proverKeys.encryptWithFixedR(x);
  let Y = proverKeys.encryptWithFixedR(y);

  // Resultat envoyé au Verifier
  let r1 = { pk: proverKeys.publicKey, r: proverKeys.r, X: X, Y: Y };

  /** STEP 2 : Transfert Inconscient d'une coordonnée */

  // Verifier

  // initialisation du Transfert Inconscient le verifier choisi une valeur arbitrairement
  let verifier = new obliviousTransfert.Requester(0) // choix de x
  await verifier.init(); // initialisation des clés
  let choice = verifier.submitChoice(); // émission du choix (encryption de 0) masque le choix au prover

  let prover = new obliviousTransfert.Revealer(x,y); // coordonnées inconnu du verifier
  let { R0, R1 } = prover.applyMask(choice.pk, choice.I); // applique le masque sur les données (masque y, découvre x inconsciemment)


  let revealedX = verifier.result(R0);

  //Verifiy that E(revealedX) match with X
  console.log(Paillier.encryptExternal(r1.pk,revealedX,r1.r).eq(r1.X));

  cv = Math.round(((revealedX - center.x) ** 2));

  /** STEP 3 : Transfert Inconscient d'une composante du calcul dépend du choix précedent */

  // Prover
  let c1 = Math.round(((x - center.x) ** 2));
  let c2 = Math.round(((y - center.y) ** 2));
  let C1 = proverKeys.encryptWithFixedR(c1);
  let C2 = proverKeys.encryptWithFixedR(c2);

  prover = new obliviousTransfert.Revealer(c1,c2);
  let Result = prover.applyMask(choice.pk, choice.I);

  let revealedC1 = verifier.result(Result.R0);

  // Verifier

  console.log(revealedC1 == cv);

  // Envoi de la somme (x2 - x1)² + (y2 - y1)² 
  const S = Paillier.hAdd(Paillier.encryptExternal(r1.pk, cv, r1.r), C2, r1.pk);

  /** STEP 4 : Final check */

  

  // pistes utiliser un r aléatoire sur l'encryption et le retirer apres
  // au pire le prover invente mais il ne connais pas r donc trkl
  const F = proverKeys.decrypt(S);
  console.log(S, proverKeys.encryptWithFixedR(F));
  console.log(F);
  const f = Math.sqrt(F);
  console.log(f);
  

  //envoi de f au verifier qui remet le resultat au carré
  let cf = Math.round(f ** 2);
  console.log(cf);

  let CF = Paillier.encryptExternal(r1.pk, cf, r1.r);

  console.log('tests congruence')
  const N2 = bigInt(r1.pk).times(r1.pk);
  console.log(S.mod(N2),CF.mod(N2)) // not working try congruence
  console.log(proverKeys.decrypt(S),proverKeys.decrypt(CF))

  console.log()

  console.log(f < rayon);
  console.log("est dans la zone")





  // safe math test

  /** Ok mais Alice peut mentir à l'étape 2 donc nécéssité de ZKP */
/*
  //revealer
  let mult = new SafeMultiplication(proverKeys.publicKey);

  //prover
  X = proverKeys.encrypt(5);
  Y = proverKeys.encrypt(2);

  //revealer
  let resultMask = mult.applyMask(X, Y);

  // prover
  let XY = proverKeys.encrypt(proverKeys.decrypt(resultMask.c1).times(proverKeys.decrypt(resultMask.c2)));


  // ZKP - révélations de secrets
  // Soient X Y et XY tels que XY = X*Y mod n
  // Le Prover dois prouver que XY = X*Y mod n sans rien dévoiler les valeurs

  console.log("--- ZKP ---")

  let delta = bigInt.randBetween(1, bigInt.one.shiftLeft(512) );
  let pi = delta.times(2)

  let DELTA = proverKeys.encryptWithFixedR(delta);
  let PI = proverKeys.encryptWithFixedR(pi);

  // Verifier
  let e = bigInt.randBetween(1, bigInt.one.shiftLeft(512) );

  // prover

  let A = DELTA.times(X.modPow(e, proverKeys.publicKey.pow(2)));
  let a = proverKeys.decrypt(A);


  console.log(a)

  let B = Y.modPow(a, proverKeys.publicKey.pow(2)).times(Paillier.inverse(PI,proverKeys.publicKey)).times(XY.modPow(-e, proverKeys.publicKey.pow(2)))
  console.log(B)
  let b = proverKeys.decrypt(B);

  // verifier

  console.log('check ZKP');
  a_candidate = Paillier.encryptExternal(r1.pk, a, r1.r)
  console.log(a_candidate.eq(A));
  console.log(Paillier.encryptExternal(r1.pk, b, r1.r).eq(B));
  console.log(b === 0);



  // revealer
  let removeMask = mult.removeMask(X, Y, XY);

  // prover
  console.log(proverKeys.decrypt(removeMask));
  */

  //await multiProof()
}


let multiProof = async () => {
  
  console.log("la multiproof")


  let x = 5;
  let y = 10;
  let xy = 50;

  let keys = new Paillier();
  await keys.genKeys();

  const N2 = keys.publicKey.times(keys.publicKey);

  let X = keys.encryptWithFixedR(x);
  let Y = keys.encryptWithFixedR(y);
  let XY = keys.encryptWithFixedR(xy);

  let delta = bigInt.randBetween(1, bigInt.one.shiftLeft(512) );
  let DELTA = keys.encryptWithFixedR(delta);

  let e = bigInt.randBetween(1, bigInt.one.shiftLeft(512) );

  let A = DELTA.times(X.modPow(e, N2)).mod(N2);
  console.log(A);
  let a = keys.decrypt(A);
  console.log(a);

  let cA = keys.encryptWithFixedR(a);
  console.log(cA)
  cA
  console.log(cA.mod(N2), A.mod(N2) );


  console.log("autre test");

  let n0 = 5
  let n1 = 5
  let N0 = keys.encryptWithFixedR(n0);
  let N1 = keys.encryptWithFixedR(n1);

  let Sum = (N0.times(N1)).mod(N2) // [10]

  a = 10;
  let ad = ((bigInt(a).times(keys.publicKey)).add(1))
  .times(keys.r.modPow(keys.publicKey,N2))

  console.log(ad)


  //console.log(Sum.mod(N2).eq(keys.encryptWithFixedR(10).mod(keys.publicKey)))
  console.log(keys.decrypt(Sum), keys.decrypt(keys.encryptWithFixedR(10)))
  console.log('sum is divisible ?', Sum.isDivisibleBy(keys.publicKey))
  console.log('E(10) is dibisible ?', keys.encryptWithFixedR(10).isDivisibleBy(keys.publicKey))
  //console.log(Sum.minus(keys.encryptWithFixedR(10)))
  //console.log(Sum, keys.encryptWithFixedR(10));

  console.log(Sum, Sum.mod(N2))
  console.log(keys.encryptWithFixedR(10), keys.encryptWithFixedR(10).mod(N2))

  console.log(keys.decrypt(Sum.mod(N2)));
}

main()