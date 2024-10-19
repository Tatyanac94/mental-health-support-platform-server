"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const express_2 = require("express");
const cors_1 = __importDefault(require("cors"));
const forums_1 = require("./api/forums");
const posts_1 = require("./api/posts");
const comments_1 = require("./api/comments");
const likes_1 = require("./api/likes");
const commentLikes_1 = require("./api/commentLikes");
const errorHandler_1 = require("./utils/errorHandler");
const supabase_1 = require("./config/supabase");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use((0, express_2.json)());
app.get('/', async (req, res) => {
    try {
        const { data: forums, error: forumError } = await supabase_1.supabase
            .from('forum')
            .select('*')
            .order('timestamp', { ascending: false });
        if (forumError) {
            return res.status(500).json({ error: forumError.message });
        }
        const { data: posts, error: postError } = await supabase_1.supabase
            .from('supportpost')
            .select('*')
            .order('timestamp', { ascending: false });
        if (postError) {
            return res.status(500).json({ error: postError.message });
        }
        const postsWithDetails = await Promise.all(posts.map(async (post) => {
            const { count: likeCount } = await supabase_1.supabase
                .from('postlike')
                .select('id', { count: 'exact', head: true })
                .eq('postid', post.id);
            const { data: comments } = await supabase_1.supabase
                .from('supportcomment')
                .select('*')
                .eq('postid', post.id);
            const commentsWithLikes = await Promise.all((comments || []).map(async (comment) => {
                const { count: commentLikeCount } = await supabase_1.supabase
                    .from('postlike')
                    .select('id', { count: 'exact', head: true })
                    .eq('commentid', comment.id);
                return {
                    ...comment,
                    likeCount: commentLikeCount || 0,
                };
            }));
            return {
                ...post,
                comments: commentsWithLikes,
                likeCount: likeCount || 0,
            };
        }));
        const forumsWithPosts = forums.map(forum => ({
            forumId: forum.id,
            forumName: forum.name,
            forumDescription: forum.description,
            posts: postsWithDetails
                .filter(post => post.forumid === forum.id)
                .map(post => ({
                content: post.content,
                username: post.username,
                timestamp: post.timestamp,
                likeCount: post.likeCount,
                comments: post.comments,
            })),
        }));
        res.json(forumsWithPosts);
    }
    catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.use('/api/forums', forums_1.router);
app.use('/api/posts', posts_1.router);
app.use('/api/comments', comments_1.router);
app.use('/api/likes', likes_1.router);
app.use('/api/comments/:id/likes', commentLikes_1.router);
app.use(errorHandler_1.errorHandler);
exports.default = app;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
