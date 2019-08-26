import G, { Debug } from "../config/G";
import UIBase from "../view/UIBase";

export default class UIManager {
    private static uiList: cc.Node[] = [];

    private static mCover: cc.Node;

    public static mDialogContainer: cc.Node;

    public static showUIFinish() {
        this.showView(G.Config.View.UIFinish);
    }

    public static showCover() {
        this.checkDialogContainer();
        if (!this.mCover) {
            cc.loader.loadRes("prefabs/UICover", (err, prefab) => {
                if (err) {
                    cc.error(err.message || err);
                    return;
                }
                var view = cc.instantiate<cc.Node>(prefab);
                view.name = "UICover";
                view.zIndex = G.Config.zOrder.cover;
                this.mCover = view;
                this.mDialogContainer.addChild(view);
                Debug.log("显示 Cover");
                view.on("mouseup", this.onClickCover, this);
            });
        } else {
            this.mCover.active = true;
        }
    }

    public static closeCover() {
        if (this.mCover) {
            this.mCover.active = false;
        }
    }


    public static showLoading() {

    }

    public static closeLoading() {

    }

    public static showAlertOne(content: string, title: string = null, caller: any = null, callback: Function = null, btnText: string = null) {

    }
    // 点击cover 关闭上层
    private static onClickCover() {
        Debug.log("点击 cover");
        if (UIManager.uiList.length === 0) {
            return;
        }
        const view = UIManager.uiList[UIManager.uiList.length - 1];
        const uiBase = view.getComponent(UIBase);
        if (uiBase && uiBase.touchOutSizeClose) {
            uiBase.closeSelf();
        }
    }

    private static checkDialogContainer() {
        if (!this.mDialogContainer) {
            this.mDialogContainer = new cc.Node();
            const canvasNode = cc.find("Canvas/Main Camera/UICanvas");
            this.mDialogContainer.width = canvasNode.width;
            this.mDialogContainer.height = canvasNode.height;
            canvasNode.addChild(this.mDialogContainer);
        }
    }

    private static showView(name: string) {
        this.checkDialogContainer();
        cc.loader.loadRes("prefabs/" + name, (err, prefab) => {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            var view = cc.instantiate<cc.Node>(prefab);
            view.name = name;
            this.mDialogContainer.addChild(view);
            UIManager.uiList.push(view);
            view.zIndex = G.Config.zOrder.view;
        });
    }

    public static closeViewByName(name: string) {
        for (var i = UIManager.uiList.length - 1; i >= 0; i--) {
            var view = UIManager.uiList[i];
            if (view && view.name === name) {
                view.removeFromParent(true);
                view.destroy();
                UIManager.uiList.splice(i, 1);
            }
        }
    }

    public static closeView(node: cc.Node) {
        let hasCover = false;
        for (var i = UIManager.uiList.length - 1; i >= 0; i--) {
            var view = UIManager.uiList[i];
            if (view && view === node) {
                view.destroy();
                UIManager.uiList.splice(i, 1);
            } else {
                const uiBase = view.getComponent(UIBase);
                if (uiBase && uiBase.isUseCover) {
                    hasCover = true;
                }
            }
        }

        if (!hasCover) {
            this.closeCover();
        }
    }

    public static findViewByName(name: string): cc.Node | undefined {
        for (var i = UIManager.uiList.length - 1; i >= 0; i--) {
            var view = UIManager.uiList[i];
            if (view && view.name === name) {
                return view;
            }
        }
        return undefined;
    }
}
