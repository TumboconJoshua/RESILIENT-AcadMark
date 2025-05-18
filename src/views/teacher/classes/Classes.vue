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
  return grade <= 10 ? '' : track;
};

onMounted(async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.teacher_ID) {
      console.error('TEACHER_ID not found in localStorage. Please log in as a teacher.');
      return;
    }
    const teacherId = user.teacher_ID;
    const fetchedClasses = await ClassesService.fetchClasses(teacherId);

    // Flatten: one card per subject per class
    classes.value = fetchedClasses.flatMap(cls =>
      cls.subjects.length > 0
        ? cls.subjects.map(subj => ({
            ...cls,
            subject_id: String(subj.subject_id),
            subject_name: subj.subject_name,
          }))
        : [{
            ...cls,
            subject_id: "",
            subject_name: "General"
          }]
    );
  } catch (error) {
    console.error('Error loading classes:', error);
  }
});
</script>

