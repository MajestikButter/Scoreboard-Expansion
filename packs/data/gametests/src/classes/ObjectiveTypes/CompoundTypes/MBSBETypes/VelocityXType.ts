import { MBCPlayer } from "mbcore-gametest";
import { Player, Entity, world, Location, Vector } from "mojang-minecraft";
import { Objective } from "../../../Objective";
import { CompoundObjectiveType } from "../../CompoundObjectiveType";

export class VelocityXType extends CompoundObjectiveType {
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
    const decimals = parseInt(this.argument);
    const pos = actor.velocity.x;
    const mul = Math.max(Math.pow(10, decimals), 1);
    this.setScore(objective, actor, Math.floor(pos * mul));
  }
  scoreChanged(
    objective: Objective,
    entity: Entity,
    newScore: number,
    prevScore: number
  ): void {
    const decimals = parseInt(this.argument);
    const div = Math.max(Math.pow(10, decimals), 1);
    let { x, y, z } = entity.velocity;
    x = newScore / div;

    let ent: Entity | MBCPlayer | undefined = entity;
    if (entity instanceof Player) ent = MBCPlayer.getByPlayer(entity);
    if (!ent) return;

    ent.setVelocity(new Vector(x, y, z));
  }
  parseArgument(string: string): string {
    return string;
  }
  validArgument(argument: string): boolean {
    return /^\d+$/.test(argument);
  }
}
