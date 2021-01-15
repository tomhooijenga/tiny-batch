"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tinybatch = void 0;
const schedulers_1 = require("./schedulers");
__exportStar(require("./schedulers"), exports);
__exportStar(require("./types"), exports);
function tinybatch(callback, scheduler = schedulers_1.microtaskScheduler()) {
    const queue = [];
    const fn = (...args) => {
        return new Promise((resolve => {
            queue.push({ args, resolve });
            scheduler(queue, fn.flush);
        }));
    };
    fn.queue = queue;
    fn.flush = () => {
        if (queue.length === 0) {
            return;
        }
        const oldQueue = [...queue];
        const args = queue.map(({ args }) => args);
        queue.length = 0;
        callback(args).then((results) => {
            results.forEach((result, index) => {
                oldQueue[index].resolve(result);
            });
        });
    };
    return fn;
}
exports.tinybatch = tinybatch;
exports.default = tinybatch;
