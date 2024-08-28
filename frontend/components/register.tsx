"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { FormEvent, useState } from "react";
const containerBackgroundImage = "/images/auth-login-bg.avif";
const googleLogoImage = "/images/Google_logo.png";

interface IUserType {
  username: string;
  email: string;
  password: string;
}

export default function Register() {
  const [disabled, setDisabled] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<IUserType>({
    username: "",
    email: "",
    password: "",
  });

  const inputs = [
    {
      type: "text",
      placeholder: "username",
      name: "username",
      value: formValues.username,
    },
    {
      type: "email",
      placeholder: "email",
      name: "email",
      value: formValues.email,
    },
    {
      type: "password",
      placeholder: "password",
      name: "password",
      value: formValues.password,
    },
  ];

  const mutation = useMutation({
    mutationFn: async (newData: IUserType) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_HOST}/api/v1/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formValues,
          }),
        }
      );
      const resData = await response.json();
      return resData;
    },
    onSuccess: (data) => {
      if (data.success) {
        setDisabled(false);
        return alert("register successfully");
      }
      alert(data.message);
      setDisabled(false);
    },
  });

  const handleSubmitRegisterForm = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setDisabled(true);
    mutation.mutate(formValues);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormValues((prevValues: any) => ({
      ...prevValues,
      [name]: type === "radio" ? (checked ? value : prevValues[name]) : value,
    }));
  };

  // const handleSignUpWithGoogle = async () => {
  //   window.open("http://localhost:3000/api/v1/user/auth/google", "_self");
  // };

  return (
    <div className={`w-full h-screen bg-gray-200`}>
      <div className="h-full flex justify-center items-center px-4">
        <div className="max-w-7xl w-full mx-auto p-6 md:grid lg:grid-cols-7 grid-cols-2 gap-5 rounded-md">
          <div className="lg:col-span-3 w-full">
            <form onSubmit={handleSubmitRegisterForm}>
              <div className="w-full space-y-4">
                {inputs.map((item, index) => (
                  <div
                    key={index}
                    className={`${item.type === "radio" && "inline-block"}`}
                  >
                    <input
                      type={item.type}
                      name={item.name}
                      placeholder={item.placeholder}
                      value={item.value}
                      onChange={handleInputChange}
                      className="w-full outline-none px-4 py-4 rounded-full bg-transparent border border-gray-400 text-gray-600 placeholder:text-gray-600 placeholder:capitalize"
                    />
                  </div>
                ))}

                <div className="flex">
                  <button
                    disabled={disabled}
                    className={` ${disabled ? "opacity-65 bg-gray-400" : "bg-slate-800"} w-full text-white py-3 rounded-md text-xl font-medium`}
                  >
                    Register
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-center items-center">
            <h2 className="text-[4vw] md:block hidden text-center text-gray-900 font-bold leading-[4.5vw] uppercase">
              Connect with SnippetHub
            </h2>

            <div className="flex mt-4 text-gray-600 text-sm">
              Already have account /{" "}
              <Link
                href={"/auth/login"}
                className="text-blue-500 underline inline-block"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
