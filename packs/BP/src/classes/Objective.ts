import { Scoreboard } from "mbcore-gametest";
import { EntityHealthComponent, TickEvent, world } from "mojang-minecraft";
import { ObjectiveType } from "./ObjectiveTypes/ObjectiveType";
import { Utils } from "./Utils";

export class Objective {
  static updateFuncs: {
    [type: string]: (objective: Objective, tick: number, delta: number) => void;
  } = {
    health: (objective) => {
      const sb = objective.scoreboard;
      for (const plr of world.getPlayers()) {
        const hp = plr.getComponent("health") as EntityHealthComponent;
        if (!hp) continue;
        sb.set(plr, hp.current);
      }
    },
  };

  private _id: string;
  get id() {
    return this._id;
  }
  private _type: ObjectiveType;
  get type() {
    return this._type;
  }
  private _scoreboard: Scoreboard;
  get scoreboard() {
    return this._scoreboard;
  }

  delete() {
    return !Utils.runCommand(`scoreboard objectives remove "${this.id}"`).error;
  }

  constructor(id: string, type: ObjectiveType) {
    this._id = id;
    this._type = type;
    this._scoreboard = new Scoreboard(this.id);
  }
}
