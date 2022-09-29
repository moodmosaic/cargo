import { Account, Chain, Clarinet }
  from "https://deno.land/x/clarinet@v0.34.0/index.ts";

import { CargoCommands }
  from "./cargo/CargoCommands.ts";

import fuzz
  from "https://cdn.skypack.dev/fast-check@3.0.0";

Clarinet.test({
  name: "Cargo model-based tests",
  fn(chain: Chain, accounts: Map<string, Account>) {
    const initialChain = { chain: chain };
    const initialModel = {
      shipments: new Map<number, Record<string, string>>(),
      currentId: 0,
    };
    fuzz.assert(
      fuzz.property(
        CargoCommands(accounts),
        (cmds: []) => {
          const initialState = () => ({
            model: initialModel,
             real: initialChain,
          });
          fuzz.modelRun(initialState, cmds);
        },
      ),
      { numRuns: 10, verbose: true },
    );
  },
});
