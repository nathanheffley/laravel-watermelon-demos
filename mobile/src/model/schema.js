import {appSchema, tableSchema} from "@nozbe/watermelondb/Schema";

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'tasks',
      columns: [
        {name: 'name', type: 'string'},
        {name: 'is_completed', type: 'boolean'},
      ],
    }),
  ],
});
