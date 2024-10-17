"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const supabase_1 = require("../config/supabase");
const router = (0, express_1.Router)();
exports.router = router;
// Retrieves all likes for a specific post identified by its ID.
router.get('/posts/:id/likes', async (req, res) => {
    const { id } = req.params;
    const { data: likes, error } = await supabase_1.supabase
        .from('postlike')
        .select('*')
        .eq('postid', id);
    if (error) {
        console.error('Error fetching likes:', error);
        return res.status(500).json({ error: 'Failed to fetch likes' });
    }
    res.json(likes || []);
});
// Creates a new like for a specific post identified by its ID.
router.post('/posts/:id/likes', async (req, res) => {
    const { id } = req.params;
    const { username } = req.body;
    const { data: post, error: postError } = await supabase_1.supabase
        .from('supportpost')
        .select('id')
        .eq('id', id)
        .single();
    if (postError || !post) {
        console.error('Post not found:', postError);
        return res.status(404).json({ error: 'Post not found' });
    }
    const { data: newLike, error: likeError } = await supabase_1.supabase
        .from('postlike')
        .insert([{ postid: post.id, username }])
        .single();
    if (likeError) {
        console.error('Error liking post:', likeError);
        return res.status(500).json({ error: 'Failed to like post' });
    }
    res.status(201).json(newLike);
});
// Deletes a specific like identified by its like ID.
router.delete('/likes/:likeId', async (req, res) => {
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
