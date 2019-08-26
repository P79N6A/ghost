import { Debug } from "../config/G";
import EventCenter from "../event/EventCenter";
import { IDataGame } from "../interface/common";


//游戏数据类
export default class DataGame {

    private data: IDataGame = {
        id: "0",
    }

    public static _instance: DataGame = undefined;
    public static get instance(): DataGame {
        if (this._instance == undefined) {
            this._instance = new DataGame();
        }
        return this._instance;
    }

    //初始化数据
    constructor() {
        Debug.log("初始化 DataDame");
    }


    public destroy() {
        EventCenter.removeEventByContext(this);
        DataGame._instance = undefined;
        Debug.log("销毁DataDame");
    }
}