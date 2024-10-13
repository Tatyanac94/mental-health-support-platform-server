import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase'; 

export const validateContent = (req: Request, res: Response, next: NextFunction) => {
  const { content } = req.body;

  if ((req.method === 'POST' || req.method === 'PUT') && (!content || typeof content !== 'string' || content.trim() === '')) {
    return res.status(400).json({ error: 'Content must be a non-empty string' });
  }

  next();
};

export const validatePostId = async (req: Request, res: Response, next: NextFunction) => {
  const { id: postId } = req.params;

  try {
    const { data: post, error } = await supabase
      .from('post')  
      .select('id')
      .eq('id', postId)
      .single();

    if (error || !post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    next();
  } catch (err) {
    console.error('Error validating post ID:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const validateCommentId = async (req: Request, res: Response, next: NextFunction) => {
  const { id: commentId } = req.params;

  try {
    const { data: comment, error } = await supabase
      .from('comment')
      .select('id')
      .eq('id', commentId)
      .single();

    if (error || !comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    next();
  } catch (err) {
    console.error('Error validating comment ID:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
