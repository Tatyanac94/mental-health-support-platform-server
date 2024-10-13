import 'dotenv/config';
import express from 'express';
import { json } from 'express';
import cors from 'cors';
import { router as forumRouter } from './api/forums';
import { router as postRouter } from './api/posts';
import { router as commentRouter } from './api/comments';
import { router as likeRouter } from './api/likes';
import { router as commentLikeRouter } from './api/commentLikes';
import { errorHandler } from './utils/errorHandler';
import { supabase } from './config/supabase';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(json());

app.get('/', async (req, res) => {
    try {
        const { data: posts, error: postError } = await supabase
            .from('supportpost') // Corrected table name
            .select('*')
            .order('timestamp', { ascending: false });

        if (postError) {
            return res.status(500).json({ error: postError.message });
        }

        const postsWithDetails = await Promise.all(
            posts.map(async (post) => {
                const { data: comments } = await supabase
                    .from('supportcomment') // Corrected table name
                    .select('*')
                    .eq('postid', post.id); // Ensure this matches your schema

                const commentsWithLikes = await Promise.all(
                    (comments || []).map(async (comment) => {
                        const { count: commentLikeCount } = await supabase
                            .from('postlike') // Corrected table name
                            .select('id', { count: 'exact', head: true })
                            .eq('commentid', comment.id); // Ensure this matches your schema

                        return {
                            ...comment,
                            likeCount: commentLikeCount || 0,
                        };
                    })
                );

                const { count: likeCount } = await supabase
                    .from('postlike') // Corrected table name
                    .select('id', { count: 'exact', head: true })
                    .eq('postid', post.id); // Ensure this matches your schema

                return {
                    ...post,
                    comments: commentsWithLikes,
                    likeCount: likeCount || 0,
                };
            })
        );

        const formattedPosts = postsWithDetails.map(post => ({
            content: post.content,
            username: post.username,
            timestamp: post.timestamp,
            likeCount: post.likeCount,
            comments: post.comments,
        }));

        res.json(formattedPosts);
    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define your API routes
app.use('/api/forums', forumRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use('/api/likes', likeRouter);
app.use('/api/comments/:id/likes', commentLikeRouter); // Changed route

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
