const { gpsToCartesian, distance } = require("../../utils/gpsToCartesian");
const fullProtocol = require("../full-protocol");

  
  const idealCase = async () => {

    // CONSTANT CENTER POS
    const cLat = 45.7179136;
    const cLon = 4.8922624;
    const center = gpsToCartesian(cLat, cLon);

    // MAX Distance (Radius)
    const maxLat = 45.71845326360392;
    const maxLon = 4.903936052383111;
    const max = gpsToCartesian(maxLat, maxLon);
    const radius = distance(max,center);


    // GPS coords of Prover (is in the Area)
    let lat = 45.714908216595624;
    let lon = 4.887860719442041;

    const { x, y } = gpsToCartesian(lat,lon);

    console.log(`Application 1: Alice is in the authorized Area, coord : x : ${x}, y: ${y} \n`);

    await fullProtocol(x,y,center,radius);
  }

  module.exports = idealCase;
  


