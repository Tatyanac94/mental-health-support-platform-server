"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const express_2 = require("express");
const cors_1 = __importDefault(require("cors"));
const forums_1 = require("../src/api/forums");
const posts_1 = require("../src/api/posts");
const comments_1 = require("../src/api/comments");
const likes_1 = require("../src/api/likes");
const commentLikes_1 = require("../src/api/commentLikes");
const errorHandler_1 = require("../src/utils/errorHandler");
const supabase_1 = require("../src/config/supabase");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use((0, express_2.json)());
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data: posts, error: postError } = yield supabase_1.supabase
            .from('supportpost') // Corrected table name
            .select('*')
            .order('timestamp', { ascending: false });
        if (postError) {
            return res.status(500).json({ error: postError.message });
        }
        const postsWithDetails = yield Promise.all(posts.map((post) => __awaiter(void 0, void 0, void 0, function* () {
            const { data: comments } = yield supabase_1.supabase
                .from('supportcomment') // Corrected table name
                .select('*')
                .eq('postid', post.id); // Ensure this matches your schema
            const commentsWithLikes = yield Promise.all((comments || []).map((comment) => __awaiter(void 0, void 0, void 0, function* () {
                const { count: commentLikeCount } = yield supabase_1.supabase
                    .from('postlike') // Corrected table name
                    .select('id', { count: 'exact', head: true })
                    .eq('commentid', comment.id); // Ensure this matches your schema
                return Object.assign(Object.assign({}, comment), { likeCount: commentLikeCount || 0 });
            })));
            const { count: likeCount } = yield supabase_1.supabase
                .from('postlike') // Corrected table name
                .select('id', { count: 'exact', head: true })
                .eq('postid', post.id); // Ensure this matches your schema
            return Object.assign(Object.assign({}, post), { comments: commentsWithLikes, likeCount: likeCount || 0 });
        })));
        const formattedPosts = postsWithDetails.map(post => ({
            content: post.content,
            username: post.username,
            timestamp: post.timestamp,
            likeCount: post.likeCount,
            comments: post.comments,
        }));
        res.json(formattedPosts);
    }
    catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
// Define your API routes
app.use('/api/forums', forums_1.router);
app.use('/api/posts', posts_1.router);
app.use('/api/comments', comments_1.router);
app.use('/api/likes', likes_1.router);
app.use('/api/comments/:id/likes', commentLikes_1.router); // Changed route
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
