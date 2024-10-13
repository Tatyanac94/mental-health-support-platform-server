import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';

const router = Router();

router.get('/comments/:id/likes', async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data: likes, error } = await supabase
    .from('postlike')
    .select('*')
    .eq('commentid', id);

  if (error) {
    console.error('Error fetching likes:', error);
    return res.status(500).json({ error: 'Failed to fetch likes' });
  }

  res.json(likes || []);
});

router.post('/', async (req: Request, res: Response) => {
    const { content, forumid, username } = req.body; 

    if (!content || !forumid) {
        return res.status(400).json({ error: 'Content and forumId cannot be empty' });
    }

    const { data: newPost, error } = await supabase
        .from('supportpost')
        .insert([{ content, forumid, username }])  
        .single();

    if (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ error: 'Failed to create post' });
    }

    res.status(201).json(newPost);
});


router.delete('/comments/likes/:likeId', async (req: Request, res: Response) => {
  const { likeId } = req.params;

  const { error } = await supabase
    .from('postlike')
    .delete()
    .eq('id', likeId);

  if (error) {
    console.error('Error deleting like:', error);
    return res.status(500).json({ error: 'Failed to delete like' });
  }

  res.json({ message: 'Like deleted successfully' });
});

export { router };