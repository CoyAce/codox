import { g as getStyles, r as renderer, p as parser, S as StateDB } from "./styles-apAmLlei.js";
const diagram = {
  parser,
  get db() {
    return new StateDB(2);
  },
  renderer,
  styles: getStyles,
  init: (cnf) => {
    if (!cnf.state) {
      cnf.state = {};
    }
    cnf.state.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
  }
};
export {
  diagram
};
