import { VocabWord, WordList } from '../types/vocab';

/**
 * Normalizes word list data to ensure all games work with both old and new formats
 */
export function normalizeWordList(wordList: WordList): {
    id: string;
    name: string;
    description?: string;
    words: VocabWord[];
} {
    const normalizedWords: VocabWord[] = wordList.words.map((word, index) => {
        if (Array.isArray(word)) {
            // New simplified format: [tajik, english] or [tajik, english, transliteration]
            return {
                id: String(index + 1),
                tajik: word[0],
                english: word[1],
                transliteration: word[2] || undefined
            };
        } else {
            // Old format: already a VocabWord object
            return word;
        }
    });

    return {
        id: wordList.id,
        name: wordList.name,
        description: wordList.description,
        words: normalizedWords
    };
}
