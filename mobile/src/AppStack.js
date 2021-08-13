import * as React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import Login from "./Login";
import Tasks from "./Tasks";

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Tasks" component={Tasks}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};