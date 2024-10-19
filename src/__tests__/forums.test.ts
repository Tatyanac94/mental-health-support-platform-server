import request from 'supertest';
import express from 'express';
import { router } from '../api/forums';

const app = express();
app.use(express.json());
app.use('/forums', router);

describe('Forums API', () => {

  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn(),
    insert: jest.fn(),
    single: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /forums - should create a forum', async () => {
    mockSupabase.insert.mockReturnValueOnce({
      data: { id: 1, name: 'Test Forum', description: 'A forum for testing' },
      error: null,
    });

    const response = await request(app)
      .post('/forums')
      .send({ name: 'Test Forum', description: 'A forum for testing' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id', 1);
  });

  test('POST /forums - should return 400 if name is empty', async () => {
    const response = await request(app)
      .post('/forums')
      .send({ description: 'A forum without a name' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Name cannot be empty');
  });

  test('GET /forums - should fetch all forums', async () => {
    mockSupabase.select.mockReturnValueOnce({
      data: [{ id: 1, name: 'Test Forum' }],
      error: null,
    });

    const response = await request(app).get('/forums');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test('GET /forums/:id - should fetch a specific forum', async () => {
    mockSupabase.select.mockReturnValueOnce({
      data: { id: 1, name: 'Test Forum' },
      error: null,
    });

    const response = await request(app).get('/forums/1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Test Forum');
  });

  test('GET /forums/:id - should return 404 if forum not found', async () => {
    mockSupabase.select.mockReturnValueOnce({
      data: null,
      error: null,
    });

    const response = await request(app).get('/forums/999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Forum not found');
  });

  test('GET /forums/:id/posts - should fetch posts for a specific forum', async () => {
    mockSupabase.select.mockReturnValueOnce({
      data: [{ id: 1, content: 'Test Post' }],
      error: null,
    });

    const response = await request(app).get('/forums/1/posts');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test('PUT /forums/:id - should update a specific forum', async () => {
    mockSupabase.update.mockReturnValueOnce({
      data: { id: 1, name: 'Updated Forum', description: 'Updated description' },
      error: null,
    });

    const response = await request(app)
      .put('/forums/1')
      .send({ title: 'Updated Forum', description: 'Updated description' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Updated Forum');
  });

  test('DELETE /forums/:id - should delete a specific forum', async () => {
    mockSupabase.delete.mockReturnValueOnce({
      error: null,
    });

    const response = await request(app).delete('/forums/1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Forum deleted successfully');
  });
});
