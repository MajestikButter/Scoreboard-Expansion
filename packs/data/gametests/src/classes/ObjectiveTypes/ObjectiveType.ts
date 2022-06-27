import {
  clearTickInterval,
  setTickInterval,
  setTickTimeout,
  UID,
} from "mbcore-gametest";
import {
  Entity,
  Player,
  ScoreboardIdentityType,
  world,
} from "mojang-minecraft";
import { Objective } from "../Objective";
import { Utils } from "../Utils";

export abstract class ObjectiveType<raw extends string = string> {
  private _raw: string;
  get raw() {
    return this._raw;
  }
  protected internalStore: { [name: string]: number } = {};

  abstract initialize(objective: Objective): void | PromiseLike<void>;
  abstract beforeUpdate(
    objective: Objective,
    tick: number,
    delta: number
  ): void | PromiseLike<void>;
  abstract update(
    objective: Objective,
    tick: number,
    delta: number
  ): void | PromiseLike<void>;
  abstract updatePlayer(
    objective: Objective,
    player: Player,
    tick: number,
    delta: number
  ): void | PromiseLike<void>;
  abstract updateEntity(
    objective: Objective,
    entity: Entity,
    tick: number,
    delta: number
  ): void | PromiseLike<void>;
  abstract scoreChanged(
    objective: Objective,
    entity: Entity,
    newScore: number,
    prevScore: number
  ): void | PromiseLike<void>;

  tick(objective: Objective, tick: number, delta: number) {
    this.beforeUpdate(objective, tick, delta);

    const obj = world.scoreboard.getObjective(objective.id);
    for (let scoreInfo of obj.getScores()) {
      if (scoreInfo.participant.type == ScoreboardIdentityType.fakePlayer)
        continue;

      let entity: Entity;
      try {
        entity = scoreInfo.participant.getEntity();
      } catch {
        continue;
      }

      if (Utils.runCommand("testfor @s", entity).error) continue;

      const uid = UID.getUID(entity);
      if (uid && this.internalStore[uid] !== undefined) {
        const prev = this.internalStore[uid];
        const curr = scoreInfo.score;
        if (prev !== curr) this.scoreChanged(objective, entity, curr, prev);
      }

      if (entity instanceof Player)
        this.updatePlayer(objective, entity, tick, delta);
      else this.updateEntity(objective, entity, tick, delta);
    }

    this.update(objective, tick, delta);
    for (const plr of world.getPlayers()) {
      this.internalStore[plr.name] = objective.scoreboard.get(plr);
    }
  }

  waitTicks(ticks: number) {
    return new Promise<void>((resolve, reject) => {
      setTickTimeout(() => resolve(), ticks);
    });
  }

  untilSuccessful(callback: () => void, interval = 1, timeout = 200) {
    let attempts = 0;
    const int = setTickInterval(() => {
      attempts++;
      if (attempts >= timeout) clearTickInterval(int);
      try {
        callback();
        clearTickInterval(int);
      } catch {}
    }, Math.max(interval, 1));
  }

  setScore(objective: Objective, entity: Entity, score: number) {
    const uid = UID.getUID(entity);
    if (!uid) return;
    score = Math.max(Math.min(Math.round(score), 2147483647), -2147483648);
    this.internalStore[uid] = score;
    objective.scoreboard.set(entity, score);
  }

  addScore(objective: Objective, entity: Entity, score: number) {
    this.setScore(objective, entity, objective.scoreboard.get(entity) + score);
  }

  constructor(raw: raw) {
    this._raw = raw;
  }
}
