import { rawQuery } from '@@/server/utils/db';
import { z } from 'zod';

const querySchema = z.object({
  schema: z.string(),
});

export default defineEventHandler(async (event) => {
  const { schema } = querySchema.parse(getQuery(event));
  if (!schema) {
    throw createError({
      statusCode: 400,
      statusMessage: 'schema is required',
    });
  }
  const rows = await rawQuery(`
    SELECT * FROM ${schema}.workspace
    WHERE parent_workspace_id = 1
    ORDER BY order_index
    `);
  return rows.map((e: any) => ({
    id: e.id,
    description: e.description,
    order_index: e.order_index,
  }));
});
