// @ts-nocheck FIXME
// https://github.com/dubzzz/fast-check/issues/2781
import fuzz
  from "https://cdn.skypack.dev/fast-check@3.0.0";

import { Chain, types }
  from "https://deno.land/x/clarinet@v0.34.0/index.ts";

export type Model = {
  shipments: Map<number, Record<string, string>>;
  currentId: number;
};

export type Real = {
  chain: Chain;
};

export type CargoCommand = fuzz.Command<Model, Real>;

//
// Interop: Clarity <-> TypeScript
//

export class Principal {
  readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  clarityValue(): string {
    return types.principal(this.value);
  }
}

export class Uint {
  readonly value: number;

  constructor(value: number) {
    this.value = value;
  }

  clarityValue(): string {
    return types.uint(this.value);
  }
}

export class Ascii {
  readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  clarityValue(): string {
    return types.ascii(this.value);
  }
}
