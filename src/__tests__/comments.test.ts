// src/__tests__/comments.test.ts
import request from 'supertest';
import app from '../index';
import { supabase } from '../config/supabase';

describe('Comments Likes API', () => {
    beforeAll(async () => {

      await supabase.from('supportcomment').insert([{ id: 1, content: 'Test comment', postid: 1, username: 'testuser' }]);
    });

    afterAll(async () => {

      await supabase.from('supportcomment').delete().eq('id', 1);
    });

    test('GET /comments/:id/likes - should return likes for a comment', async () => {
        const response = await request(app).get('/comments/1/likes');
        expect(response.status).toBe(200);    
        expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /comments/:id/likes - should return 404 if comment does not exist', async () => {
        const response = await request(app).get('/comments/999/likes'); 
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Comment not found');
    });

    test('POST /comments/:id/likes - should add a like to a comment', async () => {
        const response = await request(app)
            .post('/comments/1/likes')
            .send({ username: 'testuser' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('username', 'testuser');
    });

    test('POST /comments/:id/likes - should return 404 if comment does not exist', async () => {
        const response = await request(app)
            .post('/comments/999/likes')
            .send({ username: 'testuser' });
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Comment not found');
    });

    test('DELETE /comments/likes/:likeId - should delete a like', async () => {
        const likeResponse = await request(app)
            .post('/comments/1/likes')
            .send({ username: 'testuser' });
        
        const likeId = likeResponse.body.id; 
        const response = await request(app).delete(`/comments/likes/${likeId}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Like deleted successfully');
    });

    test('DELETE /comments/likes/:likeId - should return 404 if like does not exist', async () => {
        const response = await request(app).delete('/comments/likes/999');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Like not found');
    });
});
