export const askChatbot = async (body: Record<string, any>, tail: string, method: string): Promise<string> => {
    try {
        const BACKEND_URL = process.env.MODEL_URL;
        if (!BACKEND_URL) {
            throw new Error('MODEL_URL is not defined');
        }

        const res = await fetch(`${BACKEND_URL}${tail}`, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const ans = await res.json();

        if (!res.ok) throw new Error('Model call failed');
        return ans;
    } catch (error: any) {
        console.log('model failed');
        throw new Error(error.message);
    }
};
