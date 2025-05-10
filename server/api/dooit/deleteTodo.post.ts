import { rawQuery } from '@@/server/utils/db';
import { z } from 'zod';

const bodySchema = z.object({
  schema: z.string(),
  todoId: z.number(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { schema, todoId } = bodySchema.parse(body);

  await rawQuery(
    `DELETE FROM ${schema}.todo WHERE id = $1`,
    [todoId]
  );

  return { success: true };
});