<template>
    <div class="flex max-h-[412px] overflow-x-auto scrollbar-hide">
        <!-- Left Section: Student Selection -->
        <div class="px-5 py-3 border-r border-[#d0d0d0]">
            <div class="flex items-center gap-5">
                <Dropdown :showQuarter="true" v-model="selectedQuarter" />
                <Dropdown :showMarkStatus="true" v-model="selectedMarkStatus" />
                <p class="font-semibold text-lg">{{ formattedDate }}</p>
            </div>

            <!-- Select All Checkbox -->
            <div class="mt-4 flex items-center justify-end gap-2">
                <label for="select-all" class="ml-2 text-xs">Select All</label>
                <input type="checkbox" class="checkbox mr-[35px]" id="select-all" v-model="selectAll"
                    @change="toggleSelectAll" />
            </div>

            <!-- Displaying Student Names Dynamically -->
            <div v-if="filteredStudents.length > 0"
                class="mt-4 overflow-y-auto overflow-x-auto scrollbar-hide max-h-[230px]">
                <ul>
                    <li v-for="(student, index) in filteredStudents" :key="index"
                        class="flex justify-between py-2 mr-3 rounded-md transition-colors duration-200 px-2"
                        :class="{ 'bg-blue-100 border-blue': isSelectedStudent(student) }"
                        @click="setStudentInfo(index)">
                        <div class="flex items-center gap-5 cursor-pointer">
                            <!-- Conditional background color based on grade presence for the current quarter -->
                            <div :class="{
                                'bg-[#23AD00]': student.grades[quarterMapping[selectedQuarter]] !== null && student.grades[quarterMapping[selectedQuarter]] !== '',
                                'bg-red-500': !student.grades[quarterMapping[selectedQuarter]]
                            }" class="w-5 h-5 rounded-2xl"></div>
                            <p class="font-medium text-base truncate max-w-[150px]"
                                :class="{ 'text-blue font-semibold': isSelectedStudent(student) }">
                                {{ student.lastName + ", " + student.firstName + " " + student.middleName }}
                            </p>
                        </div>
                        <div>
                            <input type="checkbox" class="checkbox" v-model="student.selected" />
                        </div>
                    </li>
                </ul>
            </div>


            <p v-else class="mt-4 text-red-500">No students found for this subject.</p>

            <div class="flex justify-end mt-2 mr-5">
                <button
                    class="bg-blue px-3 py-2 text-xs font-semibold text-white rounded-sm hover:bg-[#cecece] cursor-pointer"
                    @click="submitGrades">
                    Submit Grades
                </button>
            </div>
        </div>

        <!-- Right Section: Student Info and Grading -->
        <div class="gap-3 flex flex-col mx-5 my-3 flex-1">
            <p class="text-blue font-semibold text-2xl">STUDENT INFO</p>
            <div class="flex flex-col gap-3">
                <div class="flex gap-10">
                    <div class="flex flex-col gap-1">
                        <div>
                            <p class="text-blue text-xs font-bold">Student Name</p>
                            <p class="text-2xl font-medium">{{ selectedStudent ? selectedStudent.firstName + " " +
                                selectedStudent.lastName : '(Select a Student)' }}</p>
                        </div>
                        <div>
                            <p class="text-blue text-xs font-bold">LRN</p>
                            <p class="text-2xl font-medium">{{ selectedStudent ? selectedStudent.lrn : 'N/A' }}</p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-1">
                        <div>
                            <p class="text-blue text-xs font-bold">Sex</p>
                            <p class="text-2xl font-medium">{{ selectedStudent ? selectedStudent.sex : 'N/A' }}</p>
                        </div>
                        <div>
                            <p class="text-blue text-xs font-bold">Curriculum</p>
                            <p class="text-2xl font-medium">{{ selectedStudent ? selectedStudent.curriculum : 'N/A' }}
                            </p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-1">
                        <div>
                            <p class="text-blue text-xs font-bold">Birthdate</p>
                            <p class="text-2xl font-medium">{{ selectedStudent ? selectedStudent.birthDate : 'N/A' }}
                            </p>
                        </div>
                        <div>
                            <p class="text-blue text-xs font-bold">Academic Track</p>
                            <p class="text-2xl font-medium">{{ trackStand }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <p class="text-blue font-semibold text-2xl">GRADING</p>
            <div class="flex flex-col gap-3">
                <div class="flex gap-5">
                    <div>
                        <p class="text-blue text-xs font-bold">Quarter Grade</p>
                        <input type="text" class="border-[1px] w-35 h-9 text-center" v-model="Grade"
                            @input="validateGrade" maxlength="3" pattern="[0-9]*" inputmode="numeric" />
                    </div>
                    <div>
                        <p class="text-blue text-xs font-bold">Remarks</p>
                        <div class="w-35 h-9 border-[1px] rounded-[5px] items-center justify-center flex">
                            <!-- Dynamically show Passed or Failed -->
                            <p class="font-bold" :class="remarksClass">{{ remarks }}</p>
                        </div>
                    </div>
                </div>
                <p class="italic text-xs">You are grading for <span class="font-bold mt-5">{{ selectedQuarter }}</span>
                </p>
            </div>

            <button
                class="bg-blue max-w-28 h-8 rounded-md text-white font-semibold text-md hover:bg-[#cecece] cursor-pointer"
                @click="saveGrades">Save</button>

            <!-- Pagination Controls -->
            <div class="relative">
                <div class="flex gap-5 top-[-35px] right-15 absolute">
                    <div class="flex items-center gap-2 cursor-pointer"
                        :class="{ 'pointer-events-none': currentIndex === 0 }" @click="prevStudent">
                        <img class="h-4 w-4 rotate-180"
                            :src="currentIndex === 0 ? '/assets/img/classes/arrow2.png' : '/assets/img/classes/arrow.png'"
                            alt="Previous" />
                        <p :style="{ color: currentIndex === 0 ? '#bababa' : 'inherit' }">Previous</p>
                    </div>
                    <div class="flex items-center gap-2 cursor-pointer"
                        :class="{ 'pointer-events-none': currentIndex === studentsInSubject.length - 1 }"
                        @click="nextStudent">
                        <p :style="{ color: currentIndex === studentsInSubject.length - 1 ? '#bababa' : 'inherit' }">
                            Next</p>
                        <img class="h-4 w-4"
                            :src="currentIndex === studentsInSubject.length - 1 ? '/assets/img/classes/arrow2.png' : '/assets/img/classes/arrow.png'"
                            alt="Next" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Move the modal outside the main container -->
    <div v-if="showSubmitSuccess" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
        <div class="bg-white rounded-xl p-8 text-center shadow-xl max-w-sm w-full">
            <h2 class="text-xl font-semibold text-green-600 mb-4">Success!</h2>
            <p class="text-gray-700">Grades have been successfully submitted.</p>
            <button @click="showSubmitSuccess = false"
                class="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer">
                OK
            </button>
        </div>
    </div>

    <!-- Alert Modal -->
    <div v-if="showAlert" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
        <div class="bg-white rounded-xl p-8 text-center shadow-xl max-w-sm w-full">
            <h2 class="text-xl font-semibold mb-4" :class="alertType === 'error' ? 'text-red-600' : 'text-green-600'">
                {{ alertTitle }}
            </h2>
            <p class="text-gray-700">{{ alertMessage }}</p>
            <button @click="showAlert = false" class="mt-6 px-4 py-2 rounded cursor-pointer"
                :class="alertType === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'"
                :style="{ color: 'white' }">
                OK
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import subjects from '@/data/subjects.json';
import students from '@/data/students.json';
import Dropdown from '@/components/dropdown.vue';
import { computed } from 'vue';
import Modal from '@/components/modal.vue';
import Swal from 'sweetalert2';

const props = defineProps({
    trackStand: String,
    subject_id: String,
    classType: String,
    subjectName: String,
    className: String,
});

const today = new Date();
const formattedDate = ref(`${today.getMonth() + 1}/${today.getDate()}/${String(today.getFullYear()).slice(-2)}`);
const selectAll = ref(false);
const studentsInSubject = ref([]);
const selectedStudent = ref(null);
const currentIndex = ref(0);
const Grade = ref("");
const selectedQuarter = ref("1st");
const selectedMarkStatus = ref("Show All");
const showSubmitSuccess = ref(false);
const showAlert = ref(false);
const alertTitle = ref('');
const alertMessage = ref('');
const alertType = ref('error');

const quarterMapping = {
    "1st": "first",
    "2nd": "second",
    "3rd": "third",
    "4th": "fourth"
};

const loadGrade = () => {
    if (selectedStudent.value) {
        const gradeKey = quarterMapping[selectedQuarter.value];
        Grade.value = selectedStudent.value.grades[gradeKey] || "";
    }
};


watch(selectedQuarter, loadGrade);
watch(currentIndex, () => {
    if (studentsInSubject.value.length > 0) {
        selectedStudent.value = studentsInSubject.value[currentIndex.value];
        loadGrade();
    }
});

async function loadSubjectData() {
    try {
        const submittedData = localStorage.getItem(`submittedgrade_${props.subject_id}`);
        if (submittedData) {
            studentsInSubject.value = JSON.parse(submittedData);
        } else {
            const storedData = localStorage.getItem(`subject_${props.subject_id}`);
            if (storedData) {
                studentsInSubject.value = JSON.parse(storedData);
            } else {
                const subject = subjects.find(sub => sub.subject_id === props.subject_id);
                if (subject) {
                    studentsInSubject.value = students.filter(student => subject.student_id.includes(student.student_id))
                        .map(student => ({
                            ...student,
                            selected: false,
                            grades: student.grades || { first: null, second: null, third: null, fourth: null }
                        }));

                    localStorage.setItem(`subject_${props.subject_id}`, JSON.stringify(studentsInSubject.value));
                }
            }
        }

        if (studentsInSubject.value.length > 0) {
            currentIndex.value = 0;
            selectedStudent.value = studentsInSubject.value[0];
            loadGrade();
        }
    } catch (error) {
        console.error('Error loading subject data:', error);
    }
}

function setStudentInfo(index) {
    currentIndex.value = index;
    selectedStudent.value = studentsInSubject.value[index];
    loadGrade();
}

function saveGrades() {
    if (selectedStudent.value) {
        const gradeKey = quarterMapping[selectedQuarter.value];

        const gradeToSave = Grade.value === '' || Grade.value === null ? 'No grade' : Grade.value;

        studentsInSubject.value[currentIndex.value].grades[gradeKey] = gradeToSave;

        localStorage.setItem(`subject_${props.subject_id}`, JSON.stringify(studentsInSubject.value));
        localStorage.setItem(`submittedgrade_${props.subject_id}`, JSON.stringify(studentsInSubject.value));

        const recentGradeEntry = {
            student_id: selectedStudent.value.student_id,
            lrn: selectedStudent.value.lrn,
            firstName: selectedStudent.value.firstName,
            lastName: selectedStudent.value.lastName,
            middleName: selectedStudent.value.middleName,
            curriculum: selectedStudent.value.curriculum,
            trackStand: props.trackStand,
            classType: props.classType,
            subjectName: props.subjectName,
            className: props.className,
            quarter: selectedQuarter.value,
            grade: gradeToSave,
            remarks: gradeToSave === 'No grade' ? 'Failed' : (parseFloat(gradeToSave) <= 75 ? 'Failed' : 'Passed'),
            timestamp: new Date().toISOString()
        };

        let recentGrades = JSON.parse(localStorage.getItem('recentGrades') || '[]');

        recentGrades = recentGrades.filter(grade =>
            !(grade.student_id === selectedStudent.value.student_id &&
                grade.subjectName === props.subjectName &&
                grade.quarter === selectedQuarter.value)
        );

        recentGrades.unshift(recentGradeEntry);

        localStorage.setItem('recentGrades', JSON.stringify(recentGrades));
    }
}

function toggleSelectAll() {
    studentsInSubject.value.forEach(student => {
        student.selected = selectAll.value;
    });
}

function nextStudent() {
    if (currentIndex.value < studentsInSubject.value.length - 1) {
        currentIndex.value++;
        selectedStudent.value = studentsInSubject.value[currentIndex.value];
        loadGrade();
    }
}

function prevStudent() {
    if (currentIndex.value > 0) {
        currentIndex.value--;
        selectedStudent.value = studentsInSubject.value[currentIndex.value];
        loadGrade();
    }
}

onMounted(loadSubjectData);

const filteredStudents = computed(() => {
    return studentsInSubject.value.filter(student => {
        const studentGrade = student.grades[quarterMapping[selectedQuarter.value]];

        // For debugging
        console.log('Student:', student.firstName, 'Grade:', studentGrade, 'Status:', selectedMarkStatus.value);

        if (selectedMarkStatus.value === 'Marked') {
            // A student is marked if they have a valid grade (not null, empty, 'No grade', or '-')
            const isValidGrade = studentGrade &&
                studentGrade !== '' &&
                studentGrade !== 'No grade' &&
                studentGrade !== '-';
            return isValidGrade;
        } else if (selectedMarkStatus.value === 'Unmarked') {
            // A student is unmarked if they have no grade or an invalid grade
            const isInvalidGrade = !studentGrade ||
                studentGrade === '' ||
                studentGrade === 'No grade' ||
                studentGrade === '-';
            return isInvalidGrade;
        }
        return true; // Show all students when no filter is selected
    });
});

const remarks = computed(() => {
    if (!Grade.value) {
        return "";
    }
    const gradeValue = parseFloat(Grade.value);
    return gradeValue < 75 ? "Failed" : "Passed";
});

const remarksClass = computed(() => {
    if (!Grade.value) {
        return "";
    }
    const gradeValue = parseFloat(Grade.value);
    return gradeValue < 75 ? "text-red-500" : "text-green-500";
});

const isSelectedStudent = (student) => {
    return selectedStudent.value && student.lrn === selectedStudent.value.lrn;
};

function submitGrades() {
    const selectedStudents = studentsInSubject.value.filter(student => student.selected);

    if (selectedStudents.length === 0) {
        showAlertModal("Please select students to submit grades.", 'error', 'No Selection');
        return;
    }

    localStorage.removeItem(`submittedGrade_${props.subject_id}`);

    selectedStudents.forEach(student => {
        if (!student.grades) {
            student.grades = {
                first: null,
                second: null,
                third: null,
                fourth: null,
            };
        }

        student.grades = student.grades || null;
    });

    const newSubmissions = selectedStudents.map(student => {
        return {
            student_id: student.student_id,
            lrn: student.lrn,
            firstName: student.firstName,
            lastName: student.lastName,
            middleName: student.middleName,
            trackStand: props.trackStand,
            classType: props.classType || 'Subject',
            subjectName: props.subjectName,
            curriculum: student.curriculum,
            status: 'Pending',
            timestamp: new Date().toISOString()
        };
    });

    let recentSubmit = JSON.parse(localStorage.getItem('recentSubmit') || '[]');

    newSubmissions.forEach(submission => {
        recentSubmit = recentSubmit.filter(item => item.student_id !== submission.student_id);
    });

    recentSubmit.unshift(...newSubmissions);

    localStorage.setItem('recentSubmit', JSON.stringify(recentSubmit));
    localStorage.setItem(`subject_${props.subject_id}`, JSON.stringify(studentsInSubject.value));
    localStorage.setItem(`submittedGrade_${props.subject_id}`, JSON.stringify(selectedStudents));

    showSubmitSuccess.value = true;
}

function showAlertModal(message, type = 'error', title = 'Error') {
    Swal.fire({
        title: title,
        text: message,
        icon: type,
        confirmButtonColor: type === 'error' ? '#dc2626' : '#16a34a',
        confirmButtonText: 'OK'
    });
}

function validateGrade(event) {
    // Remove any non-numeric characters
    Grade.value = Grade.value.replace(/[^0-9]/g, '');

    // Ensure the value is between 0 and 100
    const numValue = parseInt(Grade.value);
    if (numValue > 100) {
        Grade.value = '100';
    }
}
</script>