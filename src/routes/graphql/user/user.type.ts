import { UUIDType } from '../types/uuid.js';
import { User } from '@prisma/client';
import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/index.js';
import { ProfileObjectType } from '../profile/profile.type.js';
import { PostObjectType } from '../post/post.type.js';
import type { IGraphQLContext } from '../types/context.js';

export const UserObjectType: GraphQLObjectType = new GraphQLObjectType<
  User,
  IGraphQLContext
>({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    posts: {
      type: new GraphQLList(PostObjectType),
      resolve: async (user, _, { loaders }) => loaders.postsLoader.load(user.id),
    },
    profile: {
      type: ProfileObjectType,
      resolve: async (user, _, { loaders }) => loaders.profileLoader.load(user.id),
    },
    userSubscribedTo: {
      type: new GraphQLList(UserObjectType),
      resolve: async (user, _, { loaders }) =>
        loaders.userSubscribedToLoader.load(user.id),
    },
    subscribedToUser: {
      type: new GraphQLList(UserObjectType),
      resolve: async (user, _, { loaders }) =>
        loaders.subscribedToUserLoader.load(user.id),
    },
  }),
});

export const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});
