<template>
  <div>
    <h1 class="text-5xl font-bold mb-6">Dashboard</h1>
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
    <!-- Error State -->
    <div v-else-if="error" class="text-red-500 text-center p-4">
      {{ error }}
    </div>
    <!-- Content -->
    <div v-else>
      <!-- First container with 3 cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-lg border border-gray-300 shadow-md p-6">
          <h2 class="text-2xl font-semibold text-right mb-8">Total Students</h2>
          <div class="flex items-center justify-between">
            <p class="text-4xl font-semibold">{{ stats.students }}</p>
            <i class="fas fa-users text-5xl"></i>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-300 shadow-md p-6">
          <h2 class="text-2xl font-semibold text-right mb-8">Total Teachers</h2>
          <div class="flex items-center justify-between">
            <p class="text-4xl font-semibold">{{ stats.teachers }}</p>
            <i class="fas fa-chalkboard-teacher text-5xl"></i>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-300 shadow-md p-6">
          <h2 class="text-2xl font-semibold text-right mb-8">Total Classes</h2>
          <div class="flex items-center justify-between">
            <p class="text-4xl font-semibold">{{ stats.classes }}</p>
            <i class="fas fa-chalkboard text-5xl"></i>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg border border-gray-300 shadow-md p-6">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl font-semibold text-left">
              Students Gender Distribution
            </h2>
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-blue-500 rounded-sm"></div>
                <span class="text-sm text-gray-700">Male</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-[#10b981] rounded-sm"></div>
                <span class="text-sm text-gray-700">Female</span>
              </div>
            </div>
          </div>
          <div class="h-[500px] relative">
            <canvas id="genderChart"></canvas>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-300 shadow-md p-6">
          <h2 class="text-2xl font-semibold text-left mb-8">
            Total Student per Grade
          </h2>
          <div class="flex flex-col md:flex-row items-center justify-center gap-8">
            <!-- Pie Chart -->
            <div class="relative w-full md:w-1/2 h-[400px]">
              <canvas id="gradeChart"></canvas>
            </div>

            <!-- Custom Legend -->
            <ul id="gradeLegend" class="space-y-2 text-sm">
              <li class="flex items-center gap-2">
                <span class="w-4 h-4 bg-[#3b82f6] inline-block rounded-sm"></span>
                Grade 7
              </li>
              <li class="flex items-center gap-2">
                <span class="w-4 h-4 bg-[#10b981] inline-block rounded-sm"></span>
                Grade 8
              </li>
              <li class="flex items-center gap-2">
                <span class="w-4 h-4 bg-[#facc15] inline-block rounded-sm"></span>
                Grade 9
              </li>
              <li class="flex items-center gap-2">
                <span class="w-4 h-4 bg-[#f97316] inline-block rounded-sm"></span>
                Grade 10
              </li>
              <li class="flex items-center gap-2">
                <span class="w-4 h-4 bg-[#ec4899] inline-block rounded-sm"></span>
                Grade 11
              </li>
              <li class="flex items-center gap-2">
                <span class="w-4 h-4 bg-[#8b5cf6] inline-block rounded-sm"></span>
                Grade 12
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-300 shadow-md p-6 mt-6 h-[530px] flex flex-col mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 class="text-2xl font-semibold text-left">
            Recently Added Students
          </h2>
          <div class="filters flex flex-wrap gap-4">
            <select v-model="selectedGrade" class="filter-dropdown">
              <option value="">All Grades</option>
              <option v-for="grade in gradeOptions" :key="grade" :value="grade">
                {{ grade }}
              </option>
            </select>

            <select v-model="selectedTrack" class="filter-dropdown">
              <option value="">All Tracks</option>
              <option v-for="track in trackOptions" :key="track" :value="track">
                {{ track }}
              </option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left font-medium text-gray-700">LRN</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">
                  Full Name
                </th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">
                  Gender
                </th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">Age</th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">
                  Grade Level
                </th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">
                  Curriculum
                </th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">
                  Track
                </th>
                <th class="px-4 py-2 text-left font-medium text-gray-700">
                  Date Added
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="student in filteredStudents" :key="student.lrn">
                <td class="px-4 py-2">{{ student.lrn }}</td>
                <td class="px-4 py-2">{{ student.fullName }}</td>
                <td class="px-4 py-2">{{ student.gender }}</td>
                <td class="px-4 py-2">{{ student.age }}</td>
                <td class="px-4 py-2">{{ student.gradeLevel }}</td>
                <td class="px-4 py-2">{{ student.curriculum }}</td>
                <td class="px-4 py-2">{{ student.track }}</td>
                <td class="px-4 py-2">{{ student.dateAdded }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-white rounded-lg border border-gray-300 shadow-md p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-left">Manage Class</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-100 text-sm">
                <tr>
                  <th class="px-4 py-2 text-left font-medium text-gray-700">
                    Grade Level
                  </th>
                  <th class="px-1 py-2 text-left font-medium text-gray-700">
                    Track
                  </th>
                  <th class="px-2 py-2 text-left font-medium text-gray-700">
                    Section
                  </th>
                  <th class="px-2 py-2 text-left font-medium text-gray-700">
                    Adviser
                  </th>
                  <th class="px-4 py-2 text-left font-medium text-gray-700">
                    No. Student
                  </th>
                  <th class="px-4 py-2 text-left font-medium text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 text-sm justify-center">
                <tr v-for="(item, index) in classes" :key="index">
                  <td class="px-4 py-2">{{ item.Grade_Level }}</td>
                  <td class="px-1 py-2">{{ item.Track }}</td>
                  <td class="px-2 py-2">{{ item.Section }}</td>
                  <td class="px-2 py-2">{{ item.adviser }}</td>
                  <td class="px-4 py-2">{{ item.student_classes_count }}</td>
                  <td class="px-4 py-2">
                    <span :class="item.Status === 'Accepted' ? 'bg-green-800' : 'bg-orange-600'
                      " class="text-white px-1 py-1 rounded-sm text-[11px] w-[60px] h-[20px] inline-block text-center">
                      {{ item.Status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex-1 bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">
            Total Submitted Students
          </h2>
          <div class="flex justify-center items-center" style="width: 100%; height: 400px">
            <canvas id="submissionStatusChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

import {
  getStudentCount,
  getTeacherCount,
  getStudentGradeDistribution,
  getStudentGenderDistribution,
  getAcceptedClassesCount,
  getLatestStudents,
  getSubmissionStatusCounts
} from '@/service/adminDashboardService';

import { getClassesExcludingIncomplete } from '@/service/teacherSubjectsService';

Chart.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

export default {
  name: 'Dashboard',
  data() {
    return {
      loading: true,
      error: null,
      _gradeChartInstance: null,
      _genderChartInstance: null,
      _submissionStatusChartInstance: null,
      stats: {
        students: 0,
        teachers: 0,
        classes: 0,
      },
      recentStudents: [],
      studentGrades: {},
      genderData: {},
      selectedGrade: '',
      selectedTrack: '',
      recentStudents: [],
      classes: [],
      gradeOptions: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
      trackOptions: ['HUMSS', 'TVL', 'SPJ', 'SPA', 'BEP'],
    };
  },
  computed: {
    uniqueStudents() {
      const seen = new Set();
      return this.recentStudents.filter((student) => {
        if (seen.has(student.lrn)) return false;
        seen.add(student.lrn);
        return true;
      });
    },
    filteredStudents() {
      return this.recentStudents.filter((student) => {
        const matchGrade =
          !this.selectedGrade || student.gradeLevel === this.selectedGrade;
        const matchTrack =
          !this.selectedTrack || student.track === this.selectedTrack;
        return matchGrade && matchTrack;
      });
    },
  },
  beforeDestroy() {
    // Clean up chart instances when component is destroyed
    if (this._gradeChartInstance) {
      this._gradeChartInstance.destroy();
      this._gradeChartInstance = null;
    }
    if (this._genderChartInstance) {
      this._genderChartInstance.destroy();
      this._genderChartInstance = null;
    }
    if (this._submissionStatusChartInstance) {
      this._submissionStatusChartInstance.destroy();
      this._submissionStatusChartInstance = null;
    }
  },
  async mounted() {
    try {
      this.loading = true;
      this.error = null;

      await Promise.all([
        this.fetchStats(),
        this.fetchStudentGradeDistribution(),
        this.fetchGenderDistribution(),
        this.fetchLatestStudents(),
        this.fetchClasses(),
        this.fetchSubmissionStatusCounts()
      ]);
    } catch (err) {
      this.error = err.message || 'An error occurred while loading data';
      console.error('Error loading dashboard data:', err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async fetchStats() {
      try {
        const studentCount = await getStudentCount();
        this.stats.students = studentCount;

        const teacherCount = await getTeacherCount();
        this.stats.teachers = teacherCount;

        const acceptedClassesCount = await getAcceptedClassesCount();
        this.stats.classes = acceptedClassesCount;

        console.log('Students:', studentCount, 'Teachers:', teacherCount, "Classes: ", acceptedClassesCount);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    },

    async fetchSubmissionStatusCounts() {
      try {
        const data = await getSubmissionStatusCounts(); // 🆕 API call
        this.renderSubmissionStatusChart(data); // 🆕 Dynamic rendering
      } catch (error) {
        console.error('Failed to fetch submission status counts:', error);
      }
    },

    async fetchStudentGradeDistribution() {
      try {
        const gradeDistributionData = await getStudentGradeDistribution();
        this.studentGrades = gradeDistributionData;
        console.log('Grade distribution data:', gradeDistributionData);
        this.renderGradeChart();
      } catch (error) {
        console.error('Failed to fetch student grade distribution:', error);
      }
    },

    async fetchGenderDistribution() {
      try {
        const genderDistributionData = await getStudentGenderDistribution();
        this.genderData = genderDistributionData;
        console.log('Gender distribution data:', genderDistributionData);
        this.renderGenderChart();
      } catch (error) {
        console.error('Failed to fetch gender distribution:', error);
      }
    },

    async fetchLatestStudents() {
      try {
        const latestStudentsData = await getLatestStudents();

        this.recentStudents = latestStudentsData.map(student => {
          const fullName = `${student.FirstName} ${student.MiddleName || ''} ${student.LastName}`.trim();

          return {
            lrn: student.LRN,
            fullName,
            gender: student.Sex === 'M' ? 'Male' : 'Female',
            age: student.Age,
            gradeLevel: `Grade ${student.Grade_Level}`,
            curriculum: student.Curriculum,
            track: student.Track,
            dateAdded: new Date(student.created_at).toLocaleDateString()
          };
        });

        console.log('Mapped recent students:', this.recentStudents);
      } catch (error) {
        console.error('Failed to fetch latest students:', error);
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
            ? `${adviser.FirstName} ${adviser.MiddleName || ''} ${adviser.LastName}`.trim()
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

    renderGenderChart() {
      // Wait for next tick to ensure DOM is updated
      this.$nextTick(() => {
        const canvas = document.getElementById('genderChart');
        if (!canvas) {
          console.warn('Gender chart canvas element not found, retrying in 100ms');
          setTimeout(() => this.renderGenderChart(), 100);
          return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          console.warn('Gender chart canvas context not found');
          return;
        }

        // Destroy existing instance if it exists
        if (this._genderChartInstance) {
          this._genderChartInstance.destroy();
          this._genderChartInstance = null;
        }

        const data = [
          this.genderData.JHS_M || 0,
          this.genderData.JHS_F || 0,
          this.genderData.SHS_M || 0,
          this.genderData.SHS_F || 0,
        ];

        console.log('Gender Chart Data:', data);

        // Create new chart instance
        this._genderChartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['JHS Male', 'JHS Female', 'SHS Male', 'SHS Female'],
            datasets: [
              {
                label: 'Number of Students',
                data,
                backgroundColor: ['#3b82f6', '#10b981', '#3b82f6', '#10b981'],
                borderRadius: 6,
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
                  stepSize: 1
                }
              },
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                enabled: true,
                callbacks: {
                  label: function (context) {
                    return `Students: ${context.raw}`;
                  }
                }
              }
            },
          },
        });
      });
    },

    renderGradeChart() {
      // Wait for next tick to ensure DOM is updated
      this.$nextTick(() => {
        const canvas = document.getElementById('gradeChart');
        if (!canvas) {
          console.warn('Canvas element not found, retrying in 100ms');
          setTimeout(() => this.renderGradeChart(), 100);
          return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          console.warn('Canvas context not found');
          return;
        }

        const gradeLabels = [
          'Grade 7',
          'Grade 8',
          'Grade 9',
          'Grade 10',
          'Grade 11',
          'Grade 12',
        ];
        const backgroundColors = [
          '#3b82f6',
          '#10b981',
          '#facc15',
          '#f97316',
          '#ec4899',
          '#8b5cf6',
        ];
        const data = gradeLabels.map((label) => this.studentGrades[label] || 0);

        console.log('Chart Data:', data);

        if (this._gradeChartInstance) {
          this._gradeChartInstance.destroy();
        }

        this._gradeChartInstance = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: gradeLabels,
            datasets: [
              {
                data,
                backgroundColor: backgroundColors,
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
          },
        });
      });
    },

    renderSubmissionStatusChart(data) {
      const ctx = document.getElementById('submissionStatusChart')?.getContext('2d');
      if (!ctx) return;

      if (this._submissionStatusChartInstance) {
        this._submissionStatusChartInstance.destroy();
      }

      this._submissionStatusChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Accepted', 'Pending', 'Declined'],
          datasets: [
            {
              label: 'Male',
              data: [
                data.Male?.Accepted || 0,
                data.Male?.Pending || 0,
                data.Male?.Declined || 0
              ],
              backgroundColor: 'rgba(255, 206, 86, 0.8)',
            },
            {
              label: 'Female',
              data: [
                data.Female?.Accepted || 0,
                data.Female?.Pending || 0,
                data.Female?.Declined || 0
              ],
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
              ticks: { stepSize: 1 },
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
            tooltip: { enabled: true },
          },
        },
      });
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
  padding: 10px 15px;
  width: 150px;
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
