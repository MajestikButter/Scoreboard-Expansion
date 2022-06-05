import { Player, world } from "mojang-minecraft";
import { Objective } from "../../../Objective";
import { CompoundObjectiveType } from "../../CompoundObjectiveType";

export class DamageDealtType extends CompoundObjectiveType {
  initialize(objective: Objective): void {
    world.events.entityHurt.subscribe((evd) => {
      if (
        !evd.damagingEntity ||
        evd.damagingEntity.id !== "minecraft:player" ||
        evd.projectile
      )
        return;
      objective.scoreboard.add(evd.damagingEntity, evd.damage * 10);
    });
  }
  update(objective: Objective, tick: number, delta: number): void {}
  updatePlayer(
    objective: Objective,
    player: Player,
    tick: number,
    delta: number
  ): void {}
  scoreChanged(
    objective: Objective,
    player: Player,
    newScore: number,
    prevScore: number
  ): void {}
}
