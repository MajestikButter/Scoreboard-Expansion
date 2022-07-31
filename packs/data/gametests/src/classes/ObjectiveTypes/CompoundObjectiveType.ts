import { ObjectiveType } from "./ObjectiveType";

export abstract class CompoundObjectiveType extends ObjectiveType {
  private _argument: string;
  get argument() {
    return this._argument;
  }

  equalsArgument(string: string) {
    return this.argument === this.parseArgument(string);
  }

  abstract validArgument(string: string): boolean;

  abstract parseArgument(string: string): string;

  constructor(raw: string, argument: string) {
    super(raw);

    if (!this.validArgument(argument)) throw new Error("Invalid argument");
    this._argument = this.parseArgument(argument);
  }
}
