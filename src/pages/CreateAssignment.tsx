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
        classroomId: classroomId || "",
        createdById: createdById || "",
        dueDate: new Date().toISOString().slice(0, 16),
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

        if (!file) {
            toast.error("Please upload a PDF file.");
            return;
        }

        const submissionData = new FormData();
        submissionData.append("title", formData.title);
        submissionData.append("content", formData.content);
        submissionData.append("classroomId", formData.classroomId);
        submissionData.append("createdById", formData.createdById);
        submissionData.append("dueDate", formData.dueDate);
        submissionData.append("file", file);

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
                setFormData({
                    title: "",
                    content: "",
                    classroomId: classroomId || "",
                    createdById: createdById || "",
                    dueDate: new Date().toISOString().slice(0, 16),
                });
                setFile(null);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to create assignment.");
        }
    };

    const [dragging, setDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => setDragging(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile && droppedFile.type === "application/pdf") {
            setFile(droppedFile);
        } else {
            toast.error("Only PDF files are allowed.");
        }
    };

    return (
        <div className=" bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg space-y-6"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Create Assignment
                </h2>

                <div>
                    <label className="block text-gray-700 font-medium">Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => updateForm("title", e.target.value)}
                        className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Content</label>
                    <textarea
                        value={formData.content}
                        onChange={(e) => updateForm("content", e.target.value)}
                        className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div
                    className={`w-full mt-2 p-6 border-2 border-dashed rounded-lg text-center cursor-pointer ${dragging ? "border-blue-500 bg-blue-100" : "border-gray-300"
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="fileUpload"
                    />
                    <label htmlFor="fileUpload" className="cursor-pointer text-gray-700">
                        {file ? file.name : "Drag & Drop a PDF here or Click to Upload"}
                    </label>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Due Date</label>
                    <input
                        type="datetime-local"
                        value={formData.dueDate}
                        onChange={(e) => updateForm("dueDate", e.target.value)}
                        className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium text-lg hover:bg-blue-600 transition duration-300"
                >
                    Create Assignment
                </button>
            </form>
        </div>
    );
};

export default CreateAssignment;
