import { Objective } from "./Objective";
import {
  Collection,
  CommandHandler,
  DataBase,
  Document,
  FieldTypes,
  StringField,
} from "mbcore-gametest";
import { Player, world } from "mojang-minecraft";
import { ObjectiveType } from "./ObjectiveTypes/ObjectiveType";
import { CompoundObjectiveType } from "./ObjectiveTypes/CompoundObjectiveType";
import { DummyType } from "./ObjectiveTypes/SimpleTypes/DummyType";
import { HealthType } from "./ObjectiveTypes/SimpleTypes/HealthType";
import { MinedType } from "./ObjectiveTypes/CompoundTypes/MinedType";
import { PlacedType } from "./ObjectiveTypes/CompoundTypes/MBSBETypes/PlacedType";
import { DeathCountType } from "./ObjectiveTypes/SimpleTypes/DeathCountType";
import { DamageTakenType } from "./ObjectiveTypes/CompoundTypes/CustomTypes/DamageTakenType";
import { DamageDealtType } from "./ObjectiveTypes/CompoundTypes/CustomTypes/DamageDealtType";
import { TravelOneCMType } from "./ObjectiveTypes/CompoundTypes/MBSBETypes/TravelOneCMType";
import { CrouchOneCMType } from "./ObjectiveTypes/CompoundTypes/CustomTypes/CrouchOneCMType";
import { XPType } from "./ObjectiveTypes/SimpleTypes/XPType";
import { LevelType } from "./ObjectiveTypes/SimpleTypes/LevelType";
import { KilledByType } from "./ObjectiveTypes/CompoundTypes/KilledByType";
import { KilledType } from "./ObjectiveTypes/CompoundTypes/KilledType";
import { TotalKillCountType } from "./ObjectiveTypes/SimpleTypes/TotalKillCountType";
import { PlayerKillCountType } from "./ObjectiveTypes/SimpleTypes/PlayerKillCountType";
import { Utils } from "./Utils";
import { TriggerType } from "./ObjectiveTypes/SimpleTypes/TriggerType";
import { TotalUsedOnType } from "./ObjectiveTypes/SimpleTypes/MBSBETypes/TotalUsedOnType";
import { TotalUsedType } from "./ObjectiveTypes/SimpleTypes/MBSBETypes/TotalUsedType";
import { TotalMinedType } from "./ObjectiveTypes/SimpleTypes/MBSBETypes/TotalMinedType";
import { TotalPlacedType } from "./ObjectiveTypes/SimpleTypes/MBSBETypes/TotalPlacedType";
import { UsingOnType } from "./ObjectiveTypes/CompoundTypes/MBSBETypes/UsingOnType";
import { UsedType } from "./ObjectiveTypes/CompoundTypes/MBSBETypes/UsedType";
import { InteractingWithBlockType } from "./ObjectiveTypes/CompoundTypes/MBSBETypes/InteractingWithBlockType";

class ObjectiveMap {
  private scoreboard = new DataBase("mbsbe:objectives");

  private _objectives = new Map<string, Objective>();
  private _types = new Map<
    string,
    | (new () => ObjectiveType)
    | (new (raw: string, delimiter: string) => CompoundObjectiveType)
  >();

  getAllSBObjectives(): string[] {
    const cmd = CommandHandler.run("scoreboard objectives list");
    if (cmd.error) return [];
    return Array.from(
      (cmd.result.statusMessage as string).matchAll(/- (.+):/g)
    ).map((v) => v[1]);
  }

  verifyObjectives() {
    const objs = this.getAllSBObjectives();
    for (let obj of this._objectives.values()) {
      if (!objs.includes(obj.id)) {
        obj.delete();
        this._objectives.delete(obj.id);
      }
    }
  }

  getType(rawType: string): ObjectiveType {
    if (rawType.includes(":")) {
      const split = rawType.split(":");
      const id = split[0].replace("minecraft.", "");
      let constructor: any;
      const delimiter = split[1].replace("minecraft.", "");
      if (id !== "custom") {
        constructor = this._types.get(id);
      } else {
        constructor = this._types.get(`${id}:${delimiter}`);
      }
      if (!constructor) return;
      return new constructor(rawType, delimiter);
    }
    const constructor = this._types.get(rawType) as new () => ObjectiveType;
    if (!constructor) return;
    return new constructor();
  }

