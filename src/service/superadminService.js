import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
});



// Classes Tab
export const getClassesWithStudentCount = async () => {
  try {
    const response = await API.get("/superadmin/classes-with-students");
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error.response ? error.response.data : error;
  }
};

// Student Grade Count by Grade Level
export const getStudentCountPerGradeLevel = async () => {
  try {
    const response = await API.get("/super-admin/getcountofstudents");
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error.response ? error.response.data : error;
  }
};

// Get the count for Teacher Dashboard for Status Pending, Accepted and Decline
export const getStudentStatusCounts = async () => {
  try {
    const response = await API.get("/super-admin/status-counts");
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error.response ? error.response.data : error;
  }
};


//Dashboard "Teacher" get the Recently Added Faculties
export const getRecentFaculties = async (limit = 5) => {
  try {
    const response = await API.get('/super-admin/recent-faculties', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error.response ? error.response.data : error;
  }
};



// Dashboard Summary Stats (Teachers, Students, Pending Grades)
export const getSummaryStats = async () => {
  try {
    const response = await API.get("/super-admin/summary-stats");
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error.response ? error.response.data : error;
  }
};


// Students Tab
export const getAllStudentsData = async () => {
  try {
    const response = await API.get("/superadmin/students");
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error.response ? error.response.data : error;
  }
};


// Students Modal
export const getStudentById = async (id) => {
  try {
    const response = await API.get(`/superadmin/student/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching student by ID:", error);
    throw error;
  }
};

// Accept Student
export const acceptStudent = async (id) => {
  try {
    const response = await API.put(`/superadmin/student/${id}/accept`);
    return response.data;
  } catch (error) {
    console.error("Error accepting student:", error);
    throw error.response ? error.response.data : error;
  }
};

// Decline Student
export const declineStudent = async (id, comment) => {
  try {
    const response = await API.put(`/superadmin/student/${id}/decline`, {
      comment: comment, // ✅ Send the comment as request payload
    });
    return response.data;
  } catch (error) {
    console.error("Error declining student:", error);
    throw error.response ? error.response.data : error;
  }
};


// Lesson Plans Get All
export const getAllLessonPlans = async () => {
  try {
    const response = await API.get("/superadmin/lesson-plans");
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error.response ? error.response.data : error;
  }
};

// Approve Lesson Plan
export const approveLessonPlan = async (lessonPlanId) => {
  try {
    const response = await API.put(`/superadmin/lesson-plans/${lessonPlanId}/approve`);
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error.response ? error.response.data : error;
  }
};

// Decline Lesson Plan 
export const rejectLessonPlan = async (lessonPlanId) => {
  try {
    const response = await API.put(`/superadmin/lesson-plans/${lessonPlanId}/decline`);
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error.response ? error.response.data : error;
  }
};

// Get Specific Lesson Plan
export const getLessonPlanById = async (lessonPlanId) => {
  try {
    const response = await API.get(`/superadmin/lesson-plans/${lessonPlanId}`);
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error.response ? error.response.data : error;
  }
};


// Settings Tab
export const getAllSubjects = async () => {
  try {
    const response = await API.get("/testing/subjects");
    return response.data.data; // assuming you want only the 'data' field
  } catch (error) {
    console.error("Error fetching all subjects:", error);
    throw error.response ? error.response.data : error;
  }
};

export const getSubjectById = async (id) => {
  try {
    const response = await API.get(`/testing/${id}`);
    return response.data.data; // assuming you want only the 'data' field
  } catch (error) {
    console.error("Error fetching subject by ID:", error);
    throw error.response ? error.response.data : error;
  }
};

export const deleteSubjectById = async (id) => {
  try {
    const response = await API.delete(`/testing/${id}`);
    return response.data; // returns the full response with status and message
  } catch (error) {
    console.error("Error deleting subject:", error);
    throw error.response ? error.response.data : error;
  }
};

export const getAllSchoolYears = async () => {
  try {
    const response = await API.get("/testings/school-years");
    return response.data.data; // assuming 'data' holds the actual school years
  } catch (error) {
    console.error("Error fetching school years:", error);
    throw error.response ? error.response.data : error;
  }
};

export const getAllSections = async () => {
  try {
    const response = await API.get("/test/sections");
    return response.data.data; // assuming 'data' holds the actual sections
  } catch (error) {
    console.error("Error fetching sections:", error);
    throw error.response ? error.response.data : error;
  };
}

export const createSubject = async (subjectData) => {
  try {
    const response = await API.post("/test/", subjectData);
    return response.data; // returns { status: 'success', data: { ... } }
  } catch (error) {
    console.error("Error creating subject:", error);
    throw error.response ? error.response.data : error;
  }
};

export const createSchoolYear = async (schoolYearData) => {
  try {
    const response = await API.post("/test/school-years", schoolYearData);
    return response.data; // { status: 'success', message: 'School year created...', data: {...} }
  } catch (error) {
    console.error("Error creating school year:", error);
    throw error.response ? error.response.data : error;
  }
};
  export const createSection = async (CreateSection) => {
  try {
    const response = await API.post("settings/test/sub", CreateSection);
    return response.data; 
  } catch (error) {
    console.error("Error creating school year:", error);
    throw error.response ? error.response.data : error;
  }
};

export const deleteClassById = async (id) => {
  try {
    const response = await API.delete(`/testing/Subjects/${id}`);
    return response.data; // { message: "Class deleted successfully." }
  } catch (error) {
    console.error("Error deleting class:", error);
    throw error.response ? error.response.data : error;
  }
};
