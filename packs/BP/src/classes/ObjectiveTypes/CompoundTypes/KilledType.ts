import { setTickTimeout } from "mbcore-gametest";
import { EntityHealthComponent, Player, world } from "mojang-minecraft";
import { Objective } from "../../Objective";
import { CompoundObjectiveType } from "../CompoundObjectiveType";

export class KilledType extends CompoundObjectiveType {
  initialize(objective: Objective): void {
    world.events.entityHit.subscribe((evd) => {
      if (
        !evd.hitEntity ||
        evd.entity.id !== "minecraft:player" ||
        !this.equalsDelimiter(evd.hitEntity.id)
      )
        return;
      const entity = evd.entity;
      const hitEntity = evd.hitEntity;
      const hp = hitEntity.getComponent("health") as EntityHealthComponent;
      if (!hp || hp.current > 0) return;

      objective.scoreboard.add(entity, 1);
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
