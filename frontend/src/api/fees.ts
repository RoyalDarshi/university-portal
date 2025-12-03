import axiosClient from "./axiosClient";

// University: fee summary (optionally filtered by college)
export const getUniversityFeeSummary = async (collegeId?: number) => {
    const url = collegeId
        ? `/university/fees/summary?college_id=${collegeId}`
        : "/university/fees/summary";

    const res = await axiosClient.get(url);
    return res.data as FeeSummaryItem[];
};

// Student: own summary
export const getStudentFeeSummary = async (studentId: number) => {
    const res = await axiosClient.get(`/student/fees/summary`, {
        params: { student_id: studentId },
    });
    return res.data;
};

// Student: own payment history
export const getStudentFeeHistory = async (studentId: number) => {
    const res = await axiosClient.get(`/student/fees/history`, {
        params: { student_id: studentId },
    });
    return res.data;
};

// College: record a payment
export const recordPayment = async (payload: {
    student_id: number;
    amount: number;
    mode: string;
    trans_id: string;
}) => {
    const res = await axiosClient.post("/college/fees/pay", payload);
    return res.data;
};

// Types (mirror backend FeeSummaryItem)
export interface FeeSummaryItem {
    student_id: number;
    student_name: string;
    enrollment: string;
    college_name: string;
    course_name: string;
    total_fee: number;
    paid_amount: number;
    pending_amount: number;
    status: "Paid" | "Partial" | "Pending" | "No Fee" | string;
}
