import * as React from 'react';
import {Button, Text, TextInput} from "react-native";
import * as SecureStore from "expo-secure-store";
import {useCallback, useEffect, useState} from "react";

async function saveToken(value) {
  await SecureStore.setItemAsync('token', value);
}

async function getToken() {
  let result = await SecureStore.getItemAsync('token');
  if (result) {
    return result;
  } else {
    return false;
  }
}

export default function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkingToken, setCheckingToken] = useState(true);

  const login = useCallback(() => {
    fetch('https://0cd7b3df1b3b.ngrok.io/sanctum/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        'device_name': 'mobile',
      }),
    })
      .then(response => response.json())
      .then(json => {
        saveToken(json.token)
          .then(() => {
            navigation.reset({
              index: 0,
              routes: [
                {name: 'Tasks', params: {token: json.token}},
              ]
            });
            setEmail('');
            setPassword('');
          });
      })
      .catch(error => console.log(error));
  }, [email, password]);

  useEffect(() => {
    getToken().then(token => {
      if (token) {
        navigation.reset({
          index: 0,
          routes: [
            {name: 'Tasks', params: {token}},
          ]
        });
        setCheckingToken(false);
      } else {
        setCheckingToken(false);
      }
    })
  }, []);

  if (checkingToken) {
    return <Text>Loading..</Text>
  }

  return (
    <>
      <TextInput
        placeholder="Email"
        onChangeText={email => setEmail(email)}
        defaultValue={email}
      />
      <TextInput
        placeholder="Password"
        onChangeText={password => setPassword(password)}
        defaultValue={password}
        secureTextEntry={true}
      />
      <Button title="Log In" onPress={login}/>
    </>
  );
}
