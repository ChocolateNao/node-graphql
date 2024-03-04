import { Type } from '@fastify/type-provider-typebox';
import { GraphQLSchema } from 'graphql';
import { UserObjectType } from './user/user.type.js';
import { PostObjectType } from './post/post.type.js';
import { MemberObjectType } from './member/member.type.js';
import { ProfileObjectType } from './profile/profile.type.js';
import { MutationType } from './types/mutation.js';
import { QueryType } from './types/query.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const gqlSchema: GraphQLSchema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
  types: [UserObjectType, PostObjectType, MemberObjectType, ProfileObjectType],
});
