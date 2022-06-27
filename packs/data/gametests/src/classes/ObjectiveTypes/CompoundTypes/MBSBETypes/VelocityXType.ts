import { MBCPlayer } from "mbcore-gametest";
import { Player, Entity, world, Location, Vector } from "mojang-minecraft";
import { Objective } from "../../../Objective";
import { CompoundObjectiveType } from "../../CompoundObjectiveType";

export class VelocityXType extends CompoundObjectiveType {
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
    const pos = player.velocity.x;
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
    let { x, y, z } = entity.velocity;
    x = newScore / div;
    plr.setVelocity(new Vector(x, y, z));
  }
  validArgument(argument: string): boolean {
    return /^\d+$/.test(argument);
  }
}
