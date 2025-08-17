import { VocabWord } from '../types/vocab';

/**
 * Randomly select a specified number of words from a word list
 */
export function selectRandomWords(words: VocabWord[], count: number): VocabWord[] {
    if (count >= words.length) {
        return words;
    }

    const shuffled = [...words].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

/**
 * Select words for quiz (10 questions)
 */
export function selectWordsForQuiz(words: VocabWord[]): VocabWord[] {
    return selectRandomWords(words, 10);
}

/**
 * Select words for word search (up to 15 words)
 */
export function selectWordsForWordSearch(words: VocabWord[]): VocabWord[] {
    const maxWords = Math.min(15, words.length);
    return selectRandomWords(words, maxWords);
}

/**
 * Select words for memory game (all words, but shuffled)
 */
export function selectWordsForMemory(words: VocabWord[]): VocabWord[] {
    return [...words].sort(() => Math.random() - 0.5);
}

/**
 * Select words for flashcards (all words, but shuffled)
 */
export function selectWordsForFlashcards(words: VocabWord[]): VocabWord[] {
    return [...words].sort(() => Math.random() - 0.5);
}


