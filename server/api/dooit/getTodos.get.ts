import { rawQuery } from '@@/server/utils/db';
import { Todo } from '@@/types';
import { z } from 'zod';

const querySchema = z.object({
  schema: z.string(),
  workspaceId: z.string(),
});

export default defineEventHandler(async (event): Promise<Todo[]> => {
  const { schema, workspaceId } = querySchema.parse(getQuery(event));
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
