/**
 * Smart Templates Service
 * AI-powered project templates and boilerplate generation
 */

import { log } from '@/utils/logger';
import { RateLimiter } from '@/utils/security';
import { generateId } from '@/utils/api';

export interface TemplateRequest {
  projectType: 'web-app' | 'mobile-app' | 'desktop-app' | 'api' | 'library' | 'cli' | 'game' | 'data-science' | 'ml' | 'blockchain';
  language: string;
  framework?: string;
  features: string[];
  preferences?: {
    architecture?: 'mvc' | 'mvp' | 'mvvm' | 'microservices' | 'monolith';
    database?: 'sqlite' | 'postgresql' | 'mongodb' | 'redis' | 'none';
    authentication?: 'jwt' | 'oauth' | 'session' | 'none';
    styling?: 'css' | 'scss' | 'tailwind' | 'material-ui' | 'bootstrap';
    testing?: 'jest' | 'mocha' | 'pytest' | 'junit' | 'none';
    deployment?: 'docker' | 'heroku' | 'aws' | 'vercel' | 'none';
  };
  complexity: 'simple' | 'medium' | 'complex';
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  language: string;
  framework?: string;
  complexity: 'simple' | 'medium' | 'complex';
  estimatedTime: number; // in minutes
  features: string[];
  files: TemplateFile[];
  dependencies: TemplateDependency[];
  setup: {
    commands: string[];
    instructions: string[];
  };
  structure: ProjectStructure;
  metadata: {
    author: string;
    version: string;
    lastUpdated: Date;
    tags: string[];
    rating: number;
    downloads: number;
  };
}

export interface TemplateFile {
  path: string;
  content: string;
  description: string;
  type: 'source' | 'config' | 'documentation' | 'test' | 'asset';
  isRequired: boolean;
  isGenerated: boolean;
}

export interface TemplateDependency {
  name: string;
  version: string;
  type: 'production' | 'development' | 'peer';
  description: string;
  category: 'framework' | 'library' | 'tool' | 'utility';
}

export interface ProjectStructure {
  directories: Array<{
    name: string;
    description: string;
    children?: ProjectStructure;
  }>;
  files: Array<{
    name: string;
    description: string;
    type: string;
  }>;
}

export interface TemplateResponse {
  templates: ProjectTemplate[];
  recommendations: {
    primary: ProjectTemplate;
    alternatives: ProjectTemplate[];
  };
  customization: {
    suggestions: string[];
    modifications: Array<{
      file: string;
      changes: string[];
    }>;
  };
  confidence: number;
  processingTime: number;
}

class SmartTemplatesService {
  private cache = new Map<string, TemplateResponse>();
  private cacheTimeout = 60 * 60 * 1000; // 1 hour
  private templateLibrary = new Map<string, ProjectTemplate>();

  constructor() {
    this.initializeTemplateLibrary();
    log.info('Smart Templates Service initialized', {}, 'SMART_TEMPLATES');
  }

