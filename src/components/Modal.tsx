import { ModalProps } from "@/types/ModalProps";

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-gray-900 rounded-lg p-6 w-96 border border-gray-800 shadow-2xl">
                <h2 className="text-xl font-semibold mb-4 text-white">{title}</h2>
                {children}
            </div>
        </div>
    );
};
export default Modal;