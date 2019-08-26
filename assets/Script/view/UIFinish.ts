import UIBase from "./UIBase";
import DataGame from "../data/DataGame";
import EventCenter from "../event/EventCenter";
import { EventName } from "../event/EventName";

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
export default class UIFinish extends UIBase {

    @property(cc.Node)
    m_score: cc.Node = null;

    @property(cc.Button)
    m_btnRestart: cc.Button;

    onLoad() {
        super.onLoad();
        this.m_score.getComponent(cc.Label).string = DataGame.getScore() + "";
        this.m_btnRestart.node.on("click", this.onClickRestart, this);
    }
    private onClickRestart() {
        this.closeSelf();
    }

    onClosed() {
        super.onClosed();
        DataGame.instance.destroy();
        EventCenter.sendEvent(EventName.GameRestart);
    }
}
