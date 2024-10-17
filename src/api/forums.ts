import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';

const router = Router();

//Creates a new forum with the provided name and description.
router.post('/', async (req: Request, res: Response) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name cannot be empty' });
    }

    const { data: newForum, error } = await supabase
        .from('forum')
        .insert([{ name, description }])
        .single();

    if (error) {
        console.error('Error creating forum:', error);
        return res.status(500).json({ error: 'Failed to create forum' });
    }

    res.status(201).json(newForum);
});

 // Fetches all forums, ordered by timestamp.
router.get('/', async (req: Request, res: Response) => {
    const { data: forums, error } = await supabase
        .from('forum')
        .select('*')
        .order('timestamp', { ascending: false });

    if (error) {
        console.error('Error fetching forums:', error);
        return res.status(500).json({ error: 'Failed to fetch forums' });
    }

    res.json(forums || []);
});

 // Fetches a specific forum by its ID.
router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    const { data: forum, error } = await supabase
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

// Fetches all posts associated with a specific forum by its ID.
router.get('/:id/posts', async (req: Request, res: Response) => {
    const { id } = req.params;

    const { data: posts, error } = await supabase
        .from('supportpost') // Ensure this matches your actual posts table name
        .select('*')
        .eq('forumid', id); // Assuming you have a foreign key field in posts table

    if (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ error: 'Failed to fetch posts' });
    }

    res.json(posts || []);
});

 // Updates the name and description of a specific forum by its ID.
router.put('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name cannot be empty' });
    }

    const { data, error } = await supabase
        .from('forum')
        .update({ name, description })
        .eq('id', id)
        .select()  
        .single();

    if (error) {
        console.error('Error updating forum:', error);
        return res.status(500).json({ error: 'Failed to update forum' });
    }

    if (!data) {

        return res.status(404).json({ error: 'Forum not found' });
    }

    res.json({ message: 'Forum updated successfully', forum: data });
});

// Deletes a specific forum by its ID.
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    const { error } = await supabase
        .from('forum')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting forum:', error);
        return res.status(500).json({ error: 'Failed to delete forum' });
    }

    res.status(204).send();
});

export { router };