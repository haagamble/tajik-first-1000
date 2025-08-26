'use client';

import { useState } from 'react';
import Link from 'next/link';
import { levelWordLists, topicWordLists } from '../data/wordLists/index';
import { WordList } from '../types/vocab';

export default function HomePage() {
  const [selectedWordList, setSelectedWordList] = useState<WordList | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'levels' | 'topics'>('levels');

  const currentWordLists = activeTab === 'levels' ? levelWordLists : topicWordLists;

  const filteredWordLists = currentWordLists.filter((wordList: WordList) => {
    const matchesSearch = wordList.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (wordList.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
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
        <div className="text-center mb-3 sm:mb-5">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            🇹🇯 Tajik First 1000
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a word list, then select an activity.
          </p>
        </div>

        {/* Word List Selection */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-3 text-center">
            Select a Word List
          </h2>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-lg p-1 shadow-md inline-flex">
              <button
                onClick={() => {
                  setActiveTab('levels');
                  setSelectedWordList(null);
                  setSearchTerm('');
                }}
                className={`px-6 py-2 rounded-md transition-all font-medium ${activeTab === 'levels'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                Levels
              </button>
              <button
                onClick={() => {
                  setActiveTab('topics');
                  setSelectedWordList(null);
                  setSearchTerm('');
                }}
                className={`px-6 py-2 rounded-md transition-all font-medium ${activeTab === 'topics'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                Topics
              </button>
            </div>
          </div>

          {/* Search Controls. Maybe add later if needed*/}
          {/* <div className="flex justify-center mb-4">
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
            </div>
          </div> */}

          {/* Selected count display */}
          <p className="text-center text-gray-600 mb-4">
            {filteredWordLists.length} {activeTab === 'levels' ? 'levels' : 'topics'} available
            {selectedWordList && (
              <span className="text-blue-600 font-medium">
                {' '} • <strong>{selectedWordList.name}</strong> selected
              </span>
            )}
          </p>

          {/* Word List Grid - Compact design for mobile */}
          <div className="bg-white rounded-lg shadow-lg p-2 sm:p-4 max-h-60 sm:max-h-70 overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
              {filteredWordLists.map((wordList: WordList) => (
                <button
                  key={wordList.id}
                  onClick={() => setSelectedWordList(wordList)}
                  className={`p-2 sm:p-3 rounded-lg border-2 transition-all text-center text-sm font-medium min-h-[4rem] flex flex-col justify-center ${selectedWordList?.id === wordList.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700'
                    }`}
                >
                  <div className="font-semibold mb-1 text-center">
                    {wordList.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {wordList.words.length} words
                  </div>
                </button>
              ))}
            </div>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Choose an Activity
          </h2>
          {!selectedWordList && (
            <p className="text-center text-gray-500 mb-4 text-sm">
              👆 Select a word list above to enable activities
            </p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {activities.map((activity) => (
              <Link
                key={activity.name}
                href={activity.href}
                className={`block p-4 bg-white rounded-lg shadow-md transition-all text-center ${activity.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-lg hover:-translate-y-1 hover:bg-blue-50'
                  }`}
                onClick={(e) => {
                  if (activity.disabled) {
                    e.preventDefault();
                  }
                }}
              >
                <h3 className="text-sm font-semibold text-gray-800 mb-1">
                  {activity.name}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">{activity.description}</p>
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
