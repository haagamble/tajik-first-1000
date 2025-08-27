import Link from 'next/link';
import { wordLists } from '../../../data/wordLists';
import { normalizeWordList } from '../../../utils/wordListUtils';
import WordSearchGame from './WordSearchGame';

// Required for static export
export async function generateStaticParams() {
    return wordLists.map((wordList) => ({
        wordListId: wordList.id,
    }));
}

export default async function WordSearchPage({ params }: { params: Promise<{ wordListId: string }> }) {
    const { wordListId } = await params;
    const rawWordList = wordLists.find(wl => wl.id === wordListId);
    const wordList = rawWordList ? normalizeWordList(rawWordList) : null;

    if (!wordList) {
        return (
            <div className="gradient-bg p-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-2xl font-bold mb-4">Word List Not Found</h1>
                    <Link href="/" className="text-blue-100 hover:underline">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return <WordSearchGame wordList={wordList} />;
}
