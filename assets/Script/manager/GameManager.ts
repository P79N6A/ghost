import EventCenter from "../event/EventCenter";
import { EventName } from "../event/EventName";
import UIManager from "./UIManager";
import { Debug } from "../config/G";

export default class GameManager {
    private static _Instance: GameManager;
    public static get Instance() {
        if (!this._Instance) {
            this._Instance = new GameManager();
        }
        return this._Instance;
    }

    constructor() {
        this.initEnv();
    }
    private initEnv() {
        cc.debug.setDisplayStats(false);
        Debug.log('width:' + cc.winSize.width + "  " + 'height:' + cc.winSize.height);
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, 0);
        var draw = cc.PhysicsManager.DrawBits;
        cc.director.getPhysicsManager().debugDrawFlags = draw.e_shapeBit | draw.e_jointBit;
    }
}
