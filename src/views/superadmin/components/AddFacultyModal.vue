<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-[100] flex items-center justify-center"
    :style="{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }"
    @click.self="$emit('update:modelValue', false)"
  >
    <div class="bg-white p-6 rounded-md w-[1000px] shadow-lg max-w-full">
      <h2 class="text-xl text-[#295f98] font-semibold mb-6">Add Personnel</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4 p-2">
        <!-- Profile Section -->
        <h1 class="font-semibold text-[#295f98]">Profile</h1>
        <div class="flex gap-4 mb-6">
          <div class="floating-label flex-1" :class="{ filled: firstName }">
            <input
              v-model="firstName"
              type="text"
              placeholder=" "
              class="input"
              required
            />
            <label>First Name</label>
          </div>
          <div class="floating-label flex-1" :class="{ filled: middleName }">
            <input
              v-model="middleName"
              type="text"
              placeholder=" "
              class="input"
            />
            <label>Middle Name</label>
          </div>
          <div class="floating-label flex-1" :class="{ filled: lastName }">
            <input
              v-model="lastName"
              type="text"
              placeholder=" "
              class="input"
              required
            />
            <label>Last Name</label>
          </div>
          <div class="floating-label flex-1" :class="{ filled: suffix }">
            <input v-model="suffix" type="text" placeholder=" " class="input" />
            <label>Suffix</label>
          </div>
        </div>

        <!-- Employment Section -->
        <div class="flex gap-4 mb-6">
          <div class="floating-label flex-1" :class="{ filled: employeeNumber }">
            <input
              v-model="employeeNumber"
              type="text"
              placeholder=" "
              class="input"
              required
            />
            <label>Employee Number</label>
          </div>
          <div class="floating-label flex-1" :class="{ filled: teachingPosition }">
            <input
              v-model="teachingPosition"
              type="text"
              placeholder=" "
              class="input"
            />
            <label>Teaching Position</label>
          </div>
          <div class="floating-label flex-2" :class="{ filled: educationalAttainment }">
            <input
              v-model="educationalAttainment"
              type="text"
              placeholder=" "
              class="input"
            />
            <label>Educational Attainment</label>
          </div>
        </div>

      

              <!-- Additional Information Section -->
      <h1 class="font-semibold text-[#295f98]">Additional Info</h1>
      <div class="flex gap-4 mb-6">
        <div class="floating-label flex-1" :class="{ filled: birthDate }">
          <input
            v-model="birthDate"
            type="date"
            placeholder=" "
            class="input"
          />
          <label>Birth Date</label>
        </div>

        <div class="floating-label flex-1" :class="{ filled: sex }">
          <select v-model="sex" class="input">
            <option value="" disabled selected hidden></option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
          <label>Sex</label>
          <span class="custom-arrow"></span>
        </div>
      </div>

      <div class="flex gap-4 mb-6">
        <div class="floating-label flex-1" :class="{ filled: contactNumber }">
          <input
            v-model="contactNumber"
            type="text"
            placeholder=" "
            class="input"
          />
          <label>Contact Number</label>
        </div>

        <div class="floating-label flex-1" :class="{ filled: address }">
          <input
            v-model="address"
            type="text"
            placeholder=" "
            class="input"
          />
          <label>Address</label>
        </div>
      </div>

        <!-- Account Setup Section -->
        <h1 class="font-semibold text-[#295f98]">Account Setup</h1>
        <div class="flex gap-4 mb-6">
          <div class="floating-label flex-2" :class="{ filled: email }">
            <input
              v-model="email"
              type="email"
              placeholder=" "
              class="input"
              required
            />
            <label>Email</label>
          </div>
          <div class="floating-label flex-1" :class="{ filled: password }">
            <input
              v-model="password"
              type="password"
              placeholder=" "
              class="input"
              required
            />
            <label>Password</label>
          </div>
          <div class="floating-label flex-1" :class="{ filled: confirmPassword }">
            <input
              v-model="confirmPassword"
              type="password"
              placeholder=" "
              class="input"
              required
            />
            <label>Confirm Password</label>
          </div>
        </div>


            <div v-if="selectedAccession === 'Teacher'">
      <h1 class="font-semibold text-[#295f98] mb-2">Teacher Subject</h1>
      <div class="flex gap-4 mb-4">
        <div class="floating-label flex-1" :class="{ filled: subject1 }">
          <select v-model="subject1" class="input" required>
            <option value="" disabled selected hidden>Select Subject 1</option>
            <option v-for="subject in subjects" :key="subject.Subject_ID" :value="subject.Subject_ID">
              {{ subject.SubjectName }}
            </option>
          </select>
          <label>{{ subject1 ? capitalize(subject1) : 'Subject 1' }}</label>
          <span class="custom-arrow"></span>
        </div>

        <div v-if="showSubject2" class="floating-label flex-1" :class="{ filled: subject2 }">
          <select v-model="subject2" class="input">
            <option value="" disabled selected hidden>Select Subject 2</option>
            <option v-for="subject in subjects" :key="subject.Subject_ID" :value="subject.Subject_ID">
              {{ subject.SubjectName }}
            </option>
          </select>
          <label>{{ subject2 ? capitalize(subject2) : 'Subject 2' }}</label>
          <span class="custom-arrow"></span>
        </div>

        <button
          type="button"
          @click="toggleSubject2"
          class="px-5 py-3.5 text-white rounded cursor-pointer"
          :class="showSubject2 ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'"
        >
          {{ showSubject2 ? '-' : '+' }}
        </button>
      </div>
    </div>


   <!-- Accession Section -->
        <h2 class="text-xl text-[#295f98] font-semibold mb-6">Accession</h2>
        <div class="flex gap-6 items-center">
          <label class="flex flex-col items-center gap-1 cursor-pointer select-none">
            <span class="font-semibold text-[#295f98] mb-4">Teacher</span>
            <input type="radio" value="Teacher" v-model="selectedAccession" class="hidden" />
            <div :class="[ 'w-18 h-6 rounded-full flex items-center transition-colors duration-300', selectedAccession === 'Teacher' ? 'bg-blue-600' : 'bg-gray-300' ]">
              <div :class="[ 'w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300', selectedAccession === 'Teacher' ? 'translate-x-12' : 'translate-x-1' ]"></div>
            </div>
          </label>

        <label class="flex flex-col items-center gap-1 cursor-pointer select-none">
          <span class="font-semibold text-[#295f98] mb-4">Admin</span>
          <input type="radio" value="Admin" v-model="selectedAccession" class="hidden" />
          <div :class="[ 'w-18 h-6 rounded-full flex items-center transition-colors duration-300', selectedAccession === 'Admin' ? 'bg-blue-600' : 'bg-gray-300' ]">
            <div :class="[ 'w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300', selectedAccession === 'Admin' ? 'translate-x-12' : 'translate-x-1' ]"></div>
          </div>
        </label>

        <label class="flex flex-col items-center gap-1 cursor-pointer select-none">
          <span class="font-semibold text-[#295f98] mb-4">Book-keeping</span>
          <input type="radio" value="Book-keeping" v-model="selectedAccession" class="hidden" />
          <div :class="[ 'w-18 h-6 rounded-full flex items-center transition-colors duration-300', selectedAccession === 'Book-keeping' ? 'bg-blue-600' : 'bg-gray-300' ]">
            <div :class="[ 'w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300', selectedAccession === 'Book-keeping' ? 'translate-x-12' : 'translate-x-1' ]"></div>
          </div>
        </label>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end mt-6 gap-2">
          <button
            type="button"
            @click="$emit('update:modelValue', false)"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-[#295f98] text-white rounded hover:bg-blue-900 cursor-pointer"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue'; // <-- make sure to import watch
import Swal from 'sweetalert2';
import axios from 'axios';

const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue', 'submit']);

// Form state
const firstName = ref('');
const middleName = ref('');
const lastName = ref('');
const suffix = ref('');

const subjects = ref([]);

const employeeNumber = ref('');
const educationalAttainment = ref('');
const teachingPosition = ref('');

const subject1 = ref('');
const subject2 = ref('');

const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const selectedAccession = ref('');

const birthDate = ref('');
const sex = ref('');
const contactNumber = ref('');
const address = ref('');

const showSubject2 = ref(false);


const toggleSubject2 = () => {
  showSubject2.value = !showSubject2.value;
  if (!showSubject2.value) {
    subject2.value = '';
  }
};

const getSelectedSubjects = () => {
  return [subject1.value, subject2.value].filter(Boolean);
};

const allRequiredFieldsFilled = () => {
  return (
    firstName.value.trim() !== '' &&
    lastName.value.trim() !== '' &&
    employeeNumber.value.trim() !== '' &&
    email.value.trim() !== '' &&
    password.value.trim() !== '' &&
    confirmPassword.value.trim() !== '' &&
    selectedAccession.value != null && selectedAccession.value !== '' &&
    // Only require subject1 if Teacher is selected
    (selectedAccession.value !== 'Teacher' || (subject1.value != null && subject1.value !== ''))
  );
};


const handleSubmit = async () => {
  if (!allRequiredFieldsFilled()) {
    Swal.fire({
      icon: 'error',
      title: 'Missing Fields',
      text: 'Please fill in all required fields.',
    });
    return;
  }

  if (password.value !== confirmPassword.value) {
    Swal.fire({
      icon: 'error',
      title: 'Password Mismatch',
      text: 'Password and Confirm Password do not match.',
    });
    return;
  }

watch(selectedAccession, (val) => {
  if (val !== 'Teacher') {
    subject1.value = '';
    subject2.value = '';
    showSubject2.value = false;
  }
});


  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to save this faculty member?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, save it!',
    cancelButtonText: 'Cancel',
  });

  if (result.isConfirmed) {
      const formData = {
  Email: email.value,
  Password: password.value,
  ConfirmPassword: confirmPassword.value,
  EmployeeNo: employeeNumber.value,
  Educational_Attainment: educationalAttainment.value,
  Teaching_Position: teachingPosition.value,
  FirstName: firstName.value,
  LastName: lastName.value,
  MiddleName: middleName.value,
  Suffix: suffix.value,
  BirthDate: birthDate.value,
  Sex: sex.value,
  Position: selectedAccession.value,
  ContactNumber: contactNumber.value,
  Address: address.value,
  ...(selectedAccession.value === 'Teacher' && {
    Subject_IDs: getSelectedSubjects(),
  }),
};
    try {
      const token = localStorage.getItem('token');

      await fetch('http://127.0.0.1:8000/api/teacher/create-teacher', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      emit('submit', formData);

      // Reset form
      firstName.value = '';
      middleName.value = '';
      lastName.value = '';
      suffix.value = '';
      employeeNumber.value = '';
      educationalAttainment.value = '';
      teachingPosition.value = '';
      subject1.value = '';
      subject2.value = '';
      email.value = '';
      password.value = '';
      confirmPassword.value = '';
      selectedAccession.value = '';
      showSubject2.value = false;
      birthDate.value = '';
      sex.value = '';
      contactNumber.value = '';
      address.value = '';

      emit('update:modelValue', false);

      Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: 'Faculty member has been saved successfully.',
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while saving the faculty member.',
      });
      console.error(error);
    }
  }
};

