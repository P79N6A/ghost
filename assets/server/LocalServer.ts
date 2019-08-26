

export default class LocalServer {

    public static _instance: LocalServer = undefined;

    public static get instance(): LocalServer {
        if (!this._instance) {
            this._instance = new LocalServer()
        }
        return this._instance;
    }
}
