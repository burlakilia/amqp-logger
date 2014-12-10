# AMQP Logger

The wrap stadart tracer in your application, and publising your logs via amqp protocol, for example to kibana

```
var logger = require('./utils/logger').init(console, {{
	'name': 'My application',
	'environment': 'Dev',
	'protocol': 'amqp',
	'level': 'trace',
	'connection': 'amqp://localhost/rabbitmq',
	'exchange': 'exchange-name',
	'routingKey': 'yourRoutingKey',
	'durable': true,
	"delay": 30000
});


logger.trace('Hello world', {a: '1'});
//-> Hello world {a: 'a'}
```

# Install
```
npm install amqp-logger
```
