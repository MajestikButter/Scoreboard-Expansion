import { Player, world } from "mojang-minecraft";
import { Objective } from "../../../Objective";
import { CompoundObjectiveType } from "../../CompoundObjectiveType";

export class UsedType extends CompoundObjectiveType {
  initialize(objective: Objective): void {
    world.events.itemUse.subscribe((evd) => {
      const isId = this.equalsDelimiter(evd.item.id);
      if (!isId || !(evd.source instanceof Player)) return;
      objective.scoreboard.add(evd.source, 1);
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
}
