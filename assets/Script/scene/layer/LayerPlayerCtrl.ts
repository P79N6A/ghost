import MainScene from "../MainScene";
import G, { Debug } from "../../config/G";
import EventCenter from "../../event/EventCenter";
import { EventName } from "../../event/EventName";
import { IMessagePlayerMove } from "../../interface/common";
import DataAccount from "../../data/DataAccount";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class LayerPlayerCtrl extends cc.Node {
    private mMainScene: MainScene;
    private mLastTouchPosition = cc.v2();
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
        //Debug.log("触摸开始 "+ e.getLocation()+"  "+ e.getLocationInView());

    }
    // 触摸移动
    private onTouchMove(e: cc.Touch) {
        const delta = e.getDelta();

        if (delta.mag() > G.Config.MoveDelta) {
            let angle = delta.angle(cc.v2(0, 1));
            angle = Math.floor(angle / Math.PI * 180);
            if (delta.x > 0) {
                angle = -angle;
            }
            const msg: IMessagePlayerMove = {
                id: DataAccount.getUserId(),
                angle: angle
            }
            EventCenter.sendEvent(EventName.PlayerMove, msg);
        }
    }
    // 触摸结束
    private onTouchEnd(e: cc.Touch) {
        //Debug.log("触摸结束 ")
    }

}
