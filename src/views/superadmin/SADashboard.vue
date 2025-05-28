<template>
  <div class="w-full">
    <div class="flex items-center space-x-6 mb-6">
      <h1 class="text-5xl font-bold text-[#295f98]">Dashboard</h1>
      
    </div>
    <div class="filters mb-6">
      <select
        id="dashboard-select"
         v-model="selectedDashboard"
        class="filter-dropdown"
      >
        <option value="teacher">Teacher Dashboard</option>
        <option value="admin">Admin Dashboard</option>
      </select>
    </div>

    <!-- Teacher Dashboard -->
    <div v-if="selectedDashboard === 'teacher'">
      <!-- Cards -->
      <div class="flex justify-between gap-4 w-full mb-6">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="bg-white rounded-lg shadow-lg border border-gray-200 p-6 w-1/2 flex items-center space-x-4"
        >
          <i :class="card.icon" class="text-gray-500 text-4xl"></i>
          <div class="text-right ml-auto">
            <h2 class="text-xl font-semibold text-gray-700 mb-2">
              {{ card.label }}
            </h2>
            <p class="text-3xl font-semibold">{{ card.value }}</p>
          </div>
        </div>
      </div>

      <!-- Academic Chart -->
      <div
        class="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6"
      >
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">
          Academic Progress
        </h2>
        <div style="width: 100%; height: 500px">
          <canvas id="academicGroupedBarChart"></canvas>
        </div>
      </div>

      <!-- Recently Added Faculties & Grades Summary -->
      <div class="flex gap-6 mb-6 mt-6">
        <div
          class="flex-1 bg-white rounded-lg shadow-lg border border-gray-200 p-6"
        >
          <h2 class="text-xl font-semibold text-gray-700 mb-4">
            Recently Added Faculties
          </h2>
          <table id="faculty-table" class="w-full table-auto border-collapse">
            <thead>
              <tr class="bg-gray-100">
                <th class="border-b border-gray-300 px-4 py-2 text-left">
                  Name
                </th>
                <th class="border-b border-gray-300 px-4 py-2 text-left">
                  Email
                </th>
                <th class="border-b border-gray-300 px-4 py-2 text-left">
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(faculty, index) in faculties" :key="index">
                <td class="border-b border-gray-300 px-4 py-2">
                  {{ faculty.name }}
                </td>
                <td class="border-b border-gray-300 px-4 py-2">
                  {{ faculty.email }}
                </td>
                <td class="border-b border-gray-300 px-4 py-2">
                  {{ faculty.role }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex-1 bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-700 mb-8">
            Summary of Grades Approval
          </h2>
          <div class="flex justify-center items-center">
            <canvas
              id="statusPieChart"
              style="width: 370px; height: 370px"
            ></canvas>
          </div>
        </div>

        
      </div>
    </div>

    <!-- Admin Dashboard -->
    <div v-else-if="selectedDashboard === 'admin'">
      <div class="flex justify-between gap-4 w-full mb-6">
        <div
          v-for="(admincard, index) in admincards"
          :key="index"
          class="bg-white rounded-lg shadow-lg border border-gray-200 p-6 w-1/4 flex items-center space-x-4"
        >
          <i :class="admincard.icon" class="text-gray-500 text-4xl"></i>
          <div class="text-right ml-auto">
            <h2 class="text-xl font-semibold text-gray-700 mb-2">
              {{ admincard.label }}
            </h2>
            <p class="text-3xl font-semibold">{{ admincard.value }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">
          Total Students Per Grade
        </h2>
        <div style="width: 100%; height: 500px">
          <canvas id="totalStudentsChart"></canvas>
        </div>
      </div>

      <div class="flex gap-6 mb-6 mt-6">
        <div
          class="flex-1 bg-white rounded-lg shadow-lg border border-gray-200 p-6"
        >
          <h2 class="text-xl font-semibold text-gray-700 mb-4">
            Recently Added Students
          </h2>
          <table id="students-table" class="w-full table-auto border-collapse">
            <thead>
              <tr class="bg-gray-100">
                <th class="border-b border-gray-300 px-4 py-2 text-left">LRN</th>
                <th class="border-b border-gray-300 px-4 py-2 text-left">Name</th>
                <th class="border-b border-gray-300 px-4 py-2 text-left">Gender</th>
                <!-- <th class="border-b border-gray-300 px-4 py-2 text-left">Age</th> -->
                <th class="border-b border-gray-300 px-4 py-2 text-left">Grade Level</th>
                <th class="border-b border-gray-300 px-4 py-2 text-left">Track</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(student, index) in latestStudents" :key="index">
                <td class="border-b border-gray-300 px-4 py-2">{{ student.LRN }}</td>
                <td class="border-b border-gray-300 px-4 py-2">{{ student.FirstName + ' ' + student.MiddleName + ' ' + student.LastName }}</td>
                <td class="border-b border-gray-300 px-4 py-2">{{ student.Sex }}</td>
                <!-- <td class="border-b border-gray-300 px-4 py-2">{{ student.age }}</td> -->
                <td class="border-b border-gray-300 px-4 py-2">{{ student.Grade_Level }}</td>
                <td class="border-b border-gray-300 px-4 py-2">{{ student.Track }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex-1 bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-700 mb-10">
            Total Submitted Students
          </h2>

          <div class="flex justify-center items-center" style="width: 100%; height: 400px">
            <canvas id="submissionStatusChart"></canvas>
          </div>
        </div>
      </div>

       <div class="flex gap-6 mb-6 mt-6">
        <div class="flex-1 bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">
            Pending Classes Approval
          </h2>
          <div class="flex justify-center items-center" style="width: 100%; height: 500px">
            <canvas id="studentsPieChart"></canvas>
          </div>

        </div>

        <div class="flex-1 bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">
            Recently Submitted Classes
          </h2>
          <table class="w-full text-left border-collapse">
            <thead>
              <tr>
                <th class="border-b border-gray-300 px-4 py-2">Grade Level</th>
                <th class="border-b border-gray-300 px-4 py-2">Track</th>
                <th class="border-b border-gray-300 px-4 py-2">Section</th>
                <th class="border-b border-gray-300 px-4 py-2">Adviser</th>
                <th class="border-b border-gray-300 px-4 py-2">No. of Students</th>
                <th class="border-b border-gray-300 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in classes" :key="index" class="border-b border-gray-200">
                <td class="px-4 py-2 text-center">{{ item.Grade_Level }}</td>
                <td class="px-4 py-2 text-center">{{ item.Track }}</td>
                <td class="px-4 py-2 text-center">{{ item.Section }}</td>
                <td class="px-4 py-2">{{ item.adviser }}</td>
                <td class="px-4 py-2 text-center">{{ item.student_classes_count }}</td>
                <td class="px-4 py-2 text-center flex justify-center">
                  <span
                    :class="[
                      'w-20 text-center px-3 py-1 rounded-md text-sm text-white',
                      item.Status === 'Accepted' ? 'bg-green-900' : 'bg-red-600'
                    ]"
                  >
                    {{ item.Status.charAt(0).toUpperCase() + item.Status.slice(1) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>  
    </div>
  </div>
</template>

<script>
  import { Chart, registerables } from 'chart.js';
  import { getStudentCount, getAcceptedClassesCount, getAcceptedStudentsPerGrade, getSubmissionStatusCounts, getLatestStudents, fetchPendingCount, fetchPendingStudentCount, fetchPendingCountPerGrade   } from '@/service/adminDashboardService';
  import { getClassesExcludingIncomplete } from '@/service/teacherSubjectsService';
  import { getSummaryStats, getRecentFaculties, getStudentCountPerGradeLevel, getStudentStatusCounts } from '@/service/superadminService';

  Chart.register(...registerables);

  export default {
    name: 'Dashboard',
    data() {
      return {
        selectedDashboard: 'teacher',
        totalStudentsChartInstance: null,
        submissionStatusChartInstance: null,
        studentsPieChartInstance: null,
        academicGroupedBarChartInstance: null,
        statusPieChartInstance: null,
        totalSubmittedStudents: 0,
        latestStudents: [],
        classes: [],
        students: [],
        
        // Teacher Data
      cards: [
        { label: 'Total Teachers', value: 0, icon: 'fas fa-chalkboard-teacher' },
        { label: 'Total Students', value: 0, icon: 'fas fa-users' },
        { label: 'Pending Grades', value: 0, icon: 'fas fa-tasks' },
      ],
      // Academic Progress
      academicProgress: [],

        faculties: [
          {
            name: 'Alice Johnson',
            email: 'alice.johnson@example.com',
            role: 'Admin',
          },
        ],
        // Admin Data
        admincards: [
          { label: 'Total Classes', value: 0, icon: 'fas fa-chalkboard-teacher' },
          { label: 'Total Students', value: 0, icon: 'fas fa-users' },
          { label: 'Pending Classes', value: 0, icon: 'fas fa-hourglass-half' },
          { label: 'Pending Students', value: 50, icon: 'fas fa-user-clock' }
        ],
        totalStudentsPerGrade: [
          { grade: 'Grade 7', students: 0 },
          { grade: 'Grade 8', students: 0 },
          { grade: 'Grade 9', students: 0 },
          { grade: 'Grade 10', students: 0 },
          { grade: 'Grade 11', students: 0 },
          { grade: 'Grade 12', students: 0 },
        ],
        students: [
          { lrn: "1000000001", name: "Juan Dela Cruz", gender: "Male", age: 16, gradeLevel: "Grade 10", track: "STEM" },
          { lrn: "1000000002", name: "Maria Clara", gender: "Female", age: 17, gradeLevel: "Grade 11", track: "ABM" },
          { lrn: "1000000003", name: "Pedro Penduko", gender: "Male", age: 18, gradeLevel: "Grade 12", track: "HUMSS" },
        ],
        pendingClassesData: [
          { grade: 'Grade 7', students: 110 },
          { grade: 'Grade 8', students: 95 },
          { grade: 'Grade 9', students: 130 },
          { grade: 'Grade 10', students: 125 },
          { grade: 'Grade 11', students: 105 },
          { grade: 'Grade 12', students: 115 },
        ],
          classesData: [
        ],
      };
    },
    watch: {
      selectedDashboard(newVal) {
        if (newVal === 'teacher') {
          this.$nextTick(() => {
            this.renderGroupedBarChart();
            this.renderStatusPieChart();
          });
        }
        if (newVal === 'admin') {
          this.$nextTick(() => {
            this.renderTotalStudentsChart();
            this.renderSubmissionStatusChart();
            this.renderStudentsPieChart();
            this.fetchStudentCount();
            this.fetchAcceptedClassesCount();
            this.updateTotalStudentsPerGrade(); 
            this.fetchAndRenderSubmissionStatus();
            this.fetchLatestStudents();
            this.fetchClasses();
            this.fetchPendingClassesCount();
                 fetchPendingCountPerGrade();  // logs from inside service will appear in console
  fetchPendingStudentCount();
          });
        }
      },
    },
    mounted() {
  if (this.selectedDashboard === 'teacher') {
        this.fetchSummaryStats();
        this.fetchRecentFaculties();
        this.fetchStudentCountsByGradeLevel();
        this.fetchStatusCounts();

       
        this.renderGroupedBarChart();
        this.renderStatusPieChart();
      }
      if (this.selectedDashboard === 'admin') {
    this.renderTotalStudentsChart();
    this.renderSubmissionStatusChart();
    this.renderStudentsPieChart();
    this.fetchStudentCount();
    this.fetchAcceptedClassesCount();
    this.updateTotalStudentsPerGrade(); 
    this.fetchAndRenderSubmissionStatus();
    this.fetchLatestStudents();
    this.fetchClasses();
    this.fetchPendingClassesCount();
    this.fetchPendingClassesPerGrade();  // <== call this method
    this.fetchPendingStudentsCount();    // <== call this method
  }
},
watch: {
  selectedDashboard(newVal) {
    if (newVal === 'admin') {
      this.$nextTick(() => {
        this.renderTotalStudentsChart();
        this.renderSubmissionStatusChart();
        this.renderStudentsPieChart();
        this.fetchStudentCount();
        this.fetchAcceptedClassesCount();
        this.updateTotalStudentsPerGrade(); 
        this.fetchAndRenderSubmissionStatus();
        this.fetchLatestStudents();
        this.fetchClasses();
        this.fetchPendingClassesCount();
        this.fetchPendingClassesPerGrade();  // <== call here
        this.fetchPendingStudentsCount();    // <== call here
      });
    }
  }
},
    methods: {
      // Admin
async fetchPendingClassesPerGrade() {
  try {
    const data = await fetchPendingCountPerGrade();
    console.log("Pending classes per grade data:", data);

    // Transform the API response to your existing pendingClassesData format
    this.pendingClassesPerGrade = data.map(item => ({
      grade: `Grade ${item.Grade_Level}`,
      students: item.count,
    }));
  
    // Update the chart data source and rerender the pie chart
    this.pendingClassesData = [...this.pendingClassesPerGrade]; // update reactive data used by chart
    this.renderStudentsPieChart();
  } catch (error) {
    console.error("Error fetching pending classes per grade:", error);
  }
},

async fetchPendingStudentsCount() {
  try {
    const count = await fetchPendingStudentCount();  // your service function that calls API
    console.log("Pending students count:", count);

const pendingStudentCard  = this.admincards.find(card => card.label === 'Pending Students');
    if (pendingStudentCard) {
      pendingStudentCard.value = count;  // <-- update the value here
    }
  } catch (error) {
    console.error("Failed to fetch pending students count:", error);
  }
},

      renderTotalStudentsChart() {
        const ctx = document.getElementById('totalStudentsChart').getContext('2d');

        // Destroy previous instance if exists
        if (this.totalStudentsChartInstance) {
          this.totalStudentsChartInstance.destroy();
        }

        // Create new chart instance and store it
        this.totalStudentsChartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: this.totalStudentsPerGrade.map(item => item.grade),
            datasets: [{
              label: 'Total Students',
              data: this.totalStudentsPerGrade.map(item => item.students),
              backgroundColor: 'rgba(59, 130, 246, 0.8)', 
              borderRadius: 5,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 10,
                },
              },
            },
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  usePointStyle: true,
                  pointStyle: 'circle',
                  font: {
                    size: 14,
                    family: 'Arial, sans-serif',
                    weight: 'bold',
                  },
                },
              },
              tooltip: {
                enabled: true,
              },
            },
          },
        });
      },

      async fetchAndRenderSubmissionStatus() {
        try {
          const statusCounts = await getSubmissionStatusCounts();
          console.log('status counts:', statusCounts);  // Just to verify the data shape
          this.renderSubmissionStatusChart(statusCounts);
        } catch (error) {
          console.error('Failed to fetch submission status counts:', error);
        }
      },

      renderSubmissionStatusChart(statusCounts) {
        if (!statusCounts) {
          console.error('No data to render chart');
          return;
        }

        const maleData = [
          statusCounts.Male?.Accepted || 0,
          statusCounts.Male?.Pending || 0,
          statusCounts.Male?.Declined || 0,
        ];

        const femaleData = [
          statusCounts.Female?.Accepted || 0,
          statusCounts.Female?.Pending || 0,
          statusCounts.Female?.Declined || 0,
        ];

        const ctx = document.getElementById('submissionStatusChart').getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Approved', 'Pending', 'Declined'],
            datasets: [
              {
                label: 'Male',
                data: maleData,
                backgroundColor: 'rgba(255, 206, 86, 0.8)',
              },
              {
                label: 'Female',
                data: femaleData,
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 5,
                },
              },
            },
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  usePointStyle: true,
                  pointStyle: 'circle',
                  font: {
                    size: 14,
                    family: 'Arial, sans-serif',
                    weight: 'bold',
                  },
                },
              },
              tooltip: {
                enabled: true,
              },
            },
          },
        });
      },

      renderStudentsPieChart() {
    const ctx = document.getElementById('studentsPieChart').getContext('2d');

    // Destroy previous instance if it exists
    if (this.studentsPieChartInstance) {
      this.studentsPieChartInstance.destroy();
    }

    this.studentsPieChartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.pendingClassesData.map(item => item.grade),
        datasets: [{
          data: this.pendingClassesData.map(item => item.students),
          backgroundColor: [
            '#3B82F6', // Blue
            '#10B981', // Green
            '#F59E0B', // Amber
            '#EF4444', // Red
            '#8B5CF6', // Purple
            '#EC4899', // Pink
          ],
          borderColor: '#fff',
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {
                size: 16,
                family: 'Arial, sans-serif',
                weight: 'bold',
              },
              usePointStyle: true,
              pointStyle: 'rect',
            },
          },
          tooltip: {
            enabled: true,
          },
        },
      },
    });
  },

      async fetchStudentCount() {
        try {
          const count = await getStudentCount();
          const studentCard = this.admincards.find(card => card.label === 'Total Students');
          if (studentCard) {
            studentCard.value = count;
          }
        } catch (error) {
          console.error("Could not update total students card:", error);
        }
      },

      async fetchAcceptedClassesCount() {
        try {
          const count = await getAcceptedClassesCount();
          const classCard = this.admincards.find(card => card.label === 'Total Classes');
          if (classCard) {
            classCard.value = count;
          }
        } catch (error) {
          console.error("Could not update total classes card:", error);
        }
      }, 

      async updateTotalStudentsPerGrade() {
        try {
          const data = await getAcceptedStudentsPerGrade();
          
          this.totalStudentsPerGrade = [
            { grade: 'Grade 7', students: 0 },
            { grade: 'Grade 8', students: 0 },
            { grade: 'Grade 9', students: 0 },
            { grade: 'Grade 10', students: 0 },
            { grade: 'Grade 11', students: 0 },
            { grade: 'Grade 12', students: 0 },
          ].map(entry => {
            const found = data.find(item => item.Grade_Level === entry.grade.replace('Grade ', ''));
            return {
              grade: entry.grade,
              students: found ? found.count : 0
            };
          });

          // Re-render chart with updated data
          this.renderTotalStudentsChart();
        } catch (error) {
          console.error('Error fetching accepted students per grade:', error);
        }
      },

      async fetchLatestStudents() {
        try {
          const students = await getLatestStudents();
          console.log('Latest students:', students); // For debugging
          this.latestStudents = students;
        } catch (error) {
          console.error('Error fetching latest students:', error);
        }
      },

        async fetchClasses() {
          try {
            const response = await getClassesExcludingIncomplete();

            // Step 1: Sort by created_at in descending order
            const sorted = response.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            // Step 2: Take the latest 10
            const latestTen = sorted.slice(0, 10);

            // Step 3: Format the adviser full name
            this.classes = latestTen.map((item) => {
              const adviser = item.student_classes?.[0]?.adviser;
              const adviserFullName = adviser
                ? `${adviser.FirstName} ${adviser.LastName}`.trim()
                : 'N/A';

              return {
                ...item,
                adviser: adviserFullName,
              };
            });

            console.log('Fetched and processed classes (latest 10):', this.classes);
          } catch (error) {
            console.error('Failed to fetch classes:', error);
          }
        },

        async fetchPendingClassesCount() {
          try {
            const count = await fetchPendingCount();
            const card = this.admincards.find(card => card.label === 'Pending Classes');
            if (card) {
              card.value = count;
            }
          } catch (error) {
            console.error("Failed to fetch pending classes count:", error);
          }
        },


      
      // Teacher
      renderGroupedBarChart() {
        const ctx = document.getElementById('academicGroupedBarChart').getContext('2d');

        if (this.academicChart) {
          this.academicChart.destroy();
        }

        this.academicChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: this.academicProgress.map((item) => item.grade),
            datasets: [
              {
                label: 'Very Good (90-100)',
                data: this.academicProgress.map((item) => item.veryGood),
                backgroundColor: 'rgba(34, 197, 94, 0.8)', // Green
              },
              {
                label: 'Good (75-89)',
                data: this.academicProgress.map((item) => item.good),
                backgroundColor: 'rgba(59, 130, 246, 0.8)', // Blue
              },
              {
                label: 'Failed (60-74)',
                data: this.academicProgress.map((item) => item.failed),
                backgroundColor: 'rgba(239, 68, 68, 0.8)', // Red
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false, // Fill container
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  usePointStyle: true,
                  pointStyle: 'circle',
                  font: {
                    size: 14,
                    family: 'Arial, sans-serif',
                    weight: 'bold',
                  },
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 5,
                },
              },
            },
          },
        });
      },


