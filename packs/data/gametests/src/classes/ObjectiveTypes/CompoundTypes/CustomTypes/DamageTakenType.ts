import { Player, Entity, world } from "mojang-minecraft";
import { Objective } from "../../../Objective";
import { CompoundObjectiveType } from "../../CompoundObjectiveType";

export class DamageTakenType extends CompoundObjectiveType {
  initialize(objective: Objective): void {
    world.events.entityHurt.subscribe((evd) => {
      if (evd.hurtEntity.id !== "minecraft:player") return;
      this.addScore(objective, evd.hurtEntity, evd.damage * 10);
    });
  }
  beforeUpdate(objective: Objective, tick: number, delta: number): void {}
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
  validArgument(argument: string): boolean {
    return true;
  }
}
