<template>
    <div>
        <div class="p-7 rounded-t-xl" style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;">
            <div class="flex justify-between">
                <div class="flex flex-wrap gap-5">
                    <Dropdown :showGrade="true" v-model="selectedGrade" />
                    <Dropdown :showAcademicTrack="true" v-model="selectedAcademicTrack" />
                </div>

                <div class="w-[30%]">
                    <Searchbar v-model="searchQuery" />
                </div>
            </div>
        </div>

        <div class="p-7 rounded-t-xl mt-5" style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;">
            <div class="overflow-auto">
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
            <!-- Pagination Controls -->
            <div class="flex justify-between items-center mt-4 px-4">
                <div class="text-sm text-gray-600">
                    Showing {{ paginatedStudents.length }} of {{ filteredStudents.length }} entries
                </div>
                <div class="flex gap-2">
                    <button @click="currentPage--" :disabled="currentPage === 1"
                        class="px-3 py-1 rounded border border-gray-300 disabled:opacity-50">
                        Previous
                    </button>
                    <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="[
                        'px-3 py-1 rounded border',
                        currentPage === page
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-gray-300 hover:bg-gray-100'
                    ]">
                        {{ page }}
                    </button>
                    <button @click="currentPage++" :disabled="currentPage === totalPages"
                        class="px-3 py-1 rounded border border-gray-300 disabled:opacity-50">
                        Next
                    </button>
                </div>
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
        }));
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

// Reset to first page when filters change
watch([selectedGrade, selectedAcademicTrack, searchQuery], () => {
    currentPage.value = 1;
});

</script>
