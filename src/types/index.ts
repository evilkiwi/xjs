import type { Emitter } from 'nanoevents';

export interface AsyncRegistry {
    [id: string]: {
        resolve: (data: unknown) => void;
        reject: (e: Error) => void;
        timeout: number;
    };
}

export interface Options {
    host?: string;
    ports?: number[];
    debug?: boolean;
    events?: Emitter;
}

export * from './events';
