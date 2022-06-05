import { Player, world } from "mojang-minecraft";
import { Objective } from "../../../Objective";
import { ObjectiveType } from "../../ObjectiveType";

export class TotalPlacedType extends ObjectiveType<"mbsbe.totalPlaced"> {
  initialize(objective: Objective): void {
    world.events.blockPlace.subscribe((evd) => {
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
    super("mbsbe.totalPlaced");
  }
}
