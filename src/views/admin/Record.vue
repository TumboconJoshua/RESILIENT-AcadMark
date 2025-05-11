<template>
    <div>
        <div class="p-7 rounded-t-xl" style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;">
            <div class="flex justify-between">
                <div class="flex flex-wrap gap-5">
                    <Dropdown :showGrade="true" v-model="selectedGrade" />
                    <Dropdown :showCurriculum="true" v-model="selectedCurriculum" />
                    <Dropdown :showSex="true" v-model="selectedSex" />
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
                        <tr v-for="student in filteredStudents" :key="student.lrn" class="hover:bg-gray-200">
                            <td class="p-2">{{ student.gradeLevel }}</td>
                            <td class="p-2">{{ student.lrn }}</td>
                            <td class="p-2">{{ student.fullName }}</td>
                            <td class="p-2">{{ student.curriculum }}</td>
                            <td class="p-2">{{ student.track }}</td>
                            <td class="p-2">{{ student.section || '-' }}</td>
                            <td class="p-2">{{ student.sex }}</td>
                            <td class="p-2">{{ formatDate(student.birthdate) }}</td>
                            <td class="p-2">{{ student.age }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Dropdown from '@/components/dropdown.vue';
import Searchbar from '@/components/searchbar.vue';

const selectedGrade = ref('');
const selectedCurriculum = ref('');
const selectedSex = ref('');
const selectedAcademicTrack = ref('');
const searchQuery = ref('');

const filteredStudents = computed(() => {
    const students = JSON.parse(localStorage.getItem('addedStudent') || '[]');

    let filtered = students.filter(student => {
        const matchesGrade = !selectedGrade.value || student.gradeLevel === selectedGrade.value;
        const matchesCurriculum = !selectedCurriculum.value || student.curriculum === selectedCurriculum.value;
        const matchesSex = !selectedSex.value || student.sex === selectedSex.value;
        const matchesTrack = !selectedAcademicTrack.value || student.track === selectedAcademicTrack.value;

        return matchesGrade && matchesCurriculum && matchesSex && matchesTrack;
    });

    if (searchQuery.value) {
        filtered = filtered.filter(student =>
            student.fullName.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
    }

    return filtered;
});

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const resetFilters = () => {
    selectedGrade.value = '';
    selectedCurriculum.value = '';
    selectedSex.value = '';
    selectedAcademicTrack.value = '';
    searchQuery.value = '';
};
</script>