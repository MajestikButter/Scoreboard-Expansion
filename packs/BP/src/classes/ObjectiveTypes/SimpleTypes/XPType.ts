import { EntityHealthComponent, Player, world } from "mojang-minecraft";
import { Objective } from "../../Objective";
import { Utils } from "../../Utils";
import { ObjectiveType } from "../ObjectiveType";

export class XPType extends ObjectiveType<"xp"> {
  initialize(objective: Objective): void {}
  update(objective: Objective, tick: number, delta: number): void {}
  updatePlayer(
    objective: Objective,
    player: Player,
    tick: number,
    delta: number
  ): void {
    // Disabled because I don't know of a way to grab the player's xp score
    // const cmd = Utils.runCommand("xp 0 @s", player);
    // if (cmd.error) return;
    // objective.scoreboard.set(player, cmd.result.level);
  }
  scoreChanged(
    objective: Objective,
    player: Player,
    newScore: number,
    prevScore: number
  ): void {}

  constructor() {
    super("xp");
  }
}
