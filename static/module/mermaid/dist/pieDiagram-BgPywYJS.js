import { p as parse } from "./mermaid-parser.esm-B5WPt7J9.js";
import { a3 as constant, a4 as tau, a5 as array, n as getAccDescription, m as setAccDescription, o as getAccTitle, q as setAccTitle, D as getDiagramTitle, C as setDiagramTitle, l as log, I as clear$1, R as config$1, g as getConfig$1, P as cleanAndMerge, a2 as selectSvgElement, a6 as parseFontSize, x as configureSvgSize } from "./mermaid-DiDd0-cy.js";
import { p as populateCommonDb } from "./populateCommonDb-DR5KFGlj.js";
import { d as d3arc } from "./arc-D1IfNU-f.js";
import { o as ordinal } from "./ordinal-DSZU4PqD.js";
function descending(a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}
function identity(d) {
  return d;
}
function d3pie() {
  var value = identity, sortValues = descending, sort = null, startAngle = constant(0), endAngle = constant(tau), padAngle = constant(0);
  function pie(data) {
    var i, n = (data = array(data)).length, j, k, sum = 0, index = new Array(n), arcs = new Array(n), a0 = +startAngle.apply(this, arguments), da = Math.min(tau, Math.max(-tau, endAngle.apply(this, arguments) - a0)), a1, p = Math.min(Math.abs(da) / n, padAngle.apply(this, arguments)), pa = p * (da < 0 ? -1 : 1), v;
    for (i = 0; i < n; ++i) {
      if ((v = arcs[index[i] = i] = +value(data[i], i, data)) > 0) {
        sum += v;
      }
    }
    if (sortValues != null) index.sort(function(i2, j2) {
      return sortValues(arcs[i2], arcs[j2]);
    });
    else if (sort != null) index.sort(function(i2, j2) {
      return sort(data[i2], data[j2]);
    });
    for (i = 0, k = sum ? (da - n * pa) / sum : 0; i < n; ++i, a0 = a1) {
      j = index[i], v = arcs[j], a1 = a0 + (v > 0 ? v * k : 0) + pa, arcs[j] = {
        data: data[j],
        index: i,
        value: v,
        startAngle: a0,
        endAngle: a1,
        padAngle: p
      };
    }
    return arcs;
  }
  pie.value = function(_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : constant(+_), pie) : value;
  };
  pie.sortValues = function(_) {
    return arguments.length ? (sortValues = _, sort = null, pie) : sortValues;
  };
  pie.sort = function(_) {
    return arguments.length ? (sort = _, sortValues = null, pie) : sort;
  };
  pie.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant(+_), pie) : startAngle;
  };
  pie.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant(+_), pie) : endAngle;
  };
  pie.padAngle = function(_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant(+_), pie) : padAngle;
  };
  return pie;
}
const DEFAULT_PIE_CONFIG = config$1.pie;
const DEFAULT_PIE_DB = {
  sections: /* @__PURE__ */ new Map(),
  showData: false
};
let sections = DEFAULT_PIE_DB.sections;
let showData = DEFAULT_PIE_DB.showData;
const config = structuredClone(DEFAULT_PIE_CONFIG);
const getConfig = () => structuredClone(config);
const clear = () => {
  sections = /* @__PURE__ */ new Map();
  showData = DEFAULT_PIE_DB.showData;
  clear$1();
};
const addSection = ({ label, value }) => {
  if (!sections.has(label)) {
    sections.set(label, value);
    log.debug(`added new section: ${label}, with value: ${value}`);
  }
};
const getSections = () => sections;
const setShowData = (toggle) => {
  showData = toggle;
};
const getShowData = () => showData;
const db = {
  getConfig,
  clear,
  setDiagramTitle,
  getDiagramTitle,
  setAccTitle,
  getAccTitle,
  setAccDescription,
  getAccDescription,
  addSection,
  getSections,
  setShowData,
  getShowData
};
const populateDb = (ast, db2) => {
  populateCommonDb(ast, db2);
  db2.setShowData(ast.showData);
  ast.sections.map(db2.addSection);
};
const parser = {
  parse: async (input) => {
    const ast = await parse("pie", input);
    log.debug(ast);
    populateDb(ast, db);
  }
};
const getStyles = (options) => `
  .pieCircle{
    stroke: ${options.pieStrokeColor};
    stroke-width : ${options.pieStrokeWidth};
    opacity : ${options.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${options.pieOuterStrokeColor};
    stroke-width: ${options.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${options.pieTitleTextSize};
    fill: ${options.pieTitleTextColor};
    font-family: ${options.fontFamily};
  }
  .slice {
    font-family: ${options.fontFamily};
    fill: ${options.pieSectionTextColor};
    font-size:${options.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${options.pieLegendTextColor};
    font-family: ${options.fontFamily};
    font-size: ${options.pieLegendTextSize};
  }
`;
const createPieArcs = (sections2) => {
  const pieData = [...sections2.entries()].map((element) => {
    return {
      label: element[0],
      value: element[1]
    };
  }).sort((a, b) => {
    return b.value - a.value;
  });
  const pie = d3pie().value((d3Section) => d3Section.value);
  return pie(pieData);
};
const draw = (text, id, _version, diagObj) => {
  log.debug("rendering pie chart\n" + text);
  const db2 = diagObj.db;
  const globalConfig = getConfig$1();
  const pieConfig = cleanAndMerge(db2.getConfig(), globalConfig.pie);
  const MARGIN = 40;
  const LEGEND_RECT_SIZE = 18;
  const LEGEND_SPACING = 4;
  const height = 450;
  const pieWidth = height;
  const svg = selectSvgElement(id);
  const group = svg.append("g");
  group.attr("transform", "translate(" + pieWidth / 2 + "," + height / 2 + ")");
  const { themeVariables } = globalConfig;
  let [outerStrokeWidth] = parseFontSize(themeVariables.pieOuterStrokeWidth);
  outerStrokeWidth !== null && outerStrokeWidth !== void 0 ? outerStrokeWidth : outerStrokeWidth = 2;
  const textPosition = pieConfig.textPosition;
  const radius = Math.min(pieWidth, height) / 2 - MARGIN;
  const arcGenerator = d3arc().innerRadius(0).outerRadius(radius);
  const labelArcGenerator = d3arc().innerRadius(radius * textPosition).outerRadius(radius * textPosition);
  group.append("circle").attr("cx", 0).attr("cy", 0).attr("r", radius + outerStrokeWidth / 2).attr("class", "pieOuterCircle");
  const sections2 = db2.getSections();
  const arcs = createPieArcs(sections2);
  const myGeneratedColors = [
    themeVariables.pie1,
    themeVariables.pie2,
    themeVariables.pie3,
    themeVariables.pie4,
    themeVariables.pie5,
    themeVariables.pie6,
    themeVariables.pie7,
    themeVariables.pie8,
    themeVariables.pie9,
    themeVariables.pie10,
    themeVariables.pie11,
    themeVariables.pie12
  ];
  const color = ordinal(myGeneratedColors);
  group.selectAll("mySlices").data(arcs).enter().append("path").attr("d", arcGenerator).attr("fill", (datum) => {
    return color(datum.data.label);
  }).attr("class", "pieCircle");
  let sum = 0;
  sections2.forEach((section) => {
    sum += section;
  });
  group.selectAll("mySlices").data(arcs).enter().append("text").text((datum) => {
    return (datum.data.value / sum * 100).toFixed(0) + "%";
  }).attr("transform", (datum) => {
    return "translate(" + labelArcGenerator.centroid(datum) + ")";
  }).style("text-anchor", "middle").attr("class", "slice");
  group.append("text").text(db2.getDiagramTitle()).attr("x", 0).attr("y", -400 / 2).attr("class", "pieTitleText");
  const legend = group.selectAll(".legend").data(color.domain()).enter().append("g").attr("class", "legend").attr("transform", (_datum, index) => {
    const height2 = LEGEND_RECT_SIZE + LEGEND_SPACING;
    const offset = height2 * color.domain().length / 2;
    const horizontal = 12 * LEGEND_RECT_SIZE;
    const vertical = index * height2 - offset;
    return "translate(" + horizontal + "," + vertical + ")";
  });
  legend.append("rect").attr("width", LEGEND_RECT_SIZE).attr("height", LEGEND_RECT_SIZE).style("fill", color).style("stroke", color);
  legend.data(arcs).append("text").attr("x", LEGEND_RECT_SIZE + LEGEND_SPACING).attr("y", LEGEND_RECT_SIZE - LEGEND_SPACING).text((datum) => {
    const { label, value } = datum.data;
    if (db2.getShowData()) {
      return `${label} [${value}]`;
    }
    return label;
  });
  const longestTextWidth = Math.max(...legend.selectAll("text").nodes().map((node) => {
    var _a;
    return (_a = node === null || node === void 0 ? void 0 : node.getBoundingClientRect().width) !== null && _a !== void 0 ? _a : 0;
  }));
  const totalWidth = pieWidth + MARGIN + LEGEND_RECT_SIZE + LEGEND_SPACING + longestTextWidth;
  svg.attr("viewBox", `0 0 ${totalWidth} ${height}`);
  configureSvgSize(svg, height, totalWidth, pieConfig.useMaxWidth);
};
const renderer = { draw };
const diagram = {
  parser,
  db,
  renderer,
  styles: getStyles
};
export {
  diagram
};
