import { interactModel } from '../../api/http.js';
import connectToMongoDB from '../db.js';
import { AskError, InteractionDoc } from '../models/type.js';

// Place to handle chatbot logics

export const handleQuestion = async (userSession: string, question: string) => {
    try {
        const payload = { user_id: userSession, question };

        const data = await interactModel(payload, '/chat/ask', 'POST');

        //Lưu data vào database dưới dạng Interaction
        //model nên trả về answer kèm vs category
        const db = await connectToMongoDB('interactions');

        const insertData: InteractionDoc = {
            anonSid: userSession,
            answer: data['answer'],
            question: question,
            category: data['category'] || 'General',
            createdAt: new Date(),
        };
        await db.insertOne(insertData);

        return data;
    } catch (error: any) {
        const err = error as AskError;
        return { status: err.status || 500, message: `handleQuestion BE: ${err.message}` };
    }
};
