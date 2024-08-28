"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
const containerBackgroundImage = "/images/auth-login-bg.avif";
const googleLogoImage = "/images/Google_logo.png";
import Cookies from "js-cookie";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { fetchUserDetails } from "@/redux/slices/userSlice";

interface IUserType {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useRouter();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<IUserType>({
    email: "",
    password: "",
  });
  const dispatch = useAppDispatch();

  const inputs = [
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
        `${process.env.NEXT_PUBLIC_API_URL_HOST}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // credentials: "include",
          body: JSON.stringify({
            ...formValues,
          }),
        }
      );
      const resData = await response.json();
      return resData;
    },
    onSuccess: (data) => {
      console.log(data);
      if (data.success) {
        alert(data.message);
        localStorage.setItem("auth_user_access_token", data.user.accessToken);
        Cookies.set("auth_user_access_token", data.user.accessToken, {
          expires: 2,
          path: "/",
        });
        dispatch(fetchUserDetails());
        navigate.push("/");
      } else alert(data.message);
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
    <div className={`w-full h-screen bg-gray-200 bg-cover bg-no-repeat`}>
      <div className="h-full flex justify-center items-center px-4">
        <div className="max-w-7xl w-full mx-auto p-6 md:grid items-center lg:grid-cols-7 grid-cols-2 gap-5 rounded-md min-h-[30rem]">
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
                    Login
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
                href={"/auth/register"}
                className="text-blue-500 underline inline-block"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
