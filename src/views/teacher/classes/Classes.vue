<template>
  <div>
    <h1 class="title">Classes</h1>
    <div class="grid ssm:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
      <Card v-for="classItem in classes" :key="classItem.class_id" :trackStand="classItem.trackStand"
        :classType="classItem.classType" :className="classItem.className"
        :subjectName="getSubjectName(classItem.subject_id)" :subject_id="classItem.subject_id"
        :gradeLevel="classItem.gradeLevel" :type="classItem.classType || 'Subject'" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Card from "@/components/card.vue";
import classesData from "@/data/class.json";
import subjectsData from "@/data/subjects.json";

const classes = ref([]);
const subjects = ref({});

const getSubjectName = (subjectId) => subjects.value[subjectId] || "Unknown Subject";

onMounted(() => {
  classes.value = classesData;
  subjects.value = subjectsData.reduce((acc, subject) => {
    acc[subject.subject_id] = subject.subjectName;
    return acc;
  }, {});
});
</script>
