import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [dbStatus, setDbStatus] = useState('Checking...');
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = '/api';

  useEffect(() => {
    fetchTasks();
    checkHealth();
  }, []);

  const checkHealth = () => {
    fetch('/health')
      .then(res => res.json())
      .then(data => setDbStatus(data.database === 'CONNECTED' ? 'Connected' : 'Disconnected'))
      .catch(() => setDbStatus('Disconnected'));
  };

  const fetchTasks = () => {
    fetch(`${BACKEND_URL}/tasks`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.status === "Success") setTasks(resData.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    fetch(`${BACKEND_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTask })
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.status === "Success") {
          setTasks([resData.data, ...tasks]);
          setNewTask('');
        }
      });
  };

  const toggleTask = (id, currentStatus) => {
    const nextStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    fetch(`${BACKEND_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    })
      .then(() => {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: nextStatus } : t));
      });
  };

  const deleteTask = (id) => {
    fetch(`${BACKEND_URL}/tasks/${id}`, { method: 'DELETE' })
      .then(() => {
        setTasks(tasks.filter(t => t.id !== id));
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <header style={styles.header}>
            <h1 style={styles.title}>🚀 DevOps 3-Tier Dashboard</h1>
            <div style={styles.statusBadge(dbStatus)}>
              MySQL DB: {dbStatus}
            </div>
          </header>

          {/* Task Form */}
          <form onSubmit={addTask} style={styles.form}>
            <input 
              type="text" 
              placeholder="Enter a new DevOps milestone (e.g., Write Dockerfile)..." 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Add Task</button>
          </form>

          {/* Task List */}
          <h3 style={{ color: '#4a5568', marginBottom: '15px' }}>Project Milestones</h3>
          {loading ? <p>Loading milestones...</p> : (
            <div style={styles.list}>
              {tasks.length === 0 ? <p style={{color: '#777'}}>No tasks found. Add your first one above!</p> : 
                tasks.map((task) => (
                  <div key={task.id} style={styles.taskItem}>
                    <span style={styles.taskText(task.status)}>
                      {task.title}
                    </span>
                    <div>
                      <button 
                        onClick={() => toggleTask(task.id, task.status)}
                        style={styles.actionBtn(task.status === 'Pending' ? '#2ecc71' : '#f1c40f')}
                      >
                        {task.status === 'Pending' ? '✓ Complete' : '⟲ Undo'}
                      </button>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        style={styles.actionBtn('#e74c3c')}
                      >
                        ✕ Delete
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>

        {/* Copyright Footer */}
        <footer style={styles.footer}>
          © {new Date().getFullYear()} Andrew Ferdinandus.
        </footer>
      </div>
    </div>
  );
}

// Inline Beautiful CSS Styles
const styles = {
  container: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', padding: '40px 20px', fontFamily: '"Segoe UI", Roboto, sans-serif', display: 'flex', justifyContent: 'center' },
  wrapper: { maxWidth: '650px', width: '100%', display: 'flex', flexDirection: 'column' },
  card: { background: '#ffffff', width: '100%', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', height: 'fit-content' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f0f2f5', paddingBottom: '15px', marginBottom: '20px' },
  title: { fontSize: '24px', color: '#2d3748', margin: 0, fontWeight: '700' },
  statusBadge: (status) => ({ background: status === 'Connected' ? '#e6fffa' : '#fff5f5', color: status === 'Connected' ? '#319795' : '#e53e3e', padding: '6px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', border: `1px solid ${status === 'Connected' ? '#b2f5ea' : '#fed7d7'}` }),
  form: { display: 'flex', gap: '10px', marginBottom: '25px' },
  input: { flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '15px', outline: 'none' },
  button: { background: '#4c51bf', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  taskItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#f7fafc', borderRadius: '10px', borderLeft: '4px solid #4c51bf' },
  taskText: (status) => ({ fontSize: '16px', color: status === 'Completed' ? '#a0aec0' : '#2d3748', textDecoration: status === 'Completed' ? 'line-through' : 'none', fontWeight: '500' }),
  actionBtn: (color) => ({ background: color, color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', marginLeft: '6px', cursor: 'pointer' }),
  footer: { marginTop: '25px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', fontWeight: '500', borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '15px' }
};

export default App;
