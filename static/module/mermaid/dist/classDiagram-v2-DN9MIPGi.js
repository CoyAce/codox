import { g as getStyles, r as renderer, p as parser, C as ClassDB } from "./classRenderer-v3-unified-CSDl7M61.js";
const diagram = {
  parser,
  get db() {
    return new ClassDB();
  },
  renderer,
  styles: getStyles,
  init: (cnf) => {
    if (!cnf.class) {
      cnf.class = {};
    }
    cnf.class.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
  }
};
export {
  diagram
};
