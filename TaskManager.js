let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let currentFilter = 'all';
let nextId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById('task-input');
  const priority = document.getElementById('priority-select').value;
  const title = input.value.trim();
  const errEl = document.getElementById('error-msg');

  if (!title) {
    errEl.style.display = 'block';
    input.focus();
    return;
  }

  errEl.style.display = 'none';

  const task = {
    id: nextId++,
    title,
    priority,
    done: false,
    createdAt: new Date().toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  };

  tasks.unshift(task);  
  saveTasks();
  input.value = '';
  renderTasks();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) { 
    task.done = !task.done; 
    saveTasks(); 
    renderTasks(); 
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function setFilter(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTasks();
}

function getFiltered() {
  if (currentFilter === 'all') return tasks;
  if (currentFilter === 'pending') return tasks.filter(t => !t.done);
  if (currentFilter === 'done') return tasks.filter(t => t.done);
  if (currentFilter === 'high') return tasks.filter(t => t.priority === 'high');
  return tasks;
}

function priorityLabel(p) {
  if (p === 'high') return '<span class="priority-badge p-high">High</span>';
  if (p === 'low') return '<span class="priority-badge p-low">Low</span>';
  return '<span class="priority-badge p-medium">Medium</span>';
}

function renderTasks() {
  const list = document.getElementById('task-list');
  const filtered = getFiltered();

  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-pending').textContent = total - done;
  document.getElementById('stat-done').textContent = done;

  if (filtered.length === 0) {
    list.innerHTML = '<div class="empty-state"><div class="empty-icon">&#10003;</div><div>No tasks here yet.<br>Add one above to get started.</div></div>';
    return;
  }

  list.innerHTML = filtered.map(task => `
    <div class="task-item ${task.done ? 'done' : ''}">
      <div class="task-check" onclick="toggleTask(${task.id})"></div>
      <div class="task-body">
        <div class="task-title">${escapeHTML(task.title)}</div>
        <div class="task-meta">${priorityLabel(task.priority)} &nbsp; Added ${task.createdAt}</div>
      </div>
      <button class="btn-delete" onclick="deleteTask(${task.id})" title="Delete task">&#x2715;</button>
    </div>
  `).join('');
}

function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

document.getElementById('task-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') addTask();
});

renderTasks();
