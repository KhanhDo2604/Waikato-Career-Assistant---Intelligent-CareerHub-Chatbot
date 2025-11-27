export type Sender = 'user' | 'bot';

export interface ChatMessage {
    id: string;
    sender: Sender;
    text: string;
    createAt: Date;
}
