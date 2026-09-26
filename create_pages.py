import os

pages = {
    "src/pages/faculty/StudentsPage.tsx": "Faculty Students",
    "src/pages/faculty/AttendancePage.tsx": "Faculty Attendance",
    "src/pages/faculty/RiskPage.tsx": "Faculty Risk",
    "src/pages/faculty/WarningsPage.tsx": "Faculty Warnings",
    "src/pages/faculty/NotificationsPage.tsx": "Faculty Notifications",
    "src/pages/faculty/ReportsPage.tsx": "Faculty Reports",
    "src/pages/faculty/ProfilePage.tsx": "Faculty Profile",
    "src/pages/student/AttendancePage.tsx": "Student Attendance",
    "src/pages/student/RiskPage.tsx": "Student Risk",
    "src/pages/student/WarningsPage.tsx": "Student Warnings",
    "src/pages/student/NotificationsPage.tsx": "Student Notifications",
    "src/pages/student/ProfilePage.tsx": "Student Profile",
}

template = """import React from 'react';

export default function {name}() {{
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="text-slate-500">This page is under construction.</p>
    </div>
  );
}}
"""

for path, title in pages.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    component_name = path.split("/")[-1].replace(".tsx", "")
    with open(path, "w") as f:
        f.write(template.format(name=component_name, title=title))

print("Created placeholder files.")
