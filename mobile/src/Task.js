import {Pressable, StyleSheet, Text, View} from "react-native";
import * as React from "react";
import {useCallback} from "react";
import {database} from "./watermelon";
import withObservables from '@nozbe/with-observables';
const enhance = withObservables(['task'], ({task}) => ({
  task,
}));

const BaseTask = ({task}) => {
  const toggle = useCallback(async (isCompleted) => {
    const dbtask = await database.get('tasks').find(task.id);
    if (isCompleted) {
      await dbtask.markAsDone();
    } else {
      await dbtask.markAsIncomplete();
    }
  }, [task]);

  return (
    <View style={styles.task}>
      <Pressable onPress={() => toggle(!task.isCompleted)} style={styles.check}>
        {task.isCompleted && <Text>☑️</Text>}
        {!task.isCompleted && <Text>⬜</Text>}
      </Pressable>
      <Text
        style={task.isCompleted ? styles.checked : ''}
      >{task.name}</Text>
    </View>
  );
}

const Task = enhance(BaseTask);
export default Task;

const styles = StyleSheet.create({
  task: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
  },

  check: {
    marginRight: 10,
  },

  checked: {
    textDecorationLine: 'line-through',
  },
});
