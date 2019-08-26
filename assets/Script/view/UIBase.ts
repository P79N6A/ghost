import { UIAnimation } from "./UIAnimation";
import { Debug } from "../config/G";
import UIManager from "../manager/UIManager";
import EventCenter from "../event/EventCenter";

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
export default class UIBase extends cc.Component {
    public destroyed = false;
    protected nodeDict = {};
    @property({ type: UIAnimation })
    showAnimation = UIAnimation.None;

    @property({ type: UIAnimation })
    closeAnimation = UIAnimation.None;

    @property({ type: cc.Boolean })
    isUseCover = true;

    @property({ type: cc.Boolean })
    touchOutSizeClose = true;

    @property(cc.Button)
    m_btnClose: cc.Button;



    onLoad() {
        this.linkWidget(this.node, this.nodeDict);
        if (this.m_btnClose) {
            this.m_btnClose.node.on("click", this.closeSelf, this);
        }
        if (this.isUseCover) {
            UIManager.showCover();
        }
        this.doOpenAnim();
    }


    private linkWidget(self: cc.Node, nodeDict: any) {
        var children = self.children;
        for (var i = 0; i < children.length; i++) {
            var widgetName = children[i].name;
            if (widgetName && widgetName.indexOf("m_") >= 0) {
                var nodeName = widgetName;
                if (nodeDict[nodeName]) {
                    Debug.error("控件名字重复!" + children[i].name);
                }
                nodeDict[nodeName] = children[i];
                Debug.log("绑定名字 " + nodeName);
                if (this.hasOwnProperty(nodeName) && !this[nodeName]) {
                    this[nodeName] = children[i];
                }
            }
            if (children[i].childrenCount > 0) {
                this.linkWidget(children[i], nodeDict);
            }
        }
    }

    onOpened() {
        Debug.log("open UI " + this.node.name);
    }

    public closeSelf() {
        if (this.destroyed) {
            return;
        }
        this.destroyed = true;
        this.doCloseAnim();
    }
    public onClosed() {
        EventCenter.removeEventByContext(this);
        Debug.log("close UI " + this.node.name);
        UIManager.closeView(this.node);
    }

    // 打开动画
    private doOpenAnim() {
        if (this.showAnimation === UIAnimation.None) {
            this.onOpened();
            return;
        }
        let anim: cc.Action;
        if (this.showAnimation === UIAnimation.OpenScale) {
            this.node.scale = 0.8;
            const anim = cc.sequence(
                cc.scaleTo(0.05, 1),
                cc.scaleTo(0.1, 1.08),
                cc.scaleTo(0.1, 1),
                cc.callFunc(() => {
                    this.onOpened();
                }, this),
            )
        }
        if (anim) {
            this.node.runAction(anim);
        }
    }
    // 关闭动画
    private doCloseAnim() {
        if (this.closeAnimation === UIAnimation.None) {
            this.onClosed();
            return;
        }
        let anim: cc.Action;
        if (this.closeAnimation === UIAnimation.CloseScale) {
            this.node.scale = 0.8;
            const anim = cc.sequence(
                cc.scaleTo(0.08, 1.04),
                cc.scaleTo(0.08, 1),
                cc.scaleTo(0.12, 0),
                cc.callFunc(() => {
                    this.onClosed();
                }, this),
            )
        }
        if (anim) {
            this.node.runAction(anim);
        }
    }

}
