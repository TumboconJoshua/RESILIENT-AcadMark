<template>
  <div class="flex gap-5 flex-wrap">
    <div v-if="showCurriculum" class="flex gap-2 border border-[#E3E9EC] rounded-md">
      <div class="flex justify-between items-center">
        <select v-model="selectedCurriculum" id="curriculum" class="filter-dropdown">
          <option :value="''">All Curriculum</option>
          <option v-for="option in curriculumOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
    </div>

    <!-- <div v-if="showCurriculum" class="flex gap-2 border border-[#E3E9EC] rounded-md">
      <div class="flex justify-between items-center">
        <label for="curriculum" class="mr-2.5 p-1.5 text-[#858585]">Curriculum</label>
        <select v-model="selectedCurriculum" id="curriculum" class="filter-dropdown">
          <option v-for="option in curriculumOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
    </div> -->

    <div v-if="showYear" class="flex gap-2 border border-[#E3E9EC] rounded-md">
      <div class="flex justify-between items-center">
        <label for="year" class="mr-2.5 p-1.5 text-[#858585]">Year</label>
        <select v-model="selectedYear" id="year"
          class="text-base border-none bg-transparent p-1.5 font-bold text-center max-w-max focus:outline-none">
          <option v-for="option in yearOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
    </div>

    <div v-if="showGrade" class="flex gap-2 border border-[#E3E9EC] rounded-md">
      <div class="flex justify-between items-center">
        <select v-model="selectedGrade" id="grade" class="filter-dropdown">
          <option :value="''">All Grades</option>
          <option v-for="option in gradeOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="showAcademicTrack" class="flex gap-2 border border-[#E3E9EC] rounded-md">
      <div class="flex justify-between items-center">
        <select v-model="selectedAcademicTrack" id="academic-track" class="filter-dropdown">
          <option :value="''">All Tracks</option>
          <option v-for="option in academicTrackOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
    </div>


    

   

    <div v-if="showSubject" class="flex gap-2 border border-[#E3E9EC] rounded-md">
      <div class="flex justify-between items-center">
        <label for="subject" class="mr-2.5 p-1.5 text-[#858585]">Subject</label>
        <select v-model="selectedSubject" id="subject"
          class="text-base border-none bg-transparent p-1.5 font-bold text-center max-w-max focus:outline-none">
          <option v-for="option in subjectOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
    </div>

    <div v-if="showQuarter" class="flex gap-2 border border-[#E3E9EC] rounded-md">
      <label for="quarter" class="mr-2.5 p-1.5 text-[#858585]">Quarter</label>
      <select v-model="selectedQuarter" id="quarter" @change="updateQuarter"
        class="text-base border-none bg-transparent p-1.5 font-bold text-center max-w-max focus:outline-none">
        <option v-for="option in quarterOptions" :key="option" :value="option">{{ option }}</option>
      </select>
    </div>

    <div v-if="showSort" class="flex gap-2 border border-[#E3E9EC] rounded-md">
      <div class="flex justify-between items-center">
        <label for="sort" class="mr-2.5 p-1.5 text-[#858585]">Sort</label>
        <select v-model="selectedSort" id="sort" @change="updateSort"
          class="text-base border-none bg-transparent p-1.5 font-bold text-center max-w-max focus:outline-none">
          <option v-for="option in sortOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
    </div>

    <div v-if="showMarkStatus" class="flex gap-2 border border-[#E3E9EC] rounded-md ">
      <div class="flex justify-between items-center">
        <label for="mark-status" class="mr-2.5 p-1.5 text-[#858585]">Status</label>
        <select v-model="selectedMarkStatus" id="mark-status" @change="updateMarkStatus"
          class="text-base border-none bg-transparent p-1.5 font-bold text-center max-w-max focus:outline-none">
          <option v-for="option in markStatusOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const emit = defineEmits();

const props = defineProps({
  showCurriculum: { type: Boolean, default: false },
  showYear: { type: Boolean, default: false },
  showAcademicTrack: { type: Boolean, default: false },
  showGrade: { type: Boolean, default: false },
  showSubject: { type: Boolean, default: false },
  showQuarter: { type: Boolean, default: false },
  showSort: { type: Boolean, default: false },
  showMarkStatus: { type: Boolean, default: false },
});

const curriculumOptions = ['JHS', 'SHS'];
const curriculumMapping = { 'JHS': 'Junior High School', 'SHS': 'Senior High School' };
const yearOptions = ['2023', '2024', '2025'];
const academicTrackOptions = ['TVL', 'SPA', 'BEP', 'SPJ', 'HUMSS'];
const gradeOptions = [
  { label: 'Grade 7', value: '7' },
  { label: 'Grade 8', value: '8' },
  { label: 'Grade 9', value: '9' },
  { label: 'Grade 10', value: '10' },
  { label: 'Grade 11', value: '11' },
  { label: 'Grade 12', value: '12' },
];
const subjectOptions = ['Mathematics', 'English', 'PE and Health', 'Chemistry', 'Physics', 'Physical Education', 'Business Mathematics', 'Music', 'Computer Science', 'Art History', 'Advanced Chemistry'];
const quarterOptions = ['1st', '2nd', '3rd', '4th'];
const sortOptions = ['Sort by A-Z', 'Sort by Z-A', 'Sort by Grade (Highest)', 'Sort by Grade (Lowest)'];
const markStatusOptions = ['Marked', 'Unmarked', 'Show All'];

const selectedCurriculum = ref('');
const selectedYear = ref('');
const selectedAcademicTrack = ref('');
const selectedGrade = ref('');
const selectedSubject = ref('');
const selectedQuarter = ref('1st');
const selectedSort = ref('');
const selectedMarkStatus = ref('Show All');

watch(selectedCurriculum, (newValue) => {
  emit('update:modelValue', curriculumMapping[newValue] || newValue);
});

watch(selectedGrade, (newValue) => {
  emit('update:modelValue', newValue);
});

watch(selectedAcademicTrack, (newValue) => {
  emit('update:modelValue', newValue);
});

const updateQuarter = () => {
  emit('update:modelValue', selectedQuarter.value);
};

const updateMarkStatus = () => {
  emit('update:modelValue', selectedMarkStatus.value);
};

const updateSort = () => {
  emit('update:modelValue', selectedSort.value);
};
</script>

<style scoped>
.filters {
  display: flex;
  gap: 10px;
} 

.filter-dropdown {
  padding: 10px 15px;
  width: auto;
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