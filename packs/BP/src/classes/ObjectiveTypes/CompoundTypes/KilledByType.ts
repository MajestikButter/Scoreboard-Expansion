import { setTickTimeout } from "mbcore-gametest";
import { EntityHealthComponent, Player, world } from "mojang-minecraft";
import { Objective } from "../../Objective";
import { CompoundObjectiveType } from "../CompoundObjectiveType";

export class KilledByType extends CompoundObjectiveType {
  initialize(objective: Objective): void {
    world.events.entityHit.subscribe((evd) => {
      if (
        !evd.hitEntity ||
        evd.hitEntity.id !== "minecraft:player" ||
        !this.equalsDelimiter(evd.entity.id)
      )
        return;
      const hitEntity = evd.hitEntity;
      setTickTimeout(() => {
        const hp = hitEntity.getComponent("health") as EntityHealthComponent;
        console.log(hp);
        if (!hp || hp.current > 0) return;
        objective.scoreboard.add(hitEntity, 1);
      }, 1);
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
