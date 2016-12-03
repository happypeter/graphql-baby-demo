var {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID
} = require('graphql');

const User = require('../models/user');

const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    _id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    }
  }
})

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'MyQuery', // 必须设置 name
    fields: {
      user: {
        type: userType,
        args: {
          id: {
            type: GraphQLID
          }
        },
        resolve: (_, {id}) => {
          return User.findById(id).exec().then(user => user)
        }
      }
    }
  })
});
