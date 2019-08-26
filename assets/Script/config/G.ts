import Util from "../util/Util";

export default class G {
    public static Config = {
        Debug: true,
        HTTP_DOMAIN: 'https://mg-cloud-api.bytedance.com/monster/invoke',
        code: {
            disconnect: 0,
            success: 100,
            loadFail: 301,
            loginValid: 401,
            loginError: 402,
            exception: 500,
        },
        Url: {
            Config: "/star_war_config/",
        },
        View: {
            UIFinish: "UIFinish",
        },
        /**
 * 层级管理
 */
        zOrder: {
            mask: -1000,
            cover: 90,
            view: 100,

            // 警示弹窗层级（在弹窗之上）
            alert: 1001,

            // loading
            loading: 2003,
            // 广播层级
            noticeBoard: 3000,
            // 调试节点层级
            debugNode: 3001,
            // effect
            effect: 3002,
            // 飘字层级
            toast: 10001,
        },
    }

    public static setConfig(config: any) {
        Util.mergeObject(G.Config, config);
    }
};

export class Debug {
    public static log(arg) {
        if (G.Config.Debug) {
            console.log(arg);
        }
    }
    public static error(arg) {
        if (G.Config.Debug) {
            console.error(arg);
        }
    }
    public static dir(...arg) {
        if (G.Config.Debug) {
            console.dir(...arg);
        }
    }
}
