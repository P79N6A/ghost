import { Lang } from "./lang_cn";
import G from "../config/G";

type LangText = typeof Lang.text
export default class LangManager {
    public static getCodeDesc(key: number): string {
        let desc = Lang.codeDesc[key.toString()]
        if (desc) {
            if (G.Config.Debug) {
                desc += " (" + key + ")";
            }
            return desc;
        }
        let reason = Lang.codeDesc[G.Config.code.exception.toString()];
        if (G.Config.Debug) {
            reason += + " (" + key.toString() + ")";
        }
        return reason;
    }

    public static getCodeDescWithoutCode(key: number): string {
        const desc = Lang.codeDesc[key.toString()]
        if (desc) {
            return desc;
        }
        return Lang.codeDesc[G.Config.code.exception.toString()];
    }

    public static getText(key: keyof LangText, param: Array<string | number> = []): string {
        let desc = Lang.text[key]
        if (desc && desc != undefined) {
            if (param && param.length > 0) {
                for (let i = 0; i < param.length; i++) {
                    desc = desc.replace('{' + i + '}', param[i].toString());
                }
            }
            return desc;
        }
        return 'null';
    }

}