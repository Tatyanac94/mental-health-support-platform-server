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
router.post('/comments/:id/likes', async (req, res) => {
    const { id } = req.params;
    const { username } = req.body;
    const { data: comment, error: commentError } = await supabase_1.supabase
        .from('supportcomment')
        .select('id')
        .eq('id', id)
        .single();
    if (commentError || !comment) {
        console.error('Comment not found:', commentError);
        return res.status(404).json({ error: 'Comment not found' });
    }
    const { data: newLike, error: likeError } = await supabase_1.supabase
        .from('postlike')
        .insert([{ commentid: comment.id, username }])
        .single();
    if (likeError) {
        console.error('Error liking comment:', likeError);
        return res.status(500).json({ error: 'Failed to like comment' });
    }
    res.status(201).json(newLike);
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
