"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const posts_1 = require("../api/posts");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/posts', posts_1.router);
describe('Posts API', () => {
    it('should fetch all posts with their like counts', async () => {
        const response = await (0, supertest_1.default)(app).get('/posts');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    it('should fetch a specific post by ID with its like count', async () => {
        const response = await (0, supertest_1.default)(app).get('/posts/1');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', 1);
    });
    it('should return 404 for a non-existent post', async () => {
        const response = await (0, supertest_1.default)(app).get('/posts/999');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Post not found');
    });
    it('should create a new post', async () => {
        const response = await (0, supertest_1.default)(app)
            .post('/posts')
            .send({ content: 'Test post content', forumid: '123', username: 'testuser' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('content', 'Test post content');
    });
    it('should return 400 if content or forumid is missing', async () => {
        const response = await (0, supertest_1.default)(app)
            .post('/posts')
            .send({ content: '', forumid: '123' });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Content and forumId cannot be empty');
    });
    it('should fetch likes for a specific post', async () => {
        const response = await (0, supertest_1.default)(app).get('/posts/1/likes');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    it('should add a like to a specific post', async () => {
        const response = await (0, supertest_1.default)(app)
            .post('/posts/1/likes')
            .send({ username: 'testuser' });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Like added successfully');
    });
    it('should delete a like for a specific post', async () => {
        const response = await (0, supertest_1.default)(app).delete('/posts/comments/likes/1');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Like deleted successfully');
    });
    it('should return 500 on server error', async () => {
    });
});
