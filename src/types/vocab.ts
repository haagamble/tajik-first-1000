export interface VocabWord {
    id: string;
    tajik: string;
    english: string;
    transliteration?: string;
    category?: string;
    level?: string; // Added for difficulty levels within word lists
}

export interface WordList {
    id: string;
    name: string;
    description: string;
    words: VocabWord[];
    // Removed difficulty field - using individual word levels instead
}

export interface GameState {
    currentWordList: WordList | null;
    score: number;
    currentQuestion: number;
    totalQuestions: number;
}
