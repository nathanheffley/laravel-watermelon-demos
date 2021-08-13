import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import {synchronize} from "@nozbe/watermelondb/sync";

import schema from './model/schema';
import migrations from './model/migrations';
import Task from "./model/Task";

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  onSetUpError: error => {
     // Database failed to load -- offer the user to reload the app or log out.
  },
});

const database = new Database({
  adapter,
  modelClasses: [
    Task,
  ],
});

async function sync(token) {
  await synchronize({
    database,
    pullChanges: async ({lastPulledAt}) => {
      const urlParams = `last_pulled_at=${lastPulledAt}`;
      const response = await fetch(`https://0cd7b3df1b3b.ngrok.io/sync?${urlParams}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error(await response.text());
      }

      const {changes, timestamp} = await response.json();
      return {changes, timestamp};
    },
    pushChanges: async ({changes}) => {
      const response = await fetch(`https://0cd7b3df1b3b.ngrok.io/sync`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(changes),
      })
      if (!response.ok) {
        throw new Error(await response.text());
      }
    },
  });
}

export {
  database,
  sync,
}
