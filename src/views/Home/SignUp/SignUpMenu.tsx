import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { trpc } from "../../../utils/trpc";
import { Input, Card, Logo } from "../../../Components/";
import { Button, TextInputField } from "evergreen-ui";
import { FormInput } from "./SignUpFormInput";
import { SelectField } from "evergreen-ui";
import Link from "next/link";

export const SignUpMenu: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [occupation, setOccupation] = useState("");
  const [location, setLocation] = useState("");
  const [affiliation, setAffiliation] = useState<string[]>([]);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    repeatPassword: "",
    birthDate: "",
  });

  const mutation = trpc.auth.register.useMutation();
  const router = useRouter();

  const formData = [
    { label: "First Name", name: "firstName", value: firstName },
    { label: "Last Name", name: "lastName", value: lastName },
    { label: "Email", name: "email", value: email },
    { label: "Password", name: "password", value: password },
    {
      label: "Repeat Password",
      name: "repeatPassword",
      value: repeatPassword,
    },
    { label: "Birth Date", name: "birthDate", value: birthDate },
    { label: "Occupation", name: "occupation", value: occupation },
    { label: "Asal PPI Cabang", name: "location", value: location },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "repeatPassword":
        setRepeatPassword(value);
        break;
      case "birthDate":
        setBirthDate(value);
        break;
      case "occupation":
        setOccupation(value);
        break;
      case "location":
        setLocation(value);
        break;
      // Add more cases as needed
      default:
        break;
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
      repeatPassword: "",
      birthDate: "",
    };

    // Simple email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Password length validation
    if (!password || password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
      isValid = false;
    }

    // Check if passwords match
    if (password !== repeatPassword) {
      newErrors.repeatPassword = "Passwords do not match.";
      isValid = false;
    }

    // BirthDate validation (example: ensure it's not empty)
    if (!birthDate) {
      newErrors.birthDate = "Please enter your birth date.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  useEffect(() => {
    if (mutation.isSuccess === true) {
      router.push("./emaillogin");
    }
  }, [mutation.isSuccess, router]);
  return (
    <>
      <div className="flex items-center justify-center gap-20 p-5">
        <div className="w-full max-w-md rounded-lg bg-white p-5 drop-shadow-lg">
          <h2 className="mb-2 mb-5 text-center text-xl font-bold">
            <Link href="/">
              <Logo />
            </Link>
            Daftar di Sensus
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center justify-center gap-4 lg:min-w-[25%]"
          >
            {mutation.isError && (
              <div className="p-20 ring-indigo-600">
                <p className="text-md text-red-500">{mutation.error.message}</p>
              </div>
            )}

            {formData.map((input) => (
              <div className="vh flex w-full" key={input.name}>
                <FormInput
                  type={
                    input.name === "password" || input.name === "repeatPassword"
                      ? "password"
                      : "text"
                  }
                  label={input.label}
                  id={input.name}
                  name={input.name}
                  value={input.value}
                  onChange={handleInputChange}
                  placeholder={input.label}
                />
              </div>
            ))}

            <Button
              type="submit"
              marginTop={10}
              height={40}
              className="self-stretch rounded-lg "
              onClick={handleSubmit}
              // disabled={mutation.isLoading}
              isLoading={mutation.isLoading}
            >
              Sign Up
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};
