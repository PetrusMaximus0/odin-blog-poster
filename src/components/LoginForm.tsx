import { FormEvent, useState } from "react";
import { Link } from "react-router-dom"

export default function LoginForm() {
    interface LoginFormState {
        username: string,
        password: string,
    }

    const [formResponse, setFormResponse] = useState<null | object>(null);
    const [formError, setFormError] = useState <string | null>(null);
    const [formData, setFormData] = useState<LoginFormState>({
        username: "",
        password: "",
    })

    function handleInputChange(e: FormEvent<HTMLInputElement>) {
        const { name, value } = e.currentTarget;
        setFormData({ ...formData, [name]: value });
    }

    function handleFormSubmit(e: FormEvent) {
        e.preventDefault();
        fetch("http://localhost:3000/users/login", {
            mode: "cors",
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Error with status: ${res.status}`);
                }
                return res.json();                
            })
            .then((res) => {
                setFormResponse(res);                
                setFormData({username: "", password: ""})
            })
            .catch((error) => {
                console.log(error.message);
                setFormError(error.message);
            })
    }

    return (
        <div>
            <form onSubmit={handleFormSubmit} className="border container max-w-[500px] w-fit mx-auto p-4 my-4" aria-label="login-form" name="login-form">
                <fieldset className="flex flex-col gap-2 py-4 items-center">
                    <legend className="mx-auto w-auto pt-2 px-2 pb-4">
                        Log In
                    </legend>
                    <label htmlFor="username">Username
                        <input required onChange={(e)=>handleInputChange(e)} value={formData.username} className="ml-2 bg-slate-700 white px-2" type="text" name="username" id="username" />
                    </label>
                    <label htmlFor="password">Password
                        <input required onChange={(e)=>handleInputChange(e)} value={formData.password} className="ml-2 bg-slate-700 white px-2" type="password" name="password" id="password" />
                    </label>
                    <div className="w-full mt-4 flex justify-between gap-2">
                        <Link className="border px-3 py-1" to="/"> Create Account </Link>
                        <button className="border px-3 py-1" type="submit">Log in</button>
                    </div>
                </fieldset>
                {formError !== null && 
                    <p className="text-red-300"> {formError} </p>
                }
            </form>
        
        </div>
    
    )
}   