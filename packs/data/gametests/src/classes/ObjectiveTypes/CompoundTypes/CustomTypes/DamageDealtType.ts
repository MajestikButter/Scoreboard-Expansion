import { Player, Entity, world } from "mojang-minecraft";
import { Objective } from "../../../Objective";
import { CompoundObjectiveType } from "../../CompoundObjectiveType";

export class DamageDealtType extends CompoundObjectiveType {
  initialize(objective: Objective): void {
    world.events.entityHurt.subscribe((evd) => {
      if (
        !evd.damagingEntity ||
        !this.hasScore(objective, evd.damagingEntity) ||
        evd.projectile
      )
        return;
      this.addScore(objective, evd.damagingEntity, evd.damage * 10);
    });
  }
  beforeUpdate(objective: Objective, tick: number, delta: number): void {
    objective.scoreboard.add("@a", 0);
  }
  update(objective: Objective, tick: number, delta: number): void {}
  updatePlayer(
    objective: Objective,
    player: Player,
    tick: number,
    delta: number
  ): void {}
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
