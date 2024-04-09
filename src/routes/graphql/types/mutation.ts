import { Post, User, Profile } from '@prisma/client';
import { GraphQLObjectType } from 'graphql';
import type { IGraphQLContext } from './context.js';
import {
  createPostMutation,
  changePostMutation,
  deletePostMutation,
} from '../post/post.mutation.js';
import {
  createProfileMutation,
  changeProfileMutation,
  deleteProfileMutation,
} from '../profile/profile.mutation.js';
import {
  createUserMutation,
  changeUserMutation,
  deleteUserMutation,
  subscribeToMutation,
  unsubscribeFromMutation,
} from '../user/user.mutation.js';

export interface ICreatePost {
  dto: Omit<Post, 'id'>;
}

export interface IChangePost {
  id: Post['id'];
  dto: Partial<Omit<Post, 'id'>>;
}

export interface ICreateProfile {
  dto: Omit<Profile, 'id'>;
}

export interface IChangeProfile {
  id: Profile['id'];
  dto: Partial<Omit<Profile, 'id'>>;
}

export interface IUserSubscribedTo {
  userId: string;
  authorId: string;
}

export interface ICreateUser {
  dto: Omit<User, 'id'>;
}

export interface IChangeUser extends ICreateUser {
  id: User['id'];
}

export const MutationType = new GraphQLObjectType<null, IGraphQLContext>({
  name: 'Mutation',
  fields: () => ({
    createPost: createPostMutation,
    changePost: changePostMutation,
    deletePost: deletePostMutation,
    createUser: createUserMutation,
    changeUser: changeUserMutation,
    deleteUser: deleteUserMutation,
    subscribeTo: subscribeToMutation,
    unsubscribeFrom: unsubscribeFromMutation,
    createProfile: createProfileMutation,
    changeProfile: changeProfileMutation,
    deleteProfile: deleteProfileMutation,
  }),
});
