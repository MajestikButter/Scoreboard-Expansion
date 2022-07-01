import { MBCPlayer } from "mbcore-gametest";
import { Player, Entity, EntityMovementComponent } from "mojang-minecraft";
import { Objective } from "../../../Objective";
import { CompoundObjectiveType } from "../../CompoundObjectiveType";

export class MovementType extends CompoundObjectiveType {
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
  ): void {}
  updateEntity(
    objective: Objective,
    entity: Entity,
    tick: number,
    delta: number
  ): void {}
  updateActor(
    objective: Objective,
    actor: Entity,
    tick: number,
    delta: number
  ): void {
    const comp = actor.getComponent("movement") as EntityMovementComponent;
    const mul = Math.max(Math.pow(10, parseInt(this.argument)), 1);
    this.setScore(objective, actor, Math.floor(comp.current * mul));
  }
  scoreChanged(
    objective: Objective,
    entity: Entity,
    newScore: number,
    prevScore: number
  ): void {
    const comp = entity.getComponent("movement") as EntityMovementComponent;
    const div = Math.max(Math.pow(10, parseInt(this.argument)), 1);
    comp.setCurrent(newScore / div);
  }
  validArgument(argument: string): boolean {
    return /^\d+$/.test(argument);
  }
}
