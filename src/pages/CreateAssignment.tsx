import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const CreateAssignment: React.FC = () => {

    const { classroomId } = useParams<{ classroomId: string }>();
    const { user } = useSelector((state: any) => state.user) || {};

    const createdById = user?.id;

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        classroomId: classroomId ?? "",
        createdById: createdById ?? "",
    });
    const [file, setFile] = useState<File | null>(null);


    const updateForm = (field: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Form Data:", formData);
        console.log("File:", file);

        const submissionData = new FormData();
        submissionData.append("title", formData.title);
        submissionData.append("content", formData.content);
        submissionData.append("classroomId", formData.classroomId);
        submissionData.append("createdById", formData.createdById);
        if (file) submissionData.append("file", file);

        try {
            const response = await axios.post(
                `http://localhost:8080/api/classrooms/assignments/add`,
                submissionData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Assignment created successfully!");
                // Reset form
                setFormData({
                    title: "",
                    content: "",
                    classroomId: classroomId ?? "",
                    createdById: createdById ?? "",
                });
                setFile(null);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to create assignment.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title</label>
                <input type="text" value={formData.title}
                    onChange={(e) => updateForm("title", e.target.value)} required />
            </div>
            <div>
                <label>Content</label>
                <textarea value={formData.content}
                    onChange={(e) => updateForm("content", e.target.value)}
                />
            </div>
            <div>
                <label>Upload PDF</label>
                <input type="file" accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
            <button type="submit">Create Assignment</button>
        </form>
    );
};

export default CreateAssignment;