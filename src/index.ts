import { createNanoEvents } from 'nanoevents';
import type { AsyncRegistry, Events } from '@/types';
import { Event, State, Subscription } from '@/enums';
import { methods } from '@/methods';
import { connect } from '@/client';
import { rand } from '@/helpers';

export const xjs = async (host = 'localhost', ports = [55511, 55512, 55513]) => {
    const events = createNanoEvents<Events>();
    const ws = await connect(host, ports);

    // Registry to hold in-progress Promises.
    const async: AsyncRegistry = {};

    // Parser for incoming payloads.
    const processMessage = ({ event, asyncId, payload }: any) => {
        if (event === Event.Subscription) {
            events.emit(payload.event, payload.payload);
            return;
        }

        if (!async[asyncId]) {
            return;
        }

        const asyncItem = async[asyncId];

        window.clearTimeout(asyncItem.timeout);

        if (event === State.Error) {
            asyncItem.reject(payload as Error);
        } else {
            asyncItem.resolve(payload);
        }

        delete async[asyncId];
    };

    // Bind the WebSocket Event parser.
    ws.addEventListener('message', ({ data }) => {
        try {
            data = JSON.parse(data);
            processMessage(data);
        } catch {
            // Ignore malformed payloads.
        }
    });

    // Helper functions to return.
    const send = (payload: object) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(payload));
        }
    };

    const request = (payload: object) => new Promise((resolve, reject) => {
        const id = rand(1, 100000);

        async[id] = {
            resolve,
            reject,
            timeout: window.setTimeout(() => {
                delete async[id];
                reject(new Error('timed out'));
            }, 5000),
        };

        send({ asyncId: id, ...payload });
    });

    const subscribe = (event: Subscription) => send({
        event: Event.Subscription,
        payload: event,
    });

    const disconnect = () => ws.close();

    // Compile all methods for this instance.
    const allMethods = methods({ send, request });

    return { events, send, request, subscribe, disconnect, ...allMethods };
};

export * from './enums';
