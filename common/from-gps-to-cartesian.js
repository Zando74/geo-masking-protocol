const fromGpsToCartesian = (longitude, latitude) => {
    const x = Math.cos(latitude) * Math.cos(longitude);
    const y = Math.cos(latitude) * Math.sin(longitude);
    return { x, y };
  }

module.exports = fromGpsToCartesian;