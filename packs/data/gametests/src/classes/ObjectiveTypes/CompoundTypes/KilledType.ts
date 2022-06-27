import { setTickTimeout } from "mbcore-gametest";
import { EntityHealthComponent, Player, Entity, world } from "mojang-minecraft";
import { Objective } from "../../Objective";
import { CompoundObjectiveType } from "../CompoundObjectiveType";

export class KilledType extends CompoundObjectiveType {
  initialize(objective: Objective): void {
    world.events.entityHurt.subscribe((evd) => {
      if (
        !evd.hurtEntity ||
        evd.damagingEntity?.id !== "minecraft:player" ||
        !this.equalsArgument(evd.hurtEntity.id)
      )
        return;
      const entity = evd.damagingEntity;
      const hitEntity = evd.hurtEntity;
      const hp = hitEntity.getComponent("health") as EntityHealthComponent;
      if (!hp || hp.current > 0) return;

      this.addScore(objective, entity, 1);
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
  scoreChanged(
    objective: Objective,
    entity: Entity,
    newScore: number,
    prevScore: number
  ): void {}
  validArgument(argument: string): boolean {
    return !!argument;
  }
}
