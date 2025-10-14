export function initEngine(importObject,test) {
    if (importObject.Engine == null) {
        importObject.Engine = {};
    }
    importObject.Engine.test = test
}