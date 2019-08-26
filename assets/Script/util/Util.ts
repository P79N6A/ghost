export default class Util {
    public static randomInt(min: number, max?: number): number {
        if (min > max) {
            const tmp = min;
            min = max;
            max = tmp;
        }
        if (!max) {
            max = min;
            min = 0;
        }
        return Math.floor(Math.random() * Math.floor(max - min) + min);
    }

    public static randomArray(list: Array<any>): any {
        if (list === null || list.length === 0) {
            return null;
        }
        return list[Util.randomInt(list.length)];
    }


    public static isNullOrEmpty(target) {
        return target === null || target === undefined || target === ''
    }

    public static createRandomUUID() {
        return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + Math.random().toString().substr(2, 5);
    }

    //距离
    public static distance(a: any, b: any): number {
        return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
    }

    //归一化
    public static vectorNormalize(v: any): any {
        if (v.x === 0 && v.y === 0) {
            return v;
        }
        const len = Math.sqrt(v.x * v.x + v.y * v.y);
        v.x = v.x / len;
        v.y = v.y / len;
        return v;
    }

    //移动至
    public static moveTowards(from, to, step) {
        const y = to.y - from.y;
        const x = to.x - from.x;
        const angle = Math.atan2(y, x);
        const moveX = Math.cos(angle) * step;
        const moveY = Math.sin(angle) * step;
        const nextX = moveX + from.x;
        const nextY = moveY + from.y;
        return { x: nextX, y: nextY };
    }


    //截断名字
    public static cutStringWithLength(str: string, len = 12): string {
        if (str == null) return;
        if (str.length > len + 1) {
            return str.substr(0, len) + "...";
        } else {
            return str;
        }
    }

    public static empty(o): boolean {
        if (o) {
            if (typeof (o) === "object") {
                // for (const k in o) {
                //     return false;
                // }
                // return true;
                return !Object.keys(o).length
            }
            return false;
        }
        return true;
    }

    public static isEmptyString(str: string): boolean {
        if (str) {
            if (str.length === 0 || str === "0") {
                return true;
            }
            return false;
        }
        return true;

    }

    public static clamp(value: number, min: number, max: number): number {
        let temp = 0
        if (min > max) {
            temp = min
            min = max
            max = temp
        }
        if (value < min) {
            return min;
        } if (value < max) {
            return value
        }
        return max

    }

    public static checkInt(str: any): number {
        if (typeof (str) === 'number') {
            str = str + '';
        }
        let n = parseInt(str);
        if (!n) {
            n = 0;
        }
        return n;
    }

    public static ceil(n: number): number {
        if (!n) {
            return 0;
        }
        return Util.checkInt(Math.ceil(n));
    }

    public static clone(object): any {
        return JSON.parse(JSON.stringify(object));
    }

    public static formatTime2String(t: number): string {
        let hour = 0;
        let min = Math.floor(t / 60);
        let minStr = min + "";
        if (min >= 60) {
            hour = Math.floor(min / 60);
            min = min % 60;
            minStr = min + "";
            if (min < 10) {
                minStr = "0" + minStr;
            }
        }
        const second = t % 60;
        if (min === 0 && hour === 0) {
            minStr = "0";
        }
        let secondStr = second + "";
        if (second < 10) {
            secondStr = "0" + second;
        }
        if (hour > 0) {
            return hour + ":" + minStr + ":" + secondStr;
        }
        return minStr + ":" + secondStr;

    }

    public static formatTime2Short(t: number): string {
        let min = Math.floor(t / 60);
        if (min > 0) {
            return min + "'";
        } else return t + "\"";
    }



    public static toPower2(num: number) {
        return Math.floor((+num || 0) / 2) * 2;
    }


    public static getFileExtension(path: string) {
        const lastIndex = path.lastIndexOf(".");
        if (lastIndex > 0) {
            const prefix = path.substr(lastIndex + 1, path.length - lastIndex)
            return prefix;
        }
        return "";

    }

    //合并
    public static mergeObject(data: any, obj: any) {
        if (!data || !obj) {
            return;
        }
        for (let key in data) {
            if (obj[key]) {
                data[key] = obj[key];
            }
        }
    }
}