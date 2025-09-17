'use client';

import { useEffect, useState, useRef } from 'react';
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
type CardDirection = 'tajik-to-english' | 'english-to-tajik';

export default function FlashcardsGame({ wordList }: FlashcardsGameProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [studyCards, setStudyCards] = useState<VocabWord[]>([]);
    const [reviewCards, setReviewCards] = useState<VocabWord[]>([]);
    const [learnedCards, setLearnedCards] = useState<VocabWord[]>([]);
    const [currentStack, setCurrentStack] = useState<CardStack>('study');
    const [mounted, setMounted] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isFlipping, setIsFlipping] = useState(false);
    const [cardDirection, setCardDirection] = useState<CardDirection>('tajik-to-english');

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

    const handleFlip = () => {
        if (isTransitioning || isFlipping) return; // Don't flip if transitioning or already flipping

        setIsFlipping(true);
        setIsFlipped((v) => !v);

        // Reset flipping state after animation completes
        setTimeout(() => {
            setIsFlipping(false);
        }, 700); // Full flip animation duration
    };

    const handleRight = () => {
        if (currentCards.length === 0 || isTransitioning || isFlipping) return;

        setIsTransitioning(true);
        const currentCard = currentCards[currentIndex];
        const currentLength = currentCards.length;
        const currentIndexValue = currentIndex;

        // Flip card back first
        setIsFlipped(false);

        // Wait for flip animation to complete, then update state
        setTimeout(() => {
            // Update card arrays
            if (currentStack === 'study') {
                setStudyCards(prev => prev.filter((_, i) => i !== currentIndexValue));
                setLearnedCards(prev => [...prev, currentCard]);
            } else if (currentStack === 'review') {
                setReviewCards(prev => prev.filter((_, i) => i !== currentIndexValue));
                setLearnedCards(prev => [...prev, currentCard]);
            }

            // Update index
            const newLength = currentLength - 1;
            if (newLength > 0) {
                if (currentIndexValue >= newLength) {
                    setCurrentIndex(newLength - 1);
                }
                // If currentIndexValue < newLength, it stays the same (next card slides into position)
            } else {
                setCurrentIndex(0);
            }

            setIsTransitioning(false);
        }, 350); // Half of the 700ms flip animation
    };

    const handleWrong = () => {
        if (currentCards.length === 0 || isTransitioning || isFlipping) return;

        setIsTransitioning(true);
        const currentCard = currentCards[currentIndex];
        const currentLength = currentCards.length;
        const currentIndexValue = currentIndex;

        // Flip card back first
        setIsFlipped(false);

        // Wait for flip animation to complete, then update state
        setTimeout(() => {
            // Update card arrays
            if (currentStack === 'study') {
                setStudyCards(prev => prev.filter((_, i) => i !== currentIndexValue));
                setReviewCards(prev => [...prev, currentCard]);
            } else if (currentStack === 'review') {
                setReviewCards(prev => {
                    const newReview = prev.filter((_, i) => i !== currentIndexValue);
                    return [...newReview, currentCard]; // Add to end
                });
            }

            // Update index - use same logic for both stacks
            if (currentStack === 'study') {
                // Study stack: card was removed, so length decreased by 1
                const newLength = currentLength - 1;
                if (newLength > 0) {
                    if (currentIndexValue >= newLength) {
                        setCurrentIndex(newLength - 1);
                    }
                    // If currentIndexValue < newLength, it stays the same (next card slides into position)
                } else {
                    setCurrentIndex(0);
                }
            } else if (currentStack === 'review') {
                // Review stack: card was moved to bottom, so length stays the same
                // Stay at same index (next card slides into this position)
                if (currentIndexValue >= currentLength - 1) {
                    setCurrentIndex(0); // Wrap to beginning if we were at the last card
                }
                // If currentIndexValue < currentLength - 1, stay at same index
            }

            setIsTransitioning(false);
        }, 350); // Half of the 700ms flip animation
    };

    const switchStack = (stack: CardStack) => {
        setCurrentStack(stack);
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    const switchDirection = (direction: CardDirection) => {
        setCardDirection(direction);
        setIsFlipped(false); // Reset flip state but preserve everything else
    };

    if (!mounted || (currentCards.length === 0 && currentStack === 'study' && studyCards.length === 0 && reviewCards.length === 0 && learnedCards.length === 0)) {
        return (
            <div className="gradient-bg p-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-sky-100 text-2xl font-bold mb-4">Word List Not Found</h1>
                    <Link href="/" className="text-blue-100 hover:underline">
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
                    <h1 className="text-gray-800 text-3xl font-bold text-green-800 mb-4">🎉 Congratulations!</h1>
                    <p className="!text-gray-800 text-lg mb-6">
                        You&apos;ve learned all {learnedCards.length} words!
                    </p>
                    <Link href="/" className="text-blue-100 hover:underline">
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
                        <h1 className="text-sky-100 text-3xl font-bold mb-2">📚 Flashcards</h1>
                        <Link href="/" className="text-blue-100 hover:underline text-sm">
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

                    {/* Direction Toggle */}
                    <div className="flex justify-center space-x-2 mb-6">
                        <button
                            onClick={() => switchDirection('tajik-to-english')}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${cardDirection === 'tajik-to-english'
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Tajik → English
                        </button>
                        <button
                            onClick={() => switchDirection('english-to-tajik')}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${cardDirection === 'english-to-tajik'
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            English → Tajik
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-6">
                        <h2 className="text-gray-800 text-xl font-semibold mb-4">
                            No cards in {currentStack} stack
                        </h2>
                        <p className="!text-gray-800">
                            {currentStack === 'study' && 'Switch to Review to continue studying!'}
                            {currentStack === 'review' && 'Great! All review cards have been learned.'}
                        </p>
                    </div>

                    {/* Progress - Always show */}
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

    const currentWord = currentCards[currentIndex];

    return (
        <div className="gradient-bg p-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6">
                    <h1 className="text-sky-100 text-3xl font-bold mb-2">📚 Flashcards</h1>
                    {/* <p className="text-gray-600">
                        {currentIndex + 1} of {currentCards.length} cards in {currentStack} stack
                    </p> */}
                    <Link href="/" className="text-blue-100 hover:underline text-sm">
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

                {/* Direction Toggle */}
                <div className="flex justify-center space-x-2 mb-6">
                    <button
                        onClick={() => switchDirection('tajik-to-english')}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${cardDirection === 'tajik-to-english'
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Tajik → English
                    </button>
                    <button
                        onClick={() => switchDirection('english-to-tajik')}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${cardDirection === 'english-to-tajik'
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        English → Tajik
                    </button>
                </div>

                {/* 3D Flip Card */}
                <div className="mb-6">
                    <div className="relative h-80 perspective-1000">
                        <div
                            className={`absolute inset-0 w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''
                                }`}
                        >
                            {/* Front of card */}
                            <div className="absolute inset-0 w-full h-full backface-hidden">
                                <div
                                    className={`h-full bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl border border-blue-100 flex flex-col justify-center items-center p-8 transform hover:scale-105 transition-transform ${(isTransitioning || isFlipping) ? 'cursor-default' : 'cursor-pointer'}`}
                                    onClick={!(isTransitioning || isFlipping) ? handleFlip : undefined}
                                >
                                    <div className="text-center mb-6">
                                        <div className="text-5xl md:text-6xl font-black !text-gray-800 mb-4">
                                            {cardDirection === 'tajik-to-english' ? currentWord.tajik : currentWord.english}
                                        </div>
                                        {cardDirection === 'tajik-to-english' && currentWord.transliteration && (
                                            <div className="text-lg text-blue-600 font-medium">
                                                /{currentWord.transliteration}/
                                            </div>
                                        )}
                                    </div>

                                    <div className="absolute bottom-6 text-blue-400 text-sm">
                                        🔄 Tap to reveal meaning
                                    </div>
                                </div>
                            </div>

                            {/* Back of card */}
                            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                                <div className="h-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-2xl border border-green-100 flex flex-col justify-center items-center p-8">
                                    <div className="text-center mb-8">
                                        <div className="text-3xl md:text-4xl font-bold !text-gray-800 mb-2">
                                            {cardDirection === 'tajik-to-english' ? currentWord.english : currentWord.tajik}
                                        </div>
                                        <div className="text-lg text-green-600 font-medium">
                                            {cardDirection === 'tajik-to-english' ? currentWord.tajik : currentWord.english}
                                        </div>
                                    </div>

                                    <div className="flex space-x-4">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleWrong(); }}
                                            disabled={isTransitioning || isFlipping}
                                            className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all transform ${(isTransitioning || isFlipping)
                                                ? 'bg-gray-400 text-gray-200'
                                                : 'bg-red-500 hover:bg-red-600 text-white hover:scale-105'
                                                }`}
                                        >
                                            {/* <span className="text-lg">❌</span> */}
                                            <span>Hard</span>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleRight(); }}
                                            disabled={isTransitioning || isFlipping}
                                            className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all transform ${(isTransitioning || isFlipping)
                                                ? 'bg-gray-400 text-gray-200'
                                                : 'bg-green-500 hover:bg-green-600 text-white hover:scale-105'
                                                }`}
                                        >
                                            {/* <span className="text-lg">✅</span> */}
                                            <span>Easy</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



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