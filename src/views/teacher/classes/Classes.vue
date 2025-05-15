<template>
  <div>
    <h1 class="title">Classes</h1>
    <div class="grid ssm:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
      <Card v-for="classItem in classes" :key="classItem.Class_ID" type="class" :trackStand="getTrackForGrade(classItem.Track, classItem.Grade_Level)"
        :classType="classItem.classType" :className="classItem.ClassName" :subjectName="classItem.subject_name"
        :subject_id="classItem.subject_id" :gradeLevel="classItem.Grade_Level" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Card from "@/components/card.vue";
import ClassesService from "@/service/Classes/ClassesService";

const classes = ref([]);

const getTrackForGrade = (track, gradeLevel) => {
  const grade = parseInt(gradeLevel);
  return grade <= 10 ? 'Academic' : track;
};

onMounted(async () => {
  try {
    classes.value = await ClassesService.fetchClasses();
  } catch (error) {
    console.error('Error loading classes:', error);
  }
});
</script>
