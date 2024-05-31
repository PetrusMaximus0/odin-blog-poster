import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import CustomInput from "./CustomInput";
import { IInputChange, LoginFormState } from "../interfaces";
import { apiBaseUrl } from "../config";

export default function LoginForm() {
    const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [formData, setFormData] = useState<LoginFormState>({username: "", password: ""});

    const navigate = useNavigate();

    function handleInputChange(e: IInputChange) {
        const { name, value } = e.currentTarget;
        setFormData({ ...formData, [name]: value });
    }

    const storeToken = (token: string) => {
        localStorage.setItem("login-token", token);
        localStorage.setItem("login-username", formData.username)
    }

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormSubmitting(true);
        try {
            const result = await fetch(`${apiBaseUrl}/users/login`, {
                mode: "cors",
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            
            const res = await result.json();
            //
            if (!result.ok) {           
                setFormSubmitting(false);
                throw new Error(res.error);
            }

            // 
            if (res.token !== undefined) {
                storeToken(res.token);
                setFormData({ username: "", password: "" })
                navigate("/");
            }

            //
            setFormError(null);
            setFormSubmitting(false);      
            

        } catch (error) {
            setFormError((error as Error).message);
            setFormSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleFormSubmit} className="border container w-fit mx-auto p-4 my-4" aria-label="login-form" name="login-form">
            <fieldset className="flex flex-col gap-2 py-4 mx-auto items-center">
                <legend className="mx-auto w-auto pt-2 px-2 pb-4">
                    Log In
                </legend>
                <label className="w-full flex justify-between gap-10" htmlFor="username">Username
                    <CustomInput required={true} name="username" value={formData.username} inputType="text" handleInputChange={handleInputChange} /> 
                </label>
                <label className="w-full flex justify-between gap-10" htmlFor="password">Password
                    <CustomInput required={true} name="password" value={formData.password} inputType="password" handleInputChange={handleInputChange} />
                </label>
                <div className="w-full mt-4 flex justify-between gap-2">
                    <Link className="border px-3 py-1" to="/newuser"> Create Account </Link>
                    <button className="border px-3 py-1" type="submit">Log in</button>
                </div>
            </fieldset>
            {formError !== null && 
                <p className="text-red-300"> {formError} </p> ||
                formSubmitting && <p> "Submitting, please wait..."</p>
            }
        </form>    
    )
}   