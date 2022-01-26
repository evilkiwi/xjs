import { createLogger } from '@tnotifier/logger';
import { createNanoEvents } from 'nanoevents';
import type { AsyncRegistry, Events, Options } from '@/types';
import { Event, State, Subscription } from '@/enums';
import { methods } from '@/methods';
import { connect } from '@/client';
import { rand } from '@/helpers';

export const xjs = async (options: Options = {}) => {
    const { host, ports, debug } = {
        host: 'localhost',
        ports: [55511, 55512, 55513],
        debug: false,
        ...options,
    };

    const events = options.events ?? createNanoEvents<Events>();
    const logger = createLogger({ name: 'xjs' });

    if (!debug) {
        logger.setDisabled(true);
    }

    logger.debug('attempting to connect');
    const ws = await connect(host, ports);
    logger.debug('successfully connected');

    // Registry to hold in-progress Promises.
    const async: AsyncRegistry = {};

    // Parser for incoming payloads.
    const processMessage = ({ event, asyncId, payload }: any) => {
        logger.debug(`incoming \`${event}\` payload`, payload);

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

        logger.debug(`resolved async request \`${asyncId}\``);

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
            logger.debug('sending event', payload);
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
                logger.error(`async request \`${id}\` timed out`);
                reject(new Error('timed out'));
            }, 5000),
        };

        logger.debug(`sending async request \`${id}\``, payload);

        send({ asyncId: id, ...payload });
    });

    const subscribe = (event: Subscription) => {
        logger.debug(`subscribing to \`${event}\``);

        send({
            event: Event.Subscription,
            payload: event,
        });
    };

    const disconnect = () => {
        logger.debug('disconnecting');
        ws.close();
    };

    // Compile all methods for this instance.
    const allMethods = methods({ send, request });

    return { events, send, request, subscribe, logger, disconnect, ...allMethods };
};

export * from './enums';
