import Http from "../http/Http";
import GameManager from "../manager/GameManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MainScene extends cc.Component {
  onLoad() {
    const gameManager = GameManager.Instance;
  }
}
