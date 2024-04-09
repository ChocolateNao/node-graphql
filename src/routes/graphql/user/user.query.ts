import { User } from '@prisma/client';
import { GraphQLFieldConfig, GraphQLNonNull, GraphQLList, GraphQLType } from 'graphql';
import { simplify, parseResolveInfo, ResolveTree } from 'graphql-parse-resolve-info';
import { UUIDType } from '../types/uuid.js';
import { UserObjectType } from './user.type.js';
import type { IGraphQLContext } from '../types/context.js';

export const getUserQuery: GraphQLFieldConfig<null, IGraphQLContext, Pick<User, 'id'>> = {
  type: UserObjectType,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: (_source, { id }, { prisma }) => prisma.user.findUnique({ where: { id } }),
};

export const getUsersQuery: GraphQLFieldConfig<null, IGraphQLContext> = {
  type: new GraphQLList(new GraphQLNonNull(UserObjectType)),
  resolve: async (_source, _args, { prisma, loaders }, info) => {
    const { fields } = simplify(
      parseResolveInfo(info) as ResolveTree,
      UserObjectType as GraphQLType,
    );
    const withSubscription = 'subscribedToUser' in fields;
    const withAuthors = 'userSubscribedTo' in fields;
    const users = await prisma.user.findMany({
      include: {
        subscribedToUser: withSubscription,
        userSubscribedTo: withAuthors,
      },
    });

    if (withSubscription || withAuthors) {
      const usersMap = Object.fromEntries(users.map((user) => [user.id, user]));
      users.forEach((user) => {
        if (withSubscription) {
          loaders.subscribedToUserLoader.prime(
            user.id,
            user.subscribedToUser.map((author) => usersMap[author.subscriberId]),
          );
        }
        if (withAuthors) {
          loaders.userSubscribedToLoader.prime(
            user.id,
            user.userSubscribedTo.map((author) => usersMap[author.authorId]),
          );
        }
      });
    }

    return users;
  },
};
