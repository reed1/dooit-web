import { rawQuery } from '@@/server/utils/db';
import { DooitSchema } from '@@/types';

function getSchemaLabel(schema: string) {
  return schema.replace('t_', '');
}

export default defineEventHandler(async (event): Promise<DooitSchema[]> => {
  const rows = await rawQuery(`
    SELECT * FROM information_schema.schemata
    where schema_name like 't_%'
    `);
  return rows.map((e: any) => ({
    name: e.schema_name,
    label: getSchemaLabel(e.schema_name),
  }));
});
