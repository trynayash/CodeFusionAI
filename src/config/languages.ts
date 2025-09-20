/**
 * Language Configuration
 * Comprehensive configuration for all supported programming languages
 */

import { EditorLanguage, EditorTemplate } from '@/types/editor';

// Language definitions
export const LANGUAGES: EditorLanguage[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    displayName: 'JavaScript',
    extension: '.js',
    mimeType: 'text/javascript',
    version: 'ES2023',
    description: 'A high-level, interpreted programming language that conforms to the ECMAScript specification.',
    website: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    documentation: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    tutorials: ['https://javascript.info/', 'https://www.w3schools.com/js/'],
    examples: ['Hello World', 'Functions', 'Objects', 'Async/Await'],
    frameworks: ['React', 'Vue', 'Angular', 'Node.js', 'Express'],
    tools: ['VS Code', 'WebStorm', 'Chrome DevTools'],
    community: 'Large and active',
    difficulty: 'intermediate',
    popularity: 'high',
    jobMarket: 'high',
    learningCurve: 'medium',
    performance: 'medium',
    ecosystem: 'large',
    syntax: 'c-like',
    paradigm: 'multi-paradigm',
    typing: 'dynamic',
    compilation: 'interpreted',
    platforms: ['web', 'server', 'mobile'],
    useCases: ['web-development', 'backend', 'mobile', 'desktop'],
    features: ['async', 'functional', 'oop', 'prototypes'],
    limitations: ['single-threaded', 'type-safety'],
    bestPractices: ['use const/let', 'avoid var', 'use arrow functions'],
    resources: ['MDN', 'JavaScript.info', 'Eloquent JavaScript'],
    icon: 'javascript',
    color: '#f7df1e',
    gradient: 'from-yellow-400 to-yellow-600',
    category: 'programming',
    tags: ['popular', 'versatile', 'web'],
    createdAt: new Date('1995-12-04'),
    updatedAt: new Date(),
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    displayName: 'TypeScript',
    extension: '.ts',
    mimeType: 'text/typescript',
    version: '5.0',
    description: 'A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.',
    website: 'https://www.typescriptlang.org/',
    documentation: 'https://www.typescriptlang.org/docs/',
    tutorials: ['https://www.typescriptlang.org/docs/handbook/intro.html'],
    examples: ['Interfaces', 'Generics', 'Classes', 'Modules'],
    frameworks: ['Angular', 'React', 'Vue', 'NestJS'],
    tools: ['VS Code', 'WebStorm', 'TypeScript Compiler'],
    community: 'Large and growing',
    difficulty: 'intermediate',
    popularity: 'high',
    jobMarket: 'high',
    learningCurve: 'medium',
    performance: 'high',
    ecosystem: 'large',
    syntax: 'c-like',
    paradigm: 'multi-paradigm',
    typing: 'static',
    compilation: 'compiled',
    platforms: ['web', 'server', 'mobile', 'desktop'],
    useCases: ['web-development', 'backend', 'mobile', 'desktop'],
    features: ['static-typing', 'interfaces', 'generics', 'decorators'],
    limitations: ['compilation-step', 'learning-curve'],
    bestPractices: ['strict mode', 'explicit types', 'interfaces'],
    resources: ['TypeScript Handbook', 'TypeScript Deep Dive'],
    icon: 'typescript',
    color: '#3178c6',
    gradient: 'from-blue-500 to-blue-700',
    category: 'programming',
    tags: ['typed', 'scalable', 'enterprise'],
    createdAt: new Date('2012-10-01'),
    updatedAt: new Date(),
  },
  {
    id: 'python',
    name: 'Python',
    displayName: 'Python',
    extension: '.py',
    mimeType: 'text/x-python',
    version: '3.11',
    description: 'A high-level, general-purpose programming language with dynamic semantics.',
    website: 'https://www.python.org/',
    documentation: 'https://docs.python.org/',
    tutorials: ['https://docs.python.org/3/tutorial/'],
    examples: ['Hello World', 'Functions', 'Classes', 'Data Structures'],
    frameworks: ['Django', 'Flask', 'FastAPI', 'PyTorch', 'TensorFlow'],
    tools: ['PyCharm', 'VS Code', 'Jupyter', 'pip'],
    community: 'Very large',
    difficulty: 'beginner',
    popularity: 'high',
    jobMarket: 'high',
    learningCurve: 'easy',
    performance: 'medium',
    ecosystem: 'very-large',
    syntax: 'python-like',
    paradigm: 'multi-paradigm',
    typing: 'dynamic',
    compilation: 'interpreted',
    platforms: ['web', 'server', 'desktop', 'data-science'],
    useCases: ['web-development', 'data-science', 'ai', 'automation'],
    features: ['readable', 'versatile', 'libraries', 'community'],
    limitations: ['performance', 'mobile'],
    bestPractices: ['PEP 8', 'virtual environments', 'type hints'],
    resources: ['Python.org', 'Real Python', 'Python Crash Course'],
    icon: 'python',
    color: '#3776ab',
    gradient: 'from-blue-500 to-green-500',
    category: 'programming',
    tags: ['beginner-friendly', 'versatile', 'data-science'],
    createdAt: new Date('1991-02-20'),
    updatedAt: new Date(),
  },
  {
    id: 'java',
    name: 'Java',
    displayName: 'Java',
    extension: '.java',
    mimeType: 'text/x-java-source',
    version: '21',
    description: 'A high-level, class-based, object-oriented programming language designed to have as few implementation dependencies as possible.',
    website: 'https://www.java.com/',
    documentation: 'https://docs.oracle.com/en/java/',
    tutorials: ['https://docs.oracle.com/javase/tutorial/'],
    examples: ['Hello World', 'Classes', 'Interfaces', 'Collections'],
    frameworks: ['Spring', 'Hibernate', 'Maven', 'Gradle'],
    tools: ['IntelliJ IDEA', 'Eclipse', 'NetBeans'],
    community: 'Very large',
    difficulty: 'intermediate',
    popularity: 'high',
    jobMarket: 'high',
    learningCurve: 'medium',
    performance: 'high',
    ecosystem: 'very-large',
    syntax: 'c-like',
    paradigm: 'object-oriented',
    typing: 'static',
    compilation: 'compiled',
    platforms: ['web', 'server', 'mobile', 'desktop'],
    useCases: ['enterprise', 'backend', 'android', 'desktop'],
    features: ['platform-independent', 'secure', 'multithreading'],
    limitations: ['verbose', 'memory-intensive'],
    bestPractices: ['SOLID principles', 'design patterns', 'clean code'],
    resources: ['Oracle Docs', 'Java Tutorials', 'Effective Java'],
    icon: 'java',
    color: '#ed8b00',
    gradient: 'from-orange-500 to-red-500',
    category: 'programming',
    tags: ['enterprise', 'robust', 'cross-platform'],
    createdAt: new Date('1995-05-23'),
    updatedAt: new Date(),
  },
  {
    id: 'cpp',
    name: 'C++',
    displayName: 'C++',
    extension: '.cpp',
    mimeType: 'text/x-c++src',
    version: 'C++23',
    description: 'A general-purpose programming language created as an extension of the C programming language.',
    website: 'https://isocpp.org/',
    documentation: 'https://en.cppreference.com/',
    tutorials: ['https://www.learncpp.com/'],
    examples: ['Hello World', 'Classes', 'Templates', 'STL'],
    frameworks: ['Qt', 'Boost', 'OpenCV', 'SFML'],
    tools: ['Visual Studio', 'CLion', 'Code::Blocks'],
    community: 'Large',
    difficulty: 'advanced',
    popularity: 'medium',
    jobMarket: 'medium',
    learningCurve: 'hard',
    performance: 'very-high',
    ecosystem: 'large',
    syntax: 'c-like',
    paradigm: 'multi-paradigm',
    typing: 'static',
    compilation: 'compiled',
    platforms: ['desktop', 'server', 'embedded', 'game'],
    useCases: ['system-programming', 'game-development', 'embedded'],
    features: ['performance', 'memory-management', 'templates'],
    limitations: ['complexity', 'memory-management'],
    bestPractices: ['RAII', 'smart pointers', 'const correctness'],
    resources: ['cppreference.com', 'LearnCpp', 'Effective C++'],
    icon: 'cpp',
    color: '#00599c',
    gradient: 'from-blue-600 to-blue-800',
    category: 'programming',
    tags: ['performance', 'system-programming', 'complex'],
    createdAt: new Date('1985-10-14'),
    updatedAt: new Date(),
  },
  {
    id: 'c',
    name: 'C',
    displayName: 'C',
    extension: '.c',
    mimeType: 'text/x-csrc',
    version: 'C17',
    description: 'A general-purpose, procedural computer programming language supporting structured programming.',
    website: 'https://en.wikipedia.org/wiki/C_(programming_language)',
    documentation: 'https://en.cppreference.com/w/c',
    tutorials: ['https://www.tutorialspoint.com/cprogramming/'],
    examples: ['Hello World', 'Functions', 'Pointers', 'Structures'],
    frameworks: ['POSIX', 'Win32', 'GTK'],
    tools: ['GCC', 'Clang', 'Visual Studio'],
    community: 'Large',
    difficulty: 'advanced',
    popularity: 'medium',
    jobMarket: 'medium',
    learningCurve: 'hard',
    performance: 'very-high',
    ecosystem: 'large',
    syntax: 'c-like',
    paradigm: 'procedural',
    typing: 'static',
    compilation: 'compiled',
    platforms: ['system', 'embedded', 'desktop'],
    useCases: ['system-programming', 'embedded', 'operating-systems'],
    features: ['performance', 'portability', 'low-level'],
    limitations: ['memory-management', 'no-oop'],
    bestPractices: ['defensive-programming', 'memory-management'],
    resources: ['K&R C', 'C Programming Language'],
    icon: 'c',
    color: '#a8b9cc',
    gradient: 'from-gray-400 to-gray-600',
    category: 'programming',
    tags: ['system-programming', 'performance', 'foundational'],
    createdAt: new Date('1972-01-01'),
    updatedAt: new Date(),
  },
  {
    id: 'go',
    name: 'Go',
    displayName: 'Go',
    extension: '.go',
    mimeType: 'text/x-go',
    version: '1.21',
    description: 'An open source programming language that makes it easy to build simple, reliable, and efficient software.',
    website: 'https://golang.org/',
    documentation: 'https://golang.org/doc/',
    tutorials: ['https://golang.org/doc/tutorial/'],
    examples: ['Hello World', 'Goroutines', 'Channels', 'Interfaces'],
    frameworks: ['Gin', 'Echo', 'Fiber', 'Beego'],
    tools: ['VS Code', 'GoLand', 'Delve'],
    community: 'Growing',
    difficulty: 'intermediate',
    popularity: 'medium',
    jobMarket: 'medium',
    learningCurve: 'easy',
    performance: 'high',
    ecosystem: 'medium',
    syntax: 'c-like',
    paradigm: 'multi-paradigm',
    typing: 'static',
    compilation: 'compiled',
    platforms: ['server', 'desktop', 'cloud'],
    useCases: ['backend', 'microservices', 'cloud-native'],
    features: ['concurrency', 'simplicity', 'performance'],
    limitations: ['ecosystem', 'generics'],
    bestPractices: ['idiomatic-go', 'error-handling', 'testing'],
    resources: ['Go by Example', 'Effective Go', 'Go Tour'],
    icon: 'go',
    color: '#00add8',
    gradient: 'from-cyan-500 to-blue-500',
    category: 'programming',
    tags: ['concurrent', 'simple', 'cloud-native'],
    createdAt: new Date('2009-11-10'),
    updatedAt: new Date(),
  },
  {
    id: 'rust',
    name: 'Rust',
    displayName: 'Rust',
    extension: '.rs',
    mimeType: 'text/x-rustsrc',
    version: '1.70',
    description: 'A systems programming language that runs blazingly fast, prevents segfaults, and guarantees thread safety.',
    website: 'https://www.rust-lang.org/',
    documentation: 'https://doc.rust-lang.org/',
    tutorials: ['https://doc.rust-lang.org/book/'],
    examples: ['Hello World', 'Ownership', 'Structs', 'Enums'],
    frameworks: ['Actix', 'Rocket', 'Tokio', 'Serde'],
    tools: ['VS Code', 'IntelliJ Rust', 'Cargo'],
    community: 'Growing',
    difficulty: 'advanced',
    popularity: 'medium',
    jobMarket: 'growing',
    learningCurve: 'hard',
    performance: 'very-high',
    ecosystem: 'growing',
    syntax: 'c-like',
    paradigm: 'multi-paradigm',
    typing: 'static',
    compilation: 'compiled',
    platforms: ['system', 'web', 'desktop'],
    useCases: ['system-programming', 'web-assembly', 'blockchain'],
    features: ['memory-safety', 'performance', 'concurrency'],
    limitations: ['learning-curve', 'ecosystem'],
    bestPractices: ['ownership', 'borrowing', 'lifetimes'],
    resources: ['Rust Book', 'Rust by Example', 'The Rustonomicon'],
    icon: 'rust',
    color: '#ce422b',
    gradient: 'from-orange-600 to-red-600',
    category: 'programming',
    tags: ['memory-safe', 'performance', 'modern'],
    createdAt: new Date('2010-07-07'),
    updatedAt: new Date(),
  },
  {
    id: 'php',
    name: 'PHP',
    displayName: 'PHP',
    extension: '.php',
    mimeType: 'text/x-php',
    version: '8.2',
    description: 'A popular general-purpose scripting language that is especially suited to web development.',
    website: 'https://www.php.net/',
    documentation: 'https://www.php.net/docs.php',
    tutorials: ['https://www.php.net/manual/en/tutorial.php'],
    examples: ['Hello World', 'Functions', 'Classes', 'Arrays'],
    frameworks: ['Laravel', 'Symfony', 'CodeIgniter', 'WordPress'],
    tools: ['PhpStorm', 'VS Code', 'Composer'],
    community: 'Very large',
    difficulty: 'beginner',
    popularity: 'high',
    jobMarket: 'high',
    learningCurve: 'easy',
    performance: 'medium',
    ecosystem: 'very-large',
    syntax: 'c-like',
    paradigm: 'multi-paradigm',
    typing: 'dynamic',
    compilation: 'interpreted',
    platforms: ['web', 'server'],
    useCases: ['web-development', 'cms', 'e-commerce'],
    features: ['web-focused', 'easy-deployment', 'large-ecosystem'],
    limitations: ['performance', 'inconsistency'],
    bestPractices: ['PSR standards', 'composer', 'modern-php'],
    resources: ['PHP.net', 'Laravel Docs', 'PHP The Right Way'],
    icon: 'php',
    color: '#777bb4',
    gradient: 'from-purple-500 to-indigo-500',
    category: 'programming',
    tags: ['web', 'popular', 'easy'],
    createdAt: new Date('1995-06-08'),
    updatedAt: new Date(),
  },
  {
    id: 'ruby',
    name: 'Ruby',
    displayName: 'Ruby',
    extension: '.rb',
    mimeType: 'text/x-ruby',
    version: '3.2',
    description: 'A dynamic, open source programming language with a focus on simplicity and productivity.',
    website: 'https://www.ruby-lang.org/',
    documentation: 'https://docs.ruby-lang.org/',
    tutorials: ['https://www.ruby-lang.org/en/documentation/quickstart/'],
    examples: ['Hello World', 'Classes', 'Blocks', 'Modules'],
    frameworks: ['Rails', 'Sinatra', 'Hanami'],
    tools: ['RubyMine', 'VS Code', 'Bundler'],
    community: 'Large',
    difficulty: 'beginner',
    popularity: 'medium',
    jobMarket: 'medium',
    learningCurve: 'easy',
    performance: 'medium',
    ecosystem: 'large',
    syntax: 'ruby-like',
    paradigm: 'object-oriented',
    typing: 'dynamic',
    compilation: 'interpreted',
    platforms: ['web', 'server', 'desktop'],
    useCases: ['web-development', 'automation', 'scripting'],
    features: ['readable', 'expressive', 'metaprogramming'],
    limitations: ['performance', 'mobile'],
    bestPractices: ['ruby-style-guide', 'bundler', 'testing'],
    resources: ['Ruby Docs', 'Ruby on Rails Guides', 'Eloquent Ruby'],
    icon: 'ruby',
    color: '#cc342d',
    gradient: 'from-red-500 to-red-700',
    category: 'programming',
    tags: ['readable', 'expressive', 'web'],
    createdAt: new Date('1995-12-21'),
    updatedAt: new Date(),
  },
  {
    id: 'swift',
    name: 'Swift',
    displayName: 'Swift',
    extension: '.swift',
    mimeType: 'text/x-swift',
    version: '5.9',
    description: 'A powerful and intuitive programming language for iOS, macOS, watchOS, and tvOS.',
    website: 'https://swift.org/',
    documentation: 'https://docs.swift.org/swift-book/',
    tutorials: ['https://docs.swift.org/swift-book/LanguageGuide/'],
    examples: ['Hello World', 'Classes', 'Protocols', 'Extensions'],
    frameworks: ['UIKit', 'SwiftUI', 'Combine', 'Vapor'],
    tools: ['Xcode', 'VS Code', 'Swift Package Manager'],
    community: 'Growing',
    difficulty: 'intermediate',
    popularity: 'medium',
    jobMarket: 'medium',
    learningCurve: 'medium',
    performance: 'high',
    ecosystem: 'medium',
    syntax: 'c-like',
    paradigm: 'multi-paradigm',
    typing: 'static',
    compilation: 'compiled',
    platforms: ['ios', 'macos', 'watchos', 'tvos'],
    useCases: ['mobile-development', 'desktop', 'server'],
    features: ['safe', 'fast', 'modern', 'interactive'],
    limitations: ['apple-ecosystem', 'learning-curve'],
    bestPractices: ['swift-style-guide', 'protocol-oriented', 'value-types'],
    resources: ['Swift Docs', 'Swift by Sundell', 'Hacking with Swift'],
    icon: 'swift',
    color: '#fa7343',
    gradient: 'from-orange-500 to-red-500',
    category: 'programming',
    tags: ['mobile', 'apple', 'modern'],
    createdAt: new Date('2014-06-02'),
    updatedAt: new Date(),
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    displayName: 'Kotlin',
    extension: '.kt',
    mimeType: 'text/x-kotlin',
    version: '1.9',
    description: 'A modern, concise, and safe programming language for Android development.',
    website: 'https://kotlinlang.org/',
    documentation: 'https://kotlinlang.org/docs/',
    tutorials: ['https://kotlinlang.org/docs/kotlin-tour.html'],
    examples: ['Hello World', 'Classes', 'Functions', 'Null Safety'],
    frameworks: ['Spring', 'Ktor', 'Compose', 'Android'],
    tools: ['IntelliJ IDEA', 'Android Studio', 'VS Code'],
    community: 'Growing',
    difficulty: 'intermediate',
    popularity: 'medium',
    jobMarket: 'growing',
    learningCurve: 'easy',
    performance: 'high',
    ecosystem: 'growing',
    syntax: 'c-like',
    paradigm: 'multi-paradigm',
    typing: 'static',
    compilation: 'compiled',
    platforms: ['android', 'jvm', 'web', 'native'],
    useCases: ['android-development', 'backend', 'web'],
    features: ['null-safety', 'interoperability', 'coroutines'],
    limitations: ['ecosystem', 'learning-curve'],
    bestPractices: ['idiomatic-kotlin', 'null-safety', 'coroutines'],
    resources: ['Kotlin Docs', 'Kotlin by Example', 'Android Developers'],
    icon: 'kotlin',
    color: '#7f52ff',
    gradient: 'from-purple-500 to-purple-700',
    category: 'programming',
    tags: ['android', 'jvm', 'modern'],
    createdAt: new Date('2011-07-22'),
    updatedAt: new Date(),
  },
  {
    id: 'csharp',
    name: 'C#',
    displayName: 'C#',
    extension: '.cs',
    mimeType: 'text/x-csharp',
    version: '12.0',
    description: 'A modern, object-oriented, and type-safe programming language.',
    website: 'https://docs.microsoft.com/en-us/dotnet/csharp/',
    documentation: 'https://docs.microsoft.com/en-us/dotnet/csharp/',
    tutorials: ['https://docs.microsoft.com/en-us/dotnet/csharp/tutorials/'],
    examples: ['Hello World', 'Classes', 'Interfaces', 'LINQ'],
    frameworks: ['.NET', 'ASP.NET', 'Xamarin', 'Unity'],
    tools: ['Visual Studio', 'VS Code', 'Rider'],
    community: 'Large',
    difficulty: 'intermediate',
    popularity: 'high',
    jobMarket: 'high',
    learningCurve: 'medium',
    performance: 'high',
    ecosystem: 'large',
    syntax: 'c-like',
    paradigm: 'object-oriented',
    typing: 'static',
    compilation: 'compiled',
    platforms: ['web', 'desktop', 'mobile', 'game'],
    useCases: ['web-development', 'desktop', 'mobile', 'games'],
    features: ['type-safe', 'garbage-collection', 'linq'],
    limitations: ['windows-focused', 'learning-curve'],
    bestPractices: ['clean-code', 'solid-principles', 'async-await'],
    resources: ['Microsoft Docs', 'C# Programming Guide', 'Pluralsight'],
    icon: 'csharp',
    color: '#239120',
    gradient: 'from-green-500 to-green-700',
    category: 'programming',
    tags: ['microsoft', 'enterprise', 'versatile'],
    createdAt: new Date('2000-12-01'),
    updatedAt: new Date(),
  },
  {
    id: 'scala',
    name: 'Scala',
    displayName: 'Scala',
    extension: '.scala',
    mimeType: 'text/x-scala',
    version: '3.3',
    description: 'A modern multi-paradigm programming language designed to express common programming patterns in a concise, elegant, and type-safe way.',
    website: 'https://www.scala-lang.org/',
    documentation: 'https://docs.scala-lang.org/',
    tutorials: ['https://docs.scala-lang.org/tour/tour-of-scala.html'],
    examples: ['Hello World', 'Case Classes', 'Pattern Matching', 'Functions'],
    frameworks: ['Akka', 'Play', 'Spark', 'Cats'],
    tools: ['IntelliJ IDEA', 'VS Code', 'sbt'],
    community: 'Medium',
    difficulty: 'advanced',
    popularity: 'low',
    jobMarket: 'low',
    learningCurve: 'hard',
    performance: 'high',
    ecosystem: 'medium',
    syntax: 'functional',
    paradigm: 'functional',
    typing: 'static',
    compilation: 'compiled',
    platforms: ['jvm', 'web', 'data'],
    useCases: ['big-data', 'backend', 'functional-programming'],
    features: ['functional', 'immutable', 'type-system'],
    limitations: ['complexity', 'learning-curve'],
    bestPractices: ['functional-style', 'immutability', 'type-safety'],
    resources: ['Scala Docs', 'Scala School', 'Functional Programming in Scala'],
    icon: 'scala',
    color: '#dc322f',
    gradient: 'from-red-500 to-red-700',
    category: 'programming',
    tags: ['functional', 'jvm', 'complex'],
    createdAt: new Date('2004-01-20'),
    updatedAt: new Date(),
  },
  {
    id: 'r',
    name: 'R',
    displayName: 'R',
    extension: '.r',
    mimeType: 'text/x-r',
    version: '4.3',
    description: 'A language and environment for statistical computing and graphics.',
    website: 'https://www.r-project.org/',
    documentation: 'https://www.r-project.org/other-docs.html',
    tutorials: ['https://cran.r-project.org/doc/manuals/r-release/R-intro.html'],
    examples: ['Hello World', 'Data Frames', 'Functions', 'Plotting'],
    frameworks: ['Shiny', 'ggplot2', 'dplyr', 'tidyr'],
    tools: ['RStudio', 'VS Code', 'Jupyter'],
    community: 'Large',
    difficulty: 'intermediate',
    popularity: 'medium',
    jobMarket: 'medium',
    learningCurve: 'medium',
    performance: 'medium',
    ecosystem: 'large',
    syntax: 'functional',
    paradigm: 'functional',
    typing: 'dynamic',
    compilation: 'interpreted',
    platforms: ['data-science', 'statistics'],
    useCases: ['data-analysis', 'statistics', 'visualization'],
    features: ['statistics', 'visualization', 'packages'],
    limitations: ['performance', 'memory'],
    bestPractices: ['tidyverse', 'reproducible-research', 'packages'],
    resources: ['R for Data Science', 'Advanced R', 'R Cookbook'],
    icon: 'r',
    color: '#276dc3',
    gradient: 'from-blue-500 to-blue-700',
    category: 'programming',
    tags: ['data-science', 'statistics', 'research'],
    createdAt: new Date('1993-08-01'),
    updatedAt: new Date(),
  },
  {
    id: 'dart',
    name: 'Dart',
    displayName: 'Dart',
    extension: '.dart',
    mimeType: 'text/x-dart',
    version: '3.1',
    description: 'A client-optimized language for fast apps on any platform.',
    website: 'https://dart.dev/',
    documentation: 'https://dart.dev/guides',
    tutorials: ['https://dart.dev/tutorials'],
    examples: ['Hello World', 'Classes', 'Functions', 'Async'],
    frameworks: ['Flutter', 'AngularDart', 'Aqueduct'],
    tools: ['VS Code', 'Android Studio', 'IntelliJ IDEA'],
    community: 'Growing',
    difficulty: 'intermediate',
    popularity: 'medium',
    jobMarket: 'growing',
    learningCurve: 'easy',
    performance: 'high',
    ecosystem: 'growing',
    syntax: 'c-like',
    paradigm: 'object-oriented',
    typing: 'static',
    compilation: 'compiled',
    platforms: ['mobile', 'web', 'desktop'],
    useCases: ['mobile-development', 'web', 'desktop'],
    features: ['hot-reload', 'performance', 'cross-platform'],
    limitations: ['ecosystem', 'learning-curve'],
    bestPractices: ['flutter-style', 'async-await', 'null-safety'],
    resources: ['Dart Docs', 'Flutter Docs', 'Dart Academy'],
    icon: 'dart',
    color: '#0175c2',
    gradient: 'from-blue-500 to-blue-700',
    category: 'programming',
    tags: ['mobile', 'flutter', 'cross-platform'],
    createdAt: new Date('2011-10-10'),
    updatedAt: new Date(),
  },
];

