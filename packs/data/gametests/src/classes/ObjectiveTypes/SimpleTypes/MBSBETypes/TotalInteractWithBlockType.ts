import { Player, Entity, world } from "mojang-minecraft";
import { Objective } from "../../../Objective";
import { ObjectiveType } from "../../ObjectiveType";

export class TotalInteractWithBlockType extends ObjectiveType<"mbsbe.totalUsedOn"> {
  initialize(objective: Objective): void {
    world.events.itemStartUseOn.subscribe((evd) => {
      if (evd.source instanceof Player) this.addScore(objective, evd.source, 1);
    });
  }
  beforeUpdate(objective: Objective, tick: number, delta: number): void {}
  update(objective: Objective, tick: number, delta: number): void {}
  updatePlayer(
    objective: Objective,
    player: Player,
    tick: number,
    delta: number
  ): void {}
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
  ): void {}

  constructor() {
    super("mbsbe.totalUsedOn");
  }
}
