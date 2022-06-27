import { Player, Entity, world } from "mojang-minecraft";
import { Objective } from "../../Objective";
import { CompoundObjectiveType } from "../CompoundObjectiveType";

export class UsedType extends CompoundObjectiveType {
  initialize(objective: Objective): void {
    world.events.itemCompleteCharge.subscribe((evd) => {
      if (!this.equalsArgument(evd.itemStack.id)) return;
      this.addScore(objective, evd.source, 1);
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
  validArgument(argument: string): boolean {
    return !!argument;
  }
}
