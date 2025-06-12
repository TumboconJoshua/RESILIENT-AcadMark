import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // example: 'http://localhost:8000/api'
    withCredentials: false,
});

// Get all students
export const getAllStudents = async () => {
    try {
        const response = await API.get("/student/getAll");
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

// Create a new student
export const createStudent = async (studentData) => {
    try {
        const response = await API.post("/student/add", studentData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const bulkRegisterStudents = async (formData) => {
    try {
        const response = await API.post("/student/bulk-upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

// get all pending 
export const getAllPendingStudents = async () => {
    try {
        const response = await API.get("/student/getAllPending");
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

//get all accepted
export const getAllAcceptedStudents = async () => {
    try {
        const response = await API.get("/student/getAllAccepted");
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getStudentsNoClass = async () => {
    try {
        const response = await API.get("/student/get-students-no-class");
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const editStudent = async (id, updatedData) => {
    try {
        const response = await API.put(`/students/update/${id}`, updatedData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const dropStudent = async (studentId, dropOutComments = '') => {
    try {
        const payload = {
            student_id: studentId,
            drop_out_comments: dropOutComments
        };

        const response = await API.post('/students/mark-dropout', payload);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

    export const acceptDropStudent = async (studentId) => {
        try {
            const payload = { student_id: studentId };

            const response = await API.post('/students/approve-mark-dropout', payload);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    };


export const rejectDropStudent = async (studentId) => {
    try {
        const payload = { student_id: studentId };

        const response = await API.post('/students/reject-mark-dropout', payload);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
    