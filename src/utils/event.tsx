import data_js from 'data_js';

export function subEvent(event: string, callback: any): number {
    return data_js.sub('set', event, callback);
}

export function unsubEvent(event: string, id?: number) {
    return data_js.unsub('set', event, id);
}

export function dispatchEvent(event: string, data: any) {
    return data_js.set(event, data);
}
