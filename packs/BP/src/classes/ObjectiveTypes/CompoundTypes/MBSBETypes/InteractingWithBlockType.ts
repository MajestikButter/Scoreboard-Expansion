import { Player, world } from "mojang-minecraft";
import { Objective } from "../../../Objective";
import { CompoundObjectiveType } from "../../CompoundObjectiveType";

export class InteractingWithBlockType extends CompoundObjectiveType {
  private lastTriggerPlayers: { [plr: string]: number } = {};
  initialize(objective: Objective): void {
    world.events.itemUseOn.subscribe((evd) => {
      if (!(evd.source instanceof Player)) return;
      if (new Date().getTime() - this.lastTriggerPlayers[evd.source.name] < 10)
        return;
      this.lastTriggerPlayers[evd.source.name] = new Date().getTime();

      const block = evd.source.dimension.getBlock(evd.blockLocation);
      const isId = this.equalsDelimiter(block.type.id);
      if (!isId) return;
      objective.scoreboard.add(evd.source, 1);
    });
  }
  update(objective: Objective, tick: number, delta: number): void {}
  updatePlayer(
    objective: Objective,
    player: Player,
    tick: number,
    delta: number
  ): void {}
  scoreChanged(
    objective: Objective,
    player: Player,
    newScore: number,
    prevScore: number
  ): void {}
}