// Template definitions
export const TEMPLATES: EditorTemplate[] = [
  // JavaScript templates
    {
      id: 'js-hello-world',
      name: 'Hello World',
    description: 'Basic JavaScript hello world program',
    language: 'javascript',
    code: `// Hello World in JavaScript
console.log("Hello, World!");

// Variables
let message = "Welcome to JavaScript!";
const name = "Developer";

// Function
function greet(name) {
    return \`Hello, \${name}!\`;
}

// Call function
console.log(greet(name));
console.log(message);`,
    category: 'basic',
    difficulty: 'beginner',
    tags: ['hello-world', 'variables', 'functions'],
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'js-function',
    name: 'Functions',
    description: 'JavaScript functions and arrow functions',
    language: 'javascript',
    code: `// Traditional function
function add(a, b) {
    return a + b;
}

// Arrow function
const multiply = (a, b) => a * b;

// Function with default parameters
function greet(name = "World") {
    return \`Hello, \${name}!\`;
}

// Higher-order function
function createMultiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

// Usage
console.log(add(5, 3)); // 8
console.log(multiply(4, 6)); // 24
console.log(greet()); // Hello, World!
console.log(greet("Alice")); // Hello, Alice!

const double = createMultiplier(2);
console.log(double(5)); // 10`,
    category: 'functions',
    difficulty: 'beginner',
    tags: ['functions', 'arrow-functions', 'higher-order'],
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'js-objects',
    name: 'Objects and Classes',
    description: 'JavaScript objects and ES6 classes',
    language: 'javascript',
    code: `// Object literal
const person = {
    name: "John",
    age: 30,
    greet() {
        return \`Hello, I'm \${this.name}\`;
    }
};

// ES6 Class
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    greet() {
        return \`Hello, I'm \${this.name}\`;
    }
    
    getAge() {
        return this.age;
    }
}

// Inheritance
class Student extends Person {
    constructor(name, age, grade) {
        super(name, age);
        this.grade = grade;
    }
    
    study() {
        return \`\${this.name} is studying\`;
    }
}

// Usage
console.log(person.greet()); // Hello, I'm John

const student = new Student("Alice", 20, "A");
console.log(student.greet()); // Hello, I'm Alice
console.log(student.study()); // Alice is studying`,
    category: 'oop',
    difficulty: 'intermediate',
    tags: ['objects', 'classes', 'inheritance'],
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'js-async',
    name: 'Async/Await',
    description: 'JavaScript asynchronous programming',
    language: 'javascript',
    code: `// Promise
function fetchData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Data fetched successfully!");
        }, 1000);
    });
}

// Async/Await
async function processData() {
    try {
        console.log("Starting to fetch data...");
        const data = await fetchData();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error:", error);
    }
}

// Multiple async operations
async function fetchMultipleData() {
    try {
        const [data1, data2] = await Promise.all([
            fetchData(),
            fetchData()
        ]);
        console.log("Both operations completed:", data1, data2);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Call async functions
processData();
fetchMultipleData();`,
    category: 'async',
    difficulty: 'intermediate',
    tags: ['async', 'await', 'promises'],
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // TypeScript templates
    {
      id: 'ts-hello-world',
      name: 'Hello World',
    description: 'Basic TypeScript hello world program',
    language: 'typescript',
    code: `// Hello World in TypeScript
console.log("Hello, World!");

// Variables with types
let message: string = "Welcome to TypeScript!";
const name: string = "Developer";

// Function with types
function greet(name: string): string {
    return \`Hello, \${name}!\`;
}

// Interface
interface Person {
    name: string;
    age: number;
    greet(): string;
}

// Class implementing interface
class PersonImpl implements Person {
    constructor(public name: string, public age: number) {}
    
    greet(): string {
        return \`Hello, I'm \${this.name} and I'm \${this.age} years old\`;
    }
}

// Usage
console.log(greet(name));
console.log(message);

const person = new PersonImpl("Alice", 25);
console.log(person.greet());`,
    category: 'basic',
    difficulty: 'beginner',
    tags: ['hello-world', 'types', 'interfaces'],
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Python templates
  {
    id: 'py-hello-world',
    name: 'Hello World',
    description: 'Basic Python hello world program',
    language: 'python',
    code: `# Hello World in Python
print("Hello, World!")

# Variables
message = "Welcome to Python!"
name = "Developer"

# Function
def greet(name):
    return f"Hello, {name}!"

# Class
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def greet(self):
        return f"Hello, I'm {self.name} and I'm {self.age} years old"

# Usage
print(greet(name))
print(message)

person = Person("Alice", 25)
print(person.greet())`,
    category: 'basic',
    difficulty: 'beginner',
    tags: ['hello-world', 'classes', 'functions'],
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Java templates
    {
      id: 'java-hello-world',
      name: 'Hello World',
    description: 'Basic Java hello world program',
    language: 'java',
    code: `// Hello World in Java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Variables
        String message = "Welcome to Java!";
        String name = "Developer";
        
        // Method call
        greet(name);
        System.out.println(message);
    }
    
    public static void greet(String name) {
        System.out.println("Hello, " + name + "!");
    }
}`,
    category: 'basic',
    difficulty: 'beginner',
    tags: ['hello-world', 'classes', 'methods'],
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // C++ templates
  {
    id: 'cpp-hello-world',
    name: 'Hello World',
    description: 'Basic C++ hello world program',
    language: 'cpp',
    code: `// Hello World in C++
#include <iostream>
#include <string>

int main() {
    std::cout << "Hello, World!" << std::endl;
    
    // Variables
    std::string message = "Welcome to C++!";
    std::string name = "Developer";
    
    // Function call
    greet(name);
    std::cout << message << std::endl;
    
    return 0;
}

void greet(const std::string& name) {
    std::cout << "Hello, " << name << "!" << std::endl;
}`,
    category: 'basic',
    difficulty: 'beginner',
    tags: ['hello-world', 'iostream', 'functions'],
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Utility functions
export function getLanguageById(id: string): EditorLanguage | undefined {
  return LANGUAGES.find(lang => lang.id === id);
}

export function getLanguagesByCategory(category: string): EditorLanguage[] {
  return LANGUAGES.filter(lang => lang.category === category);
}

export function getLanguagesByDifficulty(difficulty: string): EditorLanguage[] {
  return LANGUAGES.filter(lang => lang.difficulty === difficulty);
}

export function getTemplatesForLanguage(languageId: string): EditorTemplate[] {
  return TEMPLATES.filter(template => template.language === languageId);
}

export function getTemplatesByCategory(category: string): EditorTemplate[] {
  return TEMPLATES.filter(template => template.category === category);
}

export function getTemplatesByDifficulty(difficulty: string): EditorTemplate[] {
  return TEMPLATES.filter(template => template.difficulty === difficulty);
}

export function getPopularLanguages(): EditorLanguage[] {
  return LANGUAGES.filter(lang => lang.popularity === 'high').slice(0, 10);
}

export function getBeginnerLanguages(): EditorLanguage[] {
  return LANGUAGES.filter(lang => lang.difficulty === 'beginner');
}

export function getAdvancedLanguages(): EditorLanguage[] {
  return LANGUAGES.filter(lang => lang.difficulty === 'advanced');
}

export function searchLanguages(query: string): EditorLanguage[] {
  const lowercaseQuery = query.toLowerCase();
  return LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(lowercaseQuery) ||
    lang.displayName.toLowerCase().includes(lowercaseQuery) ||
    lang.description.toLowerCase().includes(lowercaseQuery) ||
    lang.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

export function searchTemplates(query: string): EditorTemplate[] {
  const lowercaseQuery = query.toLowerCase();
  return TEMPLATES.filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}