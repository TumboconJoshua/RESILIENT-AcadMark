<template>
  <transition name="modal-fade" @after-leave="emitClose">
    <div class="modal-overlay" v-if="showModal" @click.self="closeModal">
      <div class="modal-content">
        <button @click="closeModal" class="absolute top-5 right-6 text-gray-500 hover:text-gray-800 text-3xl cursor-pointer">&times;</button>
        <h2 class="modal-title">Individual Registration Form</h2>
        <form @submit.prevent="submitForm">
          <!-- Row 1 -->
          <div class="form-row">
            <div class="form-group">
              <label>Grade Level</label>
              <select v-model="form.gradeLevel" class="w-[350px]" required>
                <option disabled value="">Select Grade</option>
                <option>Grade 7</option>
                <option>Grade 8</option>
                <option>Grade 9</option>
                <option>Grade 10</option>
                <option>Grade 11</option>
                <option>Grade 12</option>
              </select>
            </div>
            <div class="form-group">
              <label>Curriculum</label>
              <select v-model="form.curriculum" class="w-[350px]">
                <option disabled value="">Select Curriculum</option>
                <option>Junior High School</option>
                <option>Senior High School</option>
              </select>
            </div>
            <div class="form-group">
              <label>Track</label>
              <select v-model="form.track" class="w-[350px]">
                <option disabled value="">Select Track</option>
                <option>STEM</option>
                <option>ABM</option>
                <option>HUMSS</option>
                <option>GAS</option>
                <option>TVL</option>
                <option>Sports</option>
              </select>
            </div>
            <div class="form-group">
              <label>LRN</label>
              <input type="text" v-model="form.lrn" class="w-[350px]" />
            </div>
          </div>

          <!-- Row 2 -->
          <div class="form-row">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" v-model="form.fullName" class="w-[350px]" />
            </div>
            <div class="form-group">
              <label>Sex</label>
              <select v-model="form.sex" class="w-[160px]">
                <option disabled value="">Select Sex</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div class="form-group">
              <label>Birth Date (mm/dd/yy)</label>
              <input type="date" v-model="form.birthdate" class="w-[350px]" />
            </div>
            <div class="form-group">
              <label>Age</label>
              <input type="text" v-model="form.age" class="w-[160px]" />
            </div>
            <div class="form-group">
              <label>Religious Affiliation</label>
              <input type="text" v-model="form.religiousAffiliation" class="w-[350px]" />
            </div>
          </div>

          <!-- Row 3 -->
          <div class="form-row">
            <div class="form-group">
              <label>House No. / Street / Purok</label>
              <input type="text" v-model="form.street" class="w-[350px]" />
            </div>
            <div class="form-group">
              <label>Barangay</label>
              <input type="text" v-model="form.barangay" class="w-[350px]" />
            </div>
            <div class="form-group">
              <label>Municipality/City</label>
              <input type="text" v-model="form.city" class="w-[350px]" />
            </div>
            <div class="form-group">
              <label>Province</label>
              <input type="text" v-model="form.province" class="w-[350px]" />
            </div>
          </div>

          <!-- Row 4 -->
          <div class="form-row">
            <div class="form-group">
              <label>Father’s Name</label>
              <input type="text" v-model="form.fatherName" class="w-[350px]" />
            </div>
            <div class="form-group">
              <label>Mother’s Name</label>
              <input type="text" v-model="form.motherName" class="w-[350px]" />
            </div>
            <div class="form-group">
              <label>Guardian’s Name</label>
              <input type="text" v-model="form.guardianName" class="w-[230px]" />
            </div>
            <div class="form-group">
              <label>Relationship w/ Guardian</label>
              <input type="text" v-model="form.guardianRelationship" class="w-[230px]" />
            </div>
            <div class="form-group">
              <label>Guardian/Parent Contact No.</label>
              <input type="text" v-model="form.guardianContact" class="w-[230px]" />
            </div>
          </div>

          <!-- Comment Section -->
          <div class="form-comment">
            <label class="title">COMMENT</label>
            <textarea rows="6" v-model="form.comment" placeholder="Enter comment..."></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="rejectAlert">Decline</button>
            <button type="submit" class="submit-btn">Accept</button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>


<script setup>
import { reactive, watch } from "vue";
import Swal from "sweetalert2";
import { acceptStudent, declineStudent } from "@/service/superadminService";

