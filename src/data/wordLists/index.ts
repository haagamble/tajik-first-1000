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
import adjectives1 from './adjectives1.json';
import adjectives2 from './adjectives2.json';
import adjectives3 from './adjectives3.json';
import adjectivesConjunctions from './adjectives-conjunctions.json';
import animals from './animals.json';
import body from './body.json';
import food1 from './food1.json';
import food2 from './food2.json';
import greetingsTravel from './greetings-travel.json';
import homeOffice1 from './home-office1.json';
import homeOffice2 from './home-office2.json';
import leisure from './leisure.json';
import natureWeather from './nature-weather.json';
import nouns1 from './nouns1.json';
import nouns2 from './nouns2.json';
import nouns3 from './nouns3.json';
import numbers from './numbers.json';
import people1 from './people1.json';
import people2 from './people2.json';
import places from './places.json';
import prepositionsPronouns from './prepositions-pronouns.json';
import timeDate from './time-date.json';
import verbs1 from './verbs1.json';
import verbs2 from './verbs2.json';
import verbs3 from './verbs-3.json';

// Level-based word lists - testing with fewer imports to isolate issue
import level01 from './level01.json';
import level02 from './level02.json';
import level03 from './level03.json';

// ============================================================================
// CATEGORIZED WORD LISTS
// ============================================================================

// Level-based word lists (testing with 3 levels)
export const levelWordLists: WordList[] = [
    level01 as unknown as WordList,
    level02 as unknown as WordList,
    level03 as unknown as WordList,
];

// Topic-based word lists (sorted alphabetically)
export const topicWordLists: WordList[] = [
    adjectives as unknown as WordList,
    adjectives1 as unknown as WordList,
    adjectives2 as unknown as WordList,
    adjectives3 as unknown as WordList,
    adjectivesConjunctions as unknown as WordList,
    animals as unknown as WordList,
    body as unknown as WordList,
    food1 as unknown as WordList,
    food2 as unknown as WordList,
    greetingsTravel as unknown as WordList,
    homeOffice1 as unknown as WordList,
    homeOffice2 as unknown as WordList,
    leisure as unknown as WordList,
    natureWeather as unknown as WordList,
    nouns1 as unknown as WordList,
    nouns2 as unknown as WordList,
    nouns3 as unknown as WordList,
    numbers as unknown as WordList,
    people1 as unknown as WordList,
    people2 as unknown as WordList,
    places as unknown as WordList,
    prepositionsPronouns as unknown as WordList,
    timeDate as unknown as WordList,
    verbs1 as unknown as WordList,
    verbs2 as unknown as WordList,
    verbs3 as unknown as WordList,
];

// Combined list for backward compatibility
export const wordLists: WordList[] = [
    ...levelWordLists,
    ...topicWordLists
];