  getObjective(id: string) {
    this.verifyObjectives();
    return this._objectives.get(id);
  }

  /**
   * Gets cached scoreboards
   * @param options Optional filters for the scoreboards being returned via this method
   * @returns An array of Objectives
   */
  getObjectives(
    options: {
      types?: { type: string; exclude?: boolean }[];
      ids?: { id: string; exclude?: boolean }[];
    } = {}
  ) {
    let opts = options;
    opts = Object.assign(
      {
        types: {},
        ids: {},
      },
      opts
    );
    opts.types = opts.types ?? [];
    opts.ids = opts.ids ?? [];

    this.verifyObjectives();

    let objs = Array.from(this._objectives.values());
    if (opts.types.length || opts.ids.length) {
      objs = objs.filter((v) => {
        return (
          (opts.types.length
            ? opts.types.every((t) =>
                t.type === v.type.raw ? !t.exclude : t.exclude
              )
            : true) &&
          (opts.ids.length
            ? opts.ids.every((i) => (i.id === v.id ? !i.exclude : i.exclude))
            : true)
        );
      });
    }
    return objs;
  }

  hasObjective(id: string) {
    this.verifyObjectives();
    return this._objectives.has(id);
  }

  createObjective(id: string, type: string) {
    this.verifyObjectives();
    if (this._objectives.has(id)) throw new Error("Objective already exists");
    const typeC = this.getType(type);
    if (!typeC) throw new Error("Invalid type supplied");
    const obj = new Objective(id, typeC);
    this._objectives.set(obj.id, obj);
    typeC.initialize(obj);
    this.saveObjectives();
    return obj;
  }

  loadObjectives() {
    const objs = this.getCollection().getAllDocuments();
    const loading: { [id: string]: ObjectiveType } = {};
    for (let obj of objs) {
      loading[obj.get("id")] = this.getType(obj.get("type"));
    }
    this._objectives.clear();
    const sbIds = this.getAllSBObjectives();
    for (let id of sbIds) {
      const obj = new Objective(id, loading[id] ?? this.getType("dummy"));
      this._objectives.set(id, obj);
      obj.type.initialize(obj);
    }
    this.verifyObjectives();
  }

  saveObjectives() {
    this.verifyObjectives();
    const objs = this.getObjectives({
      types: [{ type: "dummy", exclude: true }],
    });
    const collection = this.getCollection();
    collection.deleteAllDocuments();
    for (const obj of objs) {
      const doc = new Document(obj.id, collection);
      doc.set("id", obj.id);
      doc.set("type", obj.type.raw);
      collection.writeDocument(doc);
    }
    return this.scoreboard.save();
  }

  getCollection() {
    if (!this.scoreboard.hasCollection("objectives")) {
      const coll = new Collection("objectives", {
        id: FieldTypes.string,
        type: FieldTypes.string,
      });
      this.scoreboard.setCollection(coll);
      return coll;
    }
    return this.scoreboard.getCollection("objectives") as Collection<{
      type: typeof StringField;
      id: typeof StringField;
    }>;
  }

  private addType(
    type: string,
    typeConstructor:
      | (new () => ObjectiveType)
      | (new (raw: string, delimiter: string) => CompoundObjectiveType)
  ) {
    this._types.set(type, typeConstructor);
  }

  private addTypes() {
    // Objective types that are on java and aren't newly added by the addon
    this.addJavaTypes();

    // New objective types that aren't on java and are added by the addon
    this.addNewTypes();
  }

  private addJavaTypes() {
    //////////////////////////////////////
    //// Non-compound objective types ////
    //////////////////////////////////////

    this.addType("dummy", DummyType);
    this.addType("trigger", TriggerType);
    this.addType("health", HealthType);
    this.addType("deathCount", DeathCountType);
    // this.addType("xp", XPType); // Disabled because I don't know of a way to grab the player's xp score
    this.addType("level", LevelType);
    this.addType("playerKillCount", PlayerKillCountType);
    this.addType("totalKillCount", TotalKillCountType);

    //////////////////////////////////
    //// Compound objective types ////
    //////////////////////////////////

    this.addType("mined", MinedType);
    this.addType("killed_by", KilledByType);
    this.addType("killed", KilledType);

    // Custom objective types that fall under the 'custom' compound criteria
    this.addCustomJavaTypes();
  }