// Props
const props = defineProps({
  student: {
    type: Object,
    required: true,
  },
  showModal: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["close", "refresh"]);

// Form state
const form = reactive({
  gradeLevel: "",
  curriculum: "",
  track: "",
  lrn: "",
  fullName: "",
  sex: "",
  birthdate: "",
  age: "",
  religiousAffiliation: "",
  street: "",
  barangay: "",
  city: "",
  province: "",
  fatherName: "",
  motherName: "",
  guardianName: "",
  guardianRelationship: "",
  guardianContact: "",
  comment: "",
});

// Local reusable refresh function
function refresh() {
  emit("refresh");
}

// Load data from props.student
watch(
  () => props.student,
  (student) => {
    if (student) {
      form.gradeLevel = student.Grade_Level ? `Grade ${student.Grade_Level}` : "";
      form.curriculum = student.Curriculum === "JHS" ? "Junior High School" : student.Curriculum === "SHS" ? "Senior High School" : "";
      form.track = student.Track || "";
      form.lrn = student.LRN || "";
      form.fullName = `${student.FirstName || ""} ${student.MiddleName || ""} ${student.LastName || ""} ${student.Suffix || ""}`.replace(/\s+/g, " ").trim();
      form.sex = student.Sex === "M" ? "Male" : student.Sex === "F" ? "Female" : "";
      form.birthdate = student.BirthDate || "";
      form.age = student.Age || "";
      form.religiousAffiliation = student.Religion || "";
      form.street = student.HouseNo || "";
      form.barangay = student.Barangay || "";
      form.city = student.Municipality || "";
      form.province = student.Province || "";
      form.fatherName = student.FatherName || "";
      form.motherName = student.MotherName || "";
      form.guardianName = student.Guardian || "";
      form.guardianRelationship = student.Relationship || "";
      form.guardianContact = student.ContactNumber || "";
      form.comment = student.comments || "";
    }
  },
  { immediate: true }
);

// Accept Student
async function submitForm() {
  try {
    await acceptStudent(props.student.Student_ID);
    Swal.fire({
      icon: "success",
      title: "Accepted",
      text: "Student registration accepted.",
    }).then(() => {
      window.location.reload(); // 🔁 Reload after confirmation
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to accept student.",
    });
  }
}


// Reject Student
async function rejectAlert() {
  if (form.comment.trim() === "") {
    Swal.fire({
      icon: "warning",
      title: "Comment Required",
      text: "Please provide a comment before rejecting.",
    });
    return;
  }

  const result = await Swal.fire({
    title: "Are you sure you want to reject this student?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, reject",
  });

  if (result.isConfirmed) {
    try {
      // ✅ Pass the comment as second argument
      await declineStudent(props.student.Student_ID, form.comment);
      Swal.fire("Rejected!", "The student has been rejected.", "success").then(() => {
        window.location.reload(); // 🔁 Reload after confirmation
      });
    } catch (error) {
      Swal.fire("Error", "Failed to reject student.", "error");
    }
  }
}



function closeModal() {
  emit("close");
}

function emitClose() {
  emit("close");
}
</script>


<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .modal-content {
    position: relative;
    background: white;
    padding: 30px;
    border-radius: 8px;
    width: 95%;
    max-width: 1572px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

.modal-close-btn {
  position: absolute;
  top: 15px;
  right: 25px;
  font-size: 40px;
  background: none;
  border: none;
  color: #000;
  cursor: pointer;
  z-index: 10001;
}

.modal-close-btn:hover {
  color: #D30000;
}

  
  .modal-title {
    margin: 0 0 20px 0;
    font-weight: 500;
    font-size: 24px;
    text-align: left;
    color: #295f98;
  }
  
  .form-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

  
  label {
    margin-bottom: 6px;
    font-size: 12px;
  }
  
  input,
  select {
    padding: 8px 10px;
    border-radius: 5px;
    border: 1px solid #000000;
    font-size: 1rem;
    box-sizing: border-box;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 30px;
  }

  .form-comment {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  textarea {
    border: 1px solid #000000;
    padding: 10px;
  }

  .title {
    font-size: 24px;
    color: #295F98;
    font-weight: 500;
  }
  
  .form-actions {
    width: 100%;
    display: flex;
    justify-content: end;
    gap: 15px;
}
.cancel-btn,
.submit-btn {
    padding: 5px 30px;
    align-items: center;
    color: #ffffff;
    border-radius: 5px;
    cursor: pointer;
}
.cancel-btn {
    background-color: #D30000;
}
.submit-btn {
    background-color: #0C5A48;
}
  /* Modal transition */
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }
  </style>
  
<style>
.swal2-container {
  z-index: 10000 !important;
}
</style>