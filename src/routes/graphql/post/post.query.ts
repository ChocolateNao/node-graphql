import { Post } from '@prisma/client';
import type { IGraphQLContext } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import { PostObjectType } from './post.type.js';
import { GraphQLFieldConfig, GraphQLNonNull, GraphQLList } from 'graphql';

export const getPostQuery: GraphQLFieldConfig<null, IGraphQLContext, Pick<Post, 'id'>> = {
  type: PostObjectType,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: (_, { id }, { prisma }) => prisma.post.findUnique({ where: { id } }),
};

export const getPostsQuery: GraphQLFieldConfig<null, IGraphQLContext> = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostObjectType))),
  resolve: (_, _args, { prisma }) => prisma.post.findMany(),
};
