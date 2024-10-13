import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';

const router = Router();

router.get('/posts/:id/likes', async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data: likes, error } = await supabase
    .from('postlike') 
    .select('*')
    .eq('postid', id); 

  if (error) {
    console.error('Error fetching likes:', error);
    return res.status(500).json({ error: 'Failed to fetch likes' });
  }

  res.json(likes || []); 
});

router.post('/posts/:id/likes', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username } = req.body;

  const { data: post, error: postError } = await supabase
    .from('supportpost')
    .select('id')
    .eq('id', id)
    .single();

  if (postError || !post) {
    console.error('Post not found:', postError);
    return res.status(404).json({ error: 'Post not found' });
  }

  const { data: newLike, error: likeError } = await supabase
    .from('postlike')
    .insert([{ postid: post.id, username }])
    .single(); 

  if (likeError) {
    console.error('Error liking post:', likeError);
    return res.status(500).json({ error: 'Failed to like post' });
  }

  res.status(201).json(newLike); 
});

router.delete('/likes/:likeId', async (req: Request, res: Response) => {
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