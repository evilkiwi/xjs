export interface Options {
    send: (payload: object) => void;
    request: (payload: object) => Promise<unknown>;
}
