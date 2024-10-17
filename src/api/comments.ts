import { Router, Request, Response } from 'express'; 
import { supabase } from '../config/supabase';
import { validateContent } from '../middleware/validation';

const router = Router();

router.use(validateContent);

// Creates a new comment for a specific post identified by its ID.
router.post('/posts/:id/comments', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { content, username } = req.body;
    const displayName = username || "Anonymous";

    if (!content) {
        return res.status(400).json({ error: 'Content cannot be empty' });
    }

    const { data: post, error: postError } = await supabase
        .from('supportpost')
        .select('id')
        .eq('id', id)
        .single();

    if (postError || !post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const { data: comment, error: commentError } = await supabase
        .from('supportcomment')
        .insert([{ postid: post.id, content, username: displayName }])
        .single();

    if (commentError) {
        return res.status(500).json({ error: commentError.message });
    }

    res.status(201).json(comment);
});

// Retrieves all comments associated with a specific post identified by its ID.
router.get('/posts/:id/comments', async (req: Request, res: Response) => {
    const { id } = req.params;

    const { data: post, error: postError } = await supabase
        .from('supportpost')
        .select('id')
        .eq('id', id)
        .single();

    if (postError || !post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const { data: comments, error: commentsError } = await supabase
        .from('supportcomment')
        .select('*')
        .eq('postid', post.id)
        .order('timestamp', { ascending: false });

    if (commentsError) {
        return res.status(500).json({ error: commentsError.message });
    }

    res.json(comments);
});

// Updates the content of a specific comment identified by its comment ID.
router.put('/comments/:commentid', async (req: Request, res: Response) => {
    const { commentid } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Content must be a non-empty string' });
    }

    const { data, error } = await supabase
        .from('supportcomment')
        .update({ content })
        .eq('id', commentid)
        .select('*')
        .single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    if (!data) {
        return res.status(404).json({ error: 'Comment not found' });
    }

    res.json(data);
});

// Deletes a specific comment identified by its comment ID.
router.delete('/comments/:commentid', async (req: Request, res: Response) => {
    const { commentid } = req.params;

    const { data, error } = await supabase
        .from('supportcomment')
        .delete()
        .eq('id', commentid)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
        return res.status(404).json({ error: 'Comment not found' });
    }

    res.status(204).send(); 
});

export { router };