const vowels = /[аеёиоуыэюя]/gi;
const deaf = "длкпстфхцчшщДЛКПСТФХЦЧШЩ";
const signs = ["ь", "ъ", "Ь", "Ъ"];
const voiced = ["м", "р", "л", "н", "М", "Р", "Л", "Н"];

const splitLines = (source: string) => {
    return source.split("\n");
};

const joinLines = (lines: string[]) => {
    return lines.join("\n");
};

const splitWords = (source: string) => {
    return source.split(" ");
};

const joinWords = (words: string[]) => {
    return words.join(" ");
};

const addSyllable = (collection: string[], syllable: string) => {
    collection.push(syllable);
};

const indexSign = (letters: string[]) => {
    let index = -1;
    signs.some((letter) => {
        index = letters.indexOf(letter);
        return index !== -1;
    });
    return index;
};

const indexYoy = (letters: string[]) => {
    const index = letters.indexOf("й");

    if (index !== -1) {
        return index;
    }
    return -1;
};

const indexSonoric = (letters: string[]) => {
    let index = -1;

    voiced.some((letter) => {
        index = letters.indexOf(letter);
        return index !== -1;
    });

    if (index !== -1) {
        const nextLetter = letters[index + 1];
        if (deaf.indexOf(nextLetter) === -1) {
            return -1;
        }
    }

    return index;
};

const _syllabifyWord = (word: string, { separator = "·" } = {}) => {
    const collection: string[] = [];

    const vowelsMatches = word.match(vowels);

    if (!vowelsMatches) {
        return word;
    }

    const letters = (word.match(/[a-яё]/gi) as string[]) || [];

    let skip = 0;
    let currentSyllable = "";
    let currentSyllableCount = 0;
    let isWordEnd = false;
    let isLastSyllable = false;

    const len = letters?.length || 0;

    letters.forEach((letter, index) => {
        if (skip) {
            return skip--;
        }

        currentSyllable += letter;

        isWordEnd = index + 1 === len;
        isLastSyllable = vowelsMatches.length - collection.length === 1;

        if (isLastSyllable) {
            return isWordEnd ? addSyllable(collection, currentSyllable) : null;
        }

        if (vowels.test(letter)) {
            vowels.lastIndex = 0;
            currentSyllableCount++;

            const nextVowel = vowelsMatches[currentSyllableCount];
            if (!nextVowel) return;

            const nextWovelIndex = letters.indexOf(nextVowel, index + 1);
            if (nextWovelIndex === -1) return;

            const between = letters.slice(index + 1, nextWovelIndex);

            let indexSlice = -1;

            indexSlice = indexSign(between);

            if (indexSlice === -1) {
                indexSlice = indexYoy(between);
            }

            if (indexSlice === -1) {
                indexSlice = indexSonoric(between);
            }

            if (indexSlice !== -1) {
                const sufix = between.slice(0, indexSlice + 1);
                currentSyllable += sufix.join("");
                skip = sufix.length;
            }

            addSyllable(collection, currentSyllable);
            currentSyllable = "";
        }
    });

    return word.replace(/[а-яё]+/i, collection.join(separator));
};

export const syllabifyWord = (word: string, { separator = "·" } = {}) => {
    return word
        .split("-")
        .map((word_) => _syllabifyWord(word_, { separator }))
        .join("-");
};

export const syllabify = (source: string, { separator = "·" } = {}) => {
    const lines = splitLines(source);
    const modifyLines = lines.map((line) => {
        const words = splitWords(line);
        const syllabifyedWords = words.map((word) =>
            syllabifyWord(word, { separator })
        );
        return joinWords(syllabifyedWords);
    });
    return joinLines(modifyLines);
};

