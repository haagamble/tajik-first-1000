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
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Loading...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="gradient-bg p-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">🧠 Memory Game</h1>
                    <h2 className="text-xl text-gray-600 mb-4">{wordList.name}</h2>
                    <Link href="/" className="text-blue-600 hover:underline text-sm">
                        ← Back to Home
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
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
                        <h3 className="text-xl font-bold mb-2">🎉 Congratulations!</h3>
                        <p>You completed the game in {moves} moves!</p>
                    </div>
                )}

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {cards.map((card) => (
                        <div
                            key={card.id}
                            onClick={() => handleCardClick(card)}
                            className={`
                                h-20 sm:h-24 bg-white rounded-lg shadow-lg transition-all duration-300 cursor-pointer
                                flex items-center justify-center p-3 text-center
                                ${card.isFlipped || card.isMatched ? 'shadow-xl' : 'hover:shadow-xl'}
                                ${card.isMatched ? 'bg-green-100 border-2 border-green-400' : ''}
                                ${flippedCards.includes(card) && !card.isMatched ? 'bg-blue-100 border-2 border-blue-400' : ''}
                            `}
                        >
                            {card.isFlipped || card.isMatched ? (
                                <div className="w-full">
                                    <div className={`text-sm sm:text-base font-semibold ${card.type === 'tajik' ? 'text-purple-700' : 'text-blue-700'}`}>
                                        {card.text}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-2xl sm:text-3xl">❓</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
