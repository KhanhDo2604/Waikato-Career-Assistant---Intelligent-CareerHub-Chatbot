import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';

import chatbotRoute from './routes/chatbot.route.js';
import dashboardRoute from './routes/dashboard.route.js';
import { randomUUID } from 'crypto';

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 3000;

const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'].filter(
    Boolean,
) as string[];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) return callback(null, true);

            return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    }),
);

app.use(express.json());
app.use(cookieParser());

const COOKIE_NAME = 'anon_sid';

app.use((req, res, next) => {
    let sid = req.cookies?.[COOKIE_NAME];

    if (!sid) {
        sid = randomUUID();

        res.cookie(COOKIE_NAME, sid, {
            httpOnly: true,
            secure: false, //set true when deploy
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
            path: '/',
        });
    }

    (req as any).anonSid = sid;
    next();
});

app.get('/ping', (req, res) => {
    console.log('HIT /ping');
    res.status(200).send('pong');
});

app.get('/debug', (req, res) => {
    console.log('HIT /debug/me', (req as any).anonSid);
    res.json({ anonSid: (req as any).anonSid });
});

app.use('/api/chatbot', chatbotRoute);
app.use('/api/dashboard', dashboardRoute);

app.use((err: any, req: any, res: any, next: any) => {
    console.error('ERROR:', err?.message || err);
    res.status(500).json({ message: err?.message || 'Server error' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Allowed origins:', allowedOrigins);
});
