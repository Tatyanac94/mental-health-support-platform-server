import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';

const router = Router();


// Fetches all posts along with their like counts
router.get('/', async (req: Request, res: Response) => {
  const { data: posts, error } = await supabase.from('supportpost').select('*');

  if (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({ error: 'Failed to fetch posts' });
  }

  // Fetch like counts for each post
  const postsWithLikes = await Promise.all(posts.map(async (post) => {
      const { count: likeCount } = await supabase
          .from('postlike')
          .select('id', { count: 'exact', head: true })
          .eq('postid', post.id);

      return {
          ...post,
          likeCount: likeCount || 0, 
      };
  }));

  res.json(postsWithLikes);
});

// Fetches a specific post by its ID along with its like count
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  // Fetch the post
  const { data: post, error: postError } = await supabase
      .from('supportpost')
      .select('*')
      .eq('id', id)
      .single();

  if (postError) {
      console.error('Error fetching post:', postError);
      return res.status(500).json({ error: 'Failed to fetch post' });
  }

  if (!post) {
      return res.status(404).json({ error: 'Post not found' });
  }

  // Fetch the like count for the specific post
  const { count: likeCount } = await supabase
      .from('postlike')
      .select('id', { count: 'exact', head: true })
      .eq('postid', id);

  res.json({
      ...post,
      likeCount: likeCount || 0,
  });
});

// Creates a new post associated with a forum
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

// Fetches all likes associated with a specific post
router.get('/:id/likes', async (req: Request, res: Response) => {
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

// Fetches a specific post by its ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data: post, error } = await supabase
      .from('supportpost')
      .select('*')
      .eq('id', id)
      .single(); 

  if (error) {
      console.error('Error fetching post:', error);
      return res.status(500).json({ error: 'Failed to fetch post' });
  }

  if (!post) {
      return res.status(404).json({ error: 'Post not found' });
  }

  res.json(post);
});

// Deletes a like for a specific comment
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

// Adds a like to a specific post
router.post('/:id/likes', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username } = req.body; 

  const { error } = await supabase
    .from('postlike')
    .insert([{ postid: id, username: username }]);

  if (error) {
    console.error('Error adding like:', error);
    return res.status(500).json({ error: 'Failed to add like' });
  }

  res.status(201).json({ message: 'Like added successfully' });
});

export { router };

