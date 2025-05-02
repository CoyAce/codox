import { b0 as Utils, b1 as Color } from "./mermaid-DiDd0-cy.js";
const channel = (color, channel2) => {
  return Utils.lang.round(Color.parse(color)[channel2]);
};
export {
  channel as c
};
