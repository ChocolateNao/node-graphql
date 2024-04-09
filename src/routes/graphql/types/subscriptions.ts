import type { User, SubscribersOnAuthors } from '@prisma/client';

export interface IAuthor extends User {
  userSubscribedTo: SubscribersOnAuthors[];
}

export interface ISubscription extends User {
  subscribedToUser: SubscribersOnAuthors[];
}
