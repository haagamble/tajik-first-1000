#!/usr/bin/env node

/**
 * Utility script to convert JSON word lists into the proper format for the Tajik Vocab App
 * 
 * Usage: node scripts/import-words.js path/to/your/words.json
 */

const fs = require('fs');
const path = require('path');

function convertWordList(inputPath, outputPath) {
    try {
        // Read the input JSON file
        const inputData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

        // Convert to the expected format
        const convertedData = {
            id: inputData.id || generateId(inputData.name || 'word-list'),
            name: inputData.name || 'Imported Word List',
            description: inputData.description || 'Words imported from external source',
            difficulty: inputData.difficulty || 'beginner',
            words: inputData.words.map((word, index) => ({
                id: word.id || String(index + 1),
                tajik: word.tajik || word.tajik_word || word.word,
                english: word.english || word.english_word || word.translation,
                transliteration: word.transliteration || word.translit || null,
                category: word.category || null
            }))
        };

        // Write the converted data
        fs.writeFileSync(outputPath, JSON.stringify(convertedData, null, 2));

        console.log(`✅ Successfully converted ${inputPath} to ${outputPath}`);
        console.log(`📝 Found ${convertedData.words.length} words`);

    } catch (error) {
        console.error('❌ Error converting word list:', error.message);
        process.exit(1);
    }
}

function generateId(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

function showUsage() {
    console.log(`
📚 Tajik Vocab App - Word List Converter

Usage: node scripts/import-words.js <input-file> [output-file]

Arguments:
  input-file    Path to your JSON word list file
  output-file   Optional: Path for the converted file (default: input-converted.json)

Example:
  node scripts/import-words.js my-words.json
  node scripts/import-words.js my-words.json converted-words.json

Input JSON format should have:
  - name: Display name for the word list
  - description: Description of the word list
  - difficulty: "beginner", "intermediate", or "advanced"
  - words: Array of word objects with tajik, english, etc.

Output will be saved in the proper format for the Tajik Vocab App.
`);
}

// Main execution
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        showUsage();
        process.exit(0);
    }

    const inputPath = args[0];
    const outputPath = args[1] || inputPath.replace('.json', '-converted.json');

    if (!fs.existsSync(inputPath)) {
        console.error(`❌ Input file not found: ${inputPath}`);
        process.exit(1);
    }

    convertWordList(inputPath, outputPath);
}

module.exports = { convertWordList };

