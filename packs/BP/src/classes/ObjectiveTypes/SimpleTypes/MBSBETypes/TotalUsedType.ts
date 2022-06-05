import { Player, world } from "mojang-minecraft";
import { Objective } from "../../../Objective";
import { ObjectiveType } from "../../ObjectiveType";

export class TotalUsedType extends ObjectiveType<"mbsbe.totalUsed"> {
  initialize(objective: Objective): void {
    world.events.itemUse.subscribe((evd) => {
      if (evd.source instanceof Player) objective.scoreboard.add(evd.source, 1);
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

  constructor() {
    super("mbsbe.totalUsed");
  }
}
