import { useState } from 'react'
import './App.css'
import Task from './components/Task'

function App() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Complete React Project',
      completed: false,
      date: '2024-03-15',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Review Pull Requests',
      completed: true,
      date: '2024-03-14',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Team Standup Meeting',
      completed: false,
      date: '2024-03-15',
      priority: 'high'
    },
    {
      id: 4,
      title: 'Update Documentation',
      completed: false,
      date: '2024-03-16',
      priority: 'low'
    },
    {
      id: 5,
      title: 'Fix UI Bugs',
      completed: true,
      date: '2024-03-13',
      priority: 'medium'
    },
    {
      id: 6,
      title: 'Prepare Presentation',
      completed: false,
      date: '2024-03-17',
      priority: 'high'
    }
  ])
  const [newTask, setNewTask] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [filter, setFilter] = useState('all')
  const [showAddTask, setShowAddTask] = useState(false)
  const [error, setError] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const validateTask = () => {
    if (!newTask.trim()) {
      setError('Task title cannot be empty')
      return false
    }
    if (newTask.trim().length < 3) {
      setError('Task title must be at least 3 characters long')
      return false
    }
    if (newTask.trim().length > 100) {
      setError('Task title must be less than 100 characters')
      return false
    }
    if (!dueDate) {
      setError('Please select a due date')
      return false
    }
    setError('')
    return true
  }

  const addTask = (e) => {
    e.preventDefault()
    if (!validateTask()) return

    if (editingTask) {
      setTasks(tasks.map(task =>
        task.id === editingTask.id
          ? { ...task, title: newTask, priority, date: dueDate }
          : task
      ))
      setEditingTask(null)
    } else {
      setTasks([...tasks, {
        id: Date.now(),
        title: newTask,
        completed: false,
        date: dueDate,
        priority
      }])
    }
    setNewTask('')
    setPriority('medium')
    setDueDate('')
    setShowAddTask(false)
  }

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, completed: !task.completed }
        : task
    ))
  }

  const editTask = (task) => {
    setEditingTask(task)
    setNewTask(task.title)
    setPriority(task.priority)
    setDueDate(task.date)
    setShowAddTask(true)
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    if (filter === 'high') return task.priority === 'high'
    if (filter === 'medium') return task.priority === 'medium'
    if (filter === 'low') return task.priority === 'low'
    return true
  })

  const completedCount = tasks.filter(task => task.completed).length
  const activeCount = tasks.length - completedCount
  const highPriorityCount = tasks.filter(task => task.priority === 'high' && !task.completed).length

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <span>TaskFlow</span>
          </div>

          <div className="navbar-actions">
            <span className="current-date">{currentDate}</span>
            <button
              onClick={() => {
                setShowAddTask(true)
                setError('')
                setNewTask('')
                setPriority('medium')
                setDueDate('')
              }}
              className="add-task-btn"
              title="Add new task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="main-layout">
        <main className="main-content">
          {showAddTask && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2 className="modal-title">
                    {editingTask ? 'Edit Task' : 'Add New Task'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddTask(false)
                      setEditingTask(null)
                      setNewTask('')
                      setError('')
                      setPriority('medium')
                      setDueDate('')
                    }}
                    className="modal-close"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={addTask} className="modal-form">
                  {error && <div className="error-message">{error}</div>}
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => {
                      setNewTask(e.target.value)
                      setError('')
                    }}
                    placeholder="What needs to be done?"
                    className={`task-input ${error ? 'error' : ''}`}
                    autoFocus
                  />
                  <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                      id="priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="task-select"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="dueDate">Due Date</label>
                    <input
                      type="date"
                      id="dueDate"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="task-input"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="modal-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddTask(false)
                        setEditingTask(null)
                        setNewTask('')
                        setError('')
                        setPriority('medium')
                        setDueDate('')
                      }}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      {editingTask ? 'Update Task' : 'Add Task'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="filter-tabs">
            {[
              { id: 'all', label: 'All Tasks' },
              { id: 'active', label: 'Active' },
              { id: 'completed', label: 'Completed' },
              { id: 'high', label: 'High Priority' },
              { id: 'medium', label: 'Medium Priority' },
              { id: 'low', label: 'Low Priority' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`filter-btn ${filter === tab.id ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="task-stats">
            <div className="stat-item">
              <span className="stat-value">{activeCount}</span>
              <span className="stat-label">Active Tasks</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{completedCount}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{highPriorityCount}</span>
              <span className="stat-label">High Priority</span>
            </div>
          </div>

          <div className="task-grid">
            {filteredTasks.map(task => (
              <Task
                key={task.id}
                task={task}
                onDelete={deleteTask}
                onToggle={toggleTask}
                onEdit={editTask}
              />
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3>No tasks found</h3>
              <p>
                {filter === 'all'
                  ? "Click the + button to add a new task!"
                  : filter === 'active'
                    ? "No active tasks. Great job!"
                    : filter === 'completed'
                      ? "No completed tasks yet."
                      : `No ${filter} priority tasks found.`}
              </p>
            </div>
          )}
        </main>

        <aside className="sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Task Management Tips
            </h2>
            <p className="sidebar-subtitle">Boost your productivity with these helpful tips</p>
          </div>

          <div className="tip-card">
            <h4>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Prioritize Your Tasks
            </h4>
            <p>Use the priority levels to focus on what matters most. High priority tasks should be tackled first.</p>
          </div>

          <div className="tip-card">
            <h4>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Set Realistic Deadlines
            </h4>
            <p>Assign due dates to your tasks and review them regularly to stay on track with your goals.</p>
          </div>

          <div className="tip-card">
            <h4>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Break Down Large Tasks
            </h4>
            <p>Divide complex tasks into smaller, manageable subtasks to make progress more achievable.</p>
          </div>

          <div className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{activeCount}</div>
                <div className="stat-label">Active Tasks</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{completedCount}</div>
                <div className="stat-label">Completed</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default App
