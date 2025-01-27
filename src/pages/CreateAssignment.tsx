// import React, { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";
// import { useSelector } from "react-redux";

// const CreateAssignment: React.FC = () => {

//     const { classroomId } = useParams<{ classroomId: string }>();
//     const { user } = useSelector((state: any) => state.user) || {};

//     const createdById = user?.id;

//     const [formData, setFormData] = useState({
//         title: "",
//         content: "",
//         classroomId: classroomId ?? "",
//         createdById: createdById ?? "",
//         dueDate: Date.now()
//     });
//     const [file, setFile] = useState<File | null>(null);


//     const updateForm = (field: string, value: string) => {
//         setFormData((prevData) => ({
//             ...prevData,
//             [field]: value,
//         }));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         console.log("Form Data:", formData);
//         console.log("File:", file);

//         const submissionData = new FormData();
//         submissionData.append("title", formData.title);
//         submissionData.append("content", formData.content);
//         submissionData.append("classroomId", formData.classroomId);
//         submissionData.append("createdById", formData.createdById);
//         if (file) submissionData.append("file", file);

//         try {
//             const response = await axios.post(
//                 `http://localhost:8080/api/classrooms/assignments/add`,
//                 submissionData,
//                 {
//                     withCredentials: true,
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 }
//             );

//             if (response.status === 200) {
//                 toast.success("Assignment created successfully!");
//                 // Reset form
//                 setFormData({
//                     title: "",
//                     content: "",
//                     classroomId: classroomId ?? "",
//                     createdById: createdById ?? "",
//                     dueDate: Date.now()
//                 });
//                 setFile(null);
//             }
//         } catch (error) {
//             console.error(error);
//             toast.error("Failed to create assignment.");
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <div>
//                 <label>Title</label>
//                 <input type="text" value={formData.title}
//                     onChange={(e) => updateForm("title", e.target.value)} required />
//             </div>
//             <div>
//                 <label>Content</label>
//                 <textarea value={formData.content}
//                     onChange={(e) => updateForm("content", e.target.value)}
//                 />
//             </div>
//             <div>
//                 <label>Upload PDF</label>
//                 <input type="file" accept="application/pdf"
//                     onChange={(e) => setFile(e.target.files?.[0] || null)} />
//             </div>
//             <div>
//                 <label>Due Date</label>
//                 <input type="datetime-local" value={new Date(formData.dueDate).toISOString().split('T')[0] + 'T' + new Date(formData.dueDate).toISOString().split('T')[1]}
//                     onChange={(e) => updateForm("dueDate", new Date(e.target.value).getTime())} />
//             </div>
//             <button type="submit">Create Assignment</button>
//         </form>
//     );
// };

// export default CreateAssignment;

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
        dueDate: new Date().toISOString().slice(0, 16), // Default to current time in ISO format
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

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateForm("title", e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Content</label>
                <textarea
                    value={formData.content}
                    onChange={(e) => updateForm("content", e.target.value)}
                />
            </div>
            <div>
                <label>Upload PDF</label>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    required
                />
            </div>
            <div>
                <label>Due Date</label>
                <input
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => updateForm("dueDate", e.target.value)}
                    required
                />
            </div>
            <button type="submit">Create Assignment</button>
        </form>
    );
};

export default CreateAssignment;
