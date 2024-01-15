function AutoUnsub() {
  return function (constructor: any) {
    const orig = constructor.prototype.ngOnDestroy;
    constructor.prototype.ngOnDestroy = function () {
      for (const prop in this) {
        const property = this[prop];
        if (typeof property.subscribe === "function") {
          property.unsubscribe();
        }
      }
      orig.apply();
    };
  };
}

export default AutoUnsub;
