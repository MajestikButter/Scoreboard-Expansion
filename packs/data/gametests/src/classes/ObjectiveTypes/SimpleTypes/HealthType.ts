import { EntityHealthComponent, Player, Entity, world } from "mojang-minecraft";
import { Objective } from "../../Objective";
import { ObjectiveType } from "../ObjectiveType";

export class HealthType extends ObjectiveType<"health"> {
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
    const hp = player.getComponent("health") as EntityHealthComponent;
    if (!hp) return;
    this.setScore(objective, player, Math.round(hp.current));
  }
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
  ): void {
    if (!(entity instanceof Player)) return;
    const hp = entity.getComponent("health") as EntityHealthComponent;
    if (!hp) return;
    hp.setCurrent(newScore);
  }

  constructor() {
    super("health");
  }
}
