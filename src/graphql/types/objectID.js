'use strict';

import { GraphQLScalarType } from 'graphql/type';

import mongoose from 'mongoose';

function mongooseObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value) ? mongoose.Types.ObjectId(value) : null;
}

export default new GraphQLScalarType({
  name: 'ObjectID',
  serialize: mongooseObjectId,
  parseValue: mongooseObjectId,
  parseLiteral(ast) {
    return mongooseObjectId(ast.value);
  },
});
