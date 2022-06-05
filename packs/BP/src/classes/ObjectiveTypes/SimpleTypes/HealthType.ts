import { EntityHealthComponent, Player, world } from "mojang-minecraft";
import { Objective } from "../../Objective";
import { ObjectiveType } from "../ObjectiveType";

export class HealthType extends ObjectiveType<"health"> {
  initialize(objective: Objective): void {}
  update(objective: Objective, tick: number, delta: number): void {}
  updatePlayer(
    objective: Objective,
    player: Player,
    tick: number,
    delta: number
  ): void {
    const hp = player.getComponent("health") as EntityHealthComponent;
    if (!hp) return;
    objective.scoreboard.set(player, hp.current);
  }
  scoreChanged(
    objective: Objective,
    player: Player,
    newScore: number,
    prevScore: number
  ): void {
    const hp = player.getComponent("health") as EntityHealthComponent;
    if (!hp) return;
    hp.setCurrent(newScore);
  }

  constructor() {
    super("health");
  }
}
