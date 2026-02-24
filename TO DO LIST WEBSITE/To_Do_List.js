// ===================== AMBIL ELEMENT DOM =====================
// Menghubungkan JavaScript dengan elemen HTML menggunakan ID

const taskInput = document.getElementById("taskInput");     // input nama task
const priority = document.getElementById("priority");       // dropdown prioritas
const category = document.getElementById("category");       // dropdown kategori
const assignTo = document.getElementById("assignTo");       // assign task ke tim
const deadline = document.getElementById("deadline");       // tanggal deadline
const addTaskBtn = document.getElementById("addTaskBtn");   // tombol tambah task
const taskList = document.getElementById("taskList");       // container daftar task
const filterStatus = document.getElementById("filterStatus"); // filter status
const searchTask = document.getElementById("searchTask");     // search task

// ===================== STATE MANAGEMENT =====================
// Mengambil data dari localStorage agar data tetap ada saat browser direfresh

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// ===================== SIMPAN KE LOCAL STORAGE =====================
// Fungsi untuk menyimpan data task ke browser storage

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


// ===================== RENDER TASK KE UI =====================
// Menampilkan semua task ke halaman

function renderTasks() {

  taskList.innerHTML = ""; // reset isi list sebelum render ulang

  // ===== FILTER BERDASARKAN STATUS =====
  let filteredTasks = tasks.filter(task => {
    if (filterStatus.value === "completed") return task.completed;
    if (filterStatus.value === "pending") return !task.completed;
    return true;
  });

  // ===== SEARCH TASK =====
  filteredTasks = filteredTasks.filter(task =>
    task.name.toLowerCase().includes(searchTask.value.toLowerCase())
  );

  // ===== LOOPING TASK =====
  filteredTasks.forEach((task, index) => {

    const li = document.createElement("li");

    // CEK APAKAH TASK OVERDUE
    const isOverdue =
      task.deadline &&
      new Date(task.deadline) < new Date() &&
      !task.completed;

    // TEMPLATE TASK
    li.innerHTML = `
      <div>
        <strong style="text-decoration:${task.completed ? "line-through" : "none"}">
          ${task.name}
        </strong>
        <br>
        <small>${task.category} • ${task.assignTo}</small>
        <br>
        <small>Deadline: ${task.deadline || "-"}</small>
      </div>

      <div>
        <span class="priority ${task.priority.toLowerCase()}">${task.priority}</span>

        <!-- Tombol toggle complete -->
        <button onclick="toggleComplete(${index})">✔</button>

        <!-- Tombol delete -->
        <button onclick="deleteTask(${index})">🗑</button>
      </div>
    `;

    // Jika overdue → kasih indikator visual
    if (isOverdue) li.style.borderLeft = "5px solid red";

    taskList.appendChild(li);
  });

  // Update dashboard setelah render
  updateDashboard();
}


// ===================== TAMBAH TASK =====================

addTaskBtn.addEventListener("click", () => {

  // Validasi input wajib
  if (taskInput.value === "") return alert("Task name is required!");

  // Object task baru
  const newTask = {
    name: taskInput.value,
    priority: priority.value,
    category: category.value,
    assignTo: assignTo.value,
    deadline: deadline.value,
    completed: false
  };

  // Simpan ke array
  tasks.push(newTask);

  // Simpan ke localStorage
  saveToLocalStorage();

  // Render ulang UI
  renderTasks();

  // Reset form
  taskInput.value = "";
  priority.value = "";
  category.value = "";
  assignTo.value = "";
  deadline.value = "";
});


// ===================== DELETE TASK =====================

function deleteTask(index) {
  tasks.splice(index, 1); // hapus task berdasarkan index
  saveToLocalStorage();
  renderTasks();
}


// ===================== TOGGLE COMPLETE =====================

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed; // ubah status
  saveToLocalStorage();
  renderTasks();
}


// ===================== UPDATE DASHBOARD =====================
// Menghitung statistik task

function updateDashboard() {

  const total = tasks.length;

  const completed = tasks.filter(t => t.completed).length;

  const pending = total - completed;

  // Hitung overdue task
  const overdue = tasks.filter(task => {
    return (
      task.deadline &&
      new Date(task.deadline) < new Date() &&
      !task.completed
    );
  }).length;

  // Tampilkan ke UI
  document.getElementById("totalTasks").textContent = total;
  document.getElementById("completedTasks").textContent = completed;
  document.getElementById("pendingTasks").textContent = pending;
  document.getElementById("overdueTasks").textContent = overdue;

  // ===== PROGRESS BAR =====
  const progress = total === 0 ? 0 : (completed / total) * 100;

  document.getElementById("progress").style.width = progress + "%";

  document.getElementById("progressText").textContent =
    Math.round(progress) + "% Completed";
}


// ===================== FILTER & SEARCH EVENT =====================

filterStatus.addEventListener("change", renderTasks);
searchTask.addEventListener("input", renderTasks);


// ===================== LOAD AWAL =====================
// Menjalankan render saat pertama kali web dibuka

renderTasks();