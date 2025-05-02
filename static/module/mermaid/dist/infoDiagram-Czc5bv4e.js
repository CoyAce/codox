import { p as parse } from "./mermaid-parser.esm-B5WPt7J9.js";
import { l as log, a1 as packageJson, a2 as selectSvgElement, x as configureSvgSize } from "./mermaid-DiDd0-cy.js";
const parser = {
  parse: async (input) => {
    const ast = await parse("info", input);
    log.debug(ast);
  }
};
const DEFAULT_INFO_DB = { version: packageJson.version };
const getVersion = () => DEFAULT_INFO_DB.version;
const db = {
  getVersion
};
const draw = (text, id, version) => {
  log.debug("rendering info diagram\n" + text);
  const svg = selectSvgElement(id);
  configureSvgSize(svg, 100, 400, true);
  const group = svg.append("g");
  group.append("text").attr("x", 100).attr("y", 40).attr("class", "version").attr("font-size", 32).style("text-anchor", "middle").text(`v${version}`);
};
const renderer = { draw };
const diagram = {
  parser,
  db,
  renderer
};
export {
  diagram
};