  private addCustomJavaTypes() {
    this.addType("custom:damage_dealt", DamageDealtType);
    this.addType("custom:damage_taken", DamageTakenType);
    this.addType("custom:crouch_one_cm", CrouchOneCMType);
    this.addType("custom:sneak_time", CrouchOneCMType);
  }

  private addNewTypes() {
    //////////////////////////////////////
    //// Non-compound objective types ////
    //////////////////////////////////////

    this.addType("mbsbe.totalPlaced", TotalPlacedType);
    this.addType("mbsbe.totalMined", TotalMinedType);
    this.addType("mbsbe.totalUsedOn", TotalUsedOnType);
    this.addType("mbsbe.totalUsed", TotalUsedType);

    //////////////////////////////////
    //// Compound objective types ////
    //////////////////////////////////

    this.addType("mbsbe.interactingWithBlock", InteractingWithBlockType);
    this.addType("mbsbe.placed", PlacedType);
    this.addType("mbsbe.usingOn", UsingOnType);
    this.addType("mbsbe.used", UsedType);
    this.addType("custom:mbsbe.travel_one_cm", TravelOneCMType);
  }

  constructor() {
    this.addTypes();
    this.loadObjectives();

    world.events.tick.subscribe((evd) => {
      const objs = this.getObjectives({
        types: [
          {
            type: "dummy",
            exclude: true,
          },
        ],
      });
      for (const obj of objs) {
        obj.type.tick(obj, evd.currentTick, evd.deltaTime);
      }
      if (evd.currentTick % 200 == 0) this.saveObjectives();
    });

    const prefix = "\\";
    const sendMessage = (plr: Player, msg: string, shouldSend: boolean) => {
      if (shouldSend)
        Utils.runCommand(
          `tellraw @s {"rawtext":[{"text":${JSON.stringify(msg)}}]}`,
          plr
        );
    };
    const throwCMDError = (plr: Player, msg: string) => {
      sendMessage(
        plr,
        `§cAn error occured while running your command: ${msg}§r`,
        true
      );
    };
    world.events.beforeChat.subscribe((evd) => {
      if (!evd.message.startsWith(prefix)) return;
      evd.cancel = true;
      const msg = evd.message.slice(prefix.length);
      if (msg.includes('"')) {
        return throwCMDError(
          evd.sender,
          `" is not currently supported in custom commands`
        );
      }
      const hasOPTag = evd.sender.hasTag("op");
      const cmdFeed = Utils.getGamerules().sendcommandfeedback;

      const args = msg.split(" ");
      switch (args[0].toLocaleLowerCase()) {
        case "trigger": {
          const objectiveStr = args[1];
          if (!objectiveStr) {
            return throwCMDError(evd.sender, "No objective supplied");
          }
          const objective = this.getObjective(args[1]);
          if (!objective) {
            return throwCMDError(
              evd.sender,
              `${objectiveStr} is not a valid objective`
            );
          }
          if (objective.type.raw !== "trigger") {
            return throwCMDError(
              evd.sender,
              `${objectiveStr} is not a trigger type objective`
            );
          }
          if (!evd.sender.hasTag(`enable:${objectiveStr}`)) {
            return throwCMDError(
              evd.sender,
              `You do not have permission to trigger ${objectiveStr}`
            );
          }
          if (args[2]) {
            const parseVal = () => {
              if (!args[3]) {
                return throwCMDError(evd.sender, "No value supplied");
              }
              if (args[3].match(/-?\d+/)[0] !== args[3]) {
                return throwCMDError(
                  evd.sender,
                  `Invalid value supplied ${args[3]}`
                );
              }
              return Math.min(
                Math.max(parseInt(args[3]), -2147483648),
                2147483647
              );
            };
            switch (args[2].toLocaleLowerCase()) {
              case "add": {
                const value = parseVal();
                if (value === undefined) return;
                objective.scoreboard.add(evd.sender, value as number);
                sendMessage(
                  evd.sender,
                  `Triggered [${objectiveStr}] (added ${value} to value)`,
                  cmdFeed
                );
                break;
              }
              case "set": {
                const value = parseVal();
                if (value === undefined) return;
                objective.scoreboard.set(evd.sender, value as number);
                sendMessage(
                  evd.sender,
                  `Triggered [${objectiveStr}] (set value to ${value})`,
                  cmdFeed
                );
                break;
              }
              default: {
                return throwCMDError(evd.sender, `Invalid argument ${args[2]}`);
              }
            }
          } else {
            objective.scoreboard.add(evd.sender, 1);
            sendMessage(evd.sender, `Triggered [${objectiveStr}]`, cmdFeed);
          }
          evd.sender.removeTag(`enable:${objectiveStr}`);
          break;
        }
        case "scoreboard": {
          if (!hasOPTag) {
            return throwCMDError(
              evd.sender,
              "You do not have permission to use this command"
            );
          }
          if (!args[1]) {
            return throwCMDError(evd.sender, "No subcommand supplied");
          }
          switch (args[1].toLocaleLowerCase()) {
            case "objectives": {
              if (!args[2]) {
                return throwCMDError(
                  evd.sender,
                  "No objectives subcommand supplied"
                );
              }
              switch (args[2].toLocaleLowerCase()) {
                case "add": {
                  if (!args[3]) {
                    return throwCMDError(
                      evd.sender,
                      `No objective id supplied`
                    );
                  }
                  if (!args[4]) {
                    return throwCMDError(
                      evd.sender,
                      `No objective type supplied`
                    );
                  }
                  try {
                    Objectives.createObjective(args[3], args[4]);
                  } catch (err) {
                    return throwCMDError(evd.sender, err);
                  }
                  sendMessage(
                    evd.sender,
                    `Added objective ${args[3]} as type ${args[4]}`,
                    cmdFeed
                  );
                  break;
                }
                case "types": {
                  let simpleTypes = " - §l§aSingle Criteria§r§b§r";
                  let compoundTypes = " - §l§aCompound Criteria§r§b§r";
                  for (let [id, val] of this._types) {
                    if (val.prototype instanceof CompoundObjectiveType) {
                      compoundTypes += `\n  * ${id}`;
                    } else simpleTypes += `\n  * ${id}`;
                  }
                  sendMessage(
                    evd.sender,
                    `§l§2> Objective Types\n${simpleTypes}\n${compoundTypes}§r`,
                    true
                  );
                  break;
                }
                default: {
                  return throwCMDError(
                    evd.sender,
                    `Invalid objectives subcommand ${args[2]}`
                  );
                }
              }
              break;
            }
            case "players": {
              if (!args[2]) {
                return throwCMDError(
                  evd.sender,
                  "No players subcommand supplied"
                );
              }
              switch (args[2].toLocaleLowerCase()) {
                case "enable": {
                  // if (!args[3]) {
                  //   return throwCMDError(
                  //     evd.sender,
                  //     `No objective id supplied`
                  //   );
                  // }
                  // if (!args[4]) {
                  //   return throwCMDError(
                  //     evd.sender,
                  //     `No objective type supplied`
                  //   );
                  // }
                  // try {
                  //   Objectives.createObjective(args[3], args[4]);
                  // } catch (err) {
                  //   return throwCMDError(evd.sender, err);
                  // }
                  // sendMessage(
                  //   evd.sender,
                  //   `Added objective ${args[3]} as type ${args[4]}`,
                  //   cmdFeed
                  // );
                  break;
                }
                default: {
                  return throwCMDError(
                    evd.sender,
                    `Invalid players subcommand ${args[2]}`
                  );
                }
              }
              break;
            }
            default: {
              return throwCMDError(evd.sender, `Invalid subcommand ${args[1]}`);
            }
          }
          break;
        }
        case "?":
        case "help": {
          sendMessage(
            evd.sender,
            `§l§2> Help§r§a
 - trigger <objective>
 - trigger <objective> add <value>
 - trigger <objective> set <value>
 - scoreboard objectives add <objectiveId> <objectiveType>
 - scoreboard objectives list
 - scoreboard objectives types§r`,
            true
          );
          break;
        }
        default: {
          return throwCMDError(evd.sender, `Invalid command ${args[0]}`);
        }
      }
    });
  }
}

export const Objectives = new ObjectiveMap();
// world.events.beforeChat.subscribe((evd) => {
//   const args = evd.message.split(" ");
//   Objectives.createObjective(args[0], args[1]);
// });