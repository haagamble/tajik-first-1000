'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { VocabWord } from '../../../types/vocab';

interface FlashcardsGameProps {
    wordList: {
        id: string;
        name: string;
        description?: string;
        words: VocabWord[];
    };
}

type CardStack = 'study' | 'review';

export default function FlashcardsGame({ wordList }: FlashcardsGameProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [studyCards, setStudyCards] = useState<VocabWord[]>([]);
    const [reviewCards, setReviewCards] = useState<VocabWord[]>([]);
    const [learnedCards, setLearnedCards] = useState<VocabWord[]>([]);
    const [currentStack, setCurrentStack] = useState<CardStack>('study');
    const [mounted, setMounted] = useState(false);

    // Prevent hydration issues by only rendering after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Randomize the order of words when starting
        const shuffled = [...wordList.words].sort(() => Math.random() - 0.5);
        setStudyCards(shuffled);
        setReviewCards([]);
        setLearnedCards([]);
        setCurrentIndex(0);
        setIsFlipped(false);
    }, [wordList.words, mounted]);

    // Get current cards based on active stack
    const getCurrentCards = () => {
        switch (currentStack) {
            case 'study': return studyCards;
            case 'review': return reviewCards;
            default: return studyCards;
        }
    };

    const currentCards = getCurrentCards();

    const handleFlip = () => setIsFlipped((v) => !v);

    const handleRight = () => {
        if (currentCards.length === 0) return;

        const currentCard = currentCards[currentIndex];

        if (currentStack === 'study') {
            // Move from study to learned
            setStudyCards(prev => prev.filter((_, i) => i !== currentIndex));
            setLearnedCards(prev => [...prev, currentCard]);
        } else if (currentStack === 'review') {
            // Move from review to learned
            setReviewCards(prev => prev.filter((_, i) => i !== currentIndex));
            setLearnedCards(prev => [...prev, currentCard]);
        }

        // Move to next card or adjust index
        if (currentIndex >= currentCards.length - 1) {
            setCurrentIndex(Math.max(0, currentCards.length - 2));
        }
        setIsFlipped(false);
    };

    const handleWrong = () => {
        if (currentCards.length === 0) return;

        const currentCard = currentCards[currentIndex];

        if (currentStack === 'study') {
            // Move from study to review
            setStudyCards(prev => prev.filter((_, i) => i !== currentIndex));
            setReviewCards(prev => [...prev, currentCard]);
        }
        // If in review stack, card stays in review (no action needed)

        // Move to next card or adjust index
        if (currentIndex >= currentCards.length - 1) {
            setCurrentIndex(Math.max(0, currentCards.length - 2));
        }
        setIsFlipped(false);
    };

    const switchStack = (stack: CardStack) => {
        setCurrentStack(stack);
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    if (!mounted || (currentCards.length === 0 && currentStack === 'study' && studyCards.length === 0 && reviewCards.length === 0)) {
        return (
            <div className="gradient-bg p-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Word List Not Found</h1>
                    <Link href="/" className="text-blue-600 hover:underline">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    // Show completion message if all cards are learned
    if (studyCards.length === 0 && reviewCards.length === 0 && learnedCards.length > 0) {
        return (
            <div className="gradient-bg p-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-3xl font-bold text-green-800 mb-4">🎉 Congratulations!</h1>
                    <p className="text-lg text-gray-700 mb-6">
                        You&apos;ve learned all {learnedCards.length} words!
                    </p>
                    <Link href="/" className="text-blue-600 hover:underline">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    // Show message if current stack is empty but others have cards
    if (currentCards.length === 0) {
        return (
            <div className="gradient-bg p-4">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">📚 Flashcards</h1>
                        <Link href="/" className="text-blue-600 hover:underline text-sm">
                            ← Back to Home
                        </Link>
                    </div>

                    {/* Stack Navigation */}
                    <div className="flex justify-center space-x-4 mb-6">
                        <button
                            onClick={() => switchStack('study')}
                            className={`px-4 py-2 rounded-lg font-medium ${currentStack === 'study'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Study ({studyCards.length})
                        </button>
                        <button
                            onClick={() => switchStack('review')}
                            className={`px-4 py-2 rounded-lg font-medium ${currentStack === 'review'
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Review ({reviewCards.length})
                        </button>

                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            No cards in {currentStack} stack
                        </h2>
                        <p className="text-gray-600">
                            {currentStack === 'study' && 'Switch to Review to continue studying!'}
                            {currentStack === 'review' && 'Great! All review cards have been learned.'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const currentWord = currentCards[currentIndex];

    return (
        <div className="gradient-bg p-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">📚 Flashcards</h1>
                    {/* <p className="text-gray-600">
                        {currentIndex + 1} of {currentCards.length} cards in {currentStack} stack
                    </p> */}
                    <Link href="/" className="text-blue-600 hover:underline text-sm">
                        ← Back to Home
                    </Link>
                </div>

                {/* Stack Navigation */}
                <div className="flex justify-center space-x-4 mb-6">
                    <button
                        onClick={() => switchStack('study')}
                        className={`px-4 py-2 rounded-lg font-medium ${currentStack === 'study'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Study ({studyCards.length})
                    </button>
                    <button
                        onClick={() => switchStack('review')}
                        className={`px-4 py-2 rounded-lg font-medium ${currentStack === 'review'
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Review ({reviewCards.length})
                    </button>

                </div>

                <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
                    <div
                        className="text-center cursor-pointer min-h-[200px] flex flex-col justify-center"
                        onClick={handleFlip}
                    >
                        {!isFlipped ? (
                            <div>
                                <div className="text-6xl mb-4">🔄</div>
                                <p className="text-sm text-gray-500 mb-4">Click to reveal</p>
                                <h2 className="text-4xl font-bold text-gray-800 mb-2">{currentWord.tajik}</h2>
                                {currentWord.transliteration && (
                                    <p className="text-lg text-gray-600 italic">{currentWord.transliteration}</p>
                                )}
                            </div>
                        ) : (
                            <div>
                                <div className="text-6xl mb-4">✅</div>
                                <h3 className="text-2xl font-semibold text-gray-800 mb-4">{currentWord.english}</h3>
                                <p className="text-sm text-gray-500">Did you know this word?</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right/Wrong buttons - only show when flipped */}
                {isFlipped && (
                    <div className="flex justify-center space-x-6 mb-6">
                        <button
                            onClick={handleWrong}
                            className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 shadow-lg"
                        >
                            ❌ Wrong
                        </button>
                        <button
                            onClick={handleRight}
                            className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 shadow-lg"
                        >
                            ✅ Right
                        </button>
                    </div>
                )}

                {/* Progress */}
                <div className="bg-white rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                            <div className="text-blue-600 font-bold text-lg">{studyCards.length}</div>
                            <div className="text-gray-600">To Study</div>
                        </div>
                        <div>
                            <div className="text-orange-600 font-bold text-lg">{reviewCards.length}</div>
                            <div className="text-gray-600">To Review</div>
                        </div>
                        <div>
                            <div className="text-green-600 font-bold text-lg">{learnedCards.length}</div>
                            <div className="text-gray-600">Learned</div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Overall Progress</span>
                            <span>{Math.round((learnedCards.length / wordList.words.length) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(learnedCards.length / wordList.words.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


