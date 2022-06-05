import { EntityHealthComponent, Player, world } from "mojang-minecraft";
import { Objective } from "../../Objective";
import { Utils } from "../../Utils";
import { ObjectiveType } from "../ObjectiveType";

export class LevelType extends ObjectiveType<"level"> {
  initialize(objective: Objective): void {}
  update(objective: Objective, tick: number, delta: number): void {}
  updatePlayer(
    objective: Objective,
    player: Player,
    tick: number,
    delta: number
  ): void {
    const cmd = Utils.runCommand("xp 0 @s", player);
    if (cmd.error) return;
    objective.scoreboard.set(player, cmd.result.level);
  }
  scoreChanged(
    objective: Objective,
    player: Player,
    newScore: number,
    prevScore: number
  ): void {
    Utils.runCommand(`xp -100000l @s`, player);
    Utils.runCommand(`xp ${newScore}l @s`, player);
  }

  constructor() {
    super("level");
  }
}
