import { FaCheckCircle } from "react-icons/fa";

interface FormSuccessProps {
  message?: string;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;

  return (
    <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
      <FaCheckCircle className="h-4 w-4" />
      <span className="truncate block whitespace-nowrap overflow-hidden text-ellipsis">
        {message}
      </span>
    </div>
  );
};
