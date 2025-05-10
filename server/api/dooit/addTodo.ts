import { rawQuery } from '@@/server/utils/db';
import { Todo } from '@@/types';
import { z } from 'zod';

const bodySchema = z.object({
  schema: z.string(),
  workspaceId: z.string(),
  description: z.string().min(1),
});

export default defineEventHandler(async (event): Promise<Todo> => {
  const body = await readBody(event);
  const { schema, workspaceId, description } = bodySchema.parse(body);
  const maxOrderResult = await rawQuery(
    `SELECT COALESCE(MAX(order_index), 0) as max_order FROM ${schema}.todo WHERE parent_workspace_id = $1`,
    [workspaceId]
  );
  const newOrderIndex = maxOrderResult[0].max_order + 1;
  const result = await rawQuery(
    `INSERT INTO ${schema}.todo (description, order_index, parent_workspace_id, effort, urgency, pending)
     VALUES ($1, $2, $3, 0, 1, true)
     RETURNING id, description, order_index as ord`,
    [description, newOrderIndex, workspaceId]
  );
  return result[0];
});