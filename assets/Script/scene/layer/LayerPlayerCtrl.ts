import MainScene from "../MainScene";
import G, { Debug } from "../../config/G";
import EventCenter from "../../event/EventCenter";
import { EventName } from "../../event/EventName";
import { IMessagePlayerMove } from "../../interface/common";
import DataAccount from "../../data/DataAccount";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LayerPlayerCtrl extends cc.Node {
    private mMainScene: MainScene;
    private mStartPosition = cc.v2();
    constructor(scene: MainScene) {
        super();
        this.mMainScene = scene;
        this.setContentSize(cc.winSize.width, cc.winSize.height);
        Debug.log("增加 LayerPlayerCtrl");
        this.initTouch();
    }
    initTouch() {
        Debug.log("LayerPlayerCtrl onload ");
        this.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    // 触摸开始
    private onTouchStart(e: cc.Touch) {
        Debug.log("触摸开始 " + e.getLocation());
        this.mStartPosition = e.getLocation();
    }
    // 触摸移动
    private onTouchMove(e: cc.Touch) {
        Debug.log("触摸移动 " + e.getLocation());
        const touchPosition = e.getLocation();
        const dir = touchPosition.sub(this.mStartPosition).normalizeSelf();
        const angle = -cc.v2(dir.x, dir.y).signAngle(cc.v2(0, 1)) / Math.PI * 180;
        const msg: IMessagePlayerMove = {
            id: DataAccount.getUserId(),
            dirX: dir.x,
            dirY: dir.y,
            angle: angle,
        }

        Debug.log("摇杆角度 " + dir.x + " " + dir.y + "  角度=" + angle);
        EventCenter.sendEvent(EventName.PlayerMove, msg);

    }
    // 触摸结束
    private onTouchEnd(e: cc.Touch) {
        //Debug.log("触摸结束 ")
        const msg: IMessagePlayerMove = {
            id: DataAccount.getUserId(),
            dirX: dir.x,
            dirY: dir.y,
            angle: angle,
        }

        Debug.log("摇杆角度 " + dir.x + " " + dir.y + "  角度=" + angle);
        EventCenter.sendEvent(EventName.PlayerMove, msg);
    }

}
