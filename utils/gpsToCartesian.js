
const gpsToCartesian = (latitude, longitude) => {

    const a = 6378137; // rayon de la Terre en mètres
    const b = 6356752.314245; // rayon polaire de la Terre en mètres
    const f = (a - b) / a; // excentricité de la Terre
    const e = Math.sqrt(f * (2 - f)); // premier excentrique
  
    // conversion de latitude et longitude en radians
    const phi = (latitude * Math.PI) / 180;
    const lambda = (longitude * Math.PI) / 180;
  
    // calcul de la position cartésienne
    const x = a * lambda;
    const y = a * Math.log(Math.tan(Math.PI / 4 + phi / 2)) / (2 * Math.PI);
  
    return {x: Math.round(x), y: Math.round(y) };
  }

  const gpsToCartesianX = (longitude) => {
    const a = 6378137; // rayon de la Terre en mètres
  
    // conversion de la longitude en radians
    const lambda = (longitude * Math.PI) / 180;
  
    // calcul de la coordonnée x
    const x = a * lambda;
  
    return x;
  }
  
  const gpsToCartesianY = (latitude) => {
    const a = 6378137; // rayon de la Terre en mètres
  
    // conversion de la latitude en radians
    const phi = (latitude * Math.PI) / 180;
  
    // calcul de la coordonnée y
    const y = a * Math.log(Math.tan(Math.PI / 4 + phi / 2)) / (2 * Math.PI);
  
    return y;
  }

  const distance = (a,b) => {
    return Math.floor(Math.sqrt( ((a.x - b.x) ** 2) + ((a.y - b.y) ** 2) ));
  }

module.exports = { gpsToCartesian, gpsToCartesianX, gpsToCartesianY, distance };