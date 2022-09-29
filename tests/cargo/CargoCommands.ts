import { Principal, Uint, Ascii }
  from './CargoCommandModel.ts'

import { CargoCreateShipmentCommand }
  from './CargoCreateShipmentCommand.ts'

import { CargoGetShipmentCommand }
  from './CargoGetShipmentCommand.ts'

import { CargoGetUnknownShipmentCommand }
  from './CargoGetUnknownShipmentCommand.ts'

import { CargoUpdateShipmentCommand }
  from './CargoUpdateShipmentCommand.ts'

import { CargoUpdateOthersShipmentCommand }
  from './CargoUpdateOthersShipmentCommand.ts'

import { Account }
  from 'https://deno.land/x/clarinet@v0.34.0/index.ts';

import fuzz
  from 'https://cdn.skypack.dev/fast-check@3.1.4';

export function CargoCommands(accounts: Map<string, Account>) {
  const allCommands = [
    // CargoCreateShipmentCommand
    fuzz.record({
        region: fuzz.constantFrom('Southwest', 'Southeast', 'Midwest')
      , sender: fuzz.constantFrom(...accounts.values()).map((account: Account) => account.address)
      , giftee: fuzz.constantFrom(...accounts.values()).map((account: Account) => account.address)
    }).map((r: { region: string; sender: string; giftee: string; }) =>
      new CargoCreateShipmentCommand(
          new Ascii(
            r.region)
        , new Principal(
            r.sender)
        , new Principal(
            r.giftee)
        )
      ),
    // CargoGetShipmentCommand
    fuzz.record({
        shipId: fuzz.integer({min: 1, max: 100})
    }).map((r: { shipId: number; }) =>
      new CargoGetShipmentCommand(
          new Uint(
            r.shipId)
        )
      ),
    // CargoGetUnknownShipmentCommand
    fuzz.record({
        shipId: fuzz.integer({min: 100, max: 999})
      , sender: fuzz.constantFrom(...accounts.values()).map((account: Account) => account.address)
    }).map((r: { shipId: number; sender: string; }) =>
      new CargoGetUnknownShipmentCommand(
          new Uint(
            r.shipId)
        , new Principal(
            r.sender)
        )
      ),
    // CargoUpdateShipmentCommand
    fuzz.record({
        shipId: fuzz.integer({min: 1, max: 100}),
        region: fuzz.constantFrom('Northeast', 'West')
      , sender: fuzz.constantFrom(...accounts.values()).map((account: Account) => account.address)
    }).map((r: { shipId: number; region: string; sender: string; }) =>
      new CargoUpdateShipmentCommand(
          new Uint(
            r.shipId)
        , new Ascii(
            r.region)
        , new Principal(
            r.sender)
        )
      ),
    // CargoUpdateOthersShipmentCommand
    fuzz.record({
        shipId: fuzz.integer({min: 1, max: 100}),
        region: fuzz.constantFrom('Northeast', 'West')
      , sender: fuzz.constantFrom(...accounts.values()).map((account: Account) => account.address)
    }).map((r: { shipId: number; region: string; sender: string; }) =>
      new CargoUpdateOthersShipmentCommand(
          new Uint(
            r.shipId)
        , new Ascii(
            r.region)
        , new Principal(
            r.sender)
        )
      ),
  ];
  // On size: https://github.com/dubzzz/fast-check/discussions/2978
  return fuzz.commands(allCommands, { size: '+1' });
}
