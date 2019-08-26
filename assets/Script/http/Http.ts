import GameHttpRequest from './GameHttpRequest'

export default class Http {
    public static createRequest(relativeUrl:string, params: any = {}, method = "POST"): GameHttpRequest {
        const request = new GameHttpRequest(relativeUrl, params, method)
        return request
    }
}
