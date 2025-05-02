import { w as select, x as configureSvgSize, l as log } from "./mermaid-BTN5MP6C.js";
const getDiagramElement = (id, securityLevel) => {
  let sandboxElement;
  if (securityLevel === "sandbox") {
    sandboxElement = select("#i" + id);
  }
  const root = securityLevel === "sandbox" ? select(sandboxElement.nodes()[0].contentDocument.body) : select("body");
  const svg = root.select(`[id="${id}"]`);
  return svg;
};
const setupViewPortForSVG = (svg, padding, cssDiagram, useMaxWidth) => {
  svg.attr("class", cssDiagram);
  const { width, height, x, y } = calculateDimensionsWithPadding(svg, padding);
  configureSvgSize(svg, height, width, useMaxWidth);
  const viewBox = createViewBox(x, y, width, height, padding);
  svg.attr("viewBox", viewBox);
  log.debug(`viewBox configured: ${viewBox} with padding: ${padding}`);
};
const calculateDimensionsWithPadding = (svg, padding) => {
  var _a;
  const bounds = ((_a = svg.node()) === null || _a === void 0 ? void 0 : _a.getBBox()) || { width: 0, height: 0, x: 0, y: 0 };
  return {
    width: bounds.width + padding * 2,
    height: bounds.height + padding * 2,
    x: bounds.x,
    y: bounds.y
  };
};
const createViewBox = (x, y, width, height, padding) => {
  return `${x - padding} ${y - padding} ${width} ${height}`;
};
export {
  getDiagramElement as g,
  setupViewPortForSVG as s
};
