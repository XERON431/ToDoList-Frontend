import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://192.168.29.98:5000/tasks'; // Replace with your server's URL

export const useTodoStore = create((set, get) => ({
  tasks: [],
  fetchTasks: async () => {
    try {
      const response = await axios.get(API_URL);
      set({ tasks: response.data });
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  },
  addTask: async (text) => {
    const newTask = { text, completed: false };
    try {
      const response = await axios.post(API_URL, newTask);
      set((state) => ({
        tasks: [...state.tasks, response.data],
      }));
    } catch (error) {
      console.error('Error adding task:', error);
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
      const response = await axios.put(`${API_URL}/${taskId}`, {
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
    try {
      await axios.delete(`${API_URL}/${taskId}`);
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== taskId),
      }));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  },
}));
