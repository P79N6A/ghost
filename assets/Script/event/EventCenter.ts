import { EventName } from "./EventName";

export default class EventCenter {
    private static _instance: cc.EventTarget;
    public static get instance() {
        if (!this._instance) {
            this._instance = new cc.EventTarget();
        }
        return this._instance;
    }

    public static addEvent(eventName: EventName, caller: any, fun: Function) {
        try {
            this.instance.on(eventName, fun, caller);
        } catch (error) {

        }
    }

    public static removeEvent(eventName: EventName, caller: any, fun: Function) {
        this.instance.off(eventName, fun, caller)
    }
    public static removeEventByContext(caller: any) {
        this.instance.targetOff(caller)
    }

    public static sendEvent(eventName: EventName, data?: any) {
        this.instance.emit(eventName, data);
    }
}