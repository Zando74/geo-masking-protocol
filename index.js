const aliceDishonestButNotInArea = require("./proofs-of-concept/scenarios/alice-dishonest");
const aliceHonestButNotInArea = require("./proofs-of-concept/scenarios/alice-honest-but-not-in-area");
const idealCase = require("./proofs-of-concept/scenarios/ideal-case");

const main = async () => {
  await idealCase();
  console.log('\n ------ \n');
  await aliceHonestButNotInArea();
  console.log('\n ------ \n');
  await aliceDishonestButNotInArea();
}

main();