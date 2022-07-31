import { Player, Entity, world } from "mojang-minecraft";
import { Objective } from "../../../Objective";
import { CompoundObjectiveType } from "../../CompoundObjectiveType";

export class CrouchOneCMType extends CompoundObjectiveType {
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
    if (!player.isSneaking) return;
    const dist = Math.hypot(player.velocity.x, player.velocity.z);
    const score = Math.floor(dist * 100);
    this.addScore(objective, player, score);
  }
  updateEntity(
    objective: Objective,
    entity: Entity,
    tick: number,
    delta: number
  ): void {}
  updateActor(
    objective: Objective,
    actor: Entity,
    tick: number,
    delta: number
  ): void {}
  scoreChanged(
    objective: Objective,
    entity: Entity,
    newScore: number,
    prevScore: number
  ): void {}
  parseArgument(string: string): string {
    return string;
  }
  validArgument(argument: string): boolean {
    return true;
  }
}
