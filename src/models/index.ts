import common from "./common";

export default [
    common,
];

export type Model<T = any> = {
    namespace: string,
    state: T,
    effects: any,
    reducers: any,
}
