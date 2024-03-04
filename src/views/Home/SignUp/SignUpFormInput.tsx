import { Input } from "../../../Components/";

interface FormInputProps {
  label: string;
  type: string;
  id: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  id,
  name,
  value,
  placeholder,
  onChange,
}) => {
  
  return (
    <div className="flex w-full flex-col">
      <label htmlFor={id} className="self-start">
        {label}
      </label>
      
      <Input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};
