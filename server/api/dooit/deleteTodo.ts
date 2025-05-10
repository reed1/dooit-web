import { rawQuery } from '@@/server/utils/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { schema, todoId } = body;

  if (!schema || !todoId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'schema and todoId are required',
    });
  }

  await rawQuery(
    `DELETE FROM ${schema}.todo WHERE id = $1`,
    [todoId]
  );

  return { success: true };
});