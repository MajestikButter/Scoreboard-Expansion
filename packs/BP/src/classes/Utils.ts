import {
  Dimension,
  Entity,
  MinecraftDimensionTypes,
  world,
} from "mojang-minecraft";

export class Utils {
  static getGamerules() {
    return JSON.parse(this.runCommand("gamerule").result.details);
  }

  static runCommand(
    cmd: string[],
    executor?: Dimension | Entity
  ): CMDResponse[];
  static runCommand(cmd: string, executor?: Dimension | Entity): CMDResponse;
  static runCommand(
    cmd: string | string[],
    executor: Dimension | Entity = world.getDimension(
      MinecraftDimensionTypes.overworld
    )
  ): CMDResponse | CMDResponse[] {
    const exec = (cmd: string) => {
      try {
        return { result: executor.runCommand(cmd), error: false };
      } catch (err) {
        return { result: JSON.parse(err), error: true };
      }
    };
    if (typeof cmd === "string") {
      return exec(cmd);
    }
    return cmd.map((v) => exec(v));
  }
}

interface CMDResponse {
  result: {
    [k: string]: any;
  };
  error: boolean;
}
