'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { VocabWord } from '../../../types/vocab';

interface Card {
    id: string;
    text: string;
    type: 'tajik' | 'english';
    pairId: string;
    isFlipped: boolean;
    isMatched: boolean;
}

interface MemoryGameProps {
    wordList: {
        id: string;
        name: string;
        description?: string;
        words: VocabWord[];
    };
}

export default function MemoryGame({ wordList }: MemoryGameProps) {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<Card[]>([]);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [moves, setMoves] = useState(0);
    const [mounted, setMounted] = useState(false);

    const initializeGame = useCallback(() => {
        // Shuffle words and take only 6 pairs
        const shuffledWords = [...wordList.words].sort(() => Math.random() - 0.5);
        const selectedWords = shuffledWords.slice(0, 6);

        const gameCards: Card[] = [];

        selectedWords.forEach((word, index) => {
            const pairId = `pair-${index}`;

            // Tajik card
            gameCards.push({
                id: `tajik-${index}`,
                text: word.tajik,
                type: 'tajik',
                pairId,
                isFlipped: false,
                isMatched: false,
            });

            // English card
            gameCards.push({
                id: `english-${index}`,
                text: word.english,
                type: 'english',
                pairId,
                isFlipped: false,
                isMatched: false,
            });
        });

        // Shuffle the cards
        const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
        setCards(shuffledCards);
        setFlippedCards([]);
        setMatchedPairs(0);
        setMoves(0);
    }, [wordList.words]);

    // Prevent hydration issues and auto-start game
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            initializeGame();
        }
    }, [mounted, initializeGame]);

    const handleCardClick = (clickedCard: Card) => {
        if (clickedCard.isFlipped || clickedCard.isMatched || flippedCards.length >= 2) {
            return;
        }

        const newFlippedCards = [...flippedCards, clickedCard];
        setFlippedCards(newFlippedCards);

        // Update cards to show this card as flipped
        setCards(prevCards =>
            prevCards.map(card =>
                card.id === clickedCard.id ? { ...card, isFlipped: true } : card
            )
        );

        if (newFlippedCards.length === 2) {
            setMoves(moves + 1);

            const [firstCard, secondCard] = newFlippedCards;

            if (firstCard.pairId === secondCard.pairId) {
                // Match found!
                setTimeout(() => {
                    setCards(prevCards =>
                        prevCards.map(card =>
                            card.pairId === firstCard.pairId
                                ? { ...card, isMatched: true, isFlipped: true }
                                : card
                        )
                    );
                    setMatchedPairs(matchedPairs + 1);
                    setFlippedCards([]);
                }, 1000);
            } else {
                // No match - flip cards back
                setTimeout(() => {
                    setCards(prevCards =>
                        prevCards.map(card =>
                            card.id === firstCard.id || card.id === secondCard.id
                                ? { ...card, isFlipped: false }
                                : card
                        )
                    );
                    setFlippedCards([]);
                }, 1500);
            }
        }
    };

    const resetGame = () => {
        initializeGame();
    };

    const isGameComplete = matchedPairs === 6;

    if (!mounted || cards.length === 0) {
        return (
            <div className="gradient-bg p-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-xl sm:text-2xl font-bold mb-4">Loading...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="gradient-bg p-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-6">
                    <h1 className="text-sky-100 text-3xl font-bold mb-2">🧠 Memory Game</h1>
                    {/* <h2 className="text-xl text-gray-600 mb-4">{wordList.name}</h2> */}
                    <Link href="/" className="text-blue-100 hover:underline text-sm">
                        ← Back to Home
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-lg px-2 sm:px-6 py-6 mb-6">
                    <div className="flex justify-between items-center text-center">
                        <div>
                            <div className="text-2xl font-bold text-purple-600">{moves}</div>
                            <div className="text-sm text-gray-600">Moves</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-green-600">{matchedPairs}/6</div>
                            <div className="text-sm text-gray-600">Pairs Found</div>
                        </div>
                        <button
                            onClick={resetGame}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            New Game
                        </button>
                    </div>
                </div>

                {isGameComplete && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 text-center">
                        <h3 className="!text-gray-800 text-xl font-bold mb-2">🎉 Congratulations!</h3>
                        <p className="!text-gray-800">You completed the game in {moves} moves!</p>
                    </div>
                )}

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {cards.map((card) => (
                        <div key={card.id} className="h-20 sm:h-24">
                            <div className="relative w-full h-full perspective-1000">
                                <div
                                    onClick={() => handleCardClick(card)}
                                    className={`absolute inset-0 w-full h-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
                                        }`}
                                >
                                    {/* Front of card (gradient design) */}
                                    <div className="absolute inset-0 w-full h-full backface-hidden">
                                        <div className="h-full bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-xl shadow-xl border border-white/20 flex items-center justify-center transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
                                            {/* Card pattern overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                                        </div>
                                    </div>

                                    {/* Back of card (word) */}
                                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                                        <div className={`h-full rounded-lg shadow-xl border-2 flex items-center justify-center p-3 text-center ${card.isMatched
                                            ? 'bg-gradient-to-br from-green-100 to-green-200 border-green-400'
                                            : card.type === 'tajik'
                                                ? 'bg-gradient-to-br from-purple-100 to-purple-200 border-purple-400'
                                                : 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-400'
                                            }`}>
                                            <div className="w-full">
                                                <div className={`text-base sm:text-lg font-bold ${card.isMatched
                                                    ? 'text-green-800'
                                                    : card.type === 'tajik'
                                                        ? 'text-purple-700 font-black'
                                                        : 'text-blue-700'
                                                    }`}>
                                                    {card.text}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
