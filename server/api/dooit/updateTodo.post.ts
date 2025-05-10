import { rawQuery } from '@@/server/utils/db';
import { Todo } from '@@/types';
import { z } from 'zod';

const bodySchema = z.object({
  schema: z.string(),
  todoId: z.number(),
  description: z.string(),
});

export default defineEventHandler(async (event): Promise<Todo> => {
  const body = await readBody(event);
  const { schema, todoId, description } = bodySchema.parse(body);

  const result = await rawQuery(
    `UPDATE ${schema}.todo
     SET description = $1
     WHERE id = $2
     RETURNING id, description, order_index as ord`,
    [description, todoId]
  );

  if (result.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Todo not found',
    });
  }

  return result[0];
});