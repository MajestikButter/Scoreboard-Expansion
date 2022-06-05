import { Player, world } from "mojang-minecraft";
import { Objective } from "../../../Objective";
import { CompoundObjectiveType } from "../../CompoundObjectiveType";

export class CrouchOneCMType extends CompoundObjectiveType {
  initialize(objective: Objective): void {}
  update(objective: Objective, tick: number, delta: number): void {}
  updatePlayer(
    objective: Objective,
    player: Player,
    tick: number,
    delta: number
  ): void {
    if (!player.isSneaking) return;
    const dist = Math.hypot(player.velocity.x, player.velocity.z);
    const score = Math.floor(dist * 100);
    objective.scoreboard.add(player, score);
  }
  scoreChanged(
    objective: Objective,
    player: Player,
    newScore: number,
    prevScore: number
  ): void {}
}
