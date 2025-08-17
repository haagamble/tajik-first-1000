import { wordLists } from '../../../data/wordLists';
import FlashcardsGame from './FlashcardsGame';

// Required for static export
export async function generateStaticParams() {
    return wordLists.map((wordList) => ({
        wordListId: wordList.id,
    }));
}

export default async function FlashcardsPage({ params }: { params: Promise<{ wordListId: string }> }) {
    const { wordListId } = await params;
    const wordList = wordLists.find(wl => wl.id === wordListId);

    if (!wordList) {
        return (
            <div className="gradient-bg p-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Word List Not Found</h1>
                    <a href="/" className="text-blue-600 hover:underline">
                        ← Back to Home
                    </a>
                </div>
            </div>
        );
    }

    return <FlashcardsGame wordList={wordList} />;
}
