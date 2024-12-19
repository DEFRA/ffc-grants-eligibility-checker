import {
  actionImplementations,
  exampleGrantMachine,
  guardsImplementations,
  servicesImplementations
} from './example-grant-machine.js';

export const grantTypeToMachineMap = {
  'example-grant': {
    machine: exampleGrantMachine,
    actions: actionImplementations,
    guards: guardsImplementations,
    services: servicesImplementations
  }
};
