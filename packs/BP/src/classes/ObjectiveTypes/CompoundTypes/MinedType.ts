import { Player, world } from "mojang-minecraft";
import { Objective } from "../../Objective";
import { CompoundObjectiveType } from "../CompoundObjectiveType";

export class MinedType extends CompoundObjectiveType {
  initialize(objective: Objective): void {
    world.events.blockBreak.subscribe((evd) => {
      const isId = this.equalsDelimiter(evd.brokenBlockPermutation.type.id);
      if (!isId) return;
      objective.scoreboard.add(evd.player, 1);
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
