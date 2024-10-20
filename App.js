import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import List from "./List";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginForm} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={RegistrationForm} options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={List} options={{ headerShown: false }}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
