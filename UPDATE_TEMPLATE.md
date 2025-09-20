# Code Update Template for New Logos

## 🔄 Files to Update After Logo Download

### 1. Features.tsx - Import Section
```typescript
// Add these imports after downloading logos
import goLogo from '@/assets/languages/go-official.svg';
import rustLogo from '@/assets/languages/rust-official.svg';
import phpLogo from '@/assets/languages/php-official.svg';
import swiftLogo from '@/assets/languages/swift-official.svg';
import kotlinLogo from '@/assets/languages/kotlin-official.svg';
import rubyLogo from '@/assets/languages/ruby-official.svg';
import csharpLogo from '@/assets/languages/csharp-official.svg';
import dartLogo from '@/assets/languages/dart-official.svg';
```

### 2. Features.tsx - Language Array Update
```typescript
const codeLanguages = [
  { name: 'Python', logo: pythonLogo, popularity: 95, color: 'from-blue-500 to-yellow-500', description: 'Versatile & beginner-friendly' },
  { name: 'JavaScript', logo: javascriptLogo, popularity: 90, color: 'from-yellow-400 to-yellow-600', description: 'Web development essential' },
  { name: 'TypeScript', logo: typescriptLogo, popularity: 85, color: 'from-blue-600 to-blue-800', description: 'JavaScript with types' },
  { name: 'Java', logo: javaLogo, popularity: 80, color: 'from-red-500 to-orange-600', description: 'Enterprise & Android' },
  { name: 'C++', logo: cppLogo, popularity: 75, color: 'from-blue-700 to-purple-700', description: 'System programming' },
  { name: 'C', logo: cLogo, popularity: 70, color: 'from-gray-600 to-blue-600', description: 'Low-level programming' },
  { name: 'React', logo: reactLogo, popularity: 88, color: 'from-cyan-400 to-blue-500', description: 'UI library for web' },
  { name: 'Go', logo: goLogo, popularity: 68, color: 'from-cyan-500 to-blue-600', description: 'Fast & concurrent' },
  { name: 'Rust', logo: rustLogo, popularity: 65, color: 'from-orange-600 to-red-600', description: 'Memory-safe systems' },
  { name: 'PHP', logo: phpLogo, popularity: 72, color: 'from-purple-600 to-indigo-600', description: 'Web backend language' },
  { name: 'Swift', logo: swiftLogo, popularity: 62, color: 'from-orange-500 to-red-500', description: 'iOS development' },
  { name: 'Kotlin', logo: kotlinLogo, popularity: 58, color: 'from-purple-500 to-pink-500', description: 'Modern Android dev' },
  { name: 'Ruby', logo: rubyLogo, popularity: 55, color: 'from-red-500 to-pink-500', description: 'Web development' },
  { name: 'C#', logo: csharpLogo, popularity: 67, color: 'from-purple-600 to-blue-600', description: 'Microsoft ecosystem' },
  { name: 'Dart', logo: dartLogo, popularity: 45, color: 'from-blue-400 to-cyan-400', description: 'Flutter development' },
];
```

### 3. CodeEditor.tsx - Language Support
```typescript
// Add to language templates
const languageTemplates = {
  python: 'print("Hello, World!")',
  javascript: 'console.log("Hello, World!");',
  typescript: 'console.log("Hello, World!");',
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
  c: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
  go: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}`,
  rust: `fn main() {\n    println!("Hello, World!");\n}`,
  php: `<?php\necho "Hello, World!";\n?>`,
  swift: `import Foundation\nprint("Hello, World!")`,
  kotlin: `fun main() {\n    println("Hello, World!")\n}`,
  ruby: `puts "Hello, World!"`,
  csharp: `using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}`,
  dart: `void main() {\n  print('Hello, World!');\n}`,
};
```

### 4. Language Icons Object
```typescript
const languageIcons = {
  python: pythonLogo,
  javascript: javascriptLogo,
  typescript: typescriptLogo,
  java: javaLogo,
  cpp: cppLogo,
  c: cLogo,
  go: goLogo,
  rust: rustLogo,
  php: phpLogo,
  swift: swiftLogo,
  kotlin: kotlinLogo,
  ruby: rubyLogo,
  csharp: csharpLogo,
  dart: dartLogo,
};
```

### 5. Languages Array for Selector
```typescript
const languages = [
  { value: 'python', label: 'Python', icon: pythonLogo },
  { value: 'javascript', label: 'JavaScript', icon: javascriptLogo },
  { value: 'typescript', label: 'TypeScript', icon: typescriptLogo },
  { value: 'java', label: 'Java', icon: javaLogo },
  { value: 'cpp', label: 'C++', icon: cppLogo },
  { value: 'c', label: 'C', icon: cLogo },
  { value: 'go', label: 'Go', icon: goLogo },
  { value: 'rust', label: 'Rust', icon: rustLogo },
  { value: 'php', label: 'PHP', icon: phpLogo },
  { value: 'swift', label: 'Swift', icon: swiftLogo },
  { value: 'kotlin', label: 'Kotlin', icon: kotlinLogo },
  { value: 'ruby', label: 'Ruby', icon: rubyLogo },
  { value: 'csharp', label: 'C#', icon: csharpLogo },
  { value: 'dart', label: 'Dart', icon: dartLogo },
];
```

## 🎨 Color Schemes for New Languages

```typescript
const languageColors = {
  go: 'from-cyan-500 to-blue-600',
  rust: 'from-orange-600 to-red-600',
  php: 'from-purple-600 to-indigo-600',
  swift: 'from-orange-500 to-red-500',
  kotlin: 'from-purple-500 to-pink-500',
  ruby: 'from-red-500 to-pink-500',
  csharp: 'from-purple-600 to-blue-600',
  dart: 'from-blue-400 to-cyan-400',
  scala: 'from-red-600 to-orange-600',
  r: 'from-blue-500 to-indigo-600',
};
```

## 🚀 Ready to Update?

Once you've downloaded the logos:
1. Place them in `src/assets/languages/`
2. Let me know which ones you have
3. I'll update all the code files automatically!

## 📊 Current Status

- ✅ Python, JavaScript, TypeScript, Java, C++, C, React (have logos)
- 🔄 Go, Rust, PHP, Swift, Kotlin, Ruby, C#, Dart (need logos)
- 📋 Additional languages can be added as needed