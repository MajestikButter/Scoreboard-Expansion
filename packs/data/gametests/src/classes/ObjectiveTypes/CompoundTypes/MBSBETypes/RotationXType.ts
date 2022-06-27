import { MBCPlayer } from "mbcore-gametest";
import { Player, Entity, world, Location, Vector, XYRotation } from "mojang-minecraft";
import { Objective } from "../../../Objective";
import { CompoundObjectiveType } from "../../CompoundObjectiveType";

export class RotationXType extends CompoundObjectiveType {
  initialize(objective: Objective): void {}
  beforeUpdate(objective: Objective, tick: number, delta: number): void {
    objective.scoreboard.add("@a", 0);
  }
  update(objective: Objective, tick: number, delta: number): void {}
  updatePlayer(
    objective: Objective,
    player: Player,
    tick: number,
    delta: number
  ): void {
    const decimals = parseInt(this.argument);
    const pos = player.rotation.x;
    const mul = Math.max(Math.pow(10, decimals), 1);
    this.setScore(objective, player, Math.floor(pos * mul));
  }
  updateEntity(
    objective: Objective,
    entity: Entity,
    tick: number,
    delta: number
  ): void {}
  scoreChanged(
    objective: Objective,
    entity: Entity,
    newScore: number,
    prevScore: number
  ): void {
    if (!(entity instanceof Player)) return;

    const plr = MBCPlayer.getByPlayer(entity);
    if (!plr) return;

    const decimals = parseInt(this.argument);
    const div = Math.max(Math.pow(10, decimals), 1);
    let { x, y } = entity.rotation;
    x = newScore / div;
    entity.setRotation(x, y);
  }
  validArgument(argument: string): boolean {
    return /^\d+$/.test(argument);
  }
}
