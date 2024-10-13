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
exports.validateCommentId = exports.validatePostId = exports.validateContent = void 0;
const supabase_1 = require("../../src/config/supabase");
const validateContent = (req, res, next) => {
    const { content } = req.body;
    if ((req.method === 'POST' || req.method === 'PUT') && (!content || typeof content !== 'string' || content.trim() === '')) {
        return res.status(400).json({ error: 'Content must be a non-empty string' });
    }
    next();
};
exports.validateContent = validateContent;
const validatePostId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: postId } = req.params;
    try {
        const { data: post, error } = yield supabase_1.supabase
            .from('post')
            .select('id')
            .eq('id', postId)
            .single();
        if (error || !post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        next();
    }
    catch (err) {
        console.error('Error validating post ID:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.validatePostId = validatePostId;
const validateCommentId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: commentId } = req.params;
    try {
        const { data: comment, error } = yield supabase_1.supabase
            .from('comment')
            .select('id')
            .eq('id', commentId)
            .single();
        if (error || !comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        next();
    }
    catch (err) {
        console.error('Error validating comment ID:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.validateCommentId = validateCommentId;
