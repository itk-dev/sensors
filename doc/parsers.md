# Parsers

Parsers are pugins that take care of parsing sensor data into a
machine-readable format (which can also be read by some humans) on
demand.

Whenever raw (or encoded) sensor data needs to be parsed, a message is
sent and parsers can respond to this message with parsed data.

The message format is `parse.«sensor EUI»`,
e.g. `parse.0004A30B001E8EA2`, and parsers must only respond to a
message when the parser can actually parse the raw sensor data that is
sent along with the message.


See
[`parser0004A30B001E8EA2.js`](../plugins/parser0004A30B001E8EA2/parser0004A30B001E8EA2.js)
for an example on how to implement a parser.
## Example

After creating a new parser, it must be added in
[`architect_config.js`](../architect_config.js) and the service must
be restarted to activate the parser.
