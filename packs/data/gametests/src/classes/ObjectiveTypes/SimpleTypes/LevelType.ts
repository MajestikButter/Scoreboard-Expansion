import { EntityHealthComponent, Player, Entity, world } from "mojang-minecraft";
import { Objective } from "../../Objective";
import { Utils } from "../../Utils";
import { ObjectiveType } from "../ObjectiveType";

export class LevelType extends ObjectiveType<"level"> {
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
    const cmd = Utils.runCommand("xp 0 @s", player);
    if (cmd.error) return;
    this.setScore(objective, player, cmd.result.level);
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
    Utils.runCommand(`xp -100000l @s`, entity);
    Utils.runCommand(`xp ${newScore}l @s`, entity);
  }

  constructor() {
    super("level");
  }
}
