import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import confetti from 'canvas-confetti';
import './App.css';

/**
 * App Component
 * 
 * @description
 * The App component is a habit tracker that allows users to manage their daily or goal-based habits. 
 * Users can add new habits, track their progress, mark habits as completed, and delete completed habits. 
 * The app supports drag-and-drop reordering of habits, inline editing of habit names, and progress tracking 
 * either through daily check-ins or numerical goals. Confetti animations celebrate when goals are achieved.
 * 
 * @instructions
 * - To add a habit:
 *   1. Enter a habit name in the input field.
 *   2. Optionally, specify a numerical goal in the "Goal" input field.
 *   3. Press "Enter" or click the "+" button to add the habit.
 * 
 * - To track progress:
 *   - For daily check-ins: Click on the days of the week to mark them as completed.
 *   - For numerical goals: Update the progress value in the input field under the habit.
 * 
 * - To edit a habit name:
 *   1. Click on the habit name.
 *   2. Modify the name in the input field and press "Enter" or click outside to save.
 * 
 * - To mark a habit as completed or active:
 *   - Click the checkmark button next to the habit.
 * 
 * - To delete all completed habits:
 *   - Click the "Delete All Completed" button at the bottom of the app.
 * 
 * - To reorder habits:
 *   - Drag and drop habits to rearrange their order.
 * 
 * - To edit the app title:
 *   1. Click on the title at the top of the app.
 *   2. Modify the title in the input field and press "Enter" or click outside to save.
 * 
 * @returns {JSX.Element} The rendered habit tracker application.
 */

