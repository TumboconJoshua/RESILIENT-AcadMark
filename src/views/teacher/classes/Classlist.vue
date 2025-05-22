<template>
    <div>
        <div class="flex justify-between px-5 py-3 items-center">
            <button class="btn-primary px-8 py-2 mx-12 mt-5 rounded-md" @click="showLis = true">
                <p class="text-white font-semibold text-xs">LIS</p>
            </button>

            <div class="w-1/3">
                <searchbar v-model="searchQuery" />
            </div>
        </div>

        <p v-if="!subject_id">Subject ID is not available</p>

        <div v-else>
            <p v-if="filteredStudents.length === 0">No students available for this subject.</p>
            <div v-else>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th class="table-header">LRN</th>
                                <th class="table-header">Full Name</th>
                                <th class="table-header">Gender</th>
                                <th class="table-header">Birthdate</th>
                                <th class="table-header">Age</th>
                                <th class="table-header">Contact Number</th>
                                <th class="table-header">Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="student in filteredStudents" :key="student.student_id">
                                <td class="table-cell">{{ student.lrn }}</td>
                                <td class="table-cell">{{ student.firstName }} {{ student.lastName }}</td>
                                <td class="table-cell">{{ student.sex }}</td>
                                <td class="table-cell">{{ student.birthDate }}</td>
                                <td class="table-cell">{{ calculateAge(student.birthDate) }}</td>
                                <td class="table-cell">{{ student.contactNumber }}</td>
                                <td class="table-cell">{{ student.address }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div>
            <modal v-if="showLis" :subject_id="subject_id" :showLis="showLis" :showMessage="false"
                :selectedStudent="null" :selectedQuarter="'1st'" :trackStand="'STEM'" :subjectName="subjectName"
                @close="showLis = false" />

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import subjects from '@/data/subjects.json';
import students from '@/data/students.json';
import modal from '@/components/modal.vue';
import searchbar from '@/components/searchbar.vue';

const props = defineProps({
    subject_id: String,
    subjectName: String
});

const studentsInSubject = ref([]);
const showLis = ref(false);
const searchQuery = ref("");

const filteredStudents = computed(() => {
    if (!searchQuery.value) {
        return studentsInSubject.value;
    }
    return studentsInSubject.value.filter(student => {
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        return fullName.includes(searchQuery.value.toLowerCase());
    });
});

const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth();
    if (month < birthDate.getMonth() || (month === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

onMounted(() => {
    const subject = subjects.find(sub => sub.subject_id === props.subject_id);
    if (subject) {
        studentsInSubject.value = students.filter(student =>
            subject.student_id.includes(student.student_id)
        ).map(student => ({
            ...student,
            selected: false,
            grades: student.grades || { "1st": null, "2nd": null, "3rd": null, "4th": null }
        }));

        localStorage.setItem(`subject_${props.subject_id}`, JSON.stringify(studentsInSubject.value));
    }
});
</script>