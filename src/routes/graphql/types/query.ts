import { GraphQLObjectType } from 'graphql';
import type { IGraphQLContext } from './context.js';
import { getMemberTypesQuery, getMemberTypeQuery } from '../member/member.query.js';
import { getPostsQuery, getPostQuery } from '../post/post.query.js';
import { getProfilesQuery, getProfileQuery } from '../profile/profile.query.js';
import { getUsersQuery, getUserQuery } from '../user/user.query.js';

export const QueryType: GraphQLObjectType = new GraphQLObjectType<null, IGraphQLContext>({
  name: 'Query',
  fields: () => ({
    users: getUsersQuery,
    user: getUserQuery,
    posts: getPostsQuery,
    post: getPostQuery,
    profiles: getProfilesQuery,
    profile: getProfileQuery,
    memberTypes: getMemberTypesQuery,
    memberType: getMemberTypeQuery,
  }),
});
