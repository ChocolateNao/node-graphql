import {
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql';
import type { MemberType as Member } from '@prisma/client';
import type { IGraphQLContext } from '../types/context.js';

export enum MemberType {
  BASIC = 'basic',
  BUSINESS = 'business',
}

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    [MemberType.BASIC]: { value: MemberType.BASIC },
    [MemberType.BUSINESS]: { value: MemberType.BUSINESS },
  },
});

export const MemberObjectType = new GraphQLObjectType<Member, IGraphQLContext>({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeId) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});
