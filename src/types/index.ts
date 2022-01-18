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
}

export * from './events';
