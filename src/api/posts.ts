import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';

const router = Router();

// Fetches all likes associated with a specific comment by its ID.
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

// Fetches details of a specific forum and its associated posts by forum ID.
router.get('/:id/details', async (req: Request, res: Response) => {
    const { id } = req.params;

    const { data: forum, error: forumError } = await supabase
        .from('forum')
        .select('*')
        .eq('id', id)
        .single();

    if (forumError || !forum) {
        console.error('Forum not found:', forumError);
        return res.status(404).json({ error: 'Forum not found' });
    }

    const { data: posts, error: postsError } = await supabase
        .from('supportpost') 
        .select('*')
        .eq('forumid', id);

    if (postsError) {
        console.error('Error fetching posts:', postsError);
        return res.status(500).json({ error: 'Failed to fetch posts' });
    }

    res.json({ forum, posts: posts || [] });
});

 // Creates a new post for a specific forum with provided content and username.
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

// Deletes a like associated with a specific comment by like ID.
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