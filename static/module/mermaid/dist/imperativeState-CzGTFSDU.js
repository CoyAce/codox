class ImperativeState {
  /**
   * @param init - Function that creates the default state.
   */
  constructor(init) {
    this.init = init;
    this.records = this.init();
  }
  reset() {
    this.records = this.init();
  }
}
export {
  ImperativeState as I
};
