import type { PrismaClient } from '@prisma/client';
import type { TLoaders } from './loaders.js';
import type { FastifyInstance } from 'fastify';

export interface IGraphQLContext {
  fastify: FastifyInstance;
  prisma: PrismaClient;
  loaders: TLoaders;
}
