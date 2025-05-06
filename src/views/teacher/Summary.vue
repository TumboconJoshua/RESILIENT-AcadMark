<template>
    <div class="flex justify-between m-5">
        <div class="flex justify-between w-90">
            <Dropdown :showSort="true" v-model="selectedSort" />
        </div>

        <div class="flex w-1/2 justify-between">
            <Searchbar v-model="searchQuery" />
            <button @click="generateCSV"
                class="bg-[#30612E] text-white px-5 py-1 rounded-md hover:bg-[#cecece] transition-colors cursor-pointer duration-200">
                Generate Report
            </button>
        </div>
    </div>

    <div class="overflow-x-auto p-5 rounded-[5px]">
        <table class="w-full border-collapse border-none rounded-[5px]">
            <thead class="bg-gray-100">
                <tr>
                    <th v-for="header in headers" :key="header"
                        class="px-4 py-2 text-[#464F60] text-[16px] font-semibold text-center">
                        {{ header }}
                    </th>
                </tr>
            </thead>
            <tbody class="text-center font-medium">
                <tr v-if="paginatedStudents.length === 0">
                    <td colspan="8" class="px-4 py-2">No students available.</td>
                </tr>
                <tr v-for="student in paginatedStudents" :key="student.lrn">
                    <td class="px-4 py-2">{{ student.lrn }}</td>
                    <td class="px-4 py-2">{{ student.lastName + ", " + student.firstName + " " + student.middleName }}
                    </td>
                    <td class="px-4 py-2">{{ student.sex }}</td>
                    <td class="px-4 py-2">{{ getGradeForQuarter(student, "first") }}</td>
                    <td class="px-4 py-2">{{ getGradeForQuarter(student, "second") }}</td>
                    <td class="px-4 py-2">{{ getGradeForQuarter(student, "third") }}</td>
                    <td class="px-4 py-2">{{ getGradeForQuarter(student, "fourth") }}</td>
                    <td class="px-4 py-2">{{ getFinalGrade(student) }}</td>
                    <td :class="getRemarks(student) === 'Passed' ? 'text-[#23AD00]' : 'text-[#FF0000]'"
                        class="px-4 py-2 font-bold">
                        {{ getRemarks(student) }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Dropdown from '@/components/dropdown.vue';
import Searchbar from '@/components/searchbar.vue';

const props = defineProps({
    subject_id: {
        type: String,
        required: true,
    },
    subjectName: {
        type: String,
        required: true,
    },
    currentPage: {
        type: Number,
        required: true,
    },
    itemsPerPage: {
        type: Number,
        required: true,
    },
});

const emit = defineEmits(['update:currentPage', 'update:totalItems']);

const headers = ref([
    'LRN', 'Name', 'Gender', '1st Quarter', '2nd Quarter', '3rd Quarter', '4th Quarter', 'Final Grade', 'Remarks'
]);

const students = ref([]);
const selectedSort = ref('default');
const searchQuery = ref("");

const fetchStudents = () => {
    try {
        const key = `submittedGrade_${props.subject_id}`;
        const storedData = JSON.parse(localStorage.getItem(key)) || [];
        students.value = storedData;
        emit('update:currentPage', 1);
        emit('update:totalItems', students.value.length);
    } catch (error) {
        students.value = [];
        emit('update:currentPage', 1);
        emit('update:totalItems', 0);
    }
};

const getGradeForQuarter = (student, quarter) => {
    const grade = student.grades?.[quarter];
    if (!grade || grade === null || grade === undefined || grade === '' || grade === '-' || grade === 'No grade') {
        return 'No grade';
    }
    return grade;
};

const getFinalGrade = (student) => {
    const grades = ['first', 'second', 'third', 'fourth'];
    let total = 0;
    let gradeCount = 0;
    let hasAnyValidGrade = false;

    for (let quarter of grades) {
        const grade = getGradeForQuarter(student, quarter);
        if (grade !== 'No grade') {
            hasAnyValidGrade = true;
            total += parseFloat(grade);
            gradeCount++;
        }
    }

    if (!hasAnyValidGrade) return 'No grade';
    if (gradeCount < 4) return 'INC';

    return (total / gradeCount).toFixed(2);
};

const getRemarks = (student) => {
    const finalGrade = getFinalGrade(student);
    if (finalGrade === 'No grade' || finalGrade === 'INC' || parseFloat(finalGrade) <= 75) {
        return 'Failed';
    }
    return 'Passed';
};

const gradeToNumeric = (grade) => {
    if (grade === 'No grade') return -1;
    if (grade === 'INC') return 0;
    return parseFloat(grade);
};

const filteredStudents = computed(() => {
    let sortedStudents = students.value.filter(student => {
        const fullName = (student.firstName + " " + student.middleName + " " + student.lastName).toLowerCase();
        return fullName.includes(searchQuery.value.toLowerCase());
    });

    switch (selectedSort.value) {
        case 'Sort by A-Z':
            sortedStudents.sort((a, b) => a.lastName.localeCompare(b.lastName));
            break;
        case 'Sort by Z-A':
            sortedStudents.sort((a, b) => b.lastName.localeCompare(a.lastName));
            break;
        case 'Sort by Grade (Highest)':
            sortedStudents.sort((a, b) => {
                const gradeA = getFinalGrade(a);
                const gradeB = getFinalGrade(b);
                return gradeToNumeric(gradeB) - gradeToNumeric(gradeA);
            });
            break;
        case 'Sort by Grade (Lowest)':
            sortedStudents.sort((a, b) => {
                const gradeA = getFinalGrade(a);
                const gradeB = getFinalGrade(b);
                return gradeToNumeric(gradeA) - gradeToNumeric(gradeB);
            });
            break;
        default:
            break;
    }

    return sortedStudents;
});

const totalPages = computed(() => {
    if (filteredStudents.value.length === 0) {
        return 0;
    }
    return Math.ceil(filteredStudents.value.length / props.itemsPerPage);
});

const paginatedStudents = computed(() => {
    if (filteredStudents.value.length === 0) {
        return [];
    }

    const startIndex = (props.currentPage - 1) * props.itemsPerPage;
    const endIndex = startIndex + props.itemsPerPage;
    return filteredStudents.value.slice(startIndex, endIndex);
});

watch(filteredStudents, (newFilteredStudents) => {
    const newTotalPages = Math.ceil(newFilteredStudents.length / props.itemsPerPage);
    if (props.currentPage > newTotalPages && newTotalPages > 0) {
        emit('update:currentPage', newTotalPages);
    } else if (newTotalPages === 0) {
        emit('update:currentPage', 1);
    }
}, { deep: true });

const generateCSV = () => {
    const date = new Date().toLocaleDateString().replace(/\//g, '-');

    const csvContent = [
        headers.value.join(','),
        ...filteredStudents.value.map(student => [
            student.lrn,
            `${student.lastName}, ${student.firstName} ${student.middleName}`.trim(),
            student.sex,
            getGradeForQuarter(student, "first"),
            getGradeForQuarter(student, "second"),
            getGradeForQuarter(student, "third"),
            getGradeForQuarter(student, "fourth"),
            getFinalGrade(student),
            getRemarks(student)
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `Grades Summary - ${props.subjectName} - ${date}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

onMounted(() => {
    fetchStudents();
    if (students.value.length === 0) {
        emit('update:currentPage', 1);
        emit('update:totalItems', 0);
    } else {
        emit('update:totalItems', students.value.length);
    }
});
</script>