const Paillier = require("./Paillier");
const bigInt = require('big-integer');

class Requester {
    constructor(i, keypairs) {
        this.keypairs = keypairs;
        this.i = i;
    }


    submitChoice() {
        let I = this.keypairs.encrypt(this.i);
        return { I, pk: this.keypairs.publicKey };
    }

    static result(R, keypairs) {
        return keypairs.decrypt(R);
    }
}


class Revealer {
    constructor(m0, m1) {
        this.m0 = m0;
        this.m1 = m1;
    }


    applyMask(pk, I) {

        const a0 = bigInt.randBetween(1, bigInt.one.shiftLeft(512) );
        const a1 = bigInt.randBetween(1, bigInt.one.shiftLeft(512) );

        const A0 = Paillier.encryptExternal(pk,0);
        const A1 = Paillier.encryptExternal(pk, -1);

        const N2 = pk.pow(2);

        const M0 =  bigInt(I).times(A0).modPow(a0, N2);
        const M1 =  bigInt(I).times(A1).modPow(a1, N2);

        const R0 = Paillier.encryptExternal(pk, this.m0).times(M0);
        const R1 = Paillier.encryptExternal(pk, this.m1).times(M1);

        return { R0, R1 }

    }
}

module.exports = { Requester, Revealer };