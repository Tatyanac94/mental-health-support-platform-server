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
router.get('/comments/:id/likes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { data: likes, error } = yield supabase_1.supabase
        .from('postlike')
        .select('*')
        .eq('commentid', id);
    if (error) {
        console.error('Error fetching likes:', error);
        return res.status(500).json({ error: 'Failed to fetch likes' });
    }
    res.json(likes || []);
}));
router.post('/comments/:id/likes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { username } = req.body;
    const { data: comment, error: commentError } = yield supabase_1.supabase
        .from('supportcomment')
        .select('id')
        .eq('id', id)
        .single();
    if (commentError || !comment) {
        console.error('Comment not found:', commentError);
        return res.status(404).json({ error: 'Comment not found' });
    }
    const { data: newLike, error: likeError } = yield supabase_1.supabase
        .from('postlike')
        .insert([{ commentid: comment.id, username }])
        .single();
    if (likeError) {
        console.error('Error liking comment:', likeError);
        return res.status(500).json({ error: 'Failed to like comment' });
    }
    res.status(201).json(newLike);
}));
router.delete('/comments/likes/:likeId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
