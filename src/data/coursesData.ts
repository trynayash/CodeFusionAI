import { Course } from '@/services/PaymentService';

export const coursesData: Course[] = [
  {
    id: 'python-beginners',
    title: 'Python for Beginners',
    description: 'Master Python fundamentals with hands-on projects and real-world applications. Perfect for complete beginners.',
    level: 'Beginner',
    duration: '8 weeks',
    students: 15420,
    rating: 4.9,
    price: 0, // Free course
    image: '🐍',
    skills: ['Variables & Data Types', 'Control Structures', 'Functions', 'OOP Basics', 'File Handling', 'Error Handling'],
    featured: true,
    instructor: 'Dr. Sarah Johnson',
    instructorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    curriculum: [
      {
        module: 'Python Basics',
        lessons: ['Introduction to Python', 'Variables and Data Types', 'Input and Output', 'Comments and Documentation'],
        duration: '1 week'
      },
      {
        module: 'Control Structures',
        lessons: ['Conditional Statements', 'Loops', 'Break and Continue', 'Nested Structures'],
        duration: '2 weeks'
      },
      {
        module: 'Functions and Modules',
        lessons: ['Defining Functions', 'Parameters and Arguments', 'Return Values', 'Modules and Packages'],
        duration: '2 weeks'
      },
      {
        module: 'Object-Oriented Programming',
        lessons: ['Classes and Objects', 'Inheritance', 'Polymorphism', 'Encapsulation'],
        duration: '2 weeks'
      },
      {
        module: 'File Handling and Error Management',
        lessons: ['Reading and Writing Files', 'Exception Handling', 'Debugging Techniques', 'Best Practices'],
        duration: '1 week'
      }
    ],
    prerequisites: ['Basic computer knowledge', 'No programming experience required'],
    whatYouWillLearn: [
      'Write clean and efficient Python code',
      'Understand object-oriented programming concepts',
      'Handle files and data processing',
      'Debug and troubleshoot Python programs',
      'Build real-world Python applications',
      'Prepare for advanced Python topics'
    ],
    category: 'Programming',
    language: 'English',
    certificate: true,
    lifetime_access: true,
    mobile_access: true,
    assignments: 15,
    projects: 5,
    quizzes: 8
  },
  {
    id: 'advanced-javascript',
    title: 'Advanced JavaScript',
    description: 'Deep dive into modern JavaScript, ES6+, async programming, and popular frameworks.',
    level: 'Advanced',
    duration: '12 weeks',
    students: 8930,
    rating: 4.8,
    price: 2999,
    originalPrice: 4999,
    image: '⚡',
    skills: ['ES6+ Features', 'Async/Await', 'React/Vue', 'Node.js', 'TypeScript', 'Testing'],
    instructor: 'Alex Rodriguez',
    instructorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    curriculum: [
      {
        module: 'Modern JavaScript Features',
        lessons: ['ES6+ Syntax', 'Arrow Functions', 'Destructuring', 'Template Literals', 'Modules'],
        duration: '2 weeks'
      },
      {
        module: 'Asynchronous Programming',
        lessons: ['Promises', 'Async/Await', 'Fetch API', 'Error Handling', 'Concurrent Operations'],
        duration: '2 weeks'
      },
      {
        module: 'Advanced Concepts',
        lessons: ['Closures', 'Prototypes', 'Event Loop', 'Memory Management', 'Performance Optimization'],
        duration: '3 weeks'
      },
      {
        module: 'Framework Integration',
        lessons: ['React Fundamentals', 'Vue.js Basics', 'State Management', 'Component Architecture'],
        duration: '3 weeks'
      },
      {
        module: 'Node.js and Backend',
        lessons: ['Server-side JavaScript', 'Express.js', 'Database Integration', 'API Development'],
        duration: '2 weeks'
      }
    ],
    prerequisites: ['Solid understanding of basic JavaScript', 'HTML and CSS knowledge', '6+ months programming experience'],
    whatYouWillLearn: [
      'Master modern JavaScript ES6+ features',
      'Build complex asynchronous applications',
      'Understand advanced JavaScript concepts',
      'Work with popular frameworks like React and Vue',
      'Develop full-stack JavaScript applications',
      'Write clean, maintainable, and performant code'
    ],
    category: 'Web Development',
    language: 'English',
    certificate: true,
    lifetime_access: true,
    mobile_access: true,
    assignments: 25,
    projects: 8,
    quizzes: 12
  },
  {
    id: 'data-structures-algorithms',
    title: 'Data Structures & Algorithms',
    description: 'Master computer science fundamentals essential for technical interviews and efficient programming.',
    level: 'Intermediate',
    duration: '10 weeks',
    students: 12150,
    rating: 4.9,
    price: 3999,
    originalPrice: 5999,
    image: '🧠',
    skills: ['Arrays & Strings', 'Trees & Graphs', 'Dynamic Programming', 'System Design', 'Big O Notation', 'Sorting Algorithms'],
    instructor: 'Prof. Michael Chen',
    instructorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    curriculum: [
      {
        module: 'Fundamentals',
        lessons: ['Big O Notation', 'Time and Space Complexity', 'Algorithm Analysis', 'Problem Solving Approach'],
        duration: '1 week'
      },
      {
        module: 'Linear Data Structures',
        lessons: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Hash Tables'],
        duration: '2 weeks'
      },
      {
        module: 'Trees and Graphs',
        lessons: ['Binary Trees', 'Binary Search Trees', 'Graph Representation', 'Tree/Graph Traversals'],
        duration: '2 weeks'
      },
      {
        module: 'Advanced Algorithms',
        lessons: ['Sorting Algorithms', 'Searching Algorithms', 'Greedy Algorithms', 'Divide and Conquer'],
        duration: '2 weeks'
      },
      {
        module: 'Dynamic Programming',
        lessons: ['DP Concepts', 'Memoization', 'Tabulation', 'Common DP Problems', 'Optimization Techniques'],
        duration: '2 weeks'
      },
      {
        module: 'System Design Basics',
        lessons: ['Scalability', 'Load Balancing', 'Caching', 'Database Design', 'Microservices'],
        duration: '1 week'
      }
    ],
    prerequisites: ['Programming experience in any language', 'Basic mathematics knowledge', 'Understanding of recursion'],
    whatYouWillLearn: [
      'Analyze algorithm complexity using Big O notation',
      'Implement fundamental data structures from scratch',
      'Solve complex algorithmic problems efficiently',
      'Prepare for technical interviews at top companies',
      'Design scalable systems and architectures',
      'Optimize code for better performance'
    ],
    category: 'Computer Science',
    language: 'English',
    certificate: true,
    lifetime_access: true,
    mobile_access: true,
    assignments: 30,
    projects: 10,
    quizzes: 15
  },
  {
    id: 'fullstack-web-development',
    title: 'Full-Stack Web Development',
    description: 'Build complete web applications from frontend to backend deployment using modern technologies.',
    level: 'Intermediate',
    duration: '16 weeks',
    students: 6780,
    rating: 4.7,
    price: 5999,
    originalPrice: 8999,
    image: '🌐',
    skills: ['React/Angular', 'Node.js/Express', 'Databases', 'AWS/Docker', 'REST APIs', 'Authentication'],
    instructor: 'Emma Thompson',
    instructorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    curriculum: [
      {
        module: 'Frontend Development',
        lessons: ['HTML5 & CSS3', 'JavaScript ES6+', 'React.js', 'State Management', 'Responsive Design'],
        duration: '4 weeks'
      },
      {
        module: 'Backend Development',
        lessons: ['Node.js Fundamentals', 'Express.js Framework', 'RESTful APIs', 'Middleware', 'Authentication'],
        duration: '4 weeks'
      },
      {
        module: 'Database Integration',
        lessons: ['SQL Databases', 'MongoDB', 'Database Design', 'ORM/ODM', 'Data Modeling'],
        duration: '3 weeks'
      },
      {
        module: 'Advanced Topics',
        lessons: ['Real-time Communication', 'File Uploads', 'Payment Integration', 'Security Best Practices'],
        duration: '2 weeks'
      },
      {
        module: 'Deployment & DevOps',
        lessons: ['Docker Containers', 'AWS Deployment', 'CI/CD Pipelines', 'Monitoring', 'Performance Optimization'],
        duration: '3 weeks'
      }
    ],
    prerequisites: ['HTML, CSS, and JavaScript knowledge', 'Basic understanding of databases', 'Familiarity with command line'],
    whatYouWillLearn: [
      'Build modern, responsive web applications',
      'Develop RESTful APIs and microservices',
      'Integrate databases and manage data effectively',
      'Implement user authentication and authorization',
      'Deploy applications to cloud platforms',
      'Follow industry best practices and security standards'
    ],
    category: 'Web Development',
    language: 'English',
    certificate: true,
    lifetime_access: true,
    mobile_access: true,
    assignments: 40,
    projects: 15,
    quizzes: 20
  },
  {
    id: 'machine-learning-python',
    title: 'Machine Learning with Python',
    description: 'Learn ML algorithms, data preprocessing, model training, and deployment using Python and popular libraries.',
    level: 'Advanced',
    duration: '14 weeks',
    students: 4920,
    rating: 4.8,
    price: 6999,
    originalPrice: 9999,
    image: '🤖',
    skills: ['Scikit-learn', 'TensorFlow', 'Data Analysis', 'Model Deployment', 'Deep Learning', 'Computer Vision'],
    instructor: 'Dr. Raj Patel',
    instructorImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    curriculum: [
      {
        module: 'Python for Data Science',
        lessons: ['NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'Jupyter Notebooks'],
        duration: '2 weeks'
      },
      {
        module: 'Machine Learning Fundamentals',
        lessons: ['ML Concepts', 'Supervised Learning', 'Unsupervised Learning', 'Model Evaluation'],
        duration: '3 weeks'
      },
      {
        module: 'Advanced ML Algorithms',
        lessons: ['Ensemble Methods', 'SVM', 'Neural Networks', 'Clustering', 'Dimensionality Reduction'],
        duration: '3 weeks'
      },
      {
        module: 'Deep Learning',
        lessons: ['TensorFlow/Keras', 'CNN', 'RNN', 'Transfer Learning', 'Computer Vision'],
        duration: '4 weeks'
      },
      {
        module: 'Model Deployment',
        lessons: ['Flask APIs', 'Docker Deployment', 'Cloud Platforms', 'MLOps', 'Production Best Practices'],
        duration: '2 weeks'
      }
    ],
    prerequisites: ['Strong Python programming skills', 'Statistics and linear algebra knowledge', 'Data analysis experience'],
    whatYouWillLearn: [
      'Implement machine learning algorithms from scratch',
      'Use popular ML libraries like scikit-learn and TensorFlow',
      'Preprocess and analyze large datasets',
      'Build and train deep learning models',
      'Deploy ML models to production environments',
      'Apply ML to real-world business problems'
    ],
    category: 'Data Science',
    language: 'English',
    certificate: true,
    lifetime_access: true,
    mobile_access: true,
    assignments: 35,
    projects: 12,
    quizzes: 18
  },
  {
    id: 'mobile-app-development',
    title: 'Mobile App Development',
    description: 'Create native and cross-platform mobile applications for iOS and Android using modern frameworks.',
    level: 'Intermediate',
    duration: '12 weeks',
    students: 7340,
    rating: 4.6,
    price: 4999,
    originalPrice: 7499,
    image: '📱',
    skills: ['React Native', 'Flutter', 'iOS/Android', 'App Store Publishing', 'Firebase', 'Push Notifications'],
    instructor: 'James Wilson',
    instructorImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    curriculum: [
      {
        module: 'Mobile Development Fundamentals',
        lessons: ['Mobile UI/UX Principles', 'Platform Differences', 'Development Environment Setup'],
        duration: '1 week'
      },
      {
        module: 'React Native Development',
        lessons: ['React Native Basics', 'Navigation', 'State Management', 'Native Modules'],
        duration: '4 weeks'
      },
      {
        module: 'Flutter Development',
        lessons: ['Dart Language', 'Flutter Widgets', 'State Management', 'Platform Integration'],
        duration: '4 weeks'
      },
      {
        module: 'Backend Integration',
        lessons: ['REST APIs', 'Firebase', 'Authentication', 'Real-time Data', 'Push Notifications'],
        duration: '2 weeks'
      },
      {
        module: 'Publishing and Deployment',
        lessons: ['App Store Guidelines', 'Publishing Process', 'App Analytics', 'Maintenance'],
        duration: '1 week'
      }
    ],
    prerequisites: ['JavaScript/TypeScript knowledge', 'Basic understanding of mobile platforms', 'React experience (helpful)'],
    whatYouWillLearn: [
      'Build cross-platform mobile applications',
      'Master React Native and Flutter frameworks',
      'Integrate with backend services and APIs',
      'Implement user authentication and data storage',
      'Publish apps to App Store and Google Play',
      'Optimize app performance and user experience'
    ],
    category: 'Mobile Development',
    language: 'English',
    certificate: true,
    lifetime_access: true,
    mobile_access: true,
    assignments: 28,
    projects: 10,
    quizzes: 14
  }
];

export const learningPaths = [
  {
    id: 'frontend-developer',
    title: 'Frontend Developer',
    description: 'Master modern frontend technologies and build beautiful user interfaces',
    courses: ['python-beginners', 'advanced-javascript', 'fullstack-web-development'],
    duration: '6 months',
    icon: '🎨',
    skills: ['HTML/CSS', 'JavaScript', 'React', 'Vue.js', 'Responsive Design'],
    price: 8999,
    originalPrice: 12999
  },
  {
    id: 'backend-engineer',
    title: 'Backend Engineer',
    description: 'Build scalable server-side applications and APIs',
    courses: ['python-beginners', 'advanced-javascript', 'data-structures-algorithms', 'fullstack-web-development'],
    duration: '7 months',
    icon: '⚙️',
    skills: ['Node.js', 'Python', 'Databases', 'API Design', 'System Architecture'],
    price: 11999,
    originalPrice: 16999
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Analyze data and build machine learning models',
    courses: ['python-beginners', 'data-structures-algorithms', 'machine-learning-python'],
    duration: '8 months',
    icon: '📊',
    skills: ['Python', 'Statistics', 'Machine Learning', 'Data Visualization', 'Deep Learning'],
    price: 9999,
    originalPrice: 14999
  },
  {
    id: 'mobile-developer',
    title: 'Mobile Developer',
    description: 'Create mobile applications for iOS and Android',
    courses: ['advanced-javascript', 'mobile-app-development'],
    duration: '5 months',
    icon: '📱',
    skills: ['React Native', 'Flutter', 'Mobile UI/UX', 'App Publishing', 'Cross-platform Development'],
    price: 6999,
    originalPrice: 9999
  }
];

export const categories = [
  'All Courses',
  'Programming',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Computer Science'
];

export const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

export const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' }
];