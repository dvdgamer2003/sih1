# Learning Content JSON Files Structure

## Directory Structure

Your learning content JSON files should be organized in:
```
frontend/src/data/
├── lessons/          # Lesson content by class and subject
│   ├── class6/
│   │   ├── math.json
│   │   └── science.json
│   ├── class7/
│   │   ├── math.json
│   │   └── science.json
│   └── ...
├── quizzes/          # Quiz questions by class and subject
│   ├── class6/
│   │   ├── math.json
│   │   └── science.json
│   └── ...
└── games/            # Game content (optional)
    └── educational-questions.json
```

## JSON File Formats

### Lesson Format (`lessons/class6/math.json`)
```json
{
  "class": 6,
  "subject": "Mathematics",
  "chapters": [
    {
      "id": "ch1",
      "title": "Knowing Our Numbers",
      "lessons": [
        {
          "id": "lesson1",
          "title": "Introduction to Numbers",
          "content": "Numbers are everywhere in our daily life...",
          "sections": [
            {
              "heading": "What are Numbers?",
              "text": "Numbers help us count, measure, and compare things.",
              "examples": ["1, 2, 3...", "10, 20, 30..."]
            }
          ],
          "keyPoints": [
            "Numbers are used for counting",
            "We use the decimal system (0-9)"
          ]
        }
      ]
    }
  ]
}
```

### Quiz Format (`quizzes/class6/math.json`)
```json
{
  "class": 6,
  "subject": "Mathematics",
  "quizzes": [
    {
      "id": "quiz1",
      "chapterId": "ch1",
      "title": "Numbers Quiz",
      "questions": [
        {
          "id": "q1",
          "question": "What is 5 + 3?",
          "options": ["6", "7", "8", "9"],
          "correctAnswer": 2,
          "explanation": "5 + 3 = 8"
        },
        {
          "id": "q2",
          "question": "Which is a prime number?",
          "options": ["4", "6", "7", "8"],
          "correctAnswer": 2,
          "explanation": "7 is prime because it's only divisible by 1 and itself"
        }
      ]
    }
  ]
}
```

## How to Use in Your App

### 1. Import JSON files directly:
```typescript
import class6Math from '../data/lessons/class6/math.json';
import class6MathQuiz from '../data/quizzes/class6/math.json';
```

### 2. Create a service to load content:
```typescript
// services/contentService.ts
export const getLesson = (classNum: number, subject: string, lessonId: string) => {
  const lessons = require(`../data/lessons/class${classNum}/${subject}.json`);
  // Find and return specific lesson
};

export const getQuiz = (classNum: number, subject: string, quizId: string) => {
  const quizzes = require(`../data/quizzes/class${classNum}/${subject}.json`);
  // Find and return specific quiz
};
```

### 3. Use in components:
```typescript
const LessonScreen = () => {
  const [lessonData, setLessonData] = useState(null);
  
  useEffect(() => {
    const data = getLesson(6, 'math', 'lesson1');
    setLessonData(data);
  }, []);
  
  return <View>{/* Render lesson content */}</View>;
};
```

## Best Practices

1. **Keep files organized by class and subject**
2. **Use consistent naming** (lowercase, hyphen-separated)
3. **Validate JSON structure** before adding to app
4. **Keep file sizes reasonable** (split large content into multiple files)
5. **Use TypeScript interfaces** for type safety
6. **Version your content** if you plan to update it frequently

## Example TypeScript Interfaces

```typescript
interface Lesson {
  id: string;
  title: string;
  content: string;
  sections: Section[];
  keyPoints: string[];
}

interface Quiz {
  id: string;
  chapterId: string;
  title: string;
  questions: Question[];
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
```
