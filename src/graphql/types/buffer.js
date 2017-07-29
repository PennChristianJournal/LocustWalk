import { GraphQLScalarType } from 'graphql';
import { GraphQLError } from 'graphql/error';
import { Kind } from 'graphql/language';

function serializeBuffer(value) {
  if (!(value instanceof Buffer)) {
    throw new TypeError('Field error: value is not an instance of Buffer');
  }

  return value.toString();
}

function parseBuffer(value) {
  const regex = /^data:(.+\/.+);(.+),/;
  var matches = value.match(regex);
  var result = new Buffer(value.substr(matches[0].length), matches[2]);
  result.mimeType = matches[1];
  return result;
}

export default new GraphQLScalarType({
  name: 'Buffer',
  serialize: serializeBuffer,
  parseValue: parseBuffer,
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(`Query error: Can only parse strings to buffers but got a: ${ast.kind}`, [ast]);
    }

    const result = parseBuffer(ast.value);

    if (ast.value !== result.toString()) {
      throw new GraphQLError('Query error: Invalid buffer encoding', [ast]);
    }

    return result;
  },
});
