# AMQP Logger

The wrap stadart tracer in your application, and publising your logs via amqp protocol, for example to kibana

```
function compose(data) {
    
     return {
    	timestamp: Date.now(),
        logger: data.logger,
        level: data.level,
        environment: 'Dev',
        app: 'My application',
        text: data.msg
     };

}

var logger = require('./utils/logger').init(console, {{
	'protocol': 'amqp',
	'level': 'trace',
	'connection': 'amqp://localhost/rabbitmq',
	'exchange': 'exchange-name',
	'routingKey': 'yourRoutingKey',
	'durable': true,
	"delay": 30000
}, compose);


logger.trace('Hello world', {a: '1'});
//-> Hello world {a: 'a'}
```

# Install
```
npm install amqp-logger
```
