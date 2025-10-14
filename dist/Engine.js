export function initEngine(importObject,loadModel) {
    if (importObject.Engine == null) {
        importObject.Engine = {};
    }
    importObject.Engine.loadModel = loadModel
}