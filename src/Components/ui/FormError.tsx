import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

export interface FormErrorProps {
  message: string | undefined;
}

export const FormError: React.FC<FormErrorProps> = ({
  message,
}: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-x-2 rounded-md border-2 border-red-500 p-3 text-sm text-red-500">
      <ExclamationCircleIcon className="h-10 w-10" />
      <p>{message}</p>
    </div>
  );
};
