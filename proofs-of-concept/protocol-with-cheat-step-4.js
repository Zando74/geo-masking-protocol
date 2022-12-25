const Paillier = require("../utils/Paillier");
const initProver = require("../protocol/1-initialization");
const { initChallenge2, answer2, verify2, initChallenge3, answer3, verify3, computeComponent } = require("../protocol/2-3-safe-multiplication");
const SafeMultiplication = require("../utils/multiplication");
const { initChallenge4, answer4, verify4 } = require("../protocol/4-safe-comparison");
const bigInt = require('big-integer');


/**
 * Alice is the Prover
 * Bob is the Verifier
 * application of the protocol assuming dishonest parties and lie at step 4
 */
const protocolWithCheatStep4 = async (x,y,center,radius) => { 

  const aliceKeys = new Paillier();
  await aliceKeys.genKeys();


  // STEP 1

  let aliceInformations = initProver(x,y, aliceKeys);

  const CENTER = { X: Paillier.encryptExternal(aliceInformations.pk,center.x), Y: Paillier.encryptExternal(aliceInformations.pk,center.y) }

  console.log(`Step 1 done, Alice sends Encrypted coords to Bob to init the protocol`);

  // STEP 2

  const components = computeComponent(aliceInformations.X, aliceInformations.Y, CENTER, aliceInformations.pk);
  let bobSafeMultiplicator = new SafeMultiplication(aliceInformations.pk);

  let bobChallenge2 = initChallenge2(components.C1,bobSafeMultiplicator);

  let aliceAnswer2 = await answer2(aliceKeys,bobChallenge2);

  let bobVerify2 = await verify2(aliceAnswer2, components.C1, bobSafeMultiplicator);

  console.log(`Step 2 done, C1 = (x - xc)² = ${((x - center.x) ** 2)}`);
  console.log(`Alice sends this result : ${aliceKeys.decrypt(bobVerify2)}, Bob can't verify its veracity !`);


  // STEP 3


  let bobChallenge3 = await initChallenge3(components.C2,bobSafeMultiplicator);

  let aliceAnswer3 = await answer3(aliceKeys,bobChallenge3);

  let bobVerify3 = await verify3(aliceAnswer3, components.C2, bobSafeMultiplicator);

  console.log(`Step 3 done, C1 = (y - yc)² = ${((y - center.y) ** 2)}`);
  console.log(`Alice sends this result : ${aliceKeys.decrypt(bobVerify3)}, Bob can't verify its veracity !`);

  // STEP 4
  const bobresultStep4 = await initChallenge4(bobVerify2, bobVerify3, radius, aliceInformations.pk);
  let aliceDecryptionStep4 = await answer4(bobresultStep4.F,aliceKeys);
  aliceDecryptionStep4 = bigInt.randBetween(1, bigInt.one.shiftLeft(512) );
  const finalCheck = await verify4(aliceDecryptionStep4, radius, bobresultStep4.n);

  console.log(`Step 4 done, Alice result minus n is ${bigInt(aliceDecryptionStep4).minus(bobresultStep4.n)}, Bob can't verify it's veracity ! but should be : ${ bigInt(Math.round( (radius ** 2) - (((y - center.y) ** 2) + ((x - center.x) ** 2) )))  }`);

  if(finalCheck) {
    console.log(`Alice is in the authorized Area,  ${ radius ** 2 } > ${bigInt(aliceDecryptionStep4).minus(bobresultStep4.n)} `);
  }else{
    console.log(`Alice is not in the authorized Area, ${ bigInt(aliceDecryptionStep4).minus(bobresultStep4.n) } < 0 or extremely probable > ${ radius ** 2 } if alice lie at step 2 or 3`)
  }

}

module.exports = protocolWithCheatStep4;