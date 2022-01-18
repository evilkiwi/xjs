import { websocket } from '@/helpers';

export const connect = async (host = 'localhost', ports = [55511, 55512, 55513]) => {
    let connection: WebSocket|undefined;
    let found = false;

    // Find a port XJS is running on.
    await (ports ?? []).reduce(async (promise, port) => {
        await promise;

        try {
            if (!found) {
                connection = await websocket(host ?? 'localhost', port);
                found = true;
            }
        } catch {
            // Do nothing - we just want to find an active port.
        }
    }, Promise.resolve());

    if (!connection) {
        throw new Error('could not locate running xjs server');
    }

    return connection;
};
