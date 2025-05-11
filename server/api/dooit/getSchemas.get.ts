import { rawQuery } from '@@/server/utils/db';
import { DooitSchema } from '@@/types';

const PRIORITY_SCHEMAS = ['t__dotfiles'];

function getSchemaLabel(schema: string) {
  return schema.replace('t_', '');
}

export default defineEventHandler(async (event): Promise<DooitSchema[]> => {
  // const session = await getUserSession(event);
  const { user } = await requireUserSession(event);
  console.log('user', user);

  // console.log('s2ession', session);
  const rows = await rawQuery(`
    SELECT * FROM information_schema.schemata
    where schema_name like 't_%'
    order by
      case
        when schema_name in (${PRIORITY_SCHEMAS.map((s, idx) => '$' + (idx + 1)).join(',')}) then 0
        else 1
      end,
      schema_name
    `, [...PRIORITY_SCHEMAS]);
  return rows.map((e: any) => ({
    name: e.schema_name,
    label: getSchemaLabel(e.schema_name),
  }));
});
