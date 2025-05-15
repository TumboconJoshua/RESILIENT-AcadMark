<template>
  <div>
    <h1 class="title">Classes</h1>
    <div class="grid ssm:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
      <Card v-for="classItem in classes" :key="classItem.Class_ID" type="class" :trackStand="classItem.Track"
        :classType="classItem.classType || 'Subject'" :className="classItem.ClassName"
        :subjectName="getSubjectName(classItem.subject_id)" :subject_id="classItem.subject_id || ''"
        :gradeLevel="classItem.Grade_Level" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Card from "@/components/card.vue";
import ClassesService from "@/service/Classes/ClassesService";

const classes = ref([]);
const subjects = ref({});

const getSubjectName = (subjectId) => subjects.value[subjectId] || "Unknown Subject";

onMounted(async () => {
  try {
    // Fetch data in parallel for better performance
    const [classesData, subjectsData] = await Promise.all([
      ClassesService.fetchClasses(),
      ClassesService.fetchSubjects()
    ]);
    
    classes.value = classesData;
    subjects.value = subjectsData;
  } catch (error) {
    console.error('Initialization error:', error);
    // Add user-friendly error handling here (e.g., toast notification)
  }
});
</script>
