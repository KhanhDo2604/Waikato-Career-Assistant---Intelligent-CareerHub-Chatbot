import { Router } from 'express';
import { handleQuestionController } from '../controllers/chatbot.controller.js';

const chatbotRoute = Router();

//Place to call controller functions
chatbotRoute.post('/get-chat', handleQuestionController);

export default chatbotRoute;
