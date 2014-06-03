var gateway = require('owg');

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

            function compose(msg) {
                var text = typeof msg === 'object' && msg.length ? msg.map(transform).join(', ') : msg;

                return {
                    timestamp: Date.now(),
                    logger: logger,
                    level: level,
                    enviroment: cfg.enviroment,
                    app: cfg.name,
                    text: text
                };

            }

            function send() {
                cache.forEach(publish);
                tracer.trace('messages was sent to kibana', cache);
                cache = [];
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