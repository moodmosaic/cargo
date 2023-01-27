import { Principal, Uint, Model, Real, CargoCommand }
  from './CargoCommandModel.ts'

import {
  assertObjectMatch,
} from "https://deno.land/std@0.160.0/testing/asserts.ts";

export class CargoGetUnknownShipmentCommand
  implements CargoCommand {

  readonly shipId: Uint;
  readonly sender: Principal;

  constructor(
      shipId: Uint
    , sender: Principal
    ) {
    this.shipId = shipId;
    this.sender = sender;
  }

  check(model: Readonly<Model>): boolean {
    const isUnknown = this.shipId.value > model.currentId;
    return isUnknown;
  }

  run(_: Model, real: Real): void {
    const result = real.chain
      .callReadOnlyFn(
        'cargo', 'get-shipment', [this.shipId.clarityValue()],
        this.sender.value)
      .result;

    assertObjectMatch(result.expectTuple(), { status: '"Does not exist"' });

    console.log(this.printInfo(_));
  }

  toString() {
    // fast-check will call toString() in case of errors, e.g. property failed.
    // It will then make a minimal counterexample, a process called 'shrinking'
    // https://github.com/dubzzz/fast-check/issues/2864#issuecomment-1098002642
    return `get-shipment ${this.shipId.value} (which is unknown)`;
  }

  printInfo(_: Readonly<Model>) {
    const info =
        `Ӿ tx-sender ${this.sender.value.padStart(43, ' ')} `
      + `⚑ ${'get-shipment'.padStart(19, ' ')} `
      + `id ${this.shipId.value.toString().padStart(3, ' ')} `
      + `which is unknown, returns err u100`;
    return info;
  }
}
