var gateway = require('owg');

var levels = ['log', 'trace', 'debug', 'info', 'warn', 'error'];

function compare(current, minimal) {
    return levels.indexOf(current) >= levels.indexOf(minimal);
}

exports.init = function (tracer, config, compose) {
    var publish = gateway(config, tracer).publish,
        cache = [],
        timeout;

    function send () {
        cache.forEach(publish);
        tracer.trace('Messages were sent to kibana', cache);
        cache = [];
        timeout = null;
    }

    function create(logger) {
        var cfg = config,
            fns = {};

        function wrap(level) {

            fns[level] = function() {
                var args = Array.prototype.slice.call(arguments);

                var msg = {
                    level: level,
                    logger: logger,
                    msg: util.format.apply(null, args.map(transform))
                };

                tracer[level].apply(tracer, args);
                compare(level, cfg.level) && cache.push(compose(msg));

                timeout || (timeout = setTimeout(send, cfg.delay));
            };

        }

        levels.forEach(wrap);
        return fns;
    }

    return {create: create};
};
