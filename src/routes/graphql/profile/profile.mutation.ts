import { Profile } from '@prisma/client';
import { GraphQLFieldConfig, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import type { IGraphQLContext } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import {
  ChangeProfileInputObjectType,
  CreateProfileInputObjectType,
  ProfileObjectType,
} from './profile.type.js';
import type { IChangeProfile, ICreateProfile } from '../types/mutation.js';

export const createProfileMutation: GraphQLFieldConfig<
  null,
  IGraphQLContext,
  ICreateProfile
> = {
  type: new GraphQLNonNull(ProfileObjectType),
  args: { dto: { type: new GraphQLNonNull(CreateProfileInputObjectType) } },
  resolve: (_, { dto }, { prisma }) => prisma.profile.create({ data: dto }),
};

export const changeProfileMutation: GraphQLFieldConfig<
  null,
  IGraphQLContext,
  IChangeProfile
> = {
  type: new GraphQLNonNull(ProfileObjectType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeProfileInputObjectType) },
  },
  resolve: (_, { id, dto }, { prisma }) =>
    prisma.profile.update({ where: { id }, data: dto }),
};

export const deleteProfileMutation: GraphQLFieldConfig<
  null,
  IGraphQLContext,
  Pick<Profile, 'id'>
> = {
  type: new GraphQLNonNull(GraphQLBoolean),
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_, { id }, { prisma }) => {
    const deletedProfile = await prisma.profile.delete({ where: { id } });
    return Boolean(deletedProfile);
  },
};
