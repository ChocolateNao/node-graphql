import {
  GraphQLInputObjectType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLNonNull,
} from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { MemberObjectType, MemberTypeId } from '../member/member.type.js';
import { Profile } from '@prisma/client';
import type { IGraphQLContext } from '../types/context.js';
import { UserObjectType } from '../user/user.type.js';

export const ProfileObjectType = new GraphQLObjectType<Profile, IGraphQLContext>({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
    memberType: {
      type: new GraphQLNonNull(MemberObjectType),
      resolve: async (profile, _, { loaders }) =>
        loaders.memeberTypeLoader.load(profile.memberTypeId),
    },
    user: {
      type: new GraphQLNonNull(UserObjectType),
      resolve: (profile, _, { loaders }) => loaders.userLoader.load(profile.userId),
    },
  }),
});

export const CreateProfileInputObjectType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

export const ChangeProfileInputObjectType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    memberTypeId: { type: MemberTypeId },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
  }),
});
