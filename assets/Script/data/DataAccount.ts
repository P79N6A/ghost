import Util from "../util/Util";
import { IDataAccount } from "../interface/common";
import LangManager from "../lang/LangManager";

export default class DataAccount {
    private static sKey = "DataAccount";
    private playerData: IDataAccount = {
        id: "player123",
        name: "name",
        url: "",
        open_id: "open_id",
        coin: 1000, //用字符串
    }

    public static _instance: DataAccount = undefined;

    public static get instance(): DataAccount {
        if (!this._instance) {
            this._instance = new DataAccount()
        }
        return this._instance;
    }


    public static getUserId() {
        return DataAccount.instance.playerData.id;
    }

    constructor() {
        this.playerData.id = Util.createRandomUUID();
        const saveStr = cc.sys.localStorage.getItem(DataAccount.sKey)
        if (saveStr) {
            const saveData = JSON.parse(cc.sys.localStorage.getItem(DataAccount.sKey));
            this.playerData = saveData;
        } else {
            this.playerData.name = LangManager.getText("create_name", [Util.randomInt(1000000000, 9999999999)]);
            cc.sys.localStorage.setItem(DataAccount.sKey, JSON.stringify(this.playerData))
        }
    }

    public static save() {
        cc.sys.localStorage.setItem(DataAccount.sKey, JSON.stringify(DataAccount.instance.playerData));
    }
}