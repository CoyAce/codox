function populateCommonDb(ast, db) {
  var _a, _b, _c;
  if (ast.accDescr) {
    (_a = db.setAccDescription) === null || _a === void 0 ? void 0 : _a.call(db, ast.accDescr);
  }
  if (ast.accTitle) {
    (_b = db.setAccTitle) === null || _b === void 0 ? void 0 : _b.call(db, ast.accTitle);
  }
  if (ast.title) {
    (_c = db.setDiagramTitle) === null || _c === void 0 ? void 0 : _c.call(db, ast.title);
  }
}
export {
  populateCommonDb as p
};
