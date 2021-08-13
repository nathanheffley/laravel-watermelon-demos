import * as React from 'react';
import {Button, FlatList, StyleSheet} from "react-native";
import {useCallback, useEffect, useState} from "react";
import * as SecureStore from "expo-secure-store";
import {database, sync} from "./watermelon";
import Task from "./Task";

export default function Tasks({navigation, route}) {
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const logout = useCallback(() => {
    SecureStore.deleteItemAsync('token')
      .then(() => {
        database.write(async () => {
          database.unsafeResetDatabase();
        }).then(() => {
          navigation.navigate('Login');
        });
      });
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await sync(route.params.token);
    const allTasks = await database.get('tasks').query().fetch();
    setTasks(allTasks);
    setRefreshing(false);
  }, [setTasks]);

  useEffect(() => {
    database.get('tasks')
      .query()
      .fetch()
      .then(allTasks => {
        setTasks(allTasks);
      })
  }, [setTasks]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <>
      <FlatList
        data={tasks}
        renderItem={({item}) => <Task key={item.id} task={item}/>}
        onRefresh={refresh}
        refreshing={refreshing}
        style={styles.list}
      />

      <Button title="Log out" onPress={logout}/>
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
});
