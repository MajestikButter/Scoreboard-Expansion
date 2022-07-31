import { MBCPlayer } from "mbcore-gametest";
import {
  Player,
  Entity,
  world,
  Location,
  Vector,
  XYRotation,
} from "mojang-minecraft";
import { Objective } from "../../../Objective";
import { CompoundObjectiveType } from "../../CompoundObjectiveType";

export class RotationXType extends CompoundObjectiveType {
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
    const pos = actor.rotation.x;
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
    let { x, y } = entity.rotation;
    x = newScore / div;
    const vel = entity.velocity;

    if (!(entity instanceof Player)) {
      entity.setRotation(x, y);
      return;
    }

    const plr = MBCPlayer.getByPlayer(entity);
    entity.teleport(entity.location, entity.dimension, x, y);
    if (!plr) return;
    plr.setVelocity(vel);
  }
  parseArgument(string: string): string {
    return string;
  }
  validArgument(argument: string): boolean {
    return /^\d+$/.test(argument);
  }
}
