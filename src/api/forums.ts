import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';

const router = Router();

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



// Retrieves a list of all forums
router.get('/', async (req: Request, res: Response) => {
  const { data: forums, error } = await supabase.from('forum').select('*');

  if (error) {
    console.error('Error fetching forums:', error);
    return res.status(500).json({ error: 'Failed to fetch forums' });
  }

  res.json(forums || []);
});

// Retrieves details of a specific forum
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

// Retrieves all posts associated with a specific forum
router.get('/:id/posts', async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data: posts, error } = await supabase
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
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const { data, error } = await supabase
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
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase.from('forum').delete().eq('id', id);

  if (error) {
    console.error('Error deleting forum:', error);
    return res.status(500).json({ error: 'Failed to delete forum' });
  }

  res.json({ message: 'Forum deleted successfully' });
});

export { router };
