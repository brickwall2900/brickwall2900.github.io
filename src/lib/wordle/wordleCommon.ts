export class WordleContext {
    #word: string;

    constructor (word: string) {
        if (word.length === 0) {
            throw new TypeError("Word with no letters");
        }

        this.#word = word.toUpperCase();
    }

    checkWord(input: string): WordleResult {
        if (input.length != this.#word.length) {
            throw new TypeError("Bad word length");
        }

        input = input.toUpperCase();

        const result: WordleResult = [];
        for (let i = 0; i < this.#word.length; i++) {
            const correctLetter = this.#word.charAt(i);
            const inputLetter = input.charAt(i);
            result.push(compareletter(this.#word, correctLetter, inputLetter));
        }

        return result;
    }

    getLetterCount(): number {
        return this.#word.length;
    }
}

function compareletter(word: string, correctLetter: string, inLetter: string) {
    if (correctLetter === inLetter) {
        return WordleLetterResult.CORRECT;
    } else if (word.indexOf(inLetter) !== -1) {
        return WordleLetterResult.FOUND;
    } else {
        return WordleLetterResult.BAD;
    }
}

export const WordleLetterResult = {
    CORRECT: 0,
    FOUND: 1,
    BAD: 2
} as const;

export type WordleLetterResult = typeof WordleLetterResult[keyof typeof WordleLetterResult];
export type WordleResult = [ WordleLetterResult? ];