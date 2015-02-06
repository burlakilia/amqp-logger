var gateway = require('owg'),
    os = require('os'),
    util = require('util');

var levels = ['log', 'trace', 'debug', 'info', 'warn', 'error'];

function transform(msg) {
    return typeof msg === 'object' ? JSON.stringify(msg) : msg;
}

function compare(current, minimal) {
    return levels.indexOf(current) >= levels.indexOf(minimal);
}

exports.init = function (tracer, config) {
    var publish = gateway(config, tracer).publish,
        cache = [],
        timeout;

    function create(logger) {
        var cfg = config,
            fns = {};

        function wrap(level) {

            function compose (msg) {
                var message = util.format.apply(null, typeof msg === 'object' && msg.length ? msg.map(transform) : [transform(msg)]);

                return {
                    timestamp: new Date().toISOString(),
                    logger: logger,
                    level: level.charAt(0).toUpperCase() + level.substr(1),
                    environment: cfg.environment,
                    machine: os.hostname(),
                    app: cfg.name,
                    message: message
                };

            }

            function send() {
                cache.forEach(publish);
                tracer.trace('Messages were sent to kibana', cache);
                cache = [];
                timeout = null;
            }

            fns[level] = function () {
                var args = Array.prototype.slice.call(arguments);

                tracer[level].apply(tracer, args);
                compare(level, cfg.level) && cache.push(compose(args));

                timeout || (timeout = setTimeout(send, cfg.delay));
            };

        }

        levels.forEach(wrap);
        return fns;
    }

    return {create: create};
};
