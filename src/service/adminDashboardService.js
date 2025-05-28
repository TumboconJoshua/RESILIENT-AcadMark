import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
});

/**
 * Fetch the total number of students.
 */
export const getStudentCount = async () => {
  try {
    const response = await API.get('/dashboard/students/count');
    return response.data.total_students;
  } catch (error) {
    console.error("Failed to fetch student count:", error);
    throw error;
  }
};

export const getTeacherCount = async () => {
  try {
    const response = await API.get('/dashboard/teachers/count');
    return response.data.total_teachers;
  } catch (error) {
    console.error("Failed to fetch teacher count:", error);
    throw error;
  }
};

export const getStudentGradeDistribution = async () => {
  try {
    const response = await API.get('/dashboard/students/grade-distribution');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch student grade distribution:", error);
    throw error;
  }
};

export async function getStudentGenderDistribution() {
  try {
    const response = await API.get('dashboard/students/gender-distribution');
    return response.data;
  } catch (error) {
    console.error('Error fetching gender distribution:', error);
    throw error;
  }
}

export const getAcceptedClassesCount = async () => {
  try {
    const response = await API.get('/dashboard/accepted-classes/count');
    return response.data.accepted_classes_count;
  } catch (error) {
    console.error("Failed to fetch accepted classes count:", error);
    throw error;
  }
};

export const getLatestStudents = async () => {
  try {
    const response = await API.get('/dashboard/students/latest');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch latest students:", error);
    throw error;
  }
};

export const getSubmissionStatusCounts = async () => {
  try {
    const response = await API.get('/dashboard/students/status-counts');
    return response.data;
  } catch (error) {
    console.error('Error fetching student status counts:', error);
    throw error;
  }
};

export const getAcceptedStudentsPerGrade = async () => {
  try {
    const response = await API.get('/dashboard/accepted-students-per-grade');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch accepted students per grade:", error);
    throw error;
  }
};

export const fetchPendingCount = async () => {
  try {
    const response = await API.get('/count-pending-classes');
    console.log("classcount: ", response.data);
    return response.data.pending_classes_count;
    // console.log('Pending classes:', response.data.pending_classes_count);
  } catch (error) {
    console.error('Error fetching pending count:', error);
  }
}
export const fetchPendingCountPerGrade = async () => {
  try {
    const response = await API.get('/pending-gradelevel');
    console.log("Class count per grade: ", response.data);
    return response.data.pending_classes_per_grade;
  } catch (error) {
    console.error('Error fetching pending count per grade:', error);
    return [];
  }
};

export const getpendingStudentCount = async () => {
  try {
    const response = await API.get('/pending-students');
    return response.data.total_pending_students;
  } catch (error) {
    console.error("Failed to fetch student count:", error);
    throw error;
  }
};





