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
const validation_1 = require("../../src/middleware/validation");
const router = (0, express_1.Router)();
exports.router = router;
router.use(validation_1.validateContent);
router.post('/posts/:id/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { content, username } = req.body;
    const displayName = username || "Anonymous";
    if (!content) {
        return res.status(400).json({ error: 'Content cannot be empty' });
    }
    const { data: post, error: postError } = yield supabase_1.supabase
        .from('supportpost')
        .select('id')
        .eq('id', id)
        .single();
    if (postError || !post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    const { data: comment, error: commentError } = yield supabase_1.supabase
        .from('supportcomment')
        .insert([{ postid: post.id, content, username: displayName }])
        .single();
    if (commentError) {
        return res.status(500).json({ error: commentError.message });
    }
    res.status(201).json(comment);
}));
router.get('/posts/:id/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { data: post, error: postError } = yield supabase_1.supabase
        .from('supportpost')
        .select('id')
        .eq('id', id)
        .single();
    if (postError || !post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    const { data: comments, error: commentsError } = yield supabase_1.supabase
        .from('supportcomment')
        .select('*')
        .eq('postid', post.id)
        .order('timestamp', { ascending: false });
    if (commentsError) {
        return res.status(500).json({ error: commentsError.message });
    }
    res.json(comments);
}));
router.put('/comments/:commentid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentid } = req.params;
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: 'Content must be a non-empty string' });
    }
    const { data, error } = yield supabase_1.supabase
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
}));
router.delete('/comments/:commentid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentid } = req.params;
    const { data, error } = yield supabase_1.supabase
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
}));
