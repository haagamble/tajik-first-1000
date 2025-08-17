'use client';

import { useState } from 'react';
import Link from 'next/link';
import { wordLists } from '../data/wordLists';
import { WordList } from '../types/vocab';

export default function HomePage() {
  const [selectedWordList, setSelectedWordList] = useState<WordList | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWordLists = wordLists.filter(wordList => {
    const matchesSearch = wordList.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wordList.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const activities = [
    {
      name: '📚 Flashcards',
      description: 'Study words with interactive flashcards',
      href: selectedWordList ? `/flashcards/${selectedWordList.id}` : '#',
      disabled: !selectedWordList
    },
    {
      name: '🧠 Memory Game',
      description: 'Match Tajik words with English meanings',
      href: selectedWordList ? `/memory/${selectedWordList.id}` : '#',
      disabled: !selectedWordList
    },
    {
      name: '🔍 Word Search',
      description: 'Find hidden words in a grid',
      href: selectedWordList ? `/wordsearch/${selectedWordList.id}` : '#',
      disabled: !selectedWordList
    },
    {
      name: '❓ Quiz',
      description: 'Test your knowledge with multiple choice',
      href: selectedWordList ? `/quiz/${selectedWordList.id}` : '#',
      disabled: !selectedWordList
    }
  ];

  return (
    <div className="gradient-bg p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🇹🇯 Tajik Vocabulary Practice
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn Tajik language through interactive activities. Select a word list to get started!
          </p>
        </div>

        {/* Word List Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Select a Word List ({filteredWordLists.length} available)
          </h2>

          {/* Search Controls */}
          <div className="flex justify-center mb-6">
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="Search word lists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
            </div>
          </div>

          {/* Word List Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWordLists.map((wordList) => (
              <div
                key={wordList.id}
                onClick={() => setSelectedWordList(wordList)}
                className={`p-4 rounded-lg border-2 transition-all text-left cursor-pointer ${selectedWordList?.id === wordList.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
              >
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{wordList.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{wordList.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {wordList.words.length} words
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Word List Display */}
        {/* {selectedWordList && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Selected: {selectedWordList.name}
            </h3>
            <p className="text-gray-600 mb-4">{selectedWordList.description}</p>
            <div className="flex flex-wrap gap-2">
              {selectedWordList.words.slice(0, 10).map((word) => (
                <span
                  key={word.id}
                  className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {word.tajik} ({word.english})
                </span>
              ))}
              {selectedWordList.words.length > 10 && (
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  +{selectedWordList.words.length - 10} more
                </span>
              )}
            </div>
          </div>
        )} */}

        {/* Activities */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Choose an Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {activities.map((activity) => (
              <Link
                key={activity.name}
                href={activity.href}
                className={`block p-6 bg-white rounded-lg shadow-lg transition-all ${activity.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-xl hover:-translate-y-1'
                  }`}
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {activity.name}
                  </h3>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">How to Use</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Select a word list from the options above</li>
            <li>Choose an activity to practice with those words</li>
            <li>Each activity will randomly select words from your chosen list</li>
            <li>Practice regularly to improve your Tajik vocabulary!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
