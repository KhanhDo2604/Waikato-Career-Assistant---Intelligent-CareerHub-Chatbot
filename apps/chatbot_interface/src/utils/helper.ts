const GREETINGS = [
    'hi',
    'hello',
    'hey',
    'good morning',
    'good afternoon',
    'good evening',
    'helo',
    'kia ora',
    'greetings',
];

const FAREWELLS = ['thanks', 'thank you', 'bye', 'goodbye', 'see you', 'take care', 'cheers', 'catch you later'];

export function isGreeting(text: string): boolean {
    const normalized = text.toLowerCase().trim();

    if (GREETINGS.includes(normalized)) return true;

    return GREETINGS.some((greet) => normalized === greet || normalized.startsWith(greet + ' '));
}

export function isFarewell(text: string): boolean {
    const normalized = text.toLowerCase().trim();

    if (FAREWELLS.includes(normalized)) return true;

    return FAREWELLS.some((farewell) => normalized === farewell || normalized.startsWith(farewell + ' '));
}