renderStatusPieChart() {
  if (!this.statusCounts) return;

  const { approved = 0, pending = 0, decline = 0 } = this.statusCounts;

  const ctx = document.getElementById('statusPieChart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Accepted', 'Pending', 'Decline'],
      datasets: [
        {
          data: [approved, pending, decline],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',   // Approved
            'rgba(255, 165, 0, 0.8)',   // Pending
            'rgba(239, 68, 68, 0.8)',   // Declined
          ],
          borderColor: 'white',
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            font: {
              size: 18,
              family: 'Arial, sans-serif',
              weight: 'bold',
            },
            usePointStyle: true,
            pointStyle: 'rect',
          },
        },
        tooltip: {
          enabled: true,
        },
      },
    },
  });
},


// Teacher Dashboard
      async fetchSummaryStats() {
        try {
          const response = await getSummaryStats();
          const stats = response.data;

          this.cards.forEach(card => {
            if (card.label === 'Total Teachers') {
              card.value = stats.total_teachers;
            } else if (card.label === 'Total Students') {
              card.value = stats.total_students;
            } else if (card.label === 'Pending Grades') {
              card.value = stats.pending_grades;
            }
          });
        } catch (error) {
          console.error('Error loading summary stats:', error);
        }
      },

    async fetchRecentFaculties(limit = 5) {
      try {
        const result = await getRecentFaculties(limit);
        this.faculties = result.data.map(teacher => ({
          name: `${teacher.FirstName} ${teacher.LastName}`,
          email: teacher.Email,
          role: teacher.Position,
        }));
      } catch (error) {
        console.error('Error loading recent faculties:', error);
      }
    },

    async fetchStudentCountsByGradeLevel() {
      try {
        const result = await getStudentCountPerGradeLevel();

        this.academicProgress = result.map(item => ({
          grade: `Grade ${item.Grade_Level}`,
          veryGood: parseInt(item.very_good),
          good: parseInt(item.good),
          failed: parseInt(item.failed),
        }));

        this.renderGroupedBarChart();  // <-- Use the correct method name here

      } catch (error) {
        console.error("Error loading student counts by grade level:", error);
      }
    },

