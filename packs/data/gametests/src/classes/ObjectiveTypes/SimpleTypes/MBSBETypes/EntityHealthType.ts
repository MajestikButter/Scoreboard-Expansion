import { EntityHealthComponent, Player, Entity, world } from "mojang-minecraft";
import { Objective } from "../../../Objective";
import { ObjectiveType } from "../../ObjectiveType";

export class EntityHealthType extends ObjectiveType<"mbsbe.entityHealth"> {
  initialize(objective: Objective): void {
    world.events.entityHurt.subscribe((evd) => {
      if (evd.hurtEntity.id === "minecraft:player") return;
      const entity = evd.hurtEntity;
      const hp = entity.getComponent("health") as EntityHealthComponent;
      if (!hp) return;
      this.setScore(objective, entity, hp.current);
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
  ): void {
    const hp = entity.getComponent("health") as EntityHealthComponent;
    if (!hp) return;
    this.setScore(objective, entity, Math.round(hp.current));
  }
  scoreChanged(
    objective: Objective,
    entity: Entity,
    newScore: number,
    prevScore: number
  ): void {
    if (entity instanceof Player) return;

    const hp = entity.getComponent("health") as EntityHealthComponent;
    if (!hp) return;
    hp.setCurrent(newScore);
  }

  constructor() {
    super("mbsbe.entityHealth");
  }
}
