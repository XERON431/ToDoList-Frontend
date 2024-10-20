import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { useTodoStore } from './useToDoStore';

export default function RegistrationForm({navigation}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useTodoStore();

  const handleRegister = async () => {
    try {
      await register(username, password);
      navigation.navigate("Home");
      // Optionally handle success message or navigation
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.logoContainer}>
        <Image
          source={require('./assets/to-do-list.png')} // Replace with your image path
          style={styles.logo}
        />
      </View>
      <Text style={styles.title}>Create an Account</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  logoContainer: {
    alignItems: 'center', // Center the image horizontally
    marginBottom: 20, // Add space below the image
  },
  logo: {
    width: 100, // Adjust the width as needed
    height: 100, // Adjust the height as needed
    marginBottom: 20, // Adjust spacing below the image
    resizeMode: 'contain', // Ensures the image fits within the specified size
    // justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    textAlign: 'center',
    color: '#6200ee',
    marginTop: 10,
  },
});