async fetchStatusCounts() {
  try {
    const result = await getStudentStatusCounts();

    // Default all keys
    this.statusCounts = {
      approved: 0,
      pending: 0,
      decline: 0, // ✅ matches your chart data order
    };

    result.forEach(item => {
      const key = item.Status.toLowerCase(); // 'approved', 'pending', 'decline'
      if (this.statusCounts.hasOwnProperty(key)) {
        this.statusCounts[key] = parseInt(item.total, 10);
      }
    });
    this.renderStatusPieChart(); // <- make sure to call it here!
  } catch (error) {
    console.error("Error loading status counts:", error);
  }
},






      

    },
  };


</script>

<style scoped>
.filters {
  display: flex;
  gap: 10px;
} 

.filter-dropdown {
  padding: 15px 20px;
  width: 210px;
  border: 1px solid #295f98;
  border-radius: 5px;
  font-size: 14px;
  background: #fff;
  font-weight: bold;
  color: #295f98;
  cursor: pointer;
  appearance: none;
  position: relative;
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 30px;
  transition: all 0.3s ease-in-out;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' fill='%23295f98'><path d='M7 10l5 5 5-5H7z'/></svg>");
}

.filter-dropdown:focus {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' fill='%23295f98'><path d='M7 14l5-5 5 5H7z'/></svg>");
}

</style>
