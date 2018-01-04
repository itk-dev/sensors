const EventEmitter = require('events').EventEmitter;

module.exports = function setup(options, imports, register) {
    let emitter = new EventEmitter();

    /**
     * Register with architect.
     */
    register(null, {
        eventbus: {
            emit: emitter.emit,
            on: emitter.on,
            once: emitter.once,
            removeListener: emitter.removeListener
        }
    });
};
