import { Debug } from "mbcore-gametest";
import { EntityHealthComponent, Player, world } from "mojang-minecraft";
import { Objective } from "../../Objective";
import { ObjectiveType } from "../ObjectiveType";

export class DeathCountType extends ObjectiveType<"deathCount"> {
  private deadPlayers: { [plr: string]: boolean } = {};

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
    if (hp.current <= 0 && !this.deadPlayers[player.name]) {
      objective.scoreboard.add(player, 1);
      this.deadPlayers[player.name] = true;
    } else if (hp.current > 0) {
      if (this.deadPlayers[player.name]) delete this.deadPlayers[player.name];
    }
  }
  scoreChanged(
    objective: Objective,
    player: Player,
    newScore: number,
    prevScore: number
  ): void {}

  constructor() {
    super("deathCount");
  }
}
