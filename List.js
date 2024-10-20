import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useTodoStore } from "./useToDoStore";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function List({ navigation }) {
  const [task, setTask] = useState("");
  const {
    tasks,
    fetchTasks,
    addTask,
    toggleTaskCompletion,
    deleteTask,
    logout,
  } = useTodoStore();

  const user = useTodoStore((state) => state.user);
  const token = useTodoStore((state) => state.token);

  useEffect(() => {
    console.log("user", user);
  }, []);
  const [startTime, setStartTime] = useState(new Date()); // Use a default value that represents no time selected
  const [endTime, setEndTime] = useState(new Date()); // Use a default value that represents no time selected

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = () => {
    if (task.trim()) {
      console.log("task is ", task);
      addTask(task, startTime.toISOString(), endTime.toISOString()); // Pass formatted startTime and endTime
      setTask("");
      setStartTime(new Date());
      setEndTime(new Date());
      setError("");
    } else {
      setError("* Task Name Required."); // Set error state when the task input is empty
    }
  };

  const renderTaskItem = ({ item }) => {
    // Calculate duration in milliseconds
    const startTime = new Date(item.startTime);
    const endTime = new Date(item.endTime);
    // If endTime is less than startTime, assume endTime is on the next day
    if (endTime < startTime) {
      endTime.setDate(endTime.getDate() + 1); // Add a day to endTime
    }

    // Calculate duration in milliseconds
    const durationInMs = endTime - startTime;

    // Convert milliseconds to hours and minutes
    const durationHours = Math.floor(durationInMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor(
      (durationInMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    return (
      <View style={styles.taskContainer}>
        <TouchableOpacity
          onPress={() => toggleTaskCompletion(item._id)}
          style={styles.taskTextContainer}
        >
          <Text style={item.completed ? styles.completedTask : styles.task}>
            {item.text}
            <Text style={styles.durationText}>
              {" "}
              ({durationHours}h {durationMinutes}m)
            </Text>
          </Text>
          <Text style={styles.timeText}>
            Start:{" "}
            {startTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}{" "}
            | End:{" "}
            {endTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}{" "}
            |
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteTask(item._id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleLogout = async () => {
    logout(); // Call the logout function to clear user and token
    console.log("User logged out"); // Optional: Log logout action
    navigation.navigate("Login"); // Navigate to the Login screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {user ? ( // Check if user is defined
          <>
            <Text style={styles.title}>{user.username}</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.title}></Text> // Render a placeholder if user is not logged in
        )}
      </View>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder="Enter a task"
        placeholderTextColor="#aaa"
        value={task}
        onChangeText={(text) => {
          setTask(text);
          if (text.trim()) {
            setError(""); // Clear the error if there is text
          }
        }}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.timeContainer}>
        <View style={styles.timeInputContainer}>
          <Text style={styles.label}>Start Time</Text>
          <TouchableOpacity
            onPress={() => {
              setShowStartPicker(true);
              setStartTime(new Date());
            }}
            style={styles.input}
          >
            <Text style={styles.timeText}>
              {startTime.getTime() !== 0
                ? startTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "Select Start Time"}
            </Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={(event, selectedDate) => {
                if (event.type === "set" && selectedDate) {
                  setStartTime(selectedDate); // Set the selected date if it's valid
                }
                setShowStartPicker(false);
              }}
            />
          )}
        </View>

        <View style={styles.timeInputContainer}>
          <Text style={styles.label}>End Time</Text>
          <TouchableOpacity
            onPress={() => setShowEndPicker(true)}
            style={styles.input}
          >
            <Text style={styles.timeText}>
              {endTime.getTime() !== 0
                ? endTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "Select End Time"}
            </Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={(event, selectedDate) => {
                if (event.type === "set" && selectedDate) {
                  setEndTime(selectedDate); // Set the selected date if it's valid
                }
                setShowEndPicker(false); // Close the picker after selection
              }}
            />
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTaskItem}
        contentContainerStyle={styles.taskList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 12,
    borderRadius: 25,
    backgroundColor: "#fff",
    marginBottom: 10,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between", // Aligns items to the edges of the container
    alignItems: "center", // Centers items vertically
  },
  logoutButton: {
    backgroundColor: "#ff4d4d", // Example color for the button
    padding: 8,
    borderRadius: 4,
  },
  logoutText: {
    color: "#fff", // White text color for contrast
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  timeInputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#6200ee",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  taskList: {
    paddingBottom: 20,
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    shadowColor: "#000",
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
    color: "#333",
  },
  completedTask: {
    fontSize: 18,
    textDecorationLine: "line-through",
    color: "gray",
  },
  deleteButton: {
    backgroundColor: "#ff5252",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  timeText: {
    fontSize: 14,
    color: "#555",
  },
  durationText: {
    fontSize: 14, // Smaller font size for duration
    color: "#888", // Lighter color for duration
    // fontStyle: 'italic', // Italic style for the duration
    marginLeft: 5, // Space between task text and duration
  },
  errorText: {
    color: "red", // Color of the error message
    marginTop: -5, // Space between input and error message
    marginBottom: 10,
  },
});
