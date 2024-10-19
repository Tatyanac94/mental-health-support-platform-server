"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const supabase_1 = require("../config/supabase"); // Adjust this if necessary
describe('Comments Likes API', () => {
    beforeAll(async () => {
        // Seed your database with necessary test data
        await supabase_1.supabase
            .from('supportcomment')
            .insert([{ id: 1, content: 'Test comment', username: 'testuser' }]); // Adjust according to your schema
        await supabase_1.supabase
            .from('commentlike')
            .insert([{ commentid: 1, username: 'testuser' }]); // Adjust according to your schema
    });
    afterAll(async () => {
        // Clean up your database after tests
        await supabase_1.supabase.from('supportcomment').delete().eq('id', 1);
        await supabase_1.supabase.from('commentlike').delete().eq('commentid', 1);
    });
    test('GET /comments/:id/likes - should return likes for a comment', async () => {
        const response = await (0, supertest_1.default)(index_1.default).get('/comments/1/likes'); // Ensure the comment ID exists
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    test('GET /comments/:id/likes - should return 404 if comment does not exist', async () => {
        const response = await (0, supertest_1.default)(index_1.default).get('/comments/999/likes'); // Assume this comment does not exist
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Comment not found'); // Adjust according to your error message
    });
    test('POST /comments/:id/likes - should add a like to a comment', async () => {
        const response = await (0, supertest_1.default)(index_1.default)
            .post('/comments/1/likes')
            .send({ username: 'testuser' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('username', 'testuser'); // Adjust according to your response
    });
    test('POST /comments/:id/likes - should return 404 if comment does not exist', async () => {
        const response = await (0, supertest_1.default)(index_1.default)
            .post('/comments/999/likes')
            .send({ username: 'testuser' });
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Comment not found'); // Adjust according to your error message
    });
    test('DELETE /comments/likes/:likeId - should delete a like', async () => {
        // First, ensure there is a like to delete
        const likeResponse = await (0, supertest_1.default)(index_1.default)
            .post('/comments/1/likes')
            .send({ username: 'testuser' });
        const likeId = likeResponse.body.id; // Adjust according to your response
        const response = await (0, supertest_1.default)(index_1.default).delete(`/comments/likes/${likeId}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Like deleted successfully'); // Adjust according to your response
    });
    test('DELETE /comments/likes/:likeId - should return 404 if like does not exist', async () => {
        const response = await (0, supertest_1.default)(index_1.default).delete('/comments/likes/999'); // Assume this like does not exist
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Like not found'); // Adjust according to your error message
    });
});
