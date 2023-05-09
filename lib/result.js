"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Failure = exports.Success = void 0;
function Success(value, remaining) {
    return {
        type: "success",
        value,
        remaining,
        cata(pattern) {
            return pattern.Success(value, remaining);
        },
        orElse() {
            return Success(value, remaining);
        }
    };
}
exports.Success = Success;
;
function Failure(value) {
    return {
        type: "failure",
        value,
        cata(pattern) {
            return pattern.Failure(value);
        },
        orElse(f) {
            return f(value);
        }
    };
}
exports.Failure = Failure;
;
//# sourceMappingURL=result.js.map