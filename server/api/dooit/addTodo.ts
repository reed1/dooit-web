import { rawQuery } from '@@/server/utils/db';
import { Todo } from '@@/types';

export default defineEventHandler(async (event): Promise<Todo> => {
  const body = await readBody(event);
  const { schema, workspaceId, description } = body;

  if (!schema || !workspaceId || !description) {
    throw createError({
      statusCode: 400,
      statusMessage: 'schema, workspaceId, and description are required',
    });
  }

  // Get the maximum order_index
  const maxOrderResult = await rawQuery(
    `SELECT COALESCE(MAX(order_index), 0) as max_order FROM ${schema}.todo WHERE parent_workspace_id = $1`,
    [workspaceId]
  );
  const newOrderIndex = maxOrderResult[0].max_order + 1;

  // Insert the new todo
  const result = await rawQuery(
    `INSERT INTO ${schema}.todo (description, order_index, parent_workspace_id, effort, urgency, pending)
     VALUES ($1, $2, $3, 0, 1, true)
     RETURNING id, description, order_index as ord`,
    [description, newOrderIndex, workspaceId]
  );

  return result[0];
});