  /**
   * Initialize template library
   */
  private initializeTemplateLibrary(): void {
    // React Web App Template
    const reactTemplate: ProjectTemplate = {
      id: 'react-web-app',
      name: 'React Web Application',
      description: 'Modern React application with TypeScript, Vite, and Tailwind CSS',
      category: 'web-app',
      language: 'typescript',
      framework: 'react',
      complexity: 'medium',
      estimatedTime: 45,
      features: ['TypeScript', 'Vite', 'Tailwind CSS', 'ESLint', 'Prettier', 'Hot Reload'],
      files: [
        {
          path: 'package.json',
          content: `{
  "name": "my-react-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.28",
    "@types/react-dom": "^18.0.11",
    "@typescript-eslint/eslint-plugin": "^5.57.1",
    "@typescript-eslint/parser": "^5.57.1",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.38.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.3.4",
    "postcss": "^8.4.23",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.0.2",
    "vite": "^4.3.2"
  }
}`,
          description: 'Project dependencies and scripts',
          type: 'config',
          isRequired: true,
          isGenerated: true
        },
        {
          path: 'src/App.tsx',
          content: `import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to React + Vite + TypeScript
        </h1>
        <div className="text-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setCount((count) => count + 1)}
          >
            count is {count}
          </button>
          <p className="mt-4 text-gray-600">
            Edit <code className="bg-gray-200 px-1 rounded">src/App.tsx</code> and save to test HMR
          </p>
        </div>
      </div>
    </div>
  )
}

export default App`,
          description: 'Main application component',
          type: 'source',
          isRequired: true,
          isGenerated: true
        },
        {
          path: 'src/main.tsx',
          content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
          description: 'Application entry point',
          type: 'source',
          isRequired: true,
          isGenerated: true
        },
        {
          path: 'src/index.css',
          content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`,
          description: 'Global styles with Tailwind CSS',
          type: 'source',
          isRequired: true,
          isGenerated: true
        },
        {
          path: 'tailwind.config.js',
          content: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,
          description: 'Tailwind CSS configuration',
          type: 'config',
          isRequired: true,
          isGenerated: true
        },
        {
          path: 'vite.config.ts',
          content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})`,
          description: 'Vite build configuration',
          type: 'config',
          isRequired: true,
          isGenerated: true
        },
        {
          path: 'tsconfig.json',
          content: `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,
          description: 'TypeScript configuration',
          type: 'config',
          isRequired: true,
          isGenerated: true
        },
        {
          path: 'README.md',
          content: `# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Build for production:
   \`\`\`bash
   npm run build
   \`\`\`

## Features

- ⚡️ Vite for fast development and building
- ⚛️ React 18 with TypeScript
- 🎨 Tailwind CSS for styling
- 🔧 ESLint for code linting
- 📦 Modern build tools

## Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run lint\` - Run ESLint
- \`npm run preview\` - Preview production build`,
          description: 'Project documentation',
          type: 'documentation',
          isRequired: false,
          isGenerated: true
        }
      ],
      dependencies: [
        {
          name: 'react',
          version: '^18.2.0',
          type: 'production',
          description: 'React library for building user interfaces',
          category: 'framework'
        },
        {
          name: 'react-dom',
          version: '^18.2.0',
          type: 'production',
          description: 'React DOM rendering library',
          category: 'framework'
        },
        {
          name: 'typescript',
          version: '^5.0.2',
          type: 'development',
          description: 'TypeScript compiler',
          category: 'tool'
        },
        {
          name: 'vite',
          version: '^4.3.2',
          type: 'development',
          description: 'Fast build tool and dev server',
          category: 'tool'
        },
        {
          name: 'tailwindcss',
          version: '^3.3.0',
          type: 'development',
          description: 'Utility-first CSS framework',
          category: 'library'
        }
      ],
      setup: {
        commands: [
          'npm install',
          'npm run dev'
        ],
        instructions: [
          'Clone or download the template files',
          'Run npm install to install dependencies',
          'Run npm run dev to start the development server',
          'Open http://localhost:5173 in your browser'
        ]
      },
      structure: {
        directories: [
          {
            name: 'src',
            description: 'Source code directory',
            children: {
              directories: [
                {
                  name: 'components',
                  description: 'Reusable React components'
                },
                {
                  name: 'pages',
                  description: 'Page components'
                },
                {
                  name: 'hooks',
                  description: 'Custom React hooks'
                },
                {
                  name: 'utils',
                  description: 'Utility functions'
                }
              ],
              files: [
                { name: 'App.tsx', description: 'Main application component', type: 'source' },
                { name: 'main.tsx', description: 'Application entry point', type: 'source' },
                { name: 'index.css', description: 'Global styles', type: 'source' }
              ]
            }
          },
          {
            name: 'public',
            description: 'Static assets'
          }
        ],
        files: [
          { name: 'package.json', description: 'Project configuration', type: 'config' },
          { name: 'tsconfig.json', description: 'TypeScript configuration', type: 'config' },
          { name: 'vite.config.ts', description: 'Vite configuration', type: 'config' },
          { name: 'tailwind.config.js', description: 'Tailwind CSS configuration', type: 'config' },
          { name: 'README.md', description: 'Project documentation', type: 'documentation' }
        ]
      },
      metadata: {
        author: 'CodeFusion AI',
        version: '1.0.0',
        lastUpdated: new Date(),
        tags: ['react', 'typescript', 'vite', 'tailwind', 'modern'],
        rating: 4.8,
        downloads: 1250
      }
    };

    // Python FastAPI Template
    const fastApiTemplate: ProjectTemplate = {
      id: 'python-fastapi',
      name: 'Python FastAPI Application',
      description: 'Modern Python web API with FastAPI, Pydantic, and SQLAlchemy',
      category: 'api',
      language: 'python',
      framework: 'fastapi',
      complexity: 'medium',
      estimatedTime: 30,
      features: ['FastAPI', 'Pydantic', 'SQLAlchemy', 'Alembic', 'Pytest', 'Docker'],
      files: [
        {
          path: 'requirements.txt',
          content: `fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
alembic==1.12.1
pydantic==2.5.0
pydantic-settings==2.1.0
python-multipart==0.0.6
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.2`,
          description: 'Python dependencies',
          type: 'config',
          isRequired: true,
          isGenerated: true
        },
        {
          path: 'main.py',
          content: `from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="My FastAPI App",
    description="A modern Python web API",
    version="1.0.0"
)

security = HTTPBearer()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/items/", response_model=List[schemas.Item])
async def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = db.query(models.Item).offset(skip).limit(limit).all()
    return items

@app.post("/items/", response_model=schemas.Item)
async def create_item(item: schemas.ItemCreate, db: Session = Depends(get_db)):
    db_item = models.Item(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)`,
          description: 'Main FastAPI application',
          type: 'source',
          isRequired: true,
          isGenerated: true
        },
        {
          path: 'models.py',
          content: `from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())`,
          description: 'SQLAlchemy models',
          type: 'source',
          isRequired: true,
          isGenerated: true
        },
        {
          path: 'schemas.py',
          content: `from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_active: bool = True

class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True`,
          description: 'Pydantic schemas',
          type: 'source',
          isRequired: true,
          isGenerated: true
        },
        {
          path: 'database.py',
          content: `from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "sqlite:///./app.db"
    
    class Config:
        env_file = ".env"

settings = Settings()

engine = create_engine(settings.database_url, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()`,
          description: 'Database configuration',
          type: 'source',
          isRequired: true,
          isGenerated: true
        }
      ],
      dependencies: [
        {
          name: 'fastapi',
          version: '0.104.1',
          type: 'production',
          description: 'Modern, fast web framework for building APIs',
          category: 'framework'
        },
        {
          name: 'uvicorn',
          version: '0.24.0',
          type: 'production',
          description: 'ASGI server for running FastAPI',
          category: 'tool'
        },
        {
          name: 'sqlalchemy',
          version: '2.0.23',
          type: 'production',
          description: 'SQL toolkit and Object-Relational Mapping library',
          category: 'library'
        },
        {
          name: 'pydantic',
          version: '2.5.0',
          type: 'production',
          description: 'Data validation using Python type annotations',
          category: 'library'
        }
      ],
      setup: {
        commands: [
          'pip install -r requirements.txt',
          'uvicorn main:app --reload'
        ],
        instructions: [
          'Create a virtual environment: python -m venv venv',
          'Activate virtual environment: source venv/bin/activate (Linux/Mac) or venv\\Scripts\\activate (Windows)',
          'Install dependencies: pip install -r requirements.txt',
          'Run the application: uvicorn main:app --reload',
          'Open http://localhost:8000/docs for API documentation'
        ]
      },
      structure: {
        directories: [
          {
            name: 'app',
            description: 'Main application package',
            children: {
              directories: [
                {
                  name: 'api',
                  description: 'API route handlers'
                },
                {
                  name: 'core',
                  description: 'Core application logic'
                },
                {
                  name: 'models',
                  description: 'Database models'
                },
                {
                  name: 'schemas',
                  description: 'Pydantic schemas'
                }
              ],
              files: []
            }
          }
        ],
        files: [
          { name: 'main.py', description: 'Application entry point', type: 'source' },
          { name: 'requirements.txt', description: 'Python dependencies', type: 'config' },
          { name: 'models.py', description: 'Database models', type: 'source' },
          { name: 'schemas.py', description: 'Pydantic schemas', type: 'source' },
          { name: 'database.py', description: 'Database configuration', type: 'source' }
        ]
      },
      metadata: {
        author: 'CodeFusion AI',
        version: '1.0.0',
        lastUpdated: new Date(),
        tags: ['python', 'fastapi', 'sqlalchemy', 'pydantic', 'api'],
        rating: 4.9,
        downloads: 980
      }
    };

    // Node.js Express Template
    const expressTemplate: ProjectTemplate = {
      id: 'nodejs-express',
      name: 'Node.js Express Application',
      description: 'RESTful API with Express.js, TypeScript, and MongoDB',
      category: 'api',
      language: 'typescript',
      framework: 'express',
      complexity: 'medium',
      estimatedTime: 35,
      features: ['Express.js', 'TypeScript', 'MongoDB', 'JWT Auth', 'Jest', 'Docker'],
      files: [
        {
          path: 'package.json',
          content: `{
  "name": "my-express-api",
  "version": "1.0.0",
  "description": "A modern Node.js Express API with TypeScript",
  "main": "dist/index.js",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "dotenv": "^16.3.1",
    "joi": "^17.11.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.4",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/cors": "^2.8.17",
    "@types/jest": "^29.5.8",
    "@typescript-eslint/eslint-plugin": "^6.13.1",
    "@typescript-eslint/parser": "^6.13.1",
    "eslint": "^8.54.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "nodemon": "^3.0.2",
    "typescript": "^5.3.3"
  }
}`,
          description: 'Node.js project configuration',
          type: 'config',
          isRequired: true,
          isGenerated: true
        },
        {
          path: 'src/index.ts',
          content: `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Express API with TypeScript!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});`,
          description: 'Express application entry point',
          type: 'source',
          isRequired: true,
          isGenerated: true
        },
        {
          path: 'src/config/database.ts',
          content: `import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp';
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export { connectDB };`,
          description: 'MongoDB connection configuration',
          type: 'source',
          isRequired: true,
          isGenerated: true
        }
      ],
      dependencies: [
        {
          name: 'express',
          version: '^4.18.2',
          type: 'production',
          description: 'Fast, unopinionated web framework for Node.js',
          category: 'framework'
        },
        {
          name: 'mongoose',
          version: '^8.0.3',
          type: 'production',
          description: 'MongoDB object modeling for Node.js',
          category: 'library'
        },
        {
          name: 'typescript',
          version: '^5.3.3',
          type: 'development',
          description: 'TypeScript compiler',
          category: 'tool'
        }
      ],
      setup: {
        commands: [
          'npm install',
          'npm run dev'
        ],
        instructions: [
          'Install Node.js (version 18 or higher)',
          'Run npm install to install dependencies',
          'Create a .env file with your environment variables',
          'Run npm run dev to start the development server',
          'Open http://localhost:3000 in your browser'
        ]
      },
      structure: {
        directories: [
          {
            name: 'src',
            description: 'Source code directory',
            children: {
              directories: [
                {
                  name: 'controllers',
                  description: 'Request handlers'
                },
                {
                  name: 'models',
                  description: 'Database models'
                },
                {
                  name: 'routes',
                  description: 'API routes'
                },
                {
                  name: 'middleware',
                  description: 'Custom middleware'
                },
                {
                  name: 'utils',
                  description: 'Utility functions'
                }
              ],
              files: [
                { name: 'index.ts', description: 'Application entry point', type: 'source' }
              ]
            }
          }
        ],
        files: [
          { name: 'package.json', description: 'Node.js project configuration', type: 'config' },
          { name: 'tsconfig.json', description: 'TypeScript configuration', type: 'config' },
          { name: '.env.example', description: 'Environment variables example', type: 'config' }
        ]
      },
      metadata: {
        author: 'CodeFusion AI',
        version: '1.0.0',
        lastUpdated: new Date(),
        tags: ['nodejs', 'express', 'typescript', 'mongodb', 'api'],
        rating: 4.7,
        downloads: 1100
      }
    };

    // Add templates to library
    this.templateLibrary.set('react-web-app', reactTemplate);
    this.templateLibrary.set('python-fastapi', fastApiTemplate);
    this.templateLibrary.set('nodejs-express', expressTemplate);
  }

