import { rawQuery } from '@@/server/utils/db';
import { Todo } from '@@/types';

export default defineEventHandler(async (event): Promise<Todo[]> => {
  const { schema, workspaceId } = getQuery(event);
  if (!schema || !workspaceId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'schema and workspaceId are required',
    });
  }
  const rows = await rawQuery(`
    SELECT * FROM ${schema}.todo
    WHERE parent_workspace_id = $1 and parent_todo_id is null
    ORDER BY order_index
  `, [workspaceId]);
  return rows.map((e: any) => ({
    id: e.id,
    description: e.description,
    ord: e.order_index,
  }));
});
