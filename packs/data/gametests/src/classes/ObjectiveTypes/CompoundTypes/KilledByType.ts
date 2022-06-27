import { setTickTimeout } from "mbcore-gametest";
import { EntityHealthComponent, Player, Entity, world } from "mojang-minecraft";
import { Objective } from "../../Objective";
import { CompoundObjectiveType } from "../CompoundObjectiveType";

export class KilledByType extends CompoundObjectiveType {
  initialize(objective: Objective): void {
    world.events.projectileHit.subscribe((evd) => {
      if (
        !evd.source ||
        evd.entityHit?.entity?.id !== "minecraft:player" ||
        !this.equalsArgument(evd.source.id)
      )
        return;
      const hitEntity = evd.entityHit.entity;
      const hp = hitEntity.getComponent("health") as EntityHealthComponent;
      console.log(hitEntity.nameTag, "ph");
      if (!hp || hp.current > 0) return;

      this.addScore(objective, hitEntity, 1);
    });
    world.events.entityHit.subscribe((evd) => {
      if (
        evd.hitEntity?.id !== "minecraft:player" ||
        !this.equalsArgument(evd.entity.id)
      )
        return;
      const hitEntity = evd.hitEntity;
      console.log(hitEntity.nameTag, "eh");
      setTickTimeout(() => {
        const hp = hitEntity.getComponent("health") as EntityHealthComponent;
        console.log(hp);
        if (!hp || hp.current > 0) return;
        this.addScore(objective, hitEntity, 1);
      }, 1);
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