import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { destroyTask, updateTask, createTask } from './store';

const Tasks = ()=> {
  const { tasks } = useSelector(state => state);
  const [name, setName ] = useState('');
  const [complete, setComplete ] = useState(false);
  const dispatch = useDispatch();
  const { id, difficulty } = useParams();
  const navigate = useNavigate();

  useEffect(()=> {
    const task = tasks.find( task => task.id === id);
    setName(task ? task.name : '');
    setComplete(task ? task.complete: false);
  }, [tasks, id]);

  const save = (ev)=> {
    ev.preventDefault();
    if(id){
      const task = { id, name, complete };
      dispatch(updateTask(task, navigate));
    }
    else {
      const task = { name, complete };
      dispatch(createTask(task, navigate));
    }
  };

  const destroy = ()=> {
    dispatch(destroyTask({ id }, navigate));
  };

  let filtered = tasks;

  if (difficulty === 'EASY'){
    filtered = tasks.filter(task => task.difficulty === 'EASY');
  }
  else if (difficulty === 'MEDIUM'){
    filtered = tasks.filter(task => task.difficulty === 'MEDIUM');
  }
  else if (difficulty === 'DIFFICULT'){
    filtered = tasks.filter(task => task.difficulty === 'DIFFICULT');
  }
  return (
    <div>
      <ul>
        {
          filtered.map( task => { 
            return (
              <li
                key={ task.id }
              >
                <Link to={`/tasks/${task.id}`}>
                  <span className = { task.complete ? 'complete': ''}>{ task.name }</span>
                </Link>
                <ul>
                  {task.description ? <li>DESCRIPTION: {task.description}</li>:''}
                  <li>LEVEL: {task.difficulty}</li>
                </ul>
              </li>
            );
          })
        }
      </ul>
      <form onSubmit={ save }>
        <input
          type='checkbox'
          checked={ complete }
          onChange={ ev => setComplete(ev.target.checked)}
        />
        <input value={ name } onChange={ ev => setName(ev.target.value)}/>
        <button disabled={ !name }>Save</button>
      </form>
      { id ? <button onClick={ destroy }>x</button> : null }
    </div>
  );
}; 

export default Tasks;
