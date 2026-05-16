import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function GlobalLoader() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
            <AiOutlineLoading3Quarters className="animate-spin text-primary" size={50} />
        </div>
    );
}