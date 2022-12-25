const Paillier = require("./Paillier");
const bigInt = require('big-integer');

module.exports = class SafeMultiplication {

    constructor(pk) {
        this.r = bigInt.randBetween(1, bigInt.one.shiftLeft(512) );
        this.s =  bigInt.randBetween(1, bigInt.one.shiftLeft(512) );
        this.pk = pk;
        this.R = Paillier.encryptExternal(pk, this.r);
        this.S = Paillier.encryptExternal(pk, this.s);
    }

    applyMask = (X, Y) => {
        return {
            c1: Paillier.hAdd(X,this.R, this.pk),
            c2: Paillier.hAdd(Y,this.S, this.pk)
        }
    }

    removeMask = (X,Y, XY) => {

        let SX = Paillier.produitParScalaire(X, this.s, this.pk);
        let RY = Paillier.produitParScalaire(Y, this.r, this.pk);
        let RS = Paillier.produitParScalaire(this.R, this.s, this.pk);

        // (x + r)(y + s) - sx - ry - rs
        return Paillier.hMinus(Paillier.hMinus(
            Paillier.hMinus(XY, SX, this.pk), RY, this.pk),
        RS, this.pk)
    }

};