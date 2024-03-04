import type { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import type { MemberType as Member, Post, Profile, User } from '@prisma/client';
import type { Author, Subscription } from './types/subscriptions.js';

export const loaders = (prisma: PrismaClient) => ({
  postsLoader: postsLoader(prisma),
  profileLoader: profileLoader(prisma),
  userLoader: userLoader(prisma),
  userSubscribedToLoader: userToSubscribeLoader(prisma),
  subscribedToUser: subscribedToUserLoader(prisma),
  memeberTypeLoader: memberLoader(prisma),
});

const memberLoader = (prisma: PrismaClient) =>
  new DataLoader<string, Member | null>(async (userIds: ReadonlyArray<Member['id']>) => {
    const members: Member[] = await prisma.memberType.findMany({
      where: { id: { in: [...userIds] } },
    });

    const membersMap = new Map(members.map((member) => [member.id, member]));
    return userIds.map((id) => membersMap.get(id) ?? null);
  });

const postsLoader = (prisma: PrismaClient) =>
  new DataLoader<string, Post[]>(async (userIds: ReadonlyArray<User['id']>) => {
    const posts: Post[] = await prisma.post.findMany({
      where: { authorId: { in: [...userIds] } },
    });

    const postsMap = new Map<string, Post[]>();
    posts.forEach((post) => {
      const postsAuthor = postsMap.get(post.authorId) || [];
      postsAuthor.push(post);
      postsMap.set(post.authorId, postsAuthor);
    });

    return userIds.map((id) => postsMap.get(id) || []);
  });

const profileLoader = (prisma: PrismaClient) =>
  new DataLoader<string, Profile | null>(async (userIds: ReadonlyArray<User['id']>) => {
    const profiles: Profile[] = await prisma.profile.findMany({
      where: { userId: { in: [...userIds] } },
    });

    const profileMap = new Map(profiles.map((profile) => [profile.userId, profile]));
    return userIds.map((id) => profileMap.get(id) || null);
  });

const userLoader = (prisma: PrismaClient) =>
  new DataLoader<string, User | null>(async (userIds: ReadonlyArray<User['id']>) => {
    const users: User[] = await prisma.user.findMany({
      where: { id: { in: [...userIds] } },
    });

    const userMap = new Map(users.map((user) => [user.id, user]));
    return userIds.map((id) => userMap.get(id) || null);
  });

const subscribedToUserLoader = (prisma: PrismaClient) =>
  new DataLoader<string, Author[]>(async (userIds: ReadonlyArray<User['id']>) => {
    const authors: Author[] = await prisma.user.findMany({
      where: { userSubscribedTo: { some: { authorId: { in: [...userIds] } } } },
      include: { userSubscribedTo: true },
    });

    const authorsById = authors.reduce((map, author) => {
      author.userSubscribedTo.forEach((subscription) => {
        const authorsList = map.get(subscription.authorId) || [];
        authorsList.push(author);
        map.set(subscription.authorId, authorsList);
      });
      return map;
    }, new Map<string, Author[]>());

    return userIds.map((id) => authorsById.get(id) || []);
  });

const userToSubscribeLoader = (prisma: PrismaClient) =>
  new DataLoader<string, Subscription[]>(async (userIds: ReadonlyArray<User['id']>) => {
    const subscriptions: Subscription[] = await prisma.user.findMany({
      where: {
        subscribedToUser: { some: { subscriberId: { in: [...userIds] } } },
      },
      include: { subscribedToUser: true },
    });

    const subscriptionsBySubscriberId = subscriptions.reduce((map, user) => {
      user.subscribedToUser.forEach((subscription) => {
        const existingSubscriptions = map.get(subscription.subscriberId) || [];
        existingSubscriptions.push(user);
        map.set(subscription.subscriberId, existingSubscriptions);
      });
      return map;
    }, new Map<string, Subscription[]>());

    return userIds.map((id) => subscriptionsBySubscriberId.get(id) || []);
  });
