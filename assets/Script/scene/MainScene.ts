import Http from "../http/Http";
import G, { Debug } from "../config/G";
import GameManager from "../manager/GameManager";
import Ball from "./ball";
import EventCenter from "../event/EventCenter";
import { EventName } from "../event/EventName";
import UIManager from "../manager/UIManager";
import DataGame from "../data/DataGame";
import CameraFollowBall from "../compnonet/CameraFollowBall";
import Util from "../util/Util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainScene extends cc.Component {
  @property(cc.Node)
  mCamera: cc.Node = null;

  @property(cc.Node)
  mBall: cc.Node = null;

  @property(cc.Node)
  mArrow: cc.Node = null;

  @property(cc.Label)
  mBestScore: cc.Label = null;
  @property(cc.Node)
  mBtnStart: cc.Node = null;

  onLoad() {
    this.mCamera.zIndex = G.Config.zOrder.cover
    Debug.log("初始化");
    const gameManager = GameManager.Instance;
    this.mBtnStart.on("click", this.onMouseDown, this);
    EventCenter.addEvent(EventName.GameRestart, this, this.onGameRestart);
    EventCenter.addEvent(EventName.GameFinish, this, this.onGameFinish);
    this.doArrowAnim();
  }

  // 指针旋转
  private doArrowAnim() {
    DataGame.setState(G.Config.GameState.Ready);
    Debug.log("指针开始旋转");
    this.mArrow.angle = -5;
    const anim = cc.repeatForever(cc.sequence(
      cc.rotateTo(0.6, -60),
      cc.rotateTo(0.6, -5),
    ));
    this.mArrow.runAction(anim);
  }

  private onMouseDown() {
    if (DataGame.getState() !== G.Config.GameState.Ready) {
      return;
    }

    this.mArrow.stopAllActions();
    this.scheduleOnce(this.createBall, 0.1);
    //this.createBall();
  }
  // 生成小球
  private createBall() {
    const worldPos = this.mArrow.convertToWorldSpaceAR(cc.v2(0, 0));
    const pos = this.mBall.parent.convertToNodeSpaceAR(worldPos);
    this.mBall.x = pos.x;
    this.mBall.y = pos.y;

    let ball = this.mBall.getComponent(Ball);
    if (!ball) {
      ball = this.mBall.addComponent(Ball);
    }
    const angle = Math.floor(Math.abs(this.mArrow.angle));
    let speed = Util.randomInt(1000, 2000) + (45 - Math.abs(angle - 45)) * 30;

    const factorX = Math.abs(Math.cos(angle / 180 * Math.PI));
    const factorY = Math.abs(Math.sin(angle / 180 * Math.PI));
    Debug.log("角度 =" + angle + "  " + factorX + "  " + factorY);
    ball.setSpeed(speed * factorX, speed * factorY);
    this.mBall.active = true;

    let cameraFollowBall = this.mCamera.getComponent(CameraFollowBall);
    if (!cameraFollowBall) {
      cameraFollowBall = this.mCamera.addComponent(CameraFollowBall);
      cameraFollowBall.target = this.mBall;
    }
    DataGame.setState(G.Config.GameState.Fly);

  }

  private onGameRestart() {
    this.mBall.active = false;
    this.mCamera.x = 0;
    this.mCamera.y = 0;
    this.doArrowAnim();
  }

  private onGameFinish() {
    this.mBestScore.string = "最高分:" + DataGame.getBestScore();
  }
}
