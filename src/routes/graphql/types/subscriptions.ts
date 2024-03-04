import type { User, SubscribersOnAuthors } from '@prisma/client';

export type Author = {
  userSubscribedTo: SubscribersOnAuthors[];
} & User;

export type Subscription = {
  subscribedToUser: SubscribersOnAuthors[];
} & User;
