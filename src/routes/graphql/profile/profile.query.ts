import { Profile } from '@prisma/client';
import { GraphQLFieldConfig, GraphQLNonNull, GraphQLList } from 'graphql';
import type { IGraphQLContext } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import { ProfileObjectType } from './profile.type.js';

export const getProfileQuery: GraphQLFieldConfig<
  null,
  IGraphQLContext,
  Pick<Profile, 'id'>
> = {
  type: ProfileObjectType,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: (_, { id }, { prisma }) => prisma.profile.findUnique({ where: { id } }),
};

export const getProfilesQuery: GraphQLFieldConfig<null, IGraphQLContext> = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileObjectType))),
  resolve: (_source, _, { prisma }) => prisma.profile.findMany(),
};
