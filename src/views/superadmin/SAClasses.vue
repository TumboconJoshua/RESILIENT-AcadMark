<template>
  <div class="w-full">
    <div class="flex items-center space-x-6 mb-6">
      <h1 class="text-5xl font-bold text-[#295f98]">Classes</h1>
    </div>

    <div class="bg-white shadow-lg border border-gray-200 rounded-lg p-6 mb-6 flex flex-col" style="height: 865px;">
      <div class="flex flex-wrap justify-between items-center mb-4 gap-4">
        <!-- Filters on the left -->
        <div class="filters flex-wrap">
          <select class="filter-dropdown" v-model="filters.grade" @change="handleChange">
            <option value="">Grades (All)</option>
            <option v-for="grade in uniqueGrades" :key="grade" :value="grade">{{ grade }}</option>
          </select>

          <select class="filter-dropdown" v-model="filters.curriculum" @change="handleChange">
            <option value="">Curriculums (All)</option>
            <option v-for="curriculum in uniqueCurriculums" :key="curriculum" :value="curriculum">{{ curriculum }}
            </option>
          </select>

          <select class="filter-dropdown" v-model="filters.track" @change="handleChange">
            <option value="">Tracks (All)</option>
            <option v-for="track in uniqueTracks" :key="track" :value="track">{{ track }}</option>
          </select>

          <select class="filter-dropdown" v-model="filters.status" @change="handleChange">
            <option value="">Status (All)</option>
            <option v-for="status in uniqueStatuses" :key="status" :value="status">{{ status }}</option>
          </select>
        </div>

        <!-- Search bar on the right -->
        <div class="search-bar" style="position: relative; min-width: 200px; max-width: 300px; flex-shrink: 0;">
          <input type="text" placeholder="Search..." v-model="searchQuery" @input="handleChange"
            style="padding-left: 30px; width: 100%;" />
          <i class="fa fa-search"
            style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%); color: #888;"></i>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th class="border-b border-gray-300"></th>
              <th class="border-b border-gray-300">Grade Level</th>
              <th class="border-b border-gray-300">Curriculum</th>
              <th class="border-b border-gray-300">Track</th>
              <th class="border-b border-gray-300">Class Section</th>
              <th class="border-b border-gray-300">Class Advisory</th>
              <th class="border-b border-gray-300">Student Added</th>
              <th class="border-b border-gray-300">Date Added</th>
              <th class="border-b border-gray-300">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="personnel in paginatedPersonnel" :key="personnel.section + personnel.adviser"
              @click="openModal(personnel)" style="cursor: pointer;">
              <td class="px-6 py-4 border-b border-gray-300" @click.stop>
                <input type="checkbox" :value="personnel.class_id" v-model="checkedClasses" />
              </td>
              <td class="px-6 py-4 border-b border-gray-300">{{ personnel.grade }}</td>
              <td class="px-6 py-4 border-b border-gray-300">{{ personnel.curriculum }}</td>
              <td class="px-6 py-4 border-b border-gray-300">{{ personnel.track }}</td>
              <td class="px-6 py-4 border-b border-gray-300">{{ personnel.section }}</td>
              <td class="px-6 py-4 border-b border-gray-300">{{ personnel.adviser }}</td>
              <td class="px-6 py-4 border-b border-gray-300">{{ personnel.student }}</td>
              <td class="px-6 py-4 border-b border-gray-300">{{ personnel.date }}</td>
              <td class="px-6 py-4 border-b border-gray-300">
                <span :class="statusClass(personnel.status)">{{ personnel.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="button">
        <!-- <button class="red">Reject</button> -->
        <button @click="acceptCheckedClasses" class="green">Accept</button>
      </div>

      <div class="flex justify-center items-center mt-4 space-x-1 pt-4 border-t border-gray-300">
        <button
          class="px-3 border border-[#295F98] text-[#295F98] py-1 rounded w-28 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-1 cursor-pointer"
          @click="prevPage" :disabled="currentPage === 1">
          ← Previous
        </button>

        <button v-for="page in totalPages" :key="page" class="py-1 border border-[#295F98] rounded w-10 text-center"
          :class="[
            page === currentPage ? 'bg-[#295F98] text-white' : 'text-gray-600',
          ]" @click="currentPage = page">
          {{ page }}
        </button>

        <button
          class="px-3 border border-[#295F98] text-[#295F98] py-1 rounded w-28 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-1 cursor-pointer"
          @click="nextPage" :disabled="currentPage === totalPages">
          Next →
        </button>
      </div>
    </div>

    <!-- Modal uses v-model for visibility -->
    <ClassInfoModal v-model="isModalOpen" :classInfo="selectedClass" @submit="fetchClasses" />
  </div>
</template>

<script>
import { getClassesExcludingIncomplete } from "@/service/teacherSubjectsService";
import ClassInfoModal from "./components/ClassInfoModal.vue";
import { acceptClass } from '@/service/studentClassService';
import Swal from "sweetalert2";

export default {
  components: {
    ClassInfoModal,
  },
  data() {
    return {
      selectedClass: null,
      isModalOpen: false,
      rawClasses: [],
      checkedClasses: [],
      currentPage: 1,
      itemsPerPage: 10,
      searchQuery: "",
      filters: {
        grade: "",
        curriculum: "",
        track: "",
        status: "",
      },
    };
  },
  computed: {
    personnel() {
      return this.rawClasses
        .map((item) => {
          let adviserName = "N/A";

          if (item.adviser && item.adviser.FirstName) {
            adviserName = `${item.adviser.FirstName} ${item.adviser.MiddleName} ${item.adviser.LastName}`;
          } else if (Array.isArray(item.student_classes)) {
            const adviserFromStudents = item.student_classes.find(
              (sc) => sc.adviser && sc.adviser.FirstName
            );
            if (adviserFromStudents) {
              adviserName = `${adviserFromStudents.adviser.FirstName} ${adviserFromStudents.adviser.MiddleName} ${adviserFromStudents.adviser.LastName}`;
            }
          }

          return {
            class_id: item.Class_ID, // ✅ Add Class_ID here
            grade: item.Grade_Level,
            curriculum: item.Curriculum,
            track: item.Track,
            section: item.Section,
            adviser: adviserName,
            student: item.student_added ?? item.student_classes_count ?? 0,
            date: new Date(item.created_at).toLocaleDateString(),
            status: item.Status,
            comments: item.comments,
            subject_teachers: item.subject_teachers ?? [],
          };
        })
        .filter((item) => {
          const matchesGrade = this.filters.grade ? item.grade === this.filters.grade : true;
          const matchesCurriculum = this.filters.curriculum ? item.curriculum === this.filters.curriculum : true;
          const matchesTrack = this.filters.track ? item.track === this.filters.track : true;
          const matchesStatus = this.filters.status ? item.status === this.filters.status : true;
          const matchesSearch = Object.values(item).some((val) =>
            String(val).toLowerCase().includes(this.searchQuery.toLowerCase())
          );
          return matchesGrade && matchesCurriculum && matchesTrack && matchesStatus && matchesSearch;
        });
    },
    paginatedPersonnel() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.personnel.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.personnel.length / this.itemsPerPage);
    },
    uniqueGrades() {
      return [...new Set(this.rawClasses.map((c) => c.Grade_Level).filter(Boolean))];
    },
    uniqueCurriculums() {
      return [...new Set(this.rawClasses.map((c) => c.Curriculum).filter(Boolean))];
    },
    uniqueTracks() {
      return [...new Set(this.rawClasses.map((c) => c.Track).filter(Boolean))];
    },
    uniqueStatuses() {
      return [...new Set(this.rawClasses.map((c) => c.Status).filter(Boolean))];
    },
  },
  methods: {
    async fetchClasses() {
      try {
        const data = await getClassesExcludingIncomplete();
        this.rawClasses = data;
        console.log("DATA:!@#", this.rawClasses)
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      }
    },
    handleChange() {
      this.currentPage = 1;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    statusClass(status) {
      switch (status?.toLowerCase()) {
        case "accepted":
          return "text-green-600";
        case "pending":
          return "text-orange-600";
        case "declined":
          return "text-red-600";
        default:
          return "";
      }
    },
    openModal(personnel) {
      this.selectedClass = personnel;
      console.log("DATA:", this.selectedClass)
      this.isModalOpen = true;
    },

    async acceptCheckedClasses() {
      if (this.checkedClasses.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "No classes selected",
          text: "Please select at least one class.",
        });
        return;
      }

      const count = this.checkedClasses.length;

      const result = await Swal.fire({
        title: `Are you sure to accept ${count} class${count > 1 ? 'es' : ''}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, accept",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        try {
          await acceptClass(this.checkedClasses);
          Swal.fire({
            icon: "success",
            title: "Accepted!",
            text: `Successfully accepted ${count} class${count > 1 ? 'es' : ''}.`,
          });
          this.checkedClasses = [];
          await this.fetchClasses();
        } catch (error) {
          console.error("Failed to accept classes:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to accept classes.",
          });
        }
      }
    },
  },
  mounted() {
    this.fetchClasses();
  },
};
</script>

<style scoped>
/* Your styles unchanged */
.container {
  width: 125%;
  padding: 10px;
  box-sizing: border-box;
}

.nav-title h1 {
  color: #295f98;
  font-weight: bold;
  font-size: 48px;
  padding: 0;
  margin: 0;
}

.filters {
  display: flex;
  gap: 20px;
  flex-wrap: nowrap;
  align-items: center;
}

.filter-dropdown {
  padding: 10px 15px;
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

.search-bar {
  position: relative;
  margin-left: auto;
  width: 300px;
  position: relative;
  margin-left: auto; 
  width: 300px;
  margin-right: 15px;
}

.search-bar input { 
  padding: 8px 8px 8px 30px; /* left padding to fit icon */
  border: 1px solid #295f98;
  border-radius: 5px;
  width: 100%;
}

.search-bar i {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #295f98;
}

.table-container {
  flex: 1;
  margin-bottom: 16px;
  background: #fff;
  border-radius: 8px;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 700px;
  margin-top: 0;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 6px;
  text-align: left;
  font-weight: 500;
  font-size: 14px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

tr:hover {
  background-color: #f0f0f0;
}

.status {
  font-weight: bold;
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 12px;
  text-align: center;
  min-width: 70px;
}

.text-green-600 {
  color: #16a34a;
}

.text-red-600 {
  color: #dc2626;
}

.text-gray-600 {
  color: #4b5563;
}

.button {
    width: 100%;
    display: flex;
    justify-content: end;
    gap: 15px;
}
.red,
.green {
    padding: 5px 30px;
    align-items: center;
    color: #ffffff;
    border-radius: 5px;
    cursor: pointer;
}
.red {
    background-color: #D30000;
}
.red:hover {
  background-color: #D95353;
}
.green {
    background-color: #0C5A48;
}
.red:hover {
    background-color: #FF0000;
}
.green:hover {
    background-color: #0C5A48;
}

</style>
