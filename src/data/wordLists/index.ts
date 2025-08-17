import { WordList } from '../../types/vocab';

// ============================================================================
// INSTRUCTIONS FOR ADDING YOUR WORD LISTS:
// ============================================================================
// 1. Place your JSON files in this folder (src/data/wordLists/)
// 2. Each file should follow the format shown in sample-structure.json
// 3. Uncomment and modify the import statements below
// 4. Remove the sample data section
// ============================================================================

// Import your JSON word list files here:
import adjectives from './adjectives.json';
// import basicGreetings from './basic-greetings.json';
// import numbers from './numbers.json';
// import family from './family.json';
// import colors from './colors.json';
// import food from './food.json';
// import animals from './animals.json';
// import body from './body.json';
// import weather from './weather.json';
// import time from './time.json';
// import directions from './directions.json';
// import emotions from './emotions.json';
// import professions from './professions.json';

// ============================================================================
// SAMPLE DATA (remove this when you add your own files)
// ============================================================================
export const wordLists: WordList[] = [
    {
        id: 'basic-greetings',
        name: 'Basic Greetings',
        description: 'Essential greetings and common phrases',
        words: [
            { id: '1', tajik: 'Салом', english: 'Hello', transliteration: 'Salom' },
            { id: '2', tajik: 'Хайр', english: 'Goodbye', transliteration: 'Khayr' },
            { id: '3', tajik: 'Рахмат', english: 'Thank you', transliteration: 'Rahmat' },
            { id: '4', tajik: 'Бехтар', english: 'Better', transliteration: 'Behtar' },
            { id: '5', tajik: 'Ном', english: 'Name', transliteration: 'Nom' },
        ]
    },
    {
        id: 'numbers',
        name: 'Numbers 1-10',
        description: 'Counting from one to ten',
        words: [
            { id: '6', tajik: 'Як', english: 'One', transliteration: 'Yak' },
            { id: '7', tajik: 'Ду', english: 'Two', transliteration: 'Du' },
            { id: '8', tajik: 'Се', english: 'Three', transliteration: 'Se' },
            { id: '9', tajik: 'Чор', english: 'Four', transliteration: 'Chor' },
            { id: '10', tajik: 'Панҷ', english: 'Five', transliteration: 'Panj' },
        ]
    },
    // Add your adjectives list
    adjectives
];

// ============================================================================
// UNCOMMENT THIS SECTION WHEN YOU HAVE YOUR JSON FILES:
// ============================================================================
/*
export const wordLists: WordList[] = [
  adjectives,
  basicGreetings,
  numbers,
  family,
  colors,
  food,
  animals,
  body,
  weather,
  time,
  directions,
  emotions,
  professions
];
*/
