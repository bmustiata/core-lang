/**
 * <p>A OnceMany will return the first element once when its next() method
 * will be called, and from that moment on always return the other value.</p>
 */
var OnceMany = (function () {
    function OnceMany(first, allNext) {
        this.first = first;
        this.allNext = allNext;
        this.firstPassed = false;
    }
    OnceMany.prototype.hasNext = function () {
        return true;
    };
    OnceMany.prototype.next = function () {
        if (this.firstPassed) {
            return this.allNext;
        }
        this.firstPassed = true;
        return this.first;
    };
    return OnceMany;
})();
exports.OnceMany = OnceMany;
//# sourceMappingURL=OnceMany.js.map