const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';  // Ensure it's a string
  return str.charAt(0).toUpperCase() + str.slice(1);
};

onMounted(async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/subject/getSubjects');
    subjects.value = response.data;
  } catch (error) {
    console.error('Error fetching subjects:', error);
  }
});
</script>


<style scoped>
.floating-label {
  position: relative;
  display: flex;
  flex-direction: column;
}

.floating-label .input {
  padding: 0.75rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  background: white;
  appearance: none;
}

.floating-label label {
  position: absolute;
  left: 0.5rem;
  top: 0.75rem;
  background: white;
  color: #888;
  padding: 0 0.25rem;
  transition: all 0.2s ease;
  pointer-events: none;
}

.floating-label input:focus + label,
.floating-label select:focus + label,
.floating-label.filled label {
  transform: translateY(-1.5rem);
  font-size: 0.75rem;
  color: #2563eb;
}

.custom-arrow {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  pointer-events: none;
  width: 1rem;
  height: 1rem;
  background-image: url('data:image/svg+xml;utf8,<svg fill="%23888888" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  transform: translateY(-50%);
  transition: background-image 0.2s ease;
}

.floating-label select:focus + label + .custom-arrow {
  background-image: url('data:image/svg+xml;utf8,<svg fill="%232563eb" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
}
</style>
