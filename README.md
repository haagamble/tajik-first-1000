# Tajik Vocabulary Practice App

An interactive web application for learning Tajik vocabulary through various engaging activities including flashcards, memory games, word search puzzles, and quizzes.

## Features

- **📚 Flashcards**: Interactive cards showing Tajik words with English translations
- **🧠 Memory Game**: Match Tajik words with their English meanings
- **🔍 Word Search**: Find Tajik words hidden in letter grids
- **❓ Quiz**: Multiple choice questions to test vocabulary knowledge
- **📱 Mobile Responsive**: Works on desktop, tablet, and mobile devices
- **🎯 Word List Selection**: Choose from different vocabulary categories

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd tajik-vocab-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `out/` directory, ready for deployment.

## Customizing Your Word Lists

### Option 1: Edit the Sample Data

Modify `src/data/wordLists.ts` to add your own vocabulary:

```typescript
export const wordLists: WordList[] = [
  {
    id: 'my-custom-list',
    name: 'My Custom Words',
    description: 'Description of my word list',
    difficulty: 'beginner',
    words: [
      { 
        id: '1', 
        tajik: 'Салом', 
        english: 'Hello', 
        transliteration: 'Salom' 
      },
      // Add more words...
    ]
  }
];
```

### Option 2: Import Your JSON Files

1. Place your JSON files in the `src/data/` directory
2. Update `src/data/wordLists.ts` to import them:

```typescript
import myWordList from './my-words.json';
import anotherList from './another-list.json';

export const wordLists: WordList[] = [
  myWordList,
  anotherList,
  // ... other lists
];
```

### JSON Format

Your JSON files should follow this structure:

```json
{
  "id": "unique-identifier",
  "name": "Display Name",
  "description": "Description of the word list",
  "difficulty": "beginner",
  "words": [
    {
      "id": "1",
      "tajik": "Tajik word",
      "english": "English translation",
      "transliteration": "Optional transliteration",
      "category": "Optional category"
    }
  ]
}
```

## Deployment to GitHub Pages

### 1. Update Repository Name

In `next.config.ts`, update the `basePath`:

```typescript
basePath: process.env.NODE_ENV === 'production' ? '/your-actual-repo-name' : '',
```

### 2. Build and Deploy

```bash
npm run build
```

### 3. GitHub Pages Setup

1. Go to your repository Settings → Pages
2. Set Source to "Deploy from a branch"
3. Select the `gh-pages` branch (or main branch)
4. Set folder to `/ (root)`

### 4. GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

## Testing Locally

### Desktop Testing
```bash
npm run dev
```

### Mobile Testing
1. Run the dev server
2. Find your computer's IP address
3. On your phone, navigate to `http://your-ip:3000`
4. Or use browser dev tools to simulate mobile devices

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── page.tsx          # Home page
│   ├── flashcards/       # Flashcards activity
│   ├── memory/           # Memory game activity
│   ├── wordsearch/       # Word search activity
│   └── quiz/             # Quiz activity
├── data/                  # Word list data
│   └── wordLists.ts      # Sample vocabulary data
├── types/                 # TypeScript type definitions
│   └── vocab.ts          # Vocabulary types
└── globals.css            # Global styles
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - State management
- **Responsive Design** - Mobile-first approach

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you have questions or need help:
- Check the code comments for implementation details
- Review the TypeScript types for data structure
- Test the app locally to understand the flow

## Future Enhancements

- Audio pronunciation
- Progress tracking
- User accounts
- More game types
- Spaced repetition learning
- Export/import word lists
- Offline support with PWA

---

Happy learning! 🎓📚
