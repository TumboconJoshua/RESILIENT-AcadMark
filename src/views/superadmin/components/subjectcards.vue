<template>
  <div class="w-full">
    <div class="back-btn" @click="goBack">
      <span class="chevron">&lt;</span>
      <span>Back</span>
    </div>

    <div class="flex items-center space-x-6 mb-6 mt-8">
      <h1 class="text-5xl font-bold text-[#295f98]">Subjects</h1>
    </div>
    <div class="content mt-3">

      <!-- CARD -->
      <div class="card-grid mt-9">
        <div class="card cursor-pointer hover:shadow-lg transition"
          v-for="(subject, index) in selectedClassData.subjects" :key="index" @click="goToInsideCard(subject)">
          <div class="header"></div>
          <div class="grade">{{ subject.subjectName }}</div>
          <div class="teacher" v-if="subject.teacherName">{{ subject.teacherName }}</div>
          <div class="seal">
            <img src="/assets/img/logo.png" alt="" />
          </div>
        </div>
      </div>  

    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const selectedClassData = ref({ subjects: [] });

onMounted(() => {
  const stored = sessionStorage.getItem("selectedClassData");
  if (stored) {
    selectedClassData.value = JSON.parse(stored);
    console.log("Received class data:", selectedClassData.value);
  } else {
    console.log("No class data found in sessionStorage");
  }
});

const router = useRouter();
const goBack = () => router.back();

function goToInsideCard(subject) {
  // Log the selected subject ID
  console.log("Selected subject ID:", subject.subject_id);

  // Save subject to sessionStorage for later use (optional)
  sessionStorage.setItem("selectedSubjectData", JSON.stringify(subject));

  // Parse grade and section from className (e.g., "Grade 7 - B")
  const [gradePart, section] = selectedClassData.value.className.split(" - ");
  const grade = gradePart.replace("Grade ", "").trim();

  // Navigate to insideCard with subject_id
  router.push({
    name: "insideCard",
    params: {
      grade,
      section
    },
    query: {
      subject_id: subject.subject_id
    }
  });;
}




const selectedGrade = ref("");
const selectedCurriculum = ref("");
const selectedTrack = ref("");

const grades = [7, 8, 9, 10, 11, 12];
const curriculums = ["BEC", "K-12", "SPED"];
const tracks = ["STEM", "ABM", "TVL", "HUMSS"];

// const cards = ref([
//   { grade: 7, subjects: "Math", curriculum: "BEC", track: "STEM", teacher: "Mr. Cruz" },
//   { grade: 7, subjects: "English", curriculum: "K-12", track: "ABM", teacher: "Ms. Santos" },
//   { grade: 8, subjects: "Biology", curriculum: "SPED", track: "TVL", teacher: "Mr. Reyes" },
//   { grade: 9, subjects: "Chemistry", curriculum: "BEC", track: "HUMSS", teacher: "Mrs. Gomez" },
//   { grade: 10, subjects: "Physics", curriculum: "K-12", track: "STEM", teacher: "Ms. Dela Cruz" },
// ]);


// const filteredCards = computed(() => {
//   return cards.value.filter(card => {
//     const matchGrade = !selectedGrade.value || card.grade === Number(selectedGrade.value);
//     const matchCurriculum = !selectedCurriculum.value || card.curriculum === selectedCurriculum.value;
//     const matchTrack = !selectedTrack.value || card.track === selectedTrack.value;
//     return matchGrade && matchCurriculum && matchTrack;
//   });
// });
</script>

<style scoped>
.content {
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid #EEEEEE;
  padding: 20px;
  border-radius: 5px;
}

.filtering-section {
  display: flex;
  gap: 20px;
  flex-wrap: nowrap;
  align-items: center;
  margin-left: 5px;
}

.filter-dropdown {
  padding: 10px 15px;
  width: 210px;
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
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' fill='%23295f98'><path d='M14 7l-5 5 5 5V7z'/></svg>");
}

.filter-dropdown:focus {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' fill='%23295f98'><path d='M7 10l5 5 5-5H7z'/></svg>");
}

.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-left: 5px;
  margin-right: -5px;
}

.card {
  width: 400px;
  height: 200px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-top: -10px;
}

.card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.header {
  font-weight: bold;
  color: #FFFFFF;
  background-color: #295f98;
  height: 40px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;


}

.grade,
.subjects,
.teacher {
    text-align: start;
    padding-left: 10px;
    color: #295F98;
}

.grade {
  font-size: 37px;
  margin-top: 5px;
  font-weight: 500;
}

.teacher {
  font-size: 15px;
  padding-left: 16px;
}

.subjects {
  font-size: 23px;
  padding-left: 16px;
}

.seal {
  position: absolute;
  bottom: -30px;
  right: -30px;
  width: 130px;
  height: auto;
  opacity: 0.5;
}

.back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: 24px;
    color: #333;
    transition: color 0.2s;
    font-weight: 600;
}

span:hover {
    text-decoration: underline;
}

.chevron {
    font-size: 25px;
}
</style>
