<template>
  <div class="flex gap-5 flex-wrap">
    <div v-if="showCurriculum" class="flex gap-2 border border-[#E3E9EC] rounded-md">
      <div class="flex justify-between items-center">
        <label for="curriculum" class="mr-2.5 p-1.5 text-[#858585]">Curriculum</label>
        <select v-model="selectedCurriculum" id="curriculum"
          class="text-base border-none bg-transparent p-1.5 font-bold text-center max-w-max focus:outline-none">
          <option v-for="option in curriculumOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
    </div>

    <div v-if="showYear" class="flex gap-2 border border-[#E3E9EC] rounded-md">
      <div class="flex justify-between items-center">
        <label for="year" class="mr-2.5 p-1.5 text-[#858585]">Year</label>
        <select v-model="selectedYear" id="year"
          class="text-base border-none bg-transparent p-1.5 font-bold text-center max-w-max focus:outline-none">
          <option v-for="option in yearOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
    </div>

    <div v-if="showAcademicTrack" class="flex gap-2 border border-[#E3E9EC] rounded-md">
      <div class="flex justify-between items-center">
        <label for="academic-track" class="mr-2.5 p-1.5 text-[#858585]">Academic Track</label>
        <select v-model="selectedAcademicTrack" id="academic-track"
          class="text-base border-none bg-transparent p-1.5 font-bold text-center max-w-max focus:outline-none">
          <option v-for="option in academicTrackOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
    </div>

    <div v-if="showGrade" class="flex gap-2 border border-[#E3E9EC] rounded-md">
      <div class="flex justify-between items-center">
        <label for="grade" class="mr-2.5 p-1.5 text-[#858585]">Grade</label>
        <select v-model="selectedGrade" id="grade"
          :class="['text-base border-none bg-transparent p-1.5 font-bold text-center max-w-max focus:outline-none', customClass]">
          <option v-for="option in gradeOptions" :key="option" :value="option">{{ option }}</option>
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

    <div v-if="showMarkStatus" class="flex gap-2 border border-[#E3E9EC] rounded-md">
      <div class="flex justify-between items-center">
        <label for="mark-status" class="mr-2.5 p-1.5 text-[#858585]">Status</label>
        <select v-model="selectedMarkStatus" id="mark-status" @change="updateMarkStatus"
          class="text-base border-none bg-transparent p-1.5 font-bold text-center max-w-max focus:outline-none">
          <option v-for="option in markStatusOptions" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
    </div>

    <div v-if="options && options.length > 0">
      <div class="flex justify-between items-center">
        <select v-model="selectedOption" 
          :class="customClass ? customClass : 'text-base border-none bg-transparent p-1.5 font-bold text-center max-w-max focus:outline-none'">
          <option value="" disabled selected>{{ placeholder }}</option>
          <option v-for="option in options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const emit = defineEmits();

const props = defineProps({
  showCurriculum: {
    type: Boolean,
    default: false,
  },
  showYear: {
    type: Boolean,
    default: false,
  },
  showAcademicTrack: {
    type: Boolean,
    default: false,
  },
  showGrade: {
    type: Boolean,
    default: false,
  },
  showSubject: {
    type: Boolean,
    default: false,
  },
  showQuarter: {
    type: Boolean,
    default: false,
  },
  showSort: {
    type: Boolean,
    default: false,
  },
  showMarkStatus: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  customClass: {
    type: String,
    default: ''
  }
});

const curriculumOptions = ['JHS', 'SHS'];
const curriculumMapping = {
  'JHS': 'Junior High School',
  'SHS': 'Senior High School'
};
const yearOptions = ['2023', '2024', '2025'];
const academicTrackOptions = ['TVL', 'Academic', 'Arts and Design', 'Sports', 'ABM', 'STEM', 'HUMMS'];
const gradeOptions = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
const subjectOptions = [
  'Mathematics', 'English', 'PE and Health', 'Chemistry', 'Physics', 'Physical Education',
  'Business Mathematics', 'Music', 'Computer Science', 'Art History', 'Advanced Chemistry'
];
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
const selectedOption = ref('');

watch(selectedCurriculum, (newValue) => {
  emit("update:modelValue", curriculumMapping[newValue] || newValue);
});

watch(selectedGrade, (newValue) => {
  emit("update:modelValue", newValue);
});

watch(selectedAcademicTrack, (newValue) => {
  emit("update:modelValue", newValue);
});

const updateQuarter = () => {
  emit("update:modelValue", selectedQuarter.value);
};

const updateMarkStatus = () => {
  emit("update:modelValue", selectedMarkStatus.value);
};

const updateSort = () => {
  emit("update:modelValue", selectedSort.value);
};
</script>
