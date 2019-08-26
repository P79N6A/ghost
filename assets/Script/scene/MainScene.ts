import Http from "../http/Http";
import GameManager from "../manager/GameManager";
import LayerPlayerCtrl from "./layer/LayerPlayerCtrl";
import EventCenter from "../event/EventCenter";
import { EventName } from "../event/EventName";
import { IMessagePlayerMove } from "../interface/common";
import { Debug } from "../config/G";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MainScene extends cc.Component {
  @property(cc.Node)
  public mPlayer: cc.Node = null;

  private mLayerCtrl: LayerPlayerCtrl;
  onLoad() {
    const gameManager = GameManager.Instance;
    this.mLayerCtrl = new LayerPlayerCtrl(this);
    this.node.addChild(this.mLayerCtrl);
    EventCenter.addEvent(EventName.PlayerMove, this, this.onEventPlayerMove);
  }

  //玩家移动
  private onEventPlayerMove(msg: IMessagePlayerMove) {
    //Debug.log("选择角度 " + msg.dirX + "  " + msg.dirY);
    //const angle = cc.v2(msg.dirX, msg.dirY).signAngle(cc.v2(0, 1));
    const rigidBody = this.mPlayer.getComponent(cc.RigidBody);
    if (msg.speed === 0) {
      rigidBody.linearVelocity = cc.v2(0, 0);
    } else {
      this.mPlayer.angle = msg.angle;
      rigidBody.linearVelocity = cc.v2(300 * msg.dirX, 300 * msg.dirY);
    }

  }
}
