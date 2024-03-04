import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, gqlSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { loaders } from './loaders.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const errDepthLimit = validate(gqlSchema, parse(req.body.query), [depthLimit(5)]);

      if (errDepthLimit.length) {
        return { data: null, errors: errDepthLimit };
      }

      return await graphql({
        schema: gqlSchema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: {
          prisma: fastify.prisma,
          loaders: loaders(fastify.prisma),
        },
      });
    },
  });
};

export default plugin;
