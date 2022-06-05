import { Player } from "mojang-minecraft";
import { Objective } from "../../Objective";
import { ObjectiveType } from "../ObjectiveType";

export class DummyType extends ObjectiveType<"dummy"> {
  initialize(objective: Objective): void {}
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
    super("dummy");
  }
}
