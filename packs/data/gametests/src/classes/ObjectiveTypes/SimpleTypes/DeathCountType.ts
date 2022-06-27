import { EntityHealthComponent, Player, Entity, world } from "mojang-minecraft";
import { Objective } from "../../Objective";
import { ObjectiveType } from "../ObjectiveType";

export class DeathCountType extends ObjectiveType<"deathCount"> {
  private deadPlayers: { [plr: string]: boolean } = {};

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
    if (hp.current <= 0 && !this.deadPlayers[player.name]) {
      this.addScore(objective, player, 1);
      this.deadPlayers[player.name] = true;
    } else if (hp.current > 0) {
      if (this.deadPlayers[player.name]) delete this.deadPlayers[player.name];
    }
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
  ): void {}

  constructor() {
    super("deathCount");
  }
}
