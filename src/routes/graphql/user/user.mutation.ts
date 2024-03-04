import { User } from '@prisma/client';
import { GraphQLFieldConfig, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import type { IGraphQLContext } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import { UserObjectType, CreateUserInputType, ChangeUserInputType } from './user.type.js';
import type { IChangeUser, ICreateUser } from '../types/mutation.js';

export const createUserMutation: GraphQLFieldConfig<null, IGraphQLContext, ICreateUser> =
  {
    type: new GraphQLNonNull(UserObjectType),
    args: { dto: { type: new GraphQLNonNull(CreateUserInputType) } },
    resolve: (_, { dto }, { prisma }) => prisma.user.create({ data: dto }),
  };

export const changeUserMutation: GraphQLFieldConfig<null, IGraphQLContext, IChangeUser> =
  {
    type: new GraphQLNonNull(UserObjectType),
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: new GraphQLNonNull(ChangeUserInputType) },
    },
    resolve: (_, { id, dto }, { prisma }) =>
      prisma.user.update({ where: { id }, data: dto }),
  };

export const deleteUserMutation: GraphQLFieldConfig<
  null,
  IGraphQLContext,
  Pick<User, 'id'>
> = {
  type: new GraphQLNonNull(GraphQLBoolean),
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_, { id }, { prisma }) => {
    const deletedUser = await prisma.user.delete({ where: { id } });
    return Boolean(deletedUser);
  },
};

export const subscribeToMutation: GraphQLFieldConfig<
  null,
  IGraphQLContext,
  { userId: User['id']; authorId: User['id'] }
> = {
  type: new GraphQLNonNull(UserObjectType),
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: (_, { userId, authorId }, { prisma }) =>
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        userSubscribedTo: {
          create: {
            authorId,
          },
        },
      },
    }),
};

export const unsubscribeFromMutation: GraphQLFieldConfig<
  null,
  IGraphQLContext,
  { userId: User['id']; authorId: User['id'] }
> = {
  type: new GraphQLNonNull(GraphQLBoolean),
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, { userId, authorId }, { prisma }) => {
    const result = await prisma.subscribersOnAuthors.delete({
      where: {
        subscriberId_authorId: {
          subscriberId: userId,
          authorId: authorId,
        },
      },
    });
    return Boolean(result);
  },
};
