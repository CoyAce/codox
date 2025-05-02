import { m as setAccDescription, n as getAccDescription, D as getDiagramTitle, C as setDiagramTitle, o as getAccTitle, q as setAccTitle, I as clear$1, P as cleanAndMerge, Q as getConfig$1, R as config, l as log, a2 as selectSvgElement, a7 as getThemeVariables } from "./mermaid-BTN5MP6C.js";
import { p as parse } from "./mermaid-parser.esm-DhjzXtx8.js";
import { p as populateCommonDb } from "./populateCommonDb-DR5KFGlj.js";
const defaultOptions = {
  showLegend: true,
  ticks: 5,
  max: null,
  min: 0,
  graticule: "circle"
};
const defaultRadarData = {
  axes: [],
  curves: [],
  options: defaultOptions
};
let data = structuredClone(defaultRadarData);
const DEFAULT_RADAR_CONFIG = config.radar;
const getConfig = () => {
  const config2 = cleanAndMerge({
    ...DEFAULT_RADAR_CONFIG,
    ...getConfig$1().radar
  });
  return config2;
};
const getAxes = () => data.axes;
const getCurves = () => data.curves;
const getOptions = () => data.options;
const setAxes = (axes) => {
  data.axes = axes.map((axis) => {
    var _a;
    return {
      name: axis.name,
      label: (_a = axis.label) !== null && _a !== void 0 ? _a : axis.name
    };
  });
};
const setCurves = (curves) => {
  data.curves = curves.map((curve) => {
    var _a;
    return {
      name: curve.name,
      label: (_a = curve.label) !== null && _a !== void 0 ? _a : curve.name,
      entries: computeCurveEntries(curve.entries)
    };
  });
};
const computeCurveEntries = (entries) => {
  if (entries[0].axis == void 0) {
    return entries.map((entry) => entry.value);
  }
  const axes = getAxes();
  if (axes.length === 0) {
    throw new Error("Axes must be populated before curves for reference entries");
  }
  return axes.map((axis) => {
    const entry = entries.find((entry2) => {
      var _a;
      return ((_a = entry2.axis) === null || _a === void 0 ? void 0 : _a.$refText) === axis.name;
    });
    if (entry === void 0) {
      throw new Error("Missing entry for axis " + axis.label);
    }
    return entry.value;
  });
};
const setOptions = (options) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
  const optionMap = options.reduce((acc, option) => {
    acc[option.name] = option;
    return acc;
  }, {});
  data.options = {
    showLegend: (_b = (_a = optionMap.showLegend) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : defaultOptions.showLegend,
    ticks: (_d = (_c = optionMap.ticks) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : defaultOptions.ticks,
    max: (_f = (_e = optionMap.max) === null || _e === void 0 ? void 0 : _e.value) !== null && _f !== void 0 ? _f : defaultOptions.max,
    min: (_h = (_g = optionMap.min) === null || _g === void 0 ? void 0 : _g.value) !== null && _h !== void 0 ? _h : defaultOptions.min,
    graticule: (_k = (_j = optionMap.graticule) === null || _j === void 0 ? void 0 : _j.value) !== null && _k !== void 0 ? _k : defaultOptions.graticule
  };
};
const clear = () => {
  clear$1();
  data = structuredClone(defaultRadarData);
};
const db = {
  getAxes,
  getCurves,
  getOptions,
  setAxes,
  setCurves,
  setOptions,
  getConfig,
  clear,
  setAccTitle,
  getAccTitle,
  setDiagramTitle,
  getDiagramTitle,
  getAccDescription,
  setAccDescription
};
const populate = (ast) => {
  populateCommonDb(ast, db);
  const { axes, curves, options } = ast;
  db.setAxes(axes);
  db.setCurves(curves);
  db.setOptions(options);
};
const parser = {
  parse: async (input) => {
    const ast = await parse("radar", input);
    log.debug(ast);
    populate(ast);
  }
};
const draw = (_text, id, _version, diagram2) => {
  var _a;
  const db2 = diagram2.db;
  const axes = db2.getAxes();
  const curves = db2.getCurves();
  const options = db2.getOptions();
  const config2 = db2.getConfig();
  const title = db2.getDiagramTitle();
  const svg = selectSvgElement(id);
  const g = drawFrame(svg, config2);
  const maxValue = (_a = options.max) !== null && _a !== void 0 ? _a : Math.max(...curves.map((curve) => Math.max(...curve.entries)));
  const minValue = options.min;
  const radius = Math.min(config2.width, config2.height) / 2;
  drawGraticule(g, axes, radius, options.ticks, options.graticule);
  drawAxes(g, axes, radius, config2);
  drawCurves(g, axes, curves, minValue, maxValue, options.graticule, config2);
  drawLegend(g, curves, options.showLegend, config2);
  g.append("text").attr("class", "radarTitle").text(title).attr("x", 0).attr("y", -config2.height / 2 - config2.marginTop);
};
const drawFrame = (svg, config2) => {
  const totalWidth = config2.width + config2.marginLeft + config2.marginRight;
  const totalHeight = config2.height + config2.marginTop + config2.marginBottom;
  const center = {
    x: config2.marginLeft + config2.width / 2,
    y: config2.marginTop + config2.height / 2
  };
  svg.attr("viewbox", `0 0 ${totalWidth} ${totalHeight}`).attr("width", totalWidth).attr("height", totalHeight);
  return svg.append("g").attr("transform", `translate(${center.x}, ${center.y})`);
};
const drawGraticule = (g, axes, radius, ticks, graticule) => {
  if (graticule === "circle") {
    for (let i = 0; i < ticks; i++) {
      const r = radius * (i + 1) / ticks;
      g.append("circle").attr("r", r).attr("class", "radarGraticule");
    }
  } else if (graticule === "polygon") {
    const numAxes = axes.length;
    for (let i = 0; i < ticks; i++) {
      const r = radius * (i + 1) / ticks;
      const points = axes.map((_, j) => {
        const angle = 2 * j * Math.PI / numAxes - Math.PI / 2;
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);
        return `${x},${y}`;
      }).join(" ");
      g.append("polygon").attr("points", points).attr("class", "radarGraticule");
    }
  }
};
const drawAxes = (g, axes, radius, config2) => {
  const numAxes = axes.length;
  for (let i = 0; i < numAxes; i++) {
    const label = axes[i].label;
    const angle = 2 * i * Math.PI / numAxes - Math.PI / 2;
    g.append("line").attr("x1", 0).attr("y1", 0).attr("x2", radius * config2.axisScaleFactor * Math.cos(angle)).attr("y2", radius * config2.axisScaleFactor * Math.sin(angle)).attr("class", "radarAxisLine");
    g.append("text").text(label).attr("x", radius * config2.axisLabelFactor * Math.cos(angle)).attr("y", radius * config2.axisLabelFactor * Math.sin(angle)).attr("class", "radarAxisLabel");
  }
};
function drawCurves(g, axes, curves, minValue, maxValue, graticule, config2) {
  const numAxes = axes.length;
  const radius = Math.min(config2.width, config2.height) / 2;
  curves.forEach((curve, index) => {
    if (curve.entries.length !== numAxes) {
      return;
    }
    const points = curve.entries.map((entry, i) => {
      const angle = 2 * Math.PI * i / numAxes - Math.PI / 2;
      const r = relativeRadius(entry, minValue, maxValue, radius);
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);
      return { x, y };
    });
    if (graticule === "circle") {
      g.append("path").attr("d", closedRoundCurve(points, config2.curveTension)).attr("class", `radarCurve-${index}`);
    } else if (graticule === "polygon") {
      g.append("polygon").attr("points", points.map((p) => `${p.x},${p.y}`).join(" ")).attr("class", `radarCurve-${index}`);
    }
  });
}
function relativeRadius(value, minValue, maxValue, radius) {
  const clippedValue = Math.min(Math.max(value, minValue), maxValue);
  return radius * (clippedValue - minValue) / (maxValue - minValue);
}
function closedRoundCurve(points, tension) {
  const numPoints = points.length;
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < numPoints; i++) {
    const p0 = points[(i - 1 + numPoints) % numPoints];
    const p1 = points[i];
    const p2 = points[(i + 1) % numPoints];
    const p3 = points[(i + 2) % numPoints];
    const cp1 = {
      x: p1.x + (p2.x - p0.x) * tension,
      y: p1.y + (p2.y - p0.y) * tension
    };
    const cp2 = {
      x: p2.x - (p3.x - p1.x) * tension,
      y: p2.y - (p3.y - p1.y) * tension
    };
    d += ` C${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${p2.x},${p2.y}`;
  }
  return `${d} Z`;
}
function drawLegend(g, curves, showLegend, config2) {
  if (!showLegend) {
    return;
  }
  const legendX = (config2.width / 2 + config2.marginRight) * 3 / 4;
  const legendY = -(config2.height / 2 + config2.marginTop) * 3 / 4;
  const lineHeight = 20;
  curves.forEach((curve, index) => {
    const itemGroup = g.append("g").attr("transform", `translate(${legendX}, ${legendY + index * lineHeight})`);
    itemGroup.append("rect").attr("width", 12).attr("height", 12).attr("class", `radarLegendBox-${index}`);
    itemGroup.append("text").attr("x", 16).attr("y", 0).attr("class", "radarLegendText").text(curve.label);
  });
}
const renderer = { draw };
const genIndexStyles = (themeVariables, radarOptions) => {
  let sections = "";
  for (let i = 0; i < themeVariables.THEME_COLOR_LIMIT; i++) {
    const indexColor = themeVariables[`cScale${i}`];
    sections += `
		.radarCurve-${i} {
			color: ${indexColor};
			fill: ${indexColor};
			fill-opacity: ${radarOptions.curveOpacity};
			stroke: ${indexColor};
			stroke-width: ${radarOptions.curveStrokeWidth};
		}
		.radarLegendBox-${i} {
			fill: ${indexColor};
			fill-opacity: ${radarOptions.curveOpacity};
			stroke: ${indexColor};
		}
		`;
  }
  return sections;
};
const buildRadarStyleOptions = (radar) => {
  const defaultThemeVariables = getThemeVariables();
  const currentConfig = getConfig$1();
  const themeVariables = cleanAndMerge(defaultThemeVariables, currentConfig.themeVariables);
  const radarOptions = cleanAndMerge(themeVariables.radar, radar);
  return { themeVariables, radarOptions };
};
const styles = ({ radar } = {}) => {
  const { themeVariables, radarOptions } = buildRadarStyleOptions(radar);
  return `
	.radarTitle {
		font-size: ${themeVariables.fontSize};
		color: ${themeVariables.titleColor};
		dominant-baseline: hanging;
		text-anchor: middle;
	}
	.radarAxisLine {
		stroke: ${radarOptions.axisColor};
		stroke-width: ${radarOptions.axisStrokeWidth};
	}
	.radarAxisLabel {
		dominant-baseline: middle;
		text-anchor: middle;
		font-size: ${radarOptions.axisLabelFontSize}px;
		color: ${radarOptions.axisColor};
	}
	.radarGraticule {
		fill: ${radarOptions.graticuleColor};
		fill-opacity: ${radarOptions.graticuleOpacity};
		stroke: ${radarOptions.graticuleColor};
		stroke-width: ${radarOptions.graticuleStrokeWidth};
	}
	.radarLegendText {
		text-anchor: start;
		font-size: ${radarOptions.legendFontSize}px;
		dominant-baseline: hanging;
	}
	${genIndexStyles(themeVariables, radarOptions)}
	`;
};
const diagram = {
  parser,
  db,
  renderer,
  styles
};
export {
  diagram
};
