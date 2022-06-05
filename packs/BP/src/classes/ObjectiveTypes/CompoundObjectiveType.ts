import { Objective } from "../Objective";
import { ObjectiveType } from "./ObjectiveType";

export abstract class CompoundObjectiveType extends ObjectiveType {
  private _delimiter: string;
  get delimiter() {
    return this._delimiter;
  }

  equalsDelimiter(string: string, separator = ":") {
    return (
      this.delimiter.replace("minecraft.", "") ===
      string.replace("minecraft" + separator, "")
    );
  }

  constructor(raw: string, delimiter: string) {
    super(raw);
    this._delimiter = delimiter;
  }
}
