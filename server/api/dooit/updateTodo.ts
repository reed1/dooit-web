import { rawQuery } from '@@/server/utils/db';
import { Todo } from '@@/types';

export default defineEventHandler(async (event): Promise<Todo> => {
  const body = await readBody(event);
  const { schema, todoId, description } = body;

  if (!schema || !todoId || !description) {
    throw createError({
      statusCode: 400,
      statusMessage: 'schema, todoId, and description are required',
    });
  }

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