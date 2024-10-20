import { create } from 'zustand';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const API_URL = 'https://api-siddhant.ddns.net'; // Replace with your server's URL
// const API_URL = 'http://192.168.29.98:5000'; 
export const useTodoStore = create((set, get) => ({
  tasks: [],
  user: null, // Initialize user as null
  token: null, // Initialize token as null
  fetchTasks: async () => {
    const { token } = get(); // Retrieve the token from the state
    if (!token) {
      console.error('No token available');
      return;
    }
  
    try {
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request header
        },
      });
    //   console.log("response", response);
      set({ tasks: response.data.reverse() }); // Reverse the order of tasks
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  },
  
  addTask: async (text, startTime, endTime) => {
    const { token } = get(); // Get the token from the Zustand store
    const newTask = { text, completed: false, startTime, endTime }; // Include startTime and endTime
    console.log("task", newTask);
  
    try {
      const response = await axios.post(`${API_URL}/tasks`, newTask, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });

      console.log("added task", response.data.task);

      if (response.status === 201) {
        // Prepend the new task to the existing tasks array
        set((state) => ({
          tasks: [response.data.task, ...state.tasks], // Assuming response.data.task contains the new task
        }));
      }
    } catch (error) {
      console.error('Error adding task:', error);
      // Optionally handle error (e.g., show a notification)
    }
  },

  
  toggleTaskCompletion: async (taskId) => {
    const tasks = get().tasks; // Access the tasks from the state
  console.log("all tasks", tasks); 
    console.log("taks", taskId);
    
    const taskToUpdate = get().tasks.find((task) => task._id === taskId);  // Correctly access the current state
    console.log("task to update", taskToUpdate);
    if (!taskToUpdate) return; // Ensure the task exists
    try {
      const response = await axios.put(`${API_URL}/tasks/${taskId}`, {
        completed: !taskToUpdate.completed,
      });
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? response.data : task
        ),
      }));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  },
  deleteTask: async (taskId) => {
    const { token } = get(); // Get the token from the Zustand store
    console.log("token", taskId)
    
    try {
      const response = await axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
  
      // Check if the response indicates successful deletion
      if (response.status === 200) {
        set((state) => ({
          tasks: state.tasks.filter((task) => task._id !== taskId), // Update the state to remove the deleted task
        }));
        console.log('Task deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      // Optionally handle error (e.g., show a notification)
    }
  },
  

  login: async (username, password) => {
    console.log("hey", username, password);
    const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { token, user } = response.data;

      console.log("token ", token );
      console.log("user", user);

      // Save the token and user data
      set({ user, token });
      
  },
  register: async (username, password) => {
    console.log("hey man");
    const response = await axios.post(`${API_URL}/register`, {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("hey man2");

      const { token, user } = response.data;
      set({ user, token });
  },
  logout: () => set({ user: null, token: null }), 
}));


export const useAuthStore = create((set) => ({
    token: null,
    setToken: (token) => set({ token }),
  }));
