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

// Level-based word lists
import level01 from './level01.json';
import level02 from './level02.json';
import level03 from './level03.json';
import level04 from './level04.json';
import level05 from './level05.json';
import level06 from './level06.json';
import level07 from './level07.json';
import level08 from './level08.json';
import level09 from './level09.json';
import level10 from './level10.json';
import level11 from './level11.json';
import level12 from './level12.json';
import level13 from './level13.json';
import level14 from './level14.json';
import level15 from './level15.json';
import level16 from './level16.json';
import level17 from './level17.json';
import level18 from './level18.json';
import level19 from './level19.json';
import level20 from './level20.json';

// ============================================================================
// CATEGORIZED WORD LISTS
// ============================================================================

// Level-based word lists (sorted by level)
export const levelWordLists: WordList[] = [
    level01 as WordList,
    level02 as WordList,
    level03 as WordList,
    level04 as WordList,
    level05 as WordList,
    level06 as WordList,
    level07 as WordList,
    level08 as WordList,
    level09 as WordList,
    level10 as WordList,
    level11 as WordList,
    level12 as WordList,
    level13 as WordList,
    level14 as WordList,
    level15 as WordList,
    level16 as WordList,
    level17 as WordList,
    level18 as WordList,
    level19 as WordList,
    level20 as WordList
];

// Topic-based word lists (sorted alphabetically)
export const topicWordLists: WordList[] = [
    adjectives as WordList,
    adjectives1 as WordList,
    adjectives2 as WordList,
    adjectives3 as WordList,
    adjectivesConjunctions as WordList,
    animals as WordList,
    body as WordList,
    food1 as WordList,
    food2 as WordList,
    greetingsTravel as WordList,
    homeOffice1 as WordList,
    homeOffice2 as WordList,
    leisure as WordList,
    natureWeather as WordList,
    nouns1 as WordList,
    nouns2 as WordList,
    nouns3 as WordList,
    numbers as WordList,
    people1 as WordList,
    people2 as WordList,
    places as WordList,
    prepositionsPronouns as WordList,
    timeDate as WordList,
    verbs1 as WordList,
    verbs2 as WordList,
    verbs3 as WordList
];

// Combined list for backward compatibility
export const wordLists: WordList[] = [
    ...levelWordLists,
    ...topicWordLists
];


