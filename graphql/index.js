var {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLInputObjectType
} = require('graphql');

const User = require('../models/user');

const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    friends: {
      type: new GraphQLList(userType),
      resolve: (user) => {
        return user.friends.map((id, i) => {
          return User.findById(id).exec().then(user => user)
        })
      }
    }
  })
})

const userInputType = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: {
    name: {type: GraphQLString},
    email: {type: GraphQLString}
  }
});

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
          return User.findById(id).exec().then(user => user);
        }
      },
      users: {
        type: new GraphQLList(userType),
        args: {
          count: {
            type: GraphQLInt
          }
        },
        resolve: (_, {count}) => {
          return User.find({}).limit(count).exec().then(users => users);
        }
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'MyMutation',
    fields: {
      addUser: {
        type: GraphQLBoolean,
        args: {
          data: {
            type: new GraphQLNonNull(userInputType)
          }
        },
        resolve: (_, {data}) => {
          const user = new User(data);
          user.save()
          return true
        }
      },
      updateUser: {
        type: GraphQLBoolean,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLID)
          },
          data: {
            type: new GraphQLNonNull(userInputType)
          }
        },
        resolve: (_, {id, data}) => {
          return User.findById(id).exec().then(user => {
            user.name = data.name
            user.email = data.email
            user.save()
            return true
          })
        }
      },
      deleteUser: {
        type: userType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLID)
          }
        },
        resolve: (_, {id}) => {
          return User.findByIdAndRemove(id).exec().then(user => user);
        }
      }
    }
  })
});
