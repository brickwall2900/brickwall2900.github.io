// ports of java.util.Random to TypeScript

const MULTIPLIER: bigint = 0X5DEECE66Dn
const ADDEND: bigint = 0xBn
const MASK: bigint = (1n << 48n) - 1n;

let seedUniquifier: bigint = 8682522807148012n;
function runSeedUniquifier(): bigint {
        let current: bigint = seedUniquifier;
        let next: bigint = seedUniquifier * 1181783497276652981n;
        seedUniquifier = next;
        return next;
}

function initialScramble(seed: bigint): bigint {
    return (seed ^ MULTIPLIER) & MASK;
}

function mathBigIntMin(a: bigint, b: bigint): bigint {
    return a > b ? b : a;
}

const INTEGER_SIZE: bigint = 32n;
const BYTE_SIZE: bigint = 8n;

// not thread safe
export class JavaRandom {
    constructor(seed?: bigint | number | undefined) {
        if (seed === undefined) {
            const milliseconds = BigInt(Math.round(performance.now() * 1e9));
            seed = runSeedUniquifier() ^ milliseconds;
        }

        if (typeof seed === "number") {
            seed = BigInt(seed);
        }

        this.#seed = initialScramble(seed);
    }

    setSeed(seed: bigint | number) {
        if (typeof seed === "number") {
            seed = BigInt(seed);
        }

        this.#seed = initialScramble(seed);
    }

    protected next(bits: bigint): bigint {
        const nextSeed = (this.#seed * MULTIPLIER + ADDEND) & MASK;
        this.#seed = nextSeed;

        const res = nextSeed >> (48n - bits);
        const mask = (1n << bits) - 1n;
        return res & mask;
    }

    nextInt(): bigint {
        return BigInt.asIntN(32, this.next(32n));
    }

    nextLong(): bigint {
        const high = BigInt.asIntN(32, this.next(32n));
        const low = BigInt.asIntN(32, this.next(32n));
        
        return BigInt.asIntN(64, (high << 32n) + low);
    }

    // the only one i need...
    nextUnsignedBytes(bytes: Uint8Array) {
        for (let i = 0, len = bytes.length; i < len; ) {
            for (let rnd = this.nextInt(), 
            n = mathBigIntMin(BigInt(len - i), INTEGER_SIZE / BYTE_SIZE);
            n-- > 0; rnd >>= BYTE_SIZE) {
                bytes[i++] = Number(BigInt.asUintN(8, rnd));
            }
        }
    }

    nextBytes(bytes: Int8Array) {
        for (let i = 0, len = bytes.length; i < len; ) {
            for (let rnd = this.nextInt(), 
            n = mathBigIntMin(BigInt(len - i), INTEGER_SIZE / BYTE_SIZE);
            n-- > 0; rnd >>= BYTE_SIZE) {
                bytes[i++] = Number(BigInt.asIntN(8, rnd));
            }
        }
    }

    #seed: bigint;
}