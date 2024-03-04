import { Post } from '@prisma/client';
import type { IGraphQLContext } from '../types/context.js';
import { GraphQLFieldConfig, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import {
  ChangePostInputObjectType,
  CreatePostInputObjectType,
  PostObjectType,
} from './post.type.js';
import type { IChangePost, ICreatePost } from '../types/mutation.js';

export const createPostMutation: GraphQLFieldConfig<null, IGraphQLContext, ICreatePost> =
  {
    type: new GraphQLNonNull(PostObjectType),
    args: { dto: { type: new GraphQLNonNull(CreatePostInputObjectType) } },
    resolve: async (_, { dto }, { prisma }) => await prisma.post.create({ data: dto }),
  };

export const changePostMutation: GraphQLFieldConfig<null, IGraphQLContext, IChangePost> =
  {
    type: new GraphQLNonNull(PostObjectType),
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: new GraphQLNonNull(ChangePostInputObjectType) },
    },
    resolve: async (_, { id, dto }, { prisma }) =>
      await prisma.post.update({ where: { id }, data: dto }),
  };

export const deletePostMutation: GraphQLFieldConfig<
  null,
  IGraphQLContext,
  Pick<Post, 'id'>
> = {
  type: new GraphQLNonNull(GraphQLBoolean),
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_, { id }, { prisma }) => {
    const deletedPost = await prisma.post.delete({ where: { id } });
    return Boolean(deletedPost);
  },
};
