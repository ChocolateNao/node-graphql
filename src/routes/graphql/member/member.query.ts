import { GraphQLFieldConfig, GraphQLNonNull, GraphQLList } from 'graphql';
import { MemberType as Member } from '@prisma/client';
import type { IGraphQLContext } from '../types/context.js';
import { MemberObjectType, MemberTypeId } from './member.type.js';

export const getMemberTypeQuery: GraphQLFieldConfig<
  null,
  IGraphQLContext,
  Pick<Member, 'id'>
> = {
  type: new GraphQLNonNull(MemberObjectType),
  args: { id: { type: new GraphQLNonNull(MemberTypeId) } },
  resolve: (_source, { id }, { prisma }) =>
    prisma.memberType.findUnique({ where: { id } }),
};

export const getMemberTypesQuery: GraphQLFieldConfig<null, IGraphQLContext> = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberObjectType))),
  resolve: (_source, _, { prisma }) => prisma.memberType.findMany(),
};
