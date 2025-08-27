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

    // Helper function to get card styling based on level/topic
    const getCardStyling = (wordList: WordList, isSelected: boolean) => {
        let baseClasses = "group relative p-4 rounded-xl border transition-all duration-200 text-center font-medium min-h-[5rem] flex flex-col justify-center transform hover:scale-105 hover:-translate-y-1 cursor-pointer ";

        if (isSelected) {
            baseClasses += "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 shadow-lg shadow-blue-200/50 scale-105 ";
        } else {
            // Different colors based on level ranges or topics
            if (activeTab === 'levels') {
                const levelNum = parseInt(wordList.name.replace('Level ', ''));
                if (levelNum <= 7) {
                    baseClasses += "border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-150 text-green-700 shadow-md hover:shadow-lg hover:shadow-green-200/50 hover:border-green-300 ";
                } else if (levelNum <= 14) {
                    baseClasses += "border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150 text-blue-700 shadow-md hover:shadow-lg hover:shadow-blue-200/50 hover:border-blue-300 ";
                } else {
                    baseClasses += "border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-150 text-orange-700 shadow-md hover:shadow-lg hover:shadow-orange-200/50 hover:border-orange-300 ";
                }
            } else {
                baseClasses += "border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-150 text-purple-700 shadow-md hover:shadow-lg hover:shadow-purple-200/50 hover:border-purple-300 ";
            }
        }

        return baseClasses;
    };

    // Helper function to get level icon
    const getLevelIcon = (wordList: WordList) => {
        if (activeTab === 'topics') return '📚';

        const levelNum = parseInt(wordList.name.replace('Level ', ''));
        if (levelNum <= 7) return '🌱'; // Beginner
        if (levelNum <= 14) return '🌿'; // Intermediate  
        return '🌳'; // Advanced
    };

    const activities = [
        {
            name: '📚 Flashcards',
            description: 'Study words with interactive flashcards',
            href: selectedWordList ? `/flashcards/${selectedWordList.id}` : '#',
            disabled: !selectedWordList,
            gradient: 'from-indigo-50 to-indigo-100',
            hoverGradient: 'hover:from-indigo-100 hover:to-indigo-150',
            border: 'border-indigo-200 hover:border-indigo-300',
            text: 'text-indigo-700',
            shadow: 'shadow-md hover:shadow-lg hover:shadow-indigo-200/50'
        },
        {
            name: '🧠 Memory Game',
            description: 'Match Tajik words with English meanings',
            href: selectedWordList ? `/memory/${selectedWordList.id}` : '#',
            disabled: !selectedWordList,
            gradient: 'from-pink-50 to-pink-100',
            hoverGradient: 'hover:from-pink-100 hover:to-pink-150',
            border: 'border-pink-200 hover:border-pink-300',
            text: 'text-pink-700',
            shadow: 'shadow-md hover:shadow-lg hover:shadow-pink-200/50'
        },
        {
            name: '🔍 Word Search',
            description: 'Find hidden words in a grid',
            href: selectedWordList ? `/wordsearch/${selectedWordList.id}` : '#',
            disabled: !selectedWordList,
            gradient: 'from-emerald-50 to-emerald-100',
            hoverGradient: 'hover:from-emerald-100 hover:to-emerald-150',
            border: 'border-emerald-200 hover:border-emerald-300',
            text: 'text-emerald-700',
            shadow: 'shadow-md hover:shadow-lg hover:shadow-emerald-200/50'
        },
        {
            name: '❓ Quiz',
            description: 'Test your knowledge with multiple choice',
            href: selectedWordList ? `/quiz/${selectedWordList.id}` : '#',
            disabled: !selectedWordList,
            gradient: 'from-amber-50 to-amber-100',
            hoverGradient: 'hover:from-amber-100 hover:to-amber-150',
            border: 'border-amber-200 hover:border-amber-300',
            text: 'text-amber-700',
            shadow: 'shadow-md hover:shadow-lg hover:shadow-amber-200/50'
        }
    ];

    return (
        <div className="gradient-bg p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-3">
                    <h1 className="text-sky-100 font-bold mb-3 whitespace-nowrap" style={{ fontSize: 'clamp(1.25rem, 5vw, 2.25rem)' }}>
                        🇹🇯 Tajik First 1000 Words
                    </h1>
                    <p className="text-sky-100 text-lg max-w-2xl mx-auto">
                        Select a word list, then select an activity.
                    </p>
                </div>

                {/* Word List Selection */}
                <div className="mb-6">
                    <h2 className="text-sky-100 text-2xl font-bold mb-2 sm:mb-3 text-center">
                        Select a Word List
                    </h2>

                    {/* Tab Navigation - Enhanced with better styling */}
                    <div className="flex justify-center mb-4">
                        <div className="bg-white rounded-xl p-1.5 shadow-lg border border-gray-100 inline-flex">
                            <button
                                onClick={() => {
                                    setActiveTab('levels');
                                    setSelectedWordList(null);
                                    setSearchTerm('');
                                }}
                                className={`px-6 py-2.5 rounded-lg transition-all font-semibold text-sm ${activeTab === 'levels'
                                    ? 'bg-blue-500 text-white shadow-md transform scale-105'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
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
                                className={`px-6 py-2.5 rounded-lg transition-all font-semibold text-sm ${activeTab === 'topics'
                                    ? 'bg-blue-500 text-white shadow-md transform scale-105'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                            >
                                Topics
                            </button>
                        </div>
                    </div>

                    {/* Selected count display */}
                    <p className="text-sky-100 text-center mb-4">
                        {filteredWordLists.length} {activeTab === 'levels' ? 'levels' : 'topics'} available
                        {selectedWordList && (
                            <span className="text-blue-100 font-medium bg-blue-600/30 px-3 py-1 rounded-full ml-2 text-sm">
                                <strong>{selectedWordList.name}</strong> selected
                            </span>
                        )}
                    </p>

                    {/* Word List Grid - Modern card design */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 max-h-72 overflow-y-auto border border-white/20">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                            {filteredWordLists.map((wordList: WordList) => {
                                const isSelected = selectedWordList?.id === wordList.id;
                                return (
                                    <button
                                        key={wordList.id}
                                        onClick={() => setSelectedWordList(wordList)}
                                        className={getCardStyling(wordList, isSelected)}
                                    >
                                        {/* Level/Topic indicator with icon */}
                                        <div className="flex items-center justify-center mb-2">
                                            <span className="text-lg mr-1">{getLevelIcon(wordList)}</span>
                                            <div className="font-bold text-base">
                                                {wordList.name}
                                            </div>
                                        </div>

                                        {/* Word count with better styling */}
                                        <div className="flex items-center justify-center text-xs opacity-75">
                                            {/* <span className="mr-1">📝</span> */}
                                            {wordList.words.length} words
                                        </div>

                                        {/* Selection indicator */}
                                        {isSelected && (
                                            <div className="absolute top-2 right-2">
                                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs">✓</span>
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Activities - Enhanced card design */}
                <div className="mb-8">
                    <h2 className="text-sky-100 text-2xl font-bold mb-4 text-center">
                        Choose an Activity
                    </h2>
                    {!selectedWordList && (
                        <div className="text-center mb-4">
                            <div className="inline-flex items-center bg-sky-100/90 text-purple-800 px-4 py-2 rounded-xl text-sm font-medium border border-yellow-200">
                                <span className="mr-2">👆</span>
                                Select a word list above to enable activities
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {activities.map((activity) => (
                            <Link
                                key={activity.name}
                                href={activity.href}
                                className={`block relative p-6 rounded-xl border transition-all duration-200 text-center group ${activity.disabled
                                    ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200'
                                    : `bg-gradient-to-br ${activity.gradient} ${activity.hoverGradient} ${activity.border} ${activity.text} ${activity.shadow} hover:scale-105 hover:-translate-y-1`
                                    }`}
                                onClick={(e) => {
                                    if (activity.disabled) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <h3 className="font-bold text-base mb-2 group-hover:scale-110 transition-transform">
                                    {activity.name}
                                </h3>
                                <p className="text-sm leading-relaxed opacity-80">
                                    {activity.description}
                                </p>

                                {/* Hover effect indicator */}
                                {!activity.disabled && (
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-6 h-6 rounded-full bg-white/50 flex items-center justify-center">
                                            <span className="text-xs">→</span>
                                        </div>
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Instructions - Enhanced styling */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
                    <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3">💡</span>
                        <h3 className="!text-gray-800 text-xl font-bold">How to Use</h3>
                    </div>
                    <ol className="list-decimal list-inside space-y-3 text-gray-700">
                        <li className="flex items-start">
                            <span className="font-medium mr-2">1.</span>
                            <span>Select a word list from the options above. Both the topics option and the levels option contain all 1000 words.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-medium mr-2">2.</span>
                            <span>Choose an activity to practice with those words</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-medium mr-2">3.</span>
                            <span>Each activity will randomly select words from your chosen list</span>
                        </li>
                        <li className="flex items-start">
                            <span className="font-medium mr-2">4.</span>
                            <span>Practice regularly to improve your Tajik vocabulary!</span>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
}