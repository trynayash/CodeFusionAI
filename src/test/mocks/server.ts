/**
 * MSW (Mock Service Worker) Server Setup
 * Mock API responses for testing
 */

import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock API handlers
export const handlers = [
  // Auth endpoints
  http.post('/auth/v1/signup', () => {
    return HttpResponse.json({
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        created_at: new Date().toISOString(),
      },
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
      },
    });
  }),

  http.post('/auth/v1/token', () => {
    return HttpResponse.json({
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
      },
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
      },
    });
  }),

  // Projects endpoints
  http.get('/rest/v1/projects', () => {
    return HttpResponse.json([
      {
        id: 'test-project-1',
        name: 'Test Project 1',
        description: 'A test project',
        language: 'javascript',
        is_public: false,
        user_id: 'test-user-id',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
  }),

  // Code execution endpoints
  http.post('/api/execute', async ({ request }) => {
    const body = await request.json() as any;
    
    return HttpResponse.json({
      success: true,
      output: 'Hello, World!\nCode executed successfully!',
      errors: [],
      warnings: [],
      executionTime: 123,
      memoryUsage: 1024,
      language: body.language,
      version: '1.0.0',
    });
  }),
];

// Create server instance
export const server = setupServer(...handlers);