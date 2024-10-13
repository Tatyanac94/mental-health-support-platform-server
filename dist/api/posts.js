"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const supabase_1 = require("../config/supabase");
const router = (0, express_1.Router)();
exports.router = router;
router.get('/comments/:id/likes', async (req, res) => {
    const { id } = req.params;
    const { data: likes, error } = await supabase_1.supabase
        .from('postlike')
        .select('*')
        .eq('commentid', id);
    if (error) {
        console.error('Error fetching likes:', error);
        return res.status(500).json({ error: 'Failed to fetch likes' });
    }
    res.json(likes || []);
});
router.post('/', async (req, res) => {
    const { content, forumid, username } = req.body;
    if (!content || !forumid) {
        return res.status(400).json({ error: 'Content and forumId cannot be empty' });
    }
    const { data: newPost, error } = await supabase_1.supabase
        .from('supportpost')
        .insert([{ content, forumid, username }])
        .single();
    if (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ error: 'Failed to create post' });
    }
    res.status(201).json(newPost);
});
router.delete('/comments/likes/:likeId', async (req, res) => {
    const { likeId } = req.params;
    const { error } = await supabase_1.supabase
        .from('postlike')
        .delete()
        .eq('id', likeId);
    if (error) {
        console.error('Error deleting like:', error);
        return res.status(500).json({ error: 'Failed to delete like' });
    }
    res.json({ message: 'Like deleted successfully' });
});
