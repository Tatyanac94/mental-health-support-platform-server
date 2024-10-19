"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/__tests__/comments.test.ts
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const supabase_1 = require("../config/supabase");
describe('Comments Likes API', () => {
    beforeAll(async () => {
        await supabase_1.supabase.from('supportcomment').insert([{ id: 1, content: 'Test comment', postid: 1, username: 'testuser' }]);
    });
    afterAll(async () => {
        await supabase_1.supabase.from('supportcomment').delete().eq('id', 1);
    });
    test('GET /comments/:id/likes - should return likes for a comment', async () => {
        const response = await (0, supertest_1.default)(index_1.default).get('/comments/1/likes');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    test('GET /comments/:id/likes - should return 404 if comment does not exist', async () => {
        const response = await (0, supertest_1.default)(index_1.default).get('/comments/999/likes');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Comment not found');
    });
    test('POST /comments/:id/likes - should add a like to a comment', async () => {
        const response = await (0, supertest_1.default)(index_1.default)
            .post('/comments/1/likes')
            .send({ username: 'testuser' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('username', 'testuser');
    });
    test('POST /comments/:id/likes - should return 404 if comment does not exist', async () => {
        const response = await (0, supertest_1.default)(index_1.default)
            .post('/comments/999/likes')
            .send({ username: 'testuser' });
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Comment not found');
    });
    test('DELETE /comments/likes/:likeId - should delete a like', async () => {
        const likeResponse = await (0, supertest_1.default)(index_1.default)
            .post('/comments/1/likes')
            .send({ username: 'testuser' });
        const likeId = likeResponse.body.id;
        const response = await (0, supertest_1.default)(index_1.default).delete(`/comments/likes/${likeId}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Like deleted successfully');
    });
    test('DELETE /comments/likes/:likeId - should return 404 if like does not exist', async () => {
        const response = await (0, supertest_1.default)(index_1.default).delete('/comments/likes/999');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Like not found');
    });
});
