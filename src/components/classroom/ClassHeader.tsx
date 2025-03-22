import { motion } from "framer-motion";
import { ClassInfo } from "../../types/ClassInfo";

interface ClassHeaderProps {
    classInfo: ClassInfo | null;
    role?: string;
}

const ClassHeader: React.FC<ClassHeaderProps> = ({ classInfo, role }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
        >
            <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-200 mb-1">
                        {classInfo?.className || "Class Name"}
                    </h1>
                    <p className="text-gray-600">{classInfo?.description || ""}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {role || "Role"}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ClassHeader;