"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const supabase_1 = require("../config/supabase");
const router = (0, express_1.Router)();
exports.router = router;
router.post('/', async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name cannot be empty' });
    }
    const { data: newForum, error } = await supabase_1.supabase
        .from('forum')
        .insert([{ name, description }])
        .single();
    if (error) {
        console.error('Error creating forum:', error);
        return res.status(500).json({ error: 'Failed to create forum' });
    }
    res.status(201).json(newForum);
});
// Retrieves a list of all forums
router.get('/', async (req, res) => {
    const { data: forums, error } = await supabase_1.supabase.from('forum').select('*');
    if (error) {
        console.error('Error fetching forums:', error);
        return res.status(500).json({ error: 'Failed to fetch forums' });
    }
    res.json(forums || []);
});
// Retrieves details of a specific forum
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const { data: forum, error } = await supabase_1.supabase
        .from('forum')
        .select('*')
        .eq('id', id)
        .single();
    if (error || !forum) {
        console.error('Forum not found:', error);
        return res.status(404).json({ error: 'Forum not found' });
    }
    res.json(forum);
});
// Retrieves all posts associated with a specific forum
router.get('/:id/posts', async (req, res) => {
    const { id } = req.params;
    const { data: posts, error } = await supabase_1.supabase
        .from('supportpost')
        .select('*')
        .eq('forumid', id);
    if (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ error: 'Failed to fetch posts' });
    }
    res.json(posts || []);
});
// Updates the details of a specific forum
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const { data, error } = await supabase_1.supabase
        .from('forum')
        .update({ title, description })
        .eq('id', id)
        .single();
    if (error) {
        console.error('Error updating forum:', error);
        return res.status(500).json({ error: 'Failed to update forum' });
    }
    res.json(data);
});
// Deletes a specific forum
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase_1.supabase.from('forum').delete().eq('id', id);
    if (error) {
        console.error('Error deleting forum:', error);
        return res.status(500).json({ error: 'Failed to delete forum' });
    }
    res.json({ message: 'Forum deleted successfully' });
});
