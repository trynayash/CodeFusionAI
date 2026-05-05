# 🚀 CodeFusion AI

> **A next-generation AI-powered coding platform with intelligent code completion, real-time error detection, and interactive learning**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)](https://supabase.com/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-AI%20Models-purple.svg)](https://openrouter.ai/)

## 🌟 **Overview**

CodeFusion AI is a comprehensive, production-ready coding platform that combines the power of modern web technologies with AI-driven assistance. Built with React, TypeScript, and Supabase, it provides a seamless coding experience with intelligent features, real-time collaboration, and extensive language support.

## ✨ **Key Features**

### 🤖 **AI-Powered Development**
- **Free AI Models Integration** - Uses OpenRouter's free models (Llama 3.2, Phi-3, Gemma, Mistral)
- **Intelligent Code Analysis** - Syntax, performance, security, and suggestions analysis
- **Smart Code Completion** - Context-aware code suggestions and completions
- **Code Explanation** - AI-powered code understanding and documentation
- **Learning Path Generation** - Personalized learning recommendations

### 💻 **Advanced Code Editor**
- **Monaco Editor Integration** - VS Code editor experience in the browser
- **16+ Programming Languages** - Python, JavaScript, TypeScript, Java, C++, C, Go, Rust, PHP, Ruby, Swift, Kotlin, C#, Scala, R, Dart
- **Multi-file Project Support** - Advanced project-based editor with file management
- **Real-time Collaboration** - Multi-user editing with live cursors and presence
- **Secure Code Execution** - Sandboxed execution environment with timeout handling
- **Syntax Highlighting** - Full language support with intelligent highlighting

### 🎓 **Interactive Learning Platform**
- **Comprehensive Course Catalog** - Data Structures, Web Development, and more
- **Progress Tracking** - Detailed analytics and learning progress
- **Interactive Challenges** - Hands-on coding exercises and projects
- **Community Features** - Forums, code reviews, and mentorship
- **Certificate System** - Achievement tracking and skill validation

### 🔐 **Enterprise-Grade Security**
- **Supabase Authentication** - Email/password, magic links, OAuth integration
- **Session Management** - Automatic session handling with timeout warnings
- **Rate Limiting** - API protection and abuse prevention
- **Input Sanitization** - XSS protection and secure data handling
- **Protected Routes** - Secure page access and user management

### 🎨 **Modern UI/UX**
- **Responsive Design** - Perfect experience across all devices
- **Dark/Light Theme** - Automatic theme switching with user preference
- **Framer Motion Animations** - Smooth, professional animations
- **Accessibility** - WCAG compliant with keyboard navigation
- **Professional Design System** - Consistent UI components and branding

## 🏗️ **Architecture**

### **Frontend Stack**
- **React 18.2.0** - Modern React with concurrent features
- **TypeScript 5.0.0** - Full type safety throughout the application
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **Monaco Editor** - VS Code editor in the browser

### **Backend & Services**
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **OpenRouter API** - Free AI models integration
- **React Query** - Data fetching and caching
- **Zustand** - Lightweight state management
- **Real-time Subscriptions** - Live collaboration features

### **Development Tools**
- **ESLint** - Code quality enforcement
- **Prettier** - Code formatting
- **Jest** - Unit testing framework
- **Playwright** - End-to-end testing
- **MSW** - API mocking for development

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18.0.0 or higher
- npm or yarn package manager
- Git for version control

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/trynayash/CodeFusionAI.git
   cd CodeFusionAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the environment template
   cp .env.example .env
   
   # Configure your environment variables
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:8080
   ```
   
### **Production Build**

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📁 **Project Structure**

```
CodeFusionAI/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── auth/            # Authentication components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── editor/          # Code editor components
│   │   ├── session/         # Session management
│   │   └── ui/              # Base UI components (shadcn/ui)
│   ├── pages/               # Application pages
│   │   ├── editors/         # Language-specific editors
│   │   └── ...              # All application pages
│   ├── services/            # API services and integrations
│   ├── hooks/               # Custom React hooks
│   ├── stores/              # State management (Zustand)
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── config/              # Configuration files
│   ├── contexts/            # React contexts
│   └── assets/              # Static assets and icons
├── public/                  # Public assets
├── tests/                   # Test files
└── docs/                    # Documentation
```

## 🎯 **Supported Programming Languages**

| Language | Status | Features |
|----------|--------|----------|
| **Python** | ✅ Full Support | Syntax highlighting, execution, AI analysis |
| **JavaScript** | ✅ Full Support | ES6+, async/await, modules |
| **TypeScript** | ✅ Full Support | Type checking, interfaces, generics |
| **Java** | ✅ Full Support | OOP, collections, streams |
| **C++** | ✅ Full Support | STL, modern C++ features |
| **C** | ✅ Full Support | Standard library, pointers |
| **Go** | ✅ Full Support | Goroutines, channels, interfaces |
| **Rust** | ✅ Full Support | Ownership, lifetimes, traits |
| **PHP** | ✅ Full Support | OOP, frameworks, web development |
| **Ruby** | ✅ Full Support | Metaprogramming, gems |
| **Swift** | ✅ Full Support | iOS development, optionals |
| **Kotlin** | ✅ Full Support | Android development, coroutines |
| **C#** | ✅ Full Support | .NET, LINQ, async/await |
| **Scala** | ✅ Full Support | Functional programming, JVM |
| **R** | ✅ Full Support | Data science, statistics |
| **Dart** | ✅ Full Support | Flutter development |

## 🔧 **Available Scripts**

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm run test             # Run unit tests
npm run test:e2e         # Run end-to-end tests
npm run test:coverage    # Generate test coverage

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier

# Type Checking
npm run type-check       # Run TypeScript compiler
```

## 🌐 **API Integration**

### **OpenRouter AI Models**
```typescript
// Free models available
const models = [
  'meta-llama/llama-3.2-3b-instruct:free',
  'microsoft/phi-3-mini-128k-instruct:free',
  'google/gemma-2-2b-it:free',
  'mistralai/mistral-7b-instruct:free'
];

// Usage example
const analysis = await aiService.analyzeCode({
  code: userCode,
  language: 'python',
  analysisType: 'syntax'
});
```

### **Supabase Integration**
```typescript
// Authentication
const { user, signIn, signOut } = useAuth();

// Real-time subscriptions
const { data, error } = useQuery({
  queryKey: ['code-snippets'],
  queryFn: fetchCodeSnippets
});
```

## 🎨 **Customization**

### **Theming**
```typescript
// Custom theme configuration
const theme = {
  colors: {
    primary: '#your-primary-color',
    secondary: '#your-secondary-color',
    accent: '#your-accent-color'
  },
  fonts: {
    heading: 'Your-Font',
    body: 'Your-Font'
  }
};
```

### **Language Support**
```typescript
// Adding new language support
const newLanguage = {
  id: 'your-language',
  name: 'Your Language',
  extension: '.yl',
  monacoId: 'your-language',
  compiler: 'your-compiler',
  templates: ['template1', 'template2']
};
```

## 📊 **Performance Features**

- **Code Splitting** - Lazy loading for optimal bundle sizes
- **Caching** - Intelligent caching for AI responses and data
- **Optimization** - Bundle optimization with manual chunks
- **Monitoring** - Real-time performance tracking
- **Memory Management** - Proper cleanup and optimization

## 🔒 **Security Features**

- **Authentication** - Secure user authentication with Supabase
- **Authorization** - Role-based access control
- **Input Validation** - Comprehensive input sanitization
- **Rate Limiting** - API protection and abuse prevention
- **Session Security** - Secure session management
- **CORS Protection** - Cross-origin request security

## 🧪 **Testing**

```bash
# Unit Tests
npm run test

# E2E Tests
npm run test:e2e

# Coverage Report
npm run test:coverage
```

### **Test Structure**
```
tests/
├── unit/                 # Unit tests
├── integration/          # Integration tests
├── e2e/                  # End-to-end tests
└── fixtures/             # Test data and fixtures
```

## 📈 **Analytics & Monitoring**

- **Performance Monitoring** - Real-time performance tracking
- **Error Tracking** - Comprehensive error logging and reporting
- **User Analytics** - Usage patterns and feature adoption
- **Code Quality Metrics** - Code analysis and quality tracking

## 🌍 **Deployment**

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Netlify**
```bash
# Build command
npm run build

# Publish directory
dist
```

### **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "preview"]
```

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Supabase** - Backend infrastructure and authentication
- **OpenRouter** - Free AI models and API access
- **Monaco Editor** - VS Code editor in the browser
- **React Team** - Amazing React framework
- **Vite Team** - Lightning-fast build tool
- **shadcn/ui** - Beautiful UI components

## 📞 **Support**

- **Documentation** - [Full Documentation](https://docs.codefusion.ai)
- **Issues** - [GitHub Issues](https://github.com/trynayash/CodeFusionAI/issues)
- **Discussions** - [GitHub Discussions](https://github.com/trynayash/CodeFusionAI/discussions)
- **Email** - support@codefusion.ai

## 🚀 **Roadmap**

### **Phase 1 (Current)**
- ✅ Core platform functionality
- ✅ AI integration with free models
- ✅ Multi-language support
- ✅ User authentication and management

### **Phase 2 (Q2 2025)**
- 🔄 Advanced AI features
- 🔄 Real-time collaboration
- 🔄 Mobile applications
- 🔄 Enterprise features

### **Phase 3 (Q3 2025)**
- ⏳ Advanced analytics
- ⏳ Custom language support
- ⏳ Plugin system
- ⏳ API marketplace

---

<div align="center">

**Made with ❤️ by [Yash Suthar](https://github.com/trynayash)**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/trynayash)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/yxshsuthar)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/yashrsuthar)

</div>
