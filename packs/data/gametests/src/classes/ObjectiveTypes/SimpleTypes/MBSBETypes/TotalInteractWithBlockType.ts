import { Player, Entity, world } from "mojang-minecraft";
import { Objective } from "../../../Objective";
import { ObjectiveType } from "../../ObjectiveType";

export class TotalInteractWithBlockType extends ObjectiveType<"mbsbe.totalInteractWithBlock"> {
  private lastTriggerPlayers: { [plr: string]: number } = {};
  initialize(objective: Objective): void {
    world.events.itemUseOn.subscribe((evd) => {
      if (!(evd.source instanceof Player)) return;
      if (new Date().getTime() - this.lastTriggerPlayers[evd.source.name] < 45)
        return;
      const prev = this.lastTriggerPlayers[evd.source.name];
      this.lastTriggerPlayers[evd.source.name] = new Date().getTime();

      if (new Date().getTime() - prev < 150)
        return;

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

  constructor() {
    super("mbsbe.totalInteractWithBlock");
  }
}
