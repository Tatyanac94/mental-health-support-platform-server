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
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name cannot be empty' });
    }
    const { data: newForum, error } = yield supabase_1.supabase
        .from('forum')
        .insert([{ name, description }])
        .single();
    if (error) {
        console.error('Error creating forum:', error);
        return res.status(500).json({ error: 'Failed to create forum' });
    }
    res.status(201).json(newForum);
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data: forums, error } = yield supabase_1.supabase
        .from('forum')
        .select('*')
        .order('timestamp', { ascending: false });
    if (error) {
        console.error('Error fetching forums:', error);
        return res.status(500).json({ error: 'Failed to fetch forums' });
    }
    res.json(forums || []);
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { data: forum, error } = yield supabase_1.supabase
        .from('forum')
        .select('*')
        .eq('id', id)
        .single();
    if (error || !forum) {
        console.error('Forum not found:', error);
        return res.status(404).json({ error: 'Forum not found' });
    }
    res.json(forum);
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name cannot be empty' });
    }
    const { data, error } = yield supabase_1.supabase
        .from('forum')
        .update({ name, description })
        .eq('id', id)
        .single();
    if (error) {
        console.error('Error updating forum:', error);
        return res.status(500).json({ error: 'Failed to update forum' });
    }
    if (!data) {
        return res.status(404).json({ error: 'Forum not found' });
    }
    res.json(data);
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { error } = yield supabase_1.supabase
        .from('forum')
        .delete()
        .eq('id', id);
    if (error) {
        console.error('Error deleting forum:', error);
        return res.status(500).json({ error: 'Failed to delete forum' });
    }
    res.status(204).send();
}));
