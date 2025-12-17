// src/eventBus.js
import mitt from 'mitt';

const emitter = mitt();

export const emitBus = (event, data) => {
    emitter.emit(event, data);
};

export const onBus = (event, callback) => {
    emitter.on(event, callback);
};

export const offBus = (event, callback) => {
    emitter.off(event, callback);
};
