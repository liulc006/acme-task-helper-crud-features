import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import logger from 'redux-logger';
import { Navigate } from 'react-router-dom';

const tasks = (state = [], action)=> {
  if(action.type === 'SET_TASKS'){
    return action.tasks;
  }
  if(action.type === 'UPDATE_TASK'){
    return state.map(task => task.id === action.task.id ? action.task : task);
  }
  if(action.type === 'DESTROY_TASK'){
    return state.filter(task => task.id !== action.task.id);
  }
  if(action.type === 'CREATE_TASK'){
    return [...state, action.task];
  }
  return state;
};

const reducer = combineReducers({
  tasks
});

const store = createStore(reducer, applyMiddleware(thunk, logger));

export const fetchTasks = ()=> {
  return async(dispatch)=> {
    const response = await axios.get('/api/tasks');
    dispatch({ type: 'SET_TASKS', tasks: response.data });
  };
};

export const updateTask = (task, navigate)=> {
  return async(dispatch)=> {
    const response = await axios.put(`/api/tasks/${task.id}`, task);
    dispatch({ type: 'UPDATE_TASK', task: response.data });
    navigate('/');
  };
};

export const destroyTask = (task, navigate)=> {
  return async(dispatch)=> {
    await axios.delete(`/api/tasks/${task.id}`);
    dispatch({ type: 'DESTROY_TASK', task });
    navigate('/')
  };
};

export const createTask = (task, navigate)=> {
  return async(dispatch)=> {
    const response = await axios.post('/api/tasks', task);
    dispatch({ type: 'CREATE_TASK', task: response.data });
    navigate(`/tasks/${response.data.id}`);
  };
};

export default store;
