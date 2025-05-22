<template>
    <div class="flex justify-between m-5">
        <div class="flex justify-between w-90">
            <Dropdown :showSort="true" v-model="selectedSort" />
        </div>

        <div class="flex justify-between gap-5">
            <div>
                <Searchbar v-model="searchQuery" />
            </div>
            <button @click="generateCSV"
                class="bg-[#30612E] text-white px-5 py-1 rounded-md hover:bg-[#cecece] transition-colors cursor-pointer duration-200">
                <p class="w-full">Generate Report</p>
            </button>
        </div>
    </div>

    <div class="p-5 rounded-[5px]">
        <div class="relative">
            <table class="w-full border-collapse border-none rounded-[5px]">
                <thead class="bg-gray-100">
                    <tr>
                        <th v-for="header in headers" :key="header"
                            class="px-4 py-2 text-[#464F60] text-[16px] font-semibold text-center">
                            {{ header }}
                        </th>
                    </tr>
                </thead>
            </table>
            <div class="max-h-[600px] overflow-y-auto">
                <table class="w-full border-collapse border-none rounded-[5px]">
                    <tbody class="text-center font-medium">
                        <tr v-if="filteredStudents.length === 0">
                            <td colspan="9" class="px-4 py-2">No students available.</td>
                        </tr>
                        <tr v-for="student in filteredStudents" :key="student.lrn">
                            <td class="px-4 py-2">{{ student.lrn }}</td>
                            <td class="px-4 py-2">{{ student.lastName + ", " + student.firstName + " " +
                                student.middleName }}
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
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Dropdown from '@/components/dropdown.vue';
import Searchbar from '@/components/searchbar.vue';
import Swal from 'sweetalert2';

const props = defineProps({
    subject_id: {
        type: String,
        required: true,
    },
    subjectName: {
        type: String,
        required: true,
    }
});

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
    } catch (error) {
        students.value = [];
    }
};

const getGradeForQuarter = (student, quarter) => {
    const grade = student.grades?.[quarter];
    if (!grade || grade === null || grade === undefined || grade === '' || grade === '-' || grade === 'No grade') {
        return '-';
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
        if (grade !== '-') {
            hasAnyValidGrade = true;
            total += parseFloat(grade);
            gradeCount++;
        }
    }

    if (!hasAnyValidGrade) return '-';
    if (gradeCount < 4) return '-';

    return (total / gradeCount).toFixed(2);
};

const getRemarks = (student) => {
    const finalGrade = getFinalGrade(student);
    if (finalGrade === '-' || finalGrade === 'INC' || parseFloat(finalGrade) <= 75) {
        return 'Failed';
    }
    return 'Passed';
};

const gradeToNumeric = (grade) => {
    if (grade === '-') return -1;
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

const showAlertModal = (message, type = 'error', title = 'Error') => {
    Swal.fire({
        title: title,
        text: message,
        icon: type,
        confirmButtonColor: type === 'error' ? '#dc2626' : '#16a34a',
        confirmButtonText: 'OK'
    });
};

onMounted(() => {
    fetchStudents();
});
</script>