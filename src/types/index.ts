export interface AsyncRegistry {
    [id: string]: {
        resolve: (data: unknown) => void;
        reject: (e: Error) => void;
        timeout: number;
    };
}

export * from './events';
