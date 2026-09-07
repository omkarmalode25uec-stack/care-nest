import express from 'express';
import { chatAssistant, searchAssistant } from '../controllers/assistantController.js';

const router = express.Router();

// Chatbot conversational endpoint
router.post('/chat', chatAssistant);

// Natural query search route (legacy compatibility)
router.post('/search', searchAssistant);

export default router;
