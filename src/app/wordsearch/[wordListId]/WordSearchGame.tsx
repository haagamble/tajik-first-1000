'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { VocabWord } from '../../../types/vocab';

interface GridCell {
    letter: string;
    isSelected: boolean;
    isFound: boolean;
    row: number;
    col: number;
    wordIndex?: number; // Added for unique coloring
}

interface FoundWord {
    word: string;
    english: string;
    positions: number[][];
}

interface WordSearchGameProps {
    wordList: {
        id: string;
        name: string;
        description?: string;
        words: VocabWord[];
    };
}

export default function WordSearchGame({ wordList }: WordSearchGameProps) {
    const [grid, setGrid] = useState<GridCell[][]>([]);
    const [words, setWords] = useState<VocabWord[]>([]);
    const [foundWords, setFoundWords] = useState<FoundWord[]>([]);
    const [selectedCells, setSelectedCells] = useState<number[][]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [gridSize] = useState(10);
    const [selectionDirection, setSelectionDirection] = useState<number[] | null>(null);
    const [mounted, setMounted] = useState(false);

    const initializeGrid = useCallback((wordList: VocabWord[]) => {
        // Create empty grid
        const newGrid: GridCell[][] = [];
        for (let i = 0; i < gridSize; i++) {
            newGrid[i] = [];
            for (let j = 0; j < gridSize; j++) {
                newGrid[i][j] = {
                    letter: '',
                    isSelected: false,
                    isFound: false,
                    row: i,
                    col: j
                };
            }
        }

        // Place words in grid and track successfully placed words
        const directions = [
            [0, 1],   // horizontal left-to-right
            [0, -1],  // horizontal right-to-left
            [1, 0],   // vertical top-to-bottom
            [-1, 0],  // vertical bottom-to-top
            [1, 1],   // diagonal down-right
            [1, -1],  // diagonal down-left
            [-1, 1],  // diagonal up-right
            [-1, -1], // diagonal up-left
        ];

        const successfullyPlacedWords: VocabWord[] = [];
        let diagonalWordsPlaced = 0;
        const minDiagonalWords = 2; // Ensure at least 2 diagonal words

        // First, try to place some diagonal words
        const shuffledWords = [...wordList].sort(() => Math.random() - 0.5);
        const diagonalDirections = [
            [1, 1],   // diagonal down-right
            [1, -1],  // diagonal down-left
            [-1, 1],  // diagonal up-right
            [-1, -1]  // diagonal up-left
        ];

        for (let i = 0; i < Math.min(3, shuffledWords.length) && diagonalWordsPlaced < minDiagonalWords; i++) {
            const word = shuffledWords[i];
            let placed = false;
            let attempts = 0;

            while (!placed && attempts < 50) {
                const direction = diagonalDirections[Math.floor(Math.random() * diagonalDirections.length)];
                const startRow = Math.floor(Math.random() * gridSize);
                const startCol = Math.floor(Math.random() * gridSize);

                if (canPlaceWord(newGrid, word.tajik, startRow, startCol, direction)) {
                    placeWord(newGrid, word.tajik, startRow, startCol, direction);
                    placed = true;
                    successfullyPlacedWords.push(word);
                    diagonalWordsPlaced++;
                }
                attempts++;
            }
        }

        // Then place remaining words with all directions
        for (let i = 0; i < shuffledWords.length; i++) {
            const word = shuffledWords[i];
            if (successfullyPlacedWords.some(sw => sw.id === word.id)) continue; // Skip already placed words

            let placed = false;
            let attempts = 0;

            while (!placed && attempts < 100) {
                const direction = directions[Math.floor(Math.random() * directions.length)];
                const startRow = Math.floor(Math.random() * gridSize);
                const startCol = Math.floor(Math.random() * gridSize);

                if (canPlaceWord(newGrid, word.tajik, startRow, startCol, direction)) {
                    placeWord(newGrid, word.tajik, startRow, startCol, direction);
                    placed = true;
                    successfullyPlacedWords.push(word);
                }
                attempts++;
            }
        }

        // Fill remaining cells with random letters
        fillRemainingCells(newGrid);
        setGrid(newGrid);

        // Only show words that were successfully placed in the grid
        setWords(successfullyPlacedWords);
    }, [gridSize]);


    // Prevent hydration issues by only rendering after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Filter words: no spaces, max 10 letters, then select up to 15 random words
        const validWords = wordList.words.filter(word =>
            word.tajik.length <= 10 && word.tajik.length >= 3 &&
            !word.tajik.includes(' ')
        );

        // Select up to 15 random words for word search
        const shuffledWords = [...validWords].sort(() => Math.random() - 0.5);
        const selectedWords = shuffledWords.slice(0, 15);
        initializeGrid(selectedWords);
    }, [wordList.words, mounted, initializeGrid]);

    const canPlaceWord = (grid: GridCell[][], word: string, row: number, col: number, direction: number[]): boolean => {
        for (let i = 0; i < word.length; i++) {
            const newRow = row + i * direction[0];
            const newCol = col + i * direction[1];

            if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize) {
                return false;
            }

            if (grid[newRow][newCol].letter !== '' && grid[newRow][newCol].letter !== word[i]) {
                return false;
            }
        }
        return true;
    };

    const placeWord = (grid: GridCell[][], word: string, row: number, col: number, direction: number[]) => {
        for (let i = 0; i < word.length; i++) {
            const newRow = row + i * direction[0];
            const newCol = col + i * direction[1];
            grid[newRow][newCol].letter = word[i];
        }
    };

    const fillRemainingCells = (grid: GridCell[][]) => {
        // list of letters for filling the grid
        // on't use Russian letters in this list
        const tajikLetters = 'абвгдеёзийклмнопрстуфхчшэюя';
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j].letter === '') {
                    grid[i][j].letter = tajikLetters[Math.floor(Math.random() * tajikLetters.length)];
                }
            }
        }
    };

    const handleMouseDown = (row: number, col: number) => {
        setIsDragging(true);
        setSelectedCells([[row, col]]);
        setSelectionDirection(null); // Reset direction on new selection
    };

    const handleMouseEnter = (row: number, col: number) => {
        if (isDragging && selectedCells.length > 0) {
            const [startRow, startCol] = selectedCells[0];

            // If this is the second point, establish direction
            if (selectedCells.length === 1) {
                if (startRow === row && startCol === col) return; // Same cell

                const newDirection = getDirection([startRow, startCol], [row, col]);
                setSelectionDirection(newDirection);
                setSelectedCells([...selectedCells, [row, col]]);
            } else if (selectionDirection) {
                // For subsequent points, only allow if on the same straight line
                if (isOnStraightLine([startRow, startCol], [row, col], selectionDirection)) {
                    const newSelectedCells = getCellsBetween(startRow, startCol, row, col);
                    setSelectedCells(newSelectedCells);
                }
                // If not on the same line, keep the current selection (don't lose progress)
            }
        }
    };

    const handleMouseUp = () => {
        if (selectedCells.length > 1) {
            checkWord();
        }
        setIsDragging(false);
        setSelectedCells([]);
        setSelectionDirection(null);
    };

    const getCellsBetween = (startRow: number, startCol: number, endRow: number, endCol: number): number[][] => {
        const cells: number[][] = [];
        const rowDiff = endRow - startRow;
        const colDiff = endCol - startCol;

        // Determine if the selection is horizontal, vertical, or diagonal
        const isHorizontal = Math.abs(rowDiff) === 0;
        const isVertical = Math.abs(colDiff) === 0;
        const isDiagonal = Math.abs(rowDiff) === Math.abs(colDiff);

        if (isHorizontal || isVertical || isDiagonal) {
            const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
            const rowStep = rowDiff === 0 ? 0 : rowDiff / steps;
            const colStep = colDiff === 0 ? 0 : colDiff / steps;

            for (let i = 0; i <= steps; i++) {
                cells.push([startRow + i * rowStep, startCol + i * colStep]);
            }
        }

        return cells;
    };

    // Get direction between two points
    const getDirection = (from: number[], to: number[]): number[] => {
        const [r1, c1] = from;
        const [r2, c2] = to;
        const dr = r2 - r1;
        const dc = c2 - c1;

        // Normalize to get direction (-1, 0, 1)
        const normalizeVal = (val: number) => val === 0 ? 0 : val > 0 ? 1 : -1;
        return [normalizeVal(dr), normalizeVal(dc)];
    };

    // Check if a point is on the same line as start point in the given direction
    const isOnStraightLine = (start: number[], point: number[], direction: number[]): boolean => {
        const [r1, c1] = start;
        const [r2, c2] = point;
        const [dr, dc] = direction;

        if (dr === 0 && dc === 0) return r1 === r2 && c1 === c2;

        // Check if the point lies on the line from start in the given direction
        const steps = dr !== 0 ? (r2 - r1) / dr : dc !== 0 ? (c2 - c1) / dc : 0;

        if (steps < 0) return false; // Point is in opposite direction

        const expectedR = r1 + steps * dr;
        const expectedC = c1 + steps * dc;

        return Math.abs(expectedR - r2) < 0.001 && Math.abs(expectedC - c2) < 0.001;
    };

    const checkWord = () => {
        const selectedWord = selectedCells
            .map(([row, col]) => grid[row][col].letter)
            .join('');

        const foundWord = words.find(word =>
            word.tajik === selectedWord ||
            word.tajik === selectedWord.split('').reverse().join('')
        );

        if (foundWord && !foundWords.some(fw => fw.word === foundWord.tajik)) {
            const newFoundWords = [...foundWords, {
                word: foundWord.tajik,
                english: foundWord.english,
                positions: selectedCells
            }];
            setFoundWords(newFoundWords);

            // Mark cells as found with word index for unique coloring
            const newGrid = [...grid];
            selectedCells.forEach(([row, col]) => {
                newGrid[row][col].isFound = true;
                // Store which word this cell belongs to for unique coloring
                newGrid[row][col].wordIndex = foundWords.length;
            });
            setGrid(newGrid);
        }
    };

    const resetGame = () => {
        setFoundWords([]);
        // Filter words: no spaces, max 10 letters, then select up to 15 random words
        const validWords = wordList.words.filter(word =>
            word.tajik.length <= 10 &&
            !word.tajik.includes(' ')
        );

        // Select up to 15 random words for word search
        const shuffledWords = [...validWords].sort(() => Math.random() - 0.5);
        const selectedWords = shuffledWords.slice(0, 15);
        initializeGrid(selectedWords);
    };



    // Calculate oriented rounded rectangle aligned with the word direction
    const getWordOrientedRect = (positions: number[][]) => {
        if (positions.length === 0) return null;

        const firstCoord = positions[0];
        const lastCoord = positions[positions.length - 1];

        const firstCell = document.querySelector(`[data-cell="${firstCoord[0]},${firstCoord[1]}"]`);
        const lastCell = document.querySelector(`[data-cell="${lastCoord[0]},${lastCoord[1]}"]`);
        if (!firstCell || !lastCell) return null;

        const gridContainer = firstCell.parentElement;
        if (!gridContainer) return null;
        const gridRect = gridContainer.getBoundingClientRect();

        const firstRect = (firstCell as HTMLElement).getBoundingClientRect();
        const lastRect = (lastCell as HTMLElement).getBoundingClientRect();

        // Calculate positions relative to the grid container
        const firstCenterX = firstRect.left - gridRect.left + firstRect.width / 2;
        const firstCenterY = firstRect.top - gridRect.top + firstRect.height / 2;
        const lastCenterX = lastRect.left - gridRect.left + lastRect.width / 2;
        const lastCenterY = lastRect.top - gridRect.top + lastRect.height / 2;

        const dx = lastCenterX - firstCenterX;
        const dy = lastCenterY - firstCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Infer cell size from first cell
        const cellWidth = firstRect.width;
        const cellHeight = firstRect.height;

        // Make the bar slightly thinner than a cell and extend to cover full cells at ends
        const thickness = Math.max(8, Math.min(cellWidth, cellHeight) - 6);
        const length = distance + Math.max(cellWidth, cellHeight);

        const cx = (firstCenterX + lastCenterX) / 2;
        const cy = (firstCenterY + lastCenterY) / 2;

        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        const rx = Math.min(10, thickness / 2);

        return {
            cx,
            cy,
            width: length,
            height: thickness,
            angle,
            rx,
        };
    };

    if (!mounted || words.length === 0) {
        return (
            <div className="gradient-bg p-2 sm:p-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Loading...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="gradient-bg p-2 sm:p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-4 sm:mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">🔍 Word Search</h1>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                        Find Tajik words hidden in the grid
                    </p>
                    <Link href="/" className="text-blue-600 hover:underline text-sm">
                        ← Back to Home
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
                    {/* Word Search Grid */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2">
                                <h2 className="text-lg sm:text-xl font-semibold">Find these words:</h2>
                                <button
                                    onClick={resetGame}
                                    className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm"
                                >
                                    🔄 New Game
                                </button>
                            </div>

                            <div className="flex justify-center overflow-hidden px-1 sm:px-6 relative">
                                <div
                                    className="grid gap-0.5 sm:gap-1 select-none word-search-grid relative"
                                    style={{
                                        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                                        width: 'min(90vw, 350px)',
                                        height: 'min(90vw, 350px)',
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        touchAction: 'none'
                                    }}
                                    onMouseLeave={() => {
                                        setIsDragging(false);
                                        setSelectedCells([]);
                                    }}
                                    onMouseUp={handleMouseUp}
                                    onTouchEnd={handleMouseUp}
                                    onTouchMove={(e) => {
                                        e.preventDefault();
                                        const touch = e.touches[0];
                                        const element = document.elementFromPoint(touch.clientX, touch.clientY);
                                        if (element && element.closest('[data-cell]')) {
                                            const row = parseInt(element.getAttribute('data-row') || '0');
                                            const col = parseInt(element.getAttribute('data-col') || '0');
                                            if (!isNaN(row) && !isNaN(col)) {
                                                handleMouseEnter(row, col);
                                            }
                                        }
                                    }}
                                >
                                    {grid.map((row, rowIndex) =>
                                        row.map((cell, colIndex) => (
                                            <div
                                                key={`${rowIndex}-${colIndex}`}
                                                className={`border border-gray-300 flex items-center justify-center text-[10px] sm:text-sm font-bold cursor-pointer transition-colors min-w-0 min-h-0 ${selectedCells.some(([r, c]) => r === rowIndex && c === colIndex)
                                                    ? 'bg-blue-200 border-blue-500'
                                                    : 'bg-white hover:bg-gray-100'
                                                    }`}
                                                style={{
                                                    aspectRatio: '1',
                                                    fontSize: 'clamp(18px, 5vw, 22px)',
                                                    userSelect: 'none',
                                                    touchAction: 'none'
                                                }}
                                                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                                                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                                                onTouchStart={() => handleMouseDown(rowIndex, colIndex)}
                                                data-row={rowIndex}
                                                data-col={colIndex}
                                                data-cell={`${rowIndex},${colIndex}`}
                                            >
                                                {cell.letter}
                                            </div>
                                        ))
                                    )}

                                    {/* SVG overlay for word rectangles */}
                                    <svg
                                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                                        style={{
                                            width: 'min(90vw, 350px)',
                                            height: 'min(90vw, 350px)'
                                        }}
                                    >
                                        {foundWords.map((foundWord, index) => {
                                            const orect = getWordOrientedRect(foundWord.positions);
                                            if (!orect) return null;

                                            // Use different colors for different words
                                            const colors = ['#dc2626', '#059669', '#7c3aed', '#ea580c', '#0891b2', '#be123c'];
                                            const color = colors[index % colors.length];

                                            return (
                                                <rect
                                                    key={`rect-${foundWord.word}-${index}`}
                                                    x={orect.cx - orect.width / 2}
                                                    y={orect.cy - orect.height / 2}
                                                    width={orect.width}
                                                    height={orect.height}
                                                    rx={orect.rx}
                                                    ry={orect.rx}
                                                    transform={`rotate(${orect.angle} ${orect.cx} ${orect.cy})`}
                                                    fill="none"
                                                    stroke={color}
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    opacity="0.8"
                                                />
                                            );
                                        })}
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Word List and Found Words */}
                    <div className="space-y-3 sm:space-y-6">
                        {/* Words to Find */}
                        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6">
                            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Words to Find:</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                                {words.map((word) => {
                                    const isFound = foundWords.some(fw => fw.word === word.tajik);
                                    return (
                                        <div
                                            key={word.id}
                                            className={`p-2 rounded text-sm ${isFound ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            <div className="font-medium">{word.tajik}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Found Words */}
                        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6">
                            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                                Found: {foundWords.length}/{words.length}
                            </h3>
                            <div className="space-y-2">
                                {foundWords.map((foundWord, index) => (
                                    <div key={index} className="p-2 bg-green-100 rounded">
                                        <div className="font-medium text-green-800 text-sm">{foundWord.word}</div>
                                        <div className="text-xs text-green-600">{foundWord.english}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
