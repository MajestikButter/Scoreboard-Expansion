import { Player, Entity, world } from "mojang-minecraft";
import { Objective } from "../../../Objective";
import { CompoundObjectiveType } from "../../CompoundObjectiveType";

export class UsingOnType extends CompoundObjectiveType {
  private lastTriggerPlayers: { [plr: string]: number } = {};
  initialize(objective: Objective): void {
    world.events.itemUseOn.subscribe((evd) => {
      if (!(evd.source instanceof Player)) return;
      if (new Date().getTime() - this.lastTriggerPlayers[evd.source.name] < 45)
        return;
      this.lastTriggerPlayers[evd.source.name] = new Date().getTime();

      const isId = this.equalsArgument(evd.item?.id);
      if (!isId) return;
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
  updateActor(
    objective: Objective,
    actor: Entity,
    tick: number,
    delta: number
  ): void {}
  scoreChanged(
    objective: Objective,
    entity: Entity,
    newScore: number,
    prevScore: number
  ): void {}
  parseArgument(string: string): string {
    return string.replace(".", ":").replace("minecraft:", "");
  }
  validArgument(argument: string): boolean {
    return !!argument;
  }
}
