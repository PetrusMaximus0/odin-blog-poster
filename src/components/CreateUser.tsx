import {FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import CustomInput from "./CustomInput";
import { useNavigate } from "react-router-dom";

export default function CreateUser() {
    const navigate = useNavigate();
    interface IFormState {
        username: string,
        password: string,
        confirmPassword: "",    
    }

    const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [formData, setFormData] = useState<IFormState>({
        username: "",
        password: "",
        confirmPassword: "",
    })

    function handleInputChange(e: FormEvent<HTMLInputElement>) {
        const { name, value } = e.currentTarget;
        setFormData({ ...formData, [name]: value });
    }

    const fetchNewUser = async () => {
    // Fetch the create user
        try {
            setFormSubmitting(true);
            const result = await fetch("http://localhost:3000/users/new", {
                mode: "cors",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username: formData.username, password: formData.password}),
            })

            if (!result.ok) {
                const response = await result.json();
                setFormSubmitting(false);
                throw new Error(response.error);
            }
            setFormError(null);
            setFormSubmitting(false);
            navigate("/login");
            
        } catch (error) {
            setFormError((error as Error).message);            
        }


    }
    
    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);
        
        // Validate the passwords
        if (formData.password !== formData.confirmPassword) { 
            setFormError("The passwords don't match.");
            return;
        }
        fetchNewUser();
    }
    
    return (
        <form onSubmit={handleFormSubmit} className="border w-fit container mx-auto p-4 my-4" aria-label="new-user-form" name="new-user-form">
            <fieldset className="flex flex-col gap-2 py-4 mx-auto items-center">
                <legend className="mx-auto w-auto pt-2 px-2 pb-4">
                    Create a new user
                </legend>
                <label className="w-full flex justify-between gap-10" htmlFor="username">Username
                    <CustomInput inputType="text" name="username" required={true} handleInputChange={handleInputChange} value={formData.username} />
                </label>
                <label className="w-full flex justify-between gap-10" htmlFor="password">Password
                    <CustomInput inputType="password" name="password" required={true} handleInputChange={handleInputChange} value={formData.password} />
                </label>
                <label className="w-full flex justify-between gap-10" htmlFor="passwordConfirm">Confirm Password                    
                    <CustomInput inputType="password" name="confirmPassword" required={true} handleInputChange={handleInputChange} value={formData.confirmPassword} />                  
                </label>
                <div className="w-full mt-4 flex justify-between gap-2">
                    <Link className="border px-3 py-1" to="/login"> Login </Link>
                    <button className="border px-3 py-1" type="submit">Create Account</button>
                </div>
            </fieldset>
            {formError !== null && 
                <p className="text-red-300 text-center"> {formError} </p> ||
                formSubmitting && <p className="text-center"> "Submitting, please wait..."</p>
            }
        </form>   
    )
}