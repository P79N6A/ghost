import { Debug } from "../config/G";

export default class Timestamp {
    //本地时间戳 秒
    public static __localTimestamp = 0;
    //服务器时间戳 秒
    public static __serverTimestamp = 0;

    /**
     * 设置当前服务器时间戳
     */
    public static setServerTimestamp(serverTimestamp: number) {
        this.__serverTimestamp = serverTimestamp;
        this.__localTimestamp = this.ostime();
    }

    /**
     * 返回当前客户端时间对应的服务器端时间戳
     */
    public static now(): number {
        return this.__serverTimestamp + (this.ostime() - this.__localTimestamp);
    }

    /**
     * 返回指定的服务器时间戳距离现在是多少秒之前
     */
    public static beforeNow(targetServerTimestamp: number) {
        return this.now() - targetServerTimestamp;
    }

    /**
     * 返回指定的服务器时间戳距离现在是多少秒之后
     */
    public static afterNow(targetServerTimestamp: number): number {
        return targetServerTimestamp - this.now();
    }

    public static ostime(): number {
        return new Date().getTime();
    }

    // 返回服务器时间戳
    public static getServerTimestamp(): number {
        return this.__serverTimestamp;
    }

    /** 判断是否为同一天
        @param aTs 时间戳1
        @param bTs 时间戳2
        @return boolean
    */
    public static isSameDay(aTs, bTs): boolean {
        if (!aTs || !bTs) return false;
        return this.formatDate(aTs) === this.formatDate(bTs);
    }


    //时间戳  格式化日期为字符串 YYYY-MM-DD格式	
    public static formatDate(dt: number, split: string = null): string {
        // s to ms
        if (dt < 1e12) {
            dt *= 1000;
        }
        let s = "";
        if (dt) {
            const d = new Date(+dt);
            split = (split || "");
            s = d.getFullYear() + split;
            s += ("00" + (d.getMonth() + 1)).slice(-2) + split;
            s += ("00" + d.getDate()).slice(-2);
        }
        return s;
    }

    public static formatDateTime(dt: number, fmt: string = "yyyy-MM-dd") {
        // s to ms
        dt = Number(dt)
        if (!dt) {
            Debug.log('dt should be number')
            return ''
        }
        if (dt < 1e12) {
            dt *= 1000;
        }
        const date = new Date(dt)
        const o = {
            "M+": date.getMonth() + 1,                      // 月份   
            "d+": date.getDate(),                           // 日   
            "h+": date.getHours(),                          // 小时   
            "m+": date.getMinutes(),                        // 分   
            "s+": date.getSeconds(),                        // 秒   
            "q+": Math.floor((date.getMonth() + 3) / 3),    // 季度   
            "S": date.getMilliseconds()                     // 毫秒   
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        // tslint:disable-next-line:no-for-in
        for (const k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    //获取 距离现在多久的标志
    public static formatTimePassFromNow(t: number) {
        const diff = this.now() - t;
        const oneDay = 60 * 60 * 24;
        const oneHour = 60 * 60;
        const oneMin = 60;

        if (diff > 3 * oneDay) {
            const date = new Date(t * 1000);
            return date.getMonth() + "-" + date.getDate();
        } else if (diff > oneDay) {
            return Math.floor(diff / oneDay) + "天前";
        } if (diff > oneHour) {
            return Math.floor(diff / oneHour) + "小时前";
        } if (diff > oneMin) {
            return Math.floor(diff / oneMin) + "分钟前";
        }
        return "刚刚";

    }
}