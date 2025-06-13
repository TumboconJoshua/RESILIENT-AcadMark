<template>
    <div class="w-full">
        <div class="flex items-center space-x-6 mb-6">
            <h1 class="text-5xl font-bold text-[#295f98]">Record</h1>
        </div>

       <div class="bg-white border border-gray-200 shadow-lg rounded-lg p-6 flex flex-col mb-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4 space-x-4">
        <div class="flex flex-wrap gap-5">
            <Dropdown :showGrade="true" v-model="selectedGrade" />
            <Dropdown :showAcademicTrack="true" v-model="selectedAcademicTrack" />
        </div>

        <div class="w-[30%]">
            <Searchbar v-model="searchQuery" />
        </div>
    </div>

    <!-- Table Area -->
    <div class="flex-1 overflow-auto">
        <table class="w-full border-collapse text-center text-sm">
            <thead class="bg-gray-100 text-[#464F60] text-[15px] font-semibold">
                <tr>
                    <th class="p-2">Grade Level</th>
                    <th class="p-2">LRN</th>
                    <th class="p-2">Name</th>
                    <th class="p-2">Curriculum</th>
                    <th class="p-2">Track</th>
                    <th class="p-2">Section</th>
                    <th class="p-2">Gender</th>
                    <th class="p-2">Birthdate</th>
                    <th class="p-2">Age</th>
                </tr>
            </thead>
            <tbody class="font-medium text-[15px]">
                <tr v-if="filteredStudents.length === 0">
                    <td colspan="9" class="p-2 text-center">No students available.</td>
                </tr>
                <tr v-for="student in paginatedStudents" :key="student.lrn" class="hover:bg-gray-200">
                    <td class="p-2">{{ student.gradeLevel }}</td>
                    <td class="p-2">{{ student.lrn }}</td>
                    <td class="p-2">{{ student.fullName }}</td>
                    <td class="p-2">{{ student.curriculum }}</td>
                    <td class="p-2">{{ student.track }}</td>
                    <td class="p-2">{{ student.section || '-' }}</td>
                    <td class="p-2">{{ student.sex }}</td>
                    <td class="p-2">{{ student.birthdate }}</td>
                    <td class="p-2">{{ student.age }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Pagination (now follows table naturally) -->
    <div class="flex justify-center items-center pt-4 border-t border-gray-300 space-x-1">
        <button
            class="w-28 px-3 border border-[#295F98] text-[#295F98] py-1 rounded disabled:opacity-50 flex items-center justify-center gap-1"
            :disabled="currentPage === 1"
            @click="currentPage--"
        >
            <span>←</span>
            <span>Previous</span>
        </button>
        <button
            v-for="page in pageNumbers"
            :key="page"
            class="py-1 border border-[#295F98] rounded w-10 text-center"
            :class="{
                'bg-[#295F98] text-white': page === currentPage,
                'text-gray-600': page !== currentPage,
                'cursor-default': page === '...',
                'cursor-pointer': page !== '...'
            }"
            @click="page !== '...' && (currentPage = page)"
            :disabled="page === '...'"
        >
            {{ page }}
        </button>
        <button
            class="w-28 px-3 border border-[#295F98] text-[#295F98] py-1 rounded disabled:opacity-50 flex items-center justify-center gap-1"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
        >
            <span>Next</span>
            <span>→</span>
        </button>
    </div>
</div>


    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import Dropdown from '@/components/dropdown.vue';
import Searchbar from '@/components/searchbar.vue';
import { getAllAcceptedStudents } from '@/service/studentService'

const selectedGrade = ref('');
const selectedAcademicTrack = ref('');
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

const students = ref([]);

onMounted(async () => {
    try {
        const response = await getAllAcceptedStudents();
        students.value = response.students.map((student) => ({
            gradeLevel: student.Grade_Level,
            lrn: student.LRN,
            fullName: `${student.FirstName} ${student.MiddleName || ''} ${student.LastName}`.trim(),
            curriculum: student.Curriculum,
            track: student.Track,
            section: student.Section || null,
            sex: student.Sex,
            birthdate: student.BirthDate,
            age: student.Age,
            student_id: student.Student_ID,
        }));

        console.log("DATA:", students.value);
    } catch (error) {
        console.error('Failed to fetch students:', error);
    }
});

const filteredStudents = computed(() => {
    let filtered = students.value.filter(student => {
        const matchesGrade = !selectedGrade.value || student.gradeLevel === selectedGrade.value;
        const matchesTrack = !selectedAcademicTrack.value || student.track === selectedAcademicTrack.value;

        return matchesGrade && matchesTrack;
    });

    if (searchQuery.value) {
        const searchLower = searchQuery.value.toLowerCase();
        filtered = filtered.filter(student =>
            student.fullName.toLowerCase().includes(searchLower) ||
            String(student.lrn).toLowerCase().includes(searchLower)
        );
    }

    return filtered;
});

const totalPages = computed(() => Math.ceil(filteredStudents.value.length / itemsPerPage));

const paginatedStudents = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredStudents.value.slice(start, end);
});

const pageNumbers = computed(() => {
    const pages = [];
    const total = totalPages.value;
    const current = currentPage.value;

    if (total <= 7) {
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
    } else {
        if (current <= 4) {
            pages.push(1, 2, 3, 4, 5, '...', total);
        } else if (current >= total - 3) {
            pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
        } else {
            pages.push(1, '...', current - 1, current, current + 1, '...', total);
        }
    }

    return pages;
});

// Reset to first page when filters change
watch([selectedGrade, selectedAcademicTrack, searchQuery], () => {
    currentPage.value = 1;
});

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
