export const websocket = async (host: string, port: number, timeoutDelay = 3000) => new Promise<WebSocket>((resolve, reject) => {
    const failed = () => reject(new Error('connection failed'));
    const timeout = setTimeout(() => failed(), timeoutDelay);
    const ws = new WebSocket(`ws://${host}:${port}`);

    ws.onopen = () => {
        ws.onopen = null;
        ws.onerror = null;
        clearTimeout(timeout);
        resolve(ws);
    };
    ws.onerror = () => {
        clearTimeout(timeout);
        failed();
    };
});

export const rand = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
