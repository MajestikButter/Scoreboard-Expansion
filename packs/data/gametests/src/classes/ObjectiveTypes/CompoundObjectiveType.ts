import { ObjectiveType } from "./ObjectiveType";

export abstract class CompoundObjectiveType extends ObjectiveType {
  private _argument: string;
  get argument() {
    return this._argument;
  }

  equalsArgument(string: string, separator = ":") {
    return (
      this.argument.replace("minecraft.", "") ===
      string?.replace("minecraft" + separator, "")
    );
  }

  abstract validArgument(string: string): boolean;

  constructor(raw: string, argument: string) {
    super(raw);

    if (!this.validArgument(argument))
      throw new Error("Invalid argument");
    this._argument = argument;
  }
}
