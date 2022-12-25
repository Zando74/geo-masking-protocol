const bigInt = require('big-integer');

generateRandomPrime = () => {
    return new Promise( (res, rej) => {
        let randomNumber = bigInt.randBetween(bigInt.one, bigInt.one.shiftLeft(512) );
        while (!bigInt(randomNumber).isPrime()) {
            randomNumber = bigInt.randBetween(bigInt.one, bigInt.one.shiftLeft(512) );
        }
        res(randomNumber)
    })
    
}

class Paillier {

    publicKey;
    privateKey;
    r;


    genKeys = async () => {

        let p = 0;
        let q = 0;

        while(p == q) {
            await Promise.all([
                generateRandomPrime().then(res => p = res),
                generateRandomPrime().then(res => q = res)
            ]);
        }

        const N = bigInt(p).times(q);

        const phi = bigInt(N).minus(p).minus(q).plus(1)

        this.publicKey = bigInt(N);
        this.privateKey = bigInt(N).modInv(phi);
        
        this.r = bigInt.randBetween(1, this.publicKey-1 );

    };

    static encryptExternal = (pk, m, r) => {
        if(!r){
            r = bigInt.randBetween(1, pk-1 );
        }
        const N2 = bigInt(pk).pow(2);
        const c = (
            ((bigInt(m).times(pk)).add(1))
            .times(r.modPow(pk,N2))).mod(N2)

        return bigInt(c)
    }

    encryptWithFixedR = (m) => {

        const N2 = bigInt(this.publicKey).pow(2);
        const c = (
            ((bigInt(m).times(this.publicKey)).add(1))
            .times(this.r.modPow(this.publicKey,N2))).mod(N2)

        return bigInt(c)
    }

    encrypt = (m) => {
        const r = bigInt.randBetween(1, this.publicKey-1 );

        const N2 = bigInt(this.publicKey).pow(2);
        const c = (
            ((bigInt(m).times(this.publicKey)).add(1))
            .times(r.modPow(this.publicKey,N2))).mod(N2)

        return bigInt(c)
    }

    decrypt = (c) => {
        const N2 = bigInt(this.publicKey).times(this.publicKey);

        const r = bigInt(c).modPow(this.privateKey,this.publicKey);

        const s = bigInt(r).modInv(this.publicKey);

        const e = bigInt(s).modPow(this.publicKey, N2)
        
        const m = ((bigInt(c).times(e)).mod(N2).minus(1)).divide(this.publicKey);

        return bigInt(m)
    }

    // addition homomorphe retourne -> Chiffré de x + y
    static hAdd(X,Y, pk) {
        const N2 = bigInt(pk).pow(2);
        return bigInt(X).times(bigInt(Y)).mod(N2);
    }

    // soustraction homomorphe retourne -> Chiffré de x - y
    static hMinus(X, Y, pk) {
        const N2 = bigInt(pk).pow(2);
        return bigInt(X).times(bigInt(Y).modInv(N2)).mod(N2);
    }

    // produit par scalaire retourne -> chiffré de (x * y)
    static produitParScalaire(X, y, pk) {
        return bigInt(X).modPow(y, bigInt(pk).pow(2));
    }

    // inverse de X retourne -> X^-1
    static inverse(X, pk) {
        return bigInt(X).modInv(bigInt(pk).pow(2));
    }

}


module.exports = Paillier;