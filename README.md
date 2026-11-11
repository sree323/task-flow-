# 🎓 Student Attendance Management System

A responsive, browser-based student attendance app built using **HTML, CSS, and JavaScript**. It runs without installing packages or setting up a server.

## ✨ Features

- Add students with unique roll numbers, names, and class/section.
- Mark attendance **Present** or **Absent** by date. Click an active mark again to clear it.
- View daily totals for present, absent, and unmarked students.
- Search by name or roll number and filter by class.
- View each student's attendance percentage based on days marked present or absent.
- Mark all students present for the selected date (with confirmation).
- Delete students and associated attendance records (with confirmation).
- Download a CSV report with date-wise attendance and overall percentages.
- Automatically save records to browser `localStorage`.

## 🛠️ Technology Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Browser localStorage (no backend/database server)

## 📁 Project Structure

```text
student-attendance-management/
├── index.html       # Main application
├── style.css        # Responsive styling
├── script.js        # Attendance logic and CSV export
└── README.md        # Project documentation
```

## 🚀 Getting Started

1. Download this repository ZIP and extract it, or clone the repository.
2. Open `index.html` in Chrome, Edge, or Firefox.
3. Add students using the form.
4. Select a date and mark Present or Absent.
5. Export CSV regularly to back up your attendance history.

No build tools, dependencies, or internet connection are required.

## 📊 Attendance Calculation

```text
Attendance % = (Number of Present Days / Number of Marked Days) × 100
```

For example, 18 present days out of 20 marked days = **90%**. Days not marked are excluded from the denominator. The percentage is shown as `—` until a student has at least one marked day.

## 💾 Data Storage & Limitations

- Records are saved only in the **current browser and browser profile**.
- Data is **not synchronized** across users, devices, or browsers.
- Clearing browser data or using private browsing can erase records.
- The CSV is an export, not an importable backup (there is no restore function).
- This is a standalone academic/demo app, **not** a production-grade attendance system. It has no login, backend, server database, or access control. Do not store sensitive student information or rely on it for official institutional records.

## 🌐 GitHub Pages Deployment

1. Create a public GitHub repository.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. Open the GitHub Pages URL once deployment completes.

**Note:** Publishing this demo on GitHub Pages does not create shared attendance storage: every visitor still sees only their own browser's local data.

## 🔮 Potential Enhancements

- Secure teacher and administrator logins
- Central database with authentication and authorization
- Monthly attendance reporting and charts
- Import/restore from a backup file
- Class-wise administrator dashboard

## 📄 License

No license is included. Add a LICENSE file if you wish to define permissions for others to reuse or modify the project.
