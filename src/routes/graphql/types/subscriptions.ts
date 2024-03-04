import type { User, SubscribersOnAuthors } from '@prisma/client';

export interface Author extends User {
  userSubscribedTo: SubscribersOnAuthors[];
}

export interface Subscription extends User {
  subscribedToUser: SubscribersOnAuthors[];
}
