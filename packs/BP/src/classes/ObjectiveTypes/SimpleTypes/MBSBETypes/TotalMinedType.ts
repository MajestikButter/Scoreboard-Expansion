import { Player, world } from "mojang-minecraft";
import { Objective } from "../../../Objective";
import { ObjectiveType } from "../../ObjectiveType";

export class TotalMinedType extends ObjectiveType<"mbsbe.totalMined"> {
  initialize(objective: Objective): void {
    world.events.blockBreak.subscribe((evd) => {
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

  constructor() {
    super("mbsbe.totalMined");
  }
}
