import { setTickTimeout } from "mbcore-gametest";
import { EntityHealthComponent, Player, Entity, world } from "mojang-minecraft";
import { Objective } from "../../Objective";
import { ObjectiveType } from "../ObjectiveType";

export class TotalKillCountType extends ObjectiveType<"totalKillCount"> {
  initialize(objective: Objective): void {
    world.events.entityHit.subscribe((evd) => {
      if (!evd.hitEntity || evd.entity.id !== "minecraft:player") return;
      const entity = evd.entity;
      const hitEntity = evd.hitEntity;
      setTickTimeout(() => {
        const hp = hitEntity.getComponent("health") as EntityHealthComponent;
        if (!hp || hp.current > 0) return;

        this.addScore(objective, entity, 1);
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

  constructor() {
    super("totalKillCount");
  }
}
