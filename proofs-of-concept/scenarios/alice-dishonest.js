const { gpsToCartesian, distance } = require("../../utils/gpsToCartesian");
const protocolWithCheatStep2 = require("../protocol-with-cheat-step-2");
const protocolWithCheatStep3 = require("../protocol-with-cheat-step-3");
const protocolWithCheatStep4 = require("../protocol-with-cheat-step-4");

  
  const aliceDishonestButNotInArea = async () => {

    // CONSTANT CENTER POS
    const cLat = 45.7179136;
    const cLon = 4.8922624;
    const center = gpsToCartesian(cLat, cLon);

    // MAX Distance (Radius)
    const maxLat = 45.71845326360392;
    const maxLon = 4.903936052383111;
    const max = gpsToCartesian(maxLat, maxLon);
    const radius = distance(max,center);


    // GPS coords of Prover (not in the Area)
    let lat = 45.71853469863541;
    let lon = 4.9057615619714445;

    const { x, y } = gpsToCartesian(lat,lon);

    console.log(`Application 3: Alice not in the authorized Area, coord : x : ${x}, y: ${y}, but try to lie in order to pass the challenge \n`);

    console.log(`Try to cheat at step 2 \n`);
    await protocolWithCheatStep2(x,y,center,radius);
    console.log('\n ------ \n');
    console.log(`Try to cheat at step 3 \n`);
    await protocolWithCheatStep3(x,y,center,radius);
    console.log('\n ------ \n');
    console.log(`Try to cheat at step 4 \n`);
    await protocolWithCheatStep4(x,y,center,radius);
  }

  module.exports = aliceDishonestButNotInArea;
  


