import axiosClient from "./axiosClient";

export const getStudents = async (collegeId?: number) => {
    const url = collegeId ? `/university/students?college_id=${collegeId}` : `/university/students`;
    const res = await axiosClient.get(url);
    return res.data;
};
