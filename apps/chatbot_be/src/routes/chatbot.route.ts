import { Router } from "express";
import { getChatbotStatusController } from "../controllers/chatbot.controller.js";

const chatbotRoute = Router();

//Place to call controller functions
chatbotRoute.get("/", getChatbotStatusController);

export default chatbotRoute;
