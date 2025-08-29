'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { VocabWord } from '../../../types/vocab';
import { selectWordsForQuiz } from '../../../utils/wordSelection';

interface Question {
    word: VocabWord;
    options: string[];
    correctAnswer: string;
}

interface QuizGameProps {
    wordList: {
        id: string;
        name: string;
        description?: string;
        words: VocabWord[];
    };
}

export default function QuizGame({ wordList }: QuizGameProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [mounted, setMounted] = useState(false);

    const initializeQuiz = useCallback((words: VocabWord[]) => {
        const quizQuestions: Question[] = words.map(word => {
            // Get 3 random wrong answers from the same word list
            const wrongAnswers = wordList.words
                .filter(w => w.id !== word.id)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
                .map(w => w.english);

            // Add correct answer and shuffle
            const options = [...wrongAnswers, word.english].sort(() => Math.random() - 0.5);

            return {
                word,
                options,
                correctAnswer: word.english
            };
        });

        // Shuffle questions
        const shuffledQuestions = quizQuestions.sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
    }, [wordList.words]);

    // Prevent hydration issues by only rendering after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Select 10 random words for the quiz
        const selectedWords = selectWordsForQuiz(wordList.words);
        initializeQuiz(selectedWords);
    }, [wordList.words, mounted, initializeQuiz]);

    const handleAnswerSelect = (answer: string) => {
        if (isAnswered) return;

        setSelectedAnswer(answer);
        setIsAnswered(true);

        if (answer === questions[currentQuestionIndex].correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            setQuizCompleted(true);
        }
    };

    const resetQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setScore(0);
        setQuizCompleted(false);
        // Select 10 new random words for the quiz
        const selectedWords = selectWordsForQuiz(wordList.words);
        initializeQuiz(selectedWords);
    };

    if (!mounted || questions.length === 0) {
        return (
            <div className="gradient-bg p-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-sky-100 text-2xl font-bold mb-4">Loading Quiz...</h1>
                </div>
            </div>
        );
    }

    if (quizCompleted) {
        const percentage = Math.round((score / questions.length) * 100);
        const getMessage = () => {
            if (percentage >= 90) return "Excellent! You're a Tajik master! 🎉";
            if (percentage >= 80) return "Great job! You're doing really well! 👏";
            if (percentage >= 70) return "Good work! Keep practicing! 💪";
            if (percentage >= 60) return "Not bad! A bit more practice will help! 📚";
            return "Keep studying! Practice makes perfect! 📖";
        };

        return (
            <div className="gradient-bg p-4">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-6">
                        <h1 className="text-sky-100 text-3xl font-bold mb-2">🎯 Quiz Complete!</h1>
                        <Link href="/" className="text-blue-100 hover:underline text-sm">
                            ← Back to Home
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-xl p-8 text-center">
                        <div className="text-6xl mb-4">🏆</div>
                        <h2 className="text-gray-800 text-2xl font-bold mb-4">
                            Your Score: {score}/{questions.length}
                        </h2>
                        <p className="text-gray-800 text-4xl font-bold text-blue-600 mb-4">{percentage}%</p>
                        <p className="text-gray-800 text-lg mb-6">{getMessage()}</p>

                        <div className="flex flex-col text-lg sm:flex-row gap-4 justify-center">
                            <button
                                onClick={resetQuiz}
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                🔄 Try Again
                            </button>
                            <Link
                                href="/"
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 inline-block text-center transition-colors"
                            >
                                🏠 Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="gradient-bg p-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-sky-100 text-3xl font-bold mb-2">❓ Vocabulary Quiz</h1>
                    <Link href="/" className="text-blue-100 hover:underline text-sm md:text-base">
                        ← Back to Home
                    </Link>
                </div>

                {/* Progress */}
                <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm md:text-base text-gray-600">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </span>
                        <span className="text-sm md:text-base text-gray-600">
                            Score: {score}/{currentQuestionIndex + (isAnswered ? 1 : 0)}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 md:h-5">
                        <div
                            className="bg-blue-600 h-2 md:h-5 rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl border border-blue-100 px-6 py-4 md:px-8 md:py-6 mb-6">
                    <div className="text-center mb-6">
                        {/* <div className="text-4xl md:text-5xl mb-3">🤔</div> */}
                        <h2 className="!text-gray-800 text-4xl md:text-5xl font-black mb-3">
                            {currentQuestion.word.tajik}
                        </h2>
                    </div>

                    {/* Answer Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(option)}
                                disabled={isAnswered}
                                className={`group relative p-3 md:p-5 text-center rounded-2xl border-2 transition-all duration-300 min-h-[80px] md:min-h-[100px] transform ${isAnswered
                                    ? option === currentQuestion.correctAnswer
                                        ? 'border-green-500 bg-gradient-to-br from-green-100 to-green-200 scale-105 shadow-xl'
                                        : option === selectedAnswer && option !== currentQuestion.correctAnswer
                                            ? 'border-red-500 bg-gradient-to-br from-red-100 to-red-200 scale-95 shadow-lg'
                                            : 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 opacity-60'
                                    : 'border-gray-300 bg-gradient-to-br from-white to-gray-50 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 hover:scale-105 hover:shadow-xl active:scale-95'
                                    }`}
                            >
                                <div className="flex items-center justify-center h-full">
                                    <span className="text-xl md:text-2xl font-bold !text-gray-800">{option}</span>
                                    {isAnswered && option === currentQuestion.correctAnswer && (
                                        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-lg animate-bounce">
                                            ✅
                                        </div>
                                    )}
                                    {isAnswered && option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                                        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 shadow-lg animate-pulse">
                                            ❌
                                        </div>
                                    )}
                                </div>

                                {/* Hover glow effect */}
                                {!isAnswered && (
                                    <div className="absolute inset-0 rounded-2xl bg-blue-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Feedback */}
                    {/* {isAnswered && (
                        <div className={`mt-6 p-4 rounded-lg text-center ${selectedAnswer === currentQuestion.correctAnswer
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {selectedAnswer === currentQuestion.correctAnswer ? (
                                <p className="font-semibold">Correct! 🎉</p>
                            ) : (
                                <div>
                                    <p className="font-semibold">Incorrect! 😔</p>
                                    <p className="text-sm mt-1">
                                        The correct answer is: <strong>{currentQuestion.correctAnswer}</strong>
                                    </p>
                                </div>
                            )}
                        </div>
                    )} */}
                </div>

                {/* Navigation - Fixed height container to prevent layout shift */}
                <div className="h-16 flex items-center justify-center">
                    {isAnswered && (
                        <button
                            onClick={handleNextQuestion}
                            className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 text-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

