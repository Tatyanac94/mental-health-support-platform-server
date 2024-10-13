"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const supabase_1 = require("../../src/config/supabase");
const router = (0, express_1.Router)();
exports.router = router;
router.get('/posts/:id/likes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { data: likes, error } = yield supabase_1.supabase
        .from('postlike')
        .select('*')
        .eq('postid', id);
    if (error) {
        console.error('Error fetching likes:', error);
        return res.status(500).json({ error: 'Failed to fetch likes' });
    }
    res.json(likes || []);
}));
router.post('/posts/:id/likes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { username } = req.body;
    const { data: post, error: postError } = yield supabase_1.supabase
        .from('supportpost')
        .select('id')
        .eq('id', id)
        .single();
    if (postError || !post) {
        console.error('Post not found:', postError);
        return res.status(404).json({ error: 'Post not found' });
    }
    const { data: newLike, error: likeError } = yield supabase_1.supabase
        .from('postlike')
        .insert([{ postid: post.id, username }])
        .single();
    if (likeError) {
        console.error('Error liking post:', likeError);
        return res.status(500).json({ error: 'Failed to like post' });
    }
    res.status(201).json(newLike);
}));
router.delete('/likes/:likeId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { likeId } = req.params;
    const { error } = yield supabase_1.supabase
        .from('postlike')
        .delete()
        .eq('id', likeId);
    if (error) {
        console.error('Error deleting like:', error);
        return res.status(500).json({ error: 'Failed to delete like' });
    }
    res.json({ message: 'Like deleted successfully' });
}));