  /**
   * Generate project templates
   */
  async generateTemplates(request: TemplateRequest): Promise<TemplateResponse> {
    const startTime = performance.now();
    const requestId = generateId('template-generation');

    try {
      // Check rate limit
      if (!RateLimiter.isAllowed('smart-templates-service', 5, 60 * 1000)) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      log.info('Generating project templates', { 
        requestId, 
        projectType: request.projectType,
        language: request.language,
        framework: request.framework 
      }, 'SMART_TEMPLATES');

      // Check cache
      const cacheKey = this.generateCacheKey(request);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        log.debug('Returning cached templates', { requestId }, 'SMART_TEMPLATES');
        return cached;
      }

      // Find matching templates
      const templates = this.findMatchingTemplates(request);
      const recommendations = this.generateRecommendations(templates, request);
      const customization = this.generateCustomization(templates[0], request);

      const processingTime = performance.now() - startTime;

      const response: TemplateResponse = {
        templates,
        recommendations,
        customization,
        confidence: 0.95,
        processingTime,
      };

      // Cache result
      this.setCache(cacheKey, response);

      log.user('Project templates generated', { 
        requestId, 
        templatesCount: templates.length,
        processingTime 
      });

      return response;

    } catch (error) {
      const processingTime = performance.now() - startTime;
      log.error('Template generation failed', error as Error, 'SMART_TEMPLATES');
      
      // Return fallback response
      return this.getFallbackResponse(request, processingTime);
    }
  }

  /**
   * Find matching templates
   */
  private findMatchingTemplates(request: TemplateRequest): ProjectTemplate[] {
    const templates: ProjectTemplate[] = [];
    
    // Simple matching logic - can be enhanced with AI
    for (const [id, template] of this.templateLibrary) {
      if (this.isTemplateMatch(template, request)) {
        templates.push(template);
      }
    }

    // If no exact matches, find similar templates
    if (templates.length === 0) {
      for (const [id, template] of this.templateLibrary) {
        if (this.isSimilarTemplate(template, request)) {
          templates.push(template);
        }
      }
    }

    return templates;
  }

  /**
   * Check if template matches request
   */
  private isTemplateMatch(template: ProjectTemplate, request: TemplateRequest): boolean {
    return template.language === request.language &&
           template.framework === request.framework &&
           template.complexity === request.complexity;
  }

  /**
   * Check if template is similar to request
   */
  private isSimilarTemplate(template: ProjectTemplate, request: TemplateRequest): boolean {
    return template.language === request.language ||
           (template.framework && template.framework === request.framework);
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(templates: ProjectTemplate[], request: TemplateRequest): any {
    if (templates.length === 0) {
      return {
        primary: null,
        alternatives: []
      };
    }

    return {
      primary: templates[0],
      alternatives: templates.slice(1, 4)
    };
  }

  /**
   * Generate customization suggestions
   */
  private generateCustomization(template: ProjectTemplate, request: TemplateRequest): any {
    const suggestions: string[] = [];
    const modifications: Array<{ file: string; changes: string[] }> = [];

    // Add feature-specific suggestions
    if (request.features.includes('authentication') && !template.features.includes('JWT Auth')) {
      suggestions.push('Add JWT authentication middleware');
      modifications.push({
        file: 'package.json',
        changes: ['Add jsonwebtoken dependency']
      });
    }

    if (request.features.includes('database') && !template.features.includes('Database')) {
      suggestions.push('Add database integration');
      modifications.push({
        file: 'config/database.ts',
        changes: ['Add database connection configuration']
      });
    }

    if (request.preferences?.testing && !template.features.includes('Testing')) {
      suggestions.push('Add testing framework');
      modifications.push({
        file: 'package.json',
        changes: ['Add jest and testing dependencies']
      });
    }

    return {
      suggestions,
      modifications
    };
  }

  /**
   * Get template by ID
   */
  getTemplate(id: string): ProjectTemplate | null {
    return this.templateLibrary.get(id) || null;
  }

  /**
   * Get all available templates
   */
  getAllTemplates(): ProjectTemplate[] {
    return Array.from(this.templateLibrary.values());
  }

  /**
   * Get templates by category
   */
  getTemplatesByCategory(category: string): ProjectTemplate[] {
    return Array.from(this.templateLibrary.values())
      .filter(template => template.category === category);
  }

  /**
   * Get templates by language
   */
  getTemplatesByLanguage(language: string): ProjectTemplate[] {
    return Array.from(this.templateLibrary.values())
      .filter(template => template.language === language);
  }

  /**
   * Create custom template
   */
  createCustomTemplate(template: Omit<ProjectTemplate, 'id' | 'metadata'>): ProjectTemplate {
    const id = generateId('template');
    const customTemplate: ProjectTemplate = {
      ...template,
      id,
      metadata: {
        author: 'User',
        version: '1.0.0',
        lastUpdated: new Date(),
        tags: [],
        rating: 0,
        downloads: 0
      }
    };

    this.templateLibrary.set(id, customTemplate);
    return customTemplate;
  }

  /**
   * Get fallback response
   */
  private getFallbackResponse(request: TemplateRequest, processingTime: number): TemplateResponse {
    return {
      templates: [],
      recommendations: {
        primary: null,
        alternatives: []
      },
      customization: {
        suggestions: ['Consider using a popular framework for your chosen language'],
        modifications: []
      },
      confidence: 0.5,
      processingTime,
    };
  }

  /**
   * Cache management
   */
  private generateCacheKey(request: TemplateRequest): string {
    const key = `${request.projectType}-${request.language}-${request.framework || 'none'}-${request.complexity}`;
    return btoa(key).substring(0, 32);
  }

  private getFromCache(key: string): TemplateResponse | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.processingTime < this.cacheTimeout) {
      return cached;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: TemplateResponse): void {
    this.cache.set(key, {
      ...data,
      processingTime: Date.now()
    });
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    log.info('Smart Templates Service cache cleared', {}, 'SMART_TEMPLATES');
  }
}

// Create singleton instance
export const smartTemplatesService = new SmartTemplatesService();
export default smartTemplatesService;
