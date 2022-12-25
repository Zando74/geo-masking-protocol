const obliviousTransfert = require('./utils/oblivious-transfer');
const Paillier = require("./utils/Paillier");
const bigInt = require('big-integer');


// developper le protocole de transfert inconscient pour les coordonnées geo

main = async () => {
  const cryptosystem = new Paillier();
  await cryptosystem.genKeys();
  //for(let i=0; i<10; i++) {
    const M = cryptosystem.encrypt(-50);
    const M2 = cryptosystem.encrypt(45);
    console.log(M,M2)
    const M3 = Paillier.hMinus(M, M2, cryptosystem.publicKey)
    console.log(M3);
  //}
  //

  //const r = Paillier.hMinus(M, M2, cryptosystem.publicKey);
  //console.log(r.divmod(cryptosystem.publicKey));
  //console.log(cryptosystem.decrypt(r))

  /*console.log(M)
  const m = cryptosystem.decrypt(M);
  console.log(m)

  const M2 = cryptosystem.encrypt(2);

  let MplusM2 = Paillier.hAdd(M,M2,cryptosystem.publicKey);
  let MmoinsM2 = Paillier.hMinus(M,M2,cryptosystem.publicKey);
  let Mfois2 = Paillier.produitParScalaire(M,2,cryptosystem.publicKey);
  let opposeM = Paillier.inverse(M,cryptosystem.publicKey);

  console.log(cryptosystem.decrypt(MplusM2));
  console.log(cryptosystem.decrypt(MmoinsM2));
  console.log(cryptosystem.decrypt(Mfois2));
  console.log(opposeM);


  const M3 = cryptosystem.encryptWithFixedR(5);
  const M4 = cryptosystem.encryptWithFixedR(5);
  console.log(M3,M4)

  console.log(
    cryptosystem.decrypt(M3),
    cryptosystem.decrypt(M4)
  );



  /*** TRANSFERT INCONSCIENT */

  /*let alice = new obliviousTransfert.Revealer(10,20); // deux messages 10 et 20 inconnu de bob
  let bob = new obliviousTransfert.Requester(0); // bob veux connaitre m0 donc 10

  await bob.init() // génération de clés
  let choice = bob.submitChoice(); // bob choisit m0

  let { R0, R1 } = alice.applyMask(choice.pk, choice.I);

  let r0 = bob.result(R0);
  let r1 = bob.result(R1);

  console.log(r0, r1);


  /** Soustraction homomorphe */

  /*let c1 = cryptosystem.encrypt(4);
  let c2 = cryptosystem.encrypt(4);
  console.log(cryptosystem.decrypt(Paillier.hMinus(c1,c2,cryptosystem.publicKey)));


  /** exemple sqrt */

  /*let v = 54.452
  

  let V = cryptosystem.encryptWithFixedR(Math.floor(v)); // encryption de v
  
  let f = Math.floor(Math.sqrt(v) ** 2);
  console.log(f);

  let F2 = cryptosystem.encryptWithFixedR( f ); // encription de racine carré de v au carré sqrt(v)² ~> v

  console.log(V, F2)*/

  
  
}

main()