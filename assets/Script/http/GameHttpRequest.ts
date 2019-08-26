import { Debug, G } from "../config/G";
import LangManager from "../lang/LangManager";
import UIManager from "../manager/UIManager";
import Timestamp from "./Timestamp";

export default class GameHttpRequest {

    private __relativeUrl: string;
    private __params: any;
    private __method: string;
    private __userData: object;
    private __responseCallback: any;
    private __isShowAlert: boolean;
    private __isShowLoading: boolean;
    private __responseCaller: any;
    private __domain: string;
    private hasHandleError = false;

    constructor(action: string, params: any, method: string) {
        this.__relativeUrl = action;
        this.__params = params || {};
        this.__method = method || "POST";
        this.__userData = null;
        this.__responseCallback = null;
        this.__isShowAlert = false;
        this.__isShowLoading = false;
        this.__responseCaller = null;

        this.setDomain(G.HTTP_DOMAIN);
    }

    public send(): void {
        const finalParams = this.generatePublicParams();
        for (const key in this.__params) {
            finalParams[key] = this.__params[key];
        }
        //删除空字段
        for (const key in finalParams) {
            if (finalParams.hasOwnProperty(key) &&
                (finalParams[key] === null || finalParams[key] === undefined || finalParams[key] === "")) {
                delete finalParams[key];
            }
        }

        const getParamStr = this.getParamsStr(finalParams);
        // var prex = (G.Debug == false) ? "https://" : "http://"
        let sendUrl;
        if (this.__relativeUrl.indexOf("http") >= 0) {
            sendUrl = this.__relativeUrl;
        } else {
            sendUrl = this.__domain + this.__relativeUrl;
        }

        let sendData;

        if (this.__method === "GET") {
            if (getParamStr.length > 0) {
                sendUrl = sendUrl + "?" + getParamStr;
            }
            Debug.log("[http] url=" + sendUrl);
            sendData = "";
        } else if (this.__method === "POST") {
            sendData = JSON.stringify(finalParams);
            if (getParamStr.length > 0) {
                Debug.log("[http] url" + sendUrl + "?" + getParamStr);
            } else {
                Debug.log("[http] url" + sendUrl);
            }
        }
        if (this.__isShowLoading) {
            UIManager.showLoading();
        }

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                var response = xhr.responseText;
                if (xhr.status == 200) {
                    this.onComplete(response)
                } else {
                    this.onError(xhr.status, response);
                }
            }
        };
        xhr.onerror = () => {
            this.onError(xhr.status, xhr.responseText);
        }
        xhr.ontimeout = () => {
            this.onError(xhr.status, xhr.responseText);
        }
        xhr.open(this.__method, sendUrl, true);
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST');
        xhr.setRequestHeader('Access-Control-Allow-Headers', 'x-requested-with,content-type');
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(sendData);

    }

    public onComplete(response: any): void {
        let data = response;
        if (typeof (response) === 'string') {
            try {
                data = JSON.parse(response)
            } catch (error) {
                Debug.log("json error " + error);
            }

        }

        Debug.log("[http] callback ok " + data.code);
        Debug.dir(data);

        let isSuccess;
        let resultCode = data.code;
        if (resultCode === null || resultCode === undefined) {
            resultCode = G.code.exception;
        }

        if (data.code === G.code.success) {
            isSuccess = true;
        } else {
            isSuccess = false;
        }

        if (this.__isShowLoading) {
            UIManager.closeLoading();
        }

        const responseDict = {
            message: data || {},
            isSuccess,
            code: resultCode,
            userData: this.__userData
        };

        if (this.__responseCallback) {
            this.__responseCallback.call(this.__responseCaller, responseDict);
        }

        if (!isSuccess) {
            this.showAlertWhenFail(data, resultCode);
        }
    }
    public onError(code: number, data: string): void {
        if (this.hasHandleError){
            return;
        }
        this.hasHandleError = true;
        Debug.log("[http] callback error =" + code + data);

        const responseDict = {
            message: data,
            isSuccess: false,
            code,
            userData: this.__userData
        }
        if (this.__responseCallback) {
            this.__responseCallback.call(this.__responseCaller, responseDict);
        }
        if (this.__isShowLoading) {
            UIManager.closeLoading();
        }
        this.showAlertWhenFail(data, code);
    }



    public setDomain(domain: string): void {
        this.__domain = domain;
    }
    /**
     * 设置联网中是否加载loading
     */
    public setShowLoading(isShowLoading: boolean): void {
        this.__isShowLoading = isShowLoading;
    }
    /**
     * 设置请求回调
     */
    public setResponseCallback(caller: any, func: Function): void {
        this.__responseCaller = caller;
        this.__responseCallback = func;
    }
    /**
     * 设置个人数据
     * 设置的数据可以在response中返回
     */
    public setUserData(userData: any): void {
        this.__userData = userData;
    }

    /**
     * 设置联网回调后出现异常是否弹窗
     */
    public setShowAlert(isShowAlert: boolean): void {
        this.__isShowAlert = isShowAlert;
    }

    /**
    * get 参数解析
    */
    public getParamsStr(params): string {
        let str = "";
        for (const key in params) {
            str = str + key + "=" + encodeURIComponent(params[key]) + "&";
        }
        if (str.length > 0) {
            str = str.substr(0, str.length - 1);
        }
        return str
    }

    /**
     * 用户参数
     */
    public generatePublicParams(): any {
        const params = {
            //token: DataAccount.getToken(),
            //t: G.GAME_VERSION
        };
        return params;
    }

    private showAlertWhenFail(data: any, code: number) {
        if (code === G.code.disconnect) {
            //无网络
            UIManager.showAlertOne(LangManager.getCodeDesc(code), LangManager.getText("error_net"));
        } else {
            if (this.__isShowAlert) {
                let errorMsg = LangManager.getCodeDesc(code);
                if (G.Debug && typeof (data.status) === "string") {
                    errorMsg += "\n" + data.status
                }
                UIManager.showAlertOne(errorMsg);
            }
        }
    }
}