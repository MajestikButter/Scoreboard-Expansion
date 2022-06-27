import { Player, Entity, world } from "mojang-minecraft";
import { Objective } from "../../../Objective";
import { CompoundObjectiveType } from "../../CompoundObjectiveType";

export class PlacedType extends CompoundObjectiveType {
  initialize(objective: Objective): void {
    world.events.blockPlace.subscribe((evd) => {
      const isId = this.equalsArgument(evd.block.type.id);
      if (!isId) return;
      this.addScore(objective, evd.player, 1);
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
