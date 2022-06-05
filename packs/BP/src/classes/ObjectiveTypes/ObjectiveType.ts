import {
  clearTickInterval,
  setTickInterval,
  setTickTimeout,
} from "mbcore-gametest";
import { Player, world } from "mojang-minecraft";
import { Objective } from "../Objective";

export abstract class ObjectiveType<raw extends string = string> {
  private _raw: string;
  get raw() {
    return this._raw;
  }
  protected internalStore: { [name: string]: number } = {};

  abstract initialize(objective: Objective): void | PromiseLike<void>;
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
  abstract scoreChanged(
    objective: Objective,
    player: Player,
    newScore: number,
    prevScore: number
  ): void | PromiseLike<void>;

  tick(objective: Objective, tick: number, delta: number) {
    for (const plr of world.getPlayers()) {
      if (this.internalStore[plr.name] !== undefined) {
        const prev = this.internalStore[plr.name];
        const curr = objective.scoreboard.get(plr);
        if (prev !== curr) this.scoreChanged(objective, plr, curr, prev);
      }
      this.updatePlayer(objective, plr, tick, delta);
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

  constructor(raw: raw) {
    this._raw = raw;
  }
}
