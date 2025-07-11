<template>
  <div class="w-full">
    <div class="flex items-center space-x-6 mb-6">
      <h1 class="text-5xl font-bold text-[#295f98]">Grades</h1>
    </div>

    <div class="content mt-3 mb-6">
      <div class="filtering-section">
        <select v-model="selectedGrade" class="filter-dropdown">
          <option value="">Grade Level (All)</option>
          <option v-for="grade in grades" :key="grade" :value="grade">
            Grade {{ grade }}
          </option>
        </select>

        <select v-model="selectedCurriculum" class="filter-dropdown">
          <option value="">Curriculum (All)</option>
          <option v-for="curriculum in curriculums" :key="curriculum" :value="curriculum">
            {{ curriculum }}
          </option>
        </select>

        <select v-model="selectedTrack" class="filter-dropdown">
          <option value="">Track (All)</option>
          <option v-for="track in tracks" :key="track" :value="track">
            {{ track }}
          </option>
        </select>
      </div>

      <!-- CARD -->
      <div class="card-grid mt-9">
        <div class="card cursor-pointer hover:shadow-lg transition" v-for="(card, index) in filteredCards" :key="index"
          @click="goToInsideCard(card)">
          <div class="header" v-if="card.curriculum">
            <p>
              {{ card.curriculum === 'JHS' ? 'Junior High School' : card.curriculum === 'SHS' ? 'Senior High School' : card.curriculum }}
            </p>
          </div>
          <div class="grade">{{ card.gradeLabel }}</div>
          <div class="section" v-if="card.section && card.curriculum">
            {{ card.section }} - {{ card.curriculum }}
          </div>
          <div class="seal">
            <img src="/assets/img/logo.png" alt="">
          </div>
        </div>
      </div>


    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { getAllData } from '@/service/gradeService';

const router = useRouter();


const allClasses = ref([]);
const selectedClassData = ref(null);

onMounted(async () => {
  try {
    const response = await getAllData();

    console.log("DATA:", response);

    if (response.status === 'success') {
      allClasses.value = response.data;

      // Map the data into the structure expected by the UI
      cards.value = response.data.map(item => {
        return {
          grade: parseInt(item.gradeLevel),                // Parse to number
          gradeLabel: `Grade ${item.gradeLevel}`,          // e.g., "Grade 7"
          section: item.className.split('-')[1]?.trim() || '', // Get section if exists
          curriculum: item.curriculum,
          track: item.track,
          class_id: item.class_id
        };
      });


      console.log("Mapped Cards:", cards.value);
    }
  } catch (err) {
    console.error('Failed to fetch data:', err);
  }
});


function goToInsideCard(card) {
  const selected = allClasses.value.find(c => c.class_id === card.class_id);

  console.log("Selected class data to pass:", selected);
  console.log("Route params to pass:", {
    grade: card.grade,
    section: card.section
  });

  // Store selected class data temporarily
  sessionStorage.setItem('selectedClassData', JSON.stringify(selected));

  router.push({
    name: 'subjectcards',
    params: {
      Grade: card.grade,
      section: card.section
    }
  });
}


const selectedGrade = ref("");
const selectedCurriculum = ref("");
const selectedTrack = ref("");

// Static options for filters
const grades = [7, 8, 9, 10, 11, 12];
const curriculums = ["BEC", "K-12", "SPED"];
const tracks = ["STEM", "ABM", "TVL", "HUMSS"];

// Placeholder for dynamic card data (to be filled via backend/API)
const cards = ref([]); // ← Add your backend-fetched data here

const filteredCards = computed(() => {
  return cards.value.filter(card => {
    const matchGrade = !selectedGrade.value || card.grade === Number(selectedGrade.value);
    const matchCurriculum = !selectedCurriculum.value || card.curriculum === selectedCurriculum.value;
    const matchTrack = !selectedTrack.value || card.track === selectedTrack.value;
    return matchGrade && matchCurriculum && matchTrack;
  });
});
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
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' fill='%23295f98'><path d='M7 10l5 5 5-5H7z'/></svg>");
}

.filter-dropdown:focus {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' fill='%23295f98'><path d='M7 14l5-5 5 5H7z'/></svg>");
}

.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-left: 5px;
  margin-right: -5px;
}

.card {
  width: 350px;
  height: 200px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-top: 10px;
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
  padding: 13px 25px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

}

.grade,
.section {
    text-align: start;
    padding-left: 10px;
    color: #295F98;
}

.grade {
  font-size: 40px;
  margin-top: 5px;
  font-weight: 500;
}

.section {
  font-size: 16px;
  padding-left: 16px;
}

.seal {
  position: absolute;
  bottom: -20px;
  right: -25px;
  width: 95px;
  height: auto;
  opacity: 0.5;
}
</style>
