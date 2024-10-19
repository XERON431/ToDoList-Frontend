import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useTodoStore } from './useToDoStore';


export default function App() {
  const [task, setTask] = useState('');
  const { tasks, fetchTasks, addTask, toggleTaskCompletion, deleteTask } = useTodoStore();
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = () => {
    if (task.trim()) {
      addTask(task);
      setTask('');
    }
  };

  const renderTaskItem = ({ item }) => (
    <View style={styles.taskContainer}>
      <TouchableOpacity onPress={() => toggleTaskCompletion(item._id)} style={styles.taskTextContainer}>
        <Text style={item.completed ? styles.completedTask : styles.task}>
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTask(item._id)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a task"
        placeholderTextColor="#aaa"
        value={task}
        onChangeText={setTask}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTaskItem}
        contentContainerStyle={styles.taskList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 12,
    borderRadius: 25,
    backgroundColor: '#fff',
    marginBottom: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskList: {
    paddingBottom: 20,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  taskTextContainer: {
    flex: 1,
  },
  task: {
    fontSize: 18,
    color: '#333',
  },
  completedTask: {
    fontSize: 18,
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  deleteButton: {
    backgroundColor: '#ff5252',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