const App = () => {
  const [habits, setHabits] = useState(() => {
    const stored = localStorage.getItem('habits');
    return stored ? JSON.parse(stored) : [];
  });

  const [editingId, setEditingId] = useState(null);
  const [tempTitle, setTempTitle] = useState('');
  const [goalInput, setGoalInput] = useState('');

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const days = ['M', 'T', 'W', 'Th', 'F', 'S', 'Su'];

  const toggleDay = (index, dayIndex) => {
    const updatedHabits = habits.map((habit, i) => {
      if (i === index) {
        const updatedWeek = [...habit.weekProgress];
        updatedWeek[dayIndex] = !updatedWeek[dayIndex];
        return { ...habit, weekProgress: updatedWeek };
      }
      return habit;
    });

    const justCompleted = updatedHabits[index];
    const wasComplete = habits[index].weekProgress.every((done) => done);
    const nowComplete = justCompleted.weekProgress.every((done) => done);

    if (!wasComplete && nowComplete) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    setHabits(updatedHabits);
  };

  const toggleComplete = (id) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    );
    updatedHabits.sort((a, b) => a.completed - b.completed);
    setHabits(updatedHabits);
  };

  const deleteCompleted = () => {
    setHabits(habits.filter((habit) => !habit.completed));
  };

  const addHabit = (name, goal) => {
    if (!name.trim()) return;
  
    const parsedGoal = Number(goal);
    const validGoal = !isNaN(parsedGoal) && parsedGoal > 0;
  
    setHabits([
      {
        id: Date.now().toString(),
        name,
        completed: false,
        weekProgress: [false, false, false, false, false, false, false],
        goal: validGoal ? parsedGoal : 0,
        progress: 0,
      },
      ...habits
    ]);
  };  

  const startEditing = (id, currentTitle) => {
    setEditingId(id);
    setTempTitle(currentTitle);
  };

  const saveTitle = (id) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === id ? { ...habit, name: tempTitle } : habit
    );
    setHabits(updatedHabits);
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setTempTitle('');
  };

  const updateProgress = (id, value) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === id) {
        const newProgress = Math.max(0, Number(value));
        const cappedProgress = Math.min(newProgress, habit.goal); // prevent over-completion
        const justHitGoal = habit.progress < habit.goal && cappedProgress >= habit.goal;
  
        if (justHitGoal) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
  
        return { ...habit, progress: cappedProgress };
      }
      return habit;
    });
  
    setHabits(updatedHabits);
  };

  const updateGoal = (id, value) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === id) {
        const newGoal = Math.max(1, Number(value)); // prevent goal of 0 or less
        const adjustedProgress = Math.min(habit.progress, newGoal); // cap progress
        return { ...habit, goal: newGoal, progress: adjustedProgress };
      }
      return habit;
    });
  
    setHabits(updatedHabits);
  };
    

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const reordered = Array.from(habits);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);

    setHabits(reordered);
  };

  const activeHabits = habits.filter((habit) => !habit.completed);
  const completedHabits = habits.filter((habit) => habit.completed);

  const [title, setTitle] = useState(() => {
    return localStorage.getItem('appTitle') || 'Progress Tracker';
  });
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  useEffect(() => {
    localStorage.setItem('appTitle', title);
  }, [title]);    

  return (
    <div className="app">
      <div className="title-wrapper">
        {isEditingTitle ? (
          <input
            className="editable-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setIsEditingTitle(false);
              if (e.key === 'Escape') {
                setIsEditingTitle(false);
                setTitle(localStorage.getItem('appTitle') || 'Progress Tracker');
              }
            }}
            autoFocus
          />
        ) : (
          <div className="editable-title" onClick={() => setIsEditingTitle(true)}>
            <h1 className="title">{title}</h1>
            <ion-icon name="pencil" class="edit-icon"></ion-icon>
          </div>
        )}
      </div>

      <div className="add-habit">
        <div className='tooltip-wrapper'>
          <input
            className="input"
            type="text"
            placeholder="Do something..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addHabit(e.target.value, goalInput);
                e.target.value = '';
                setGoalInput('');
              }
            }}
          />
          <span className="tooltip-text">Leave goal blank to use daily check-ins</span>
        </div>
        <div className="tooltip-wrapper">
          <input
            className="input goal-input"
            type="number"
            min="1"
            placeholder="Goal"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
          />
          <span className="tooltip-text">Optionally, specify a numerical goal in the "Goal" input field</span>
        </div>

        <button
          className="add-button"
          onClick={() => {
            const input = document.querySelector('.input');
            addHabit(input.value, goalInput);
            input.value = '';
            setGoalInput('');
          }}
        >
          <ion-icon name="add-circle" className="add-icon" />
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="habits">
          {(provided) => (
            <div
              className="habit-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {activeHabits.map((habit, index) => (
                <Draggable key={habit.id} draggableId={habit.id} index={index}>
                  {(provided) => (
                    <div
                      className={`habit-item ${habit.completed ? 'habit-item--completed' : ''} ${
                        habit.weekProgress.every((day) => day) ? 'habit-item--finished' : ''
                      }`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className="habit-header">
                        <ion-icon name="reorder-three" class="grip-icon" {...provided.dragHandleProps}></ion-icon>

                        <div className="habit-title">
                          {editingId === habit.id ? (
                            <input
                              type="text"
                              value={tempTitle}
                              onChange={(e) => setTempTitle(e.target.value)}
                              onBlur={() => saveTitle(habit.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveTitle(habit.id);
                                if (e.key === 'Escape') cancelEditing();
                              }}
                              autoFocus
                            />
                          ) : (
                            <span onClick={() => startEditing(habit.id, habit.name)}>{habit.name}</span>
                          )}
                        </div>
                        <button
                          className={`checkmark ${habit.completed ? 'active' : 'inactive'}`}
                          onClick={() => toggleComplete(habit.id)}
                          title={habit.completed ? "Mark as Active" : "Mark as Complete"}
                        >
                          <ion-icon name={habit.completed ? "checkmark" : "checkmark-circle-outline"}></ion-icon>
                        </button>
                      </div>

                      {habit.goal && habit.goal > 0 ? (
                        <div className="progress-container">
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${Math.min((habit.progress / habit.goal) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                          <p className="percentage-text">
                            {habit.goal > 0
                              ? `${Math.round((habit.progress / habit.goal) * 100)}% complete`
                              : '0% complete'}
                          </p>
                          <p className="progress-text">
                            <input
                              type="number"
                              className="input progress-input"
                              value={habit.progress}
                              min="0"
                              max={habit.goal}
                              onChange={(e) => updateProgress(habit.id, e.target.value)}
                            /> &nbsp;&nbsp;/&nbsp;&nbsp;
                            <input
                              type="number"
                              className="input goal-input"
                              value={habit.goal}
                              min="1"
                              onChange={(e) => updateGoal(habit.id, e.target.value)}
                            />
                          </p>
                        </div>
                      ) : (
                        <div className="week-row">
                          {days.map((day, dayIndex) => (
                            <button
                              key={dayIndex}
                              onClick={() => toggleDay(index, dayIndex)}
                              className={`day ${habit.weekProgress[dayIndex] ? 'day--completed' : ''}`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      )}

                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              {completedHabits.length > 0 && (
                <div className="deleted-list">
                  <h3 className="deleted-title">Completed</h3>
                  {completedHabits.map((habit) => (
                    <div key={habit.id} className="habit-item habit-item--deleted">
                      <div className="habit-header">
                        <p className="habit-title completed">{habit.name}</p>
                        <button onClick={() => toggleComplete(habit.id)} className="checkmark completed">
                          <ion-icon name="checkmark-circle" className={`check-icon completed`}></ion-icon>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {habits.some((h) => h.completed) && (
        <button className="delete-completed" onClick={deleteCompleted}>
          <ion-icon name="trash-bin" className="delete-icon"></ion-icon>
          Delete All Completed
        </button>
      )}
    </div>
  );
};

export default App;
