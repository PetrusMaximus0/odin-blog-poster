import React, { FormEvent } from "react";
import { Link } from "react-router-dom"

export default function LoginForm() {

    /**THIS IS WHERE YOU STOPPED! */
    function handleFormSubmit(e: FormEvent) {
        e.preventDefault();
        const body = e.target as HTMLFormElement;
        const payload = body.value;
        console.log(payload)
        fetch("http://localhost:3000/users/login", {
            mode: "cors",
            method: "POST",
            body: JSON.stringify(payload),            
        })
    }

    return (
        <form onSubmit={handleFormSubmit} className="border container max-w-[500px] w-fit mx-auto my-4 px-4" aria-label="login-form" name="login-form">
            <fieldset className="flex flex-col gap-2 py-4 items-center">
                <legend className="mx-auto w-auto pt-2 px-2 pb-4">
                    Log In
                </legend>
                <label htmlFor="username">Username
                    <input required className="ml-2 bg-slate-700 white px-2" type="text" name="username" id="username" />
                </label>
                <label htmlFor="password">Password
                    <input required className="ml-2 bg-slate-700 white px-2" type="password" name="password" id="password" />
                </label>
                <div className="w-full mt-4 flex justify-between gap-2">
                    <Link className="border px-3 py-1" to="/"> Create Account </Link>
                    <button className="border px-3 py-1" type="submit">Log in</button>
                </div>
            </fieldset>
        </form>
    )
}   