import { useLoaderData, useNavigate } from "react-router-dom"
import { ICategory, IInputChange } from "../interfaces";
import CustomInput from "./CustomInput";
import { FormEvent, useState } from "react";
import CategoryCard from "./CategoryCard";

export function CategoryForm() {
    const { categories } = useLoaderData() as { categories: ICategory[] };
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate(); 

    //
    const [formData, setFormData] = useState<string>("");
    
    //
    const handleInputChange = (e: IInputChange) => {
        setFormData(e.currentTarget.value);
    }

    //
    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log("Form Data", formData);
        try {
            const url = `http://localhost:3000/categories/`;
            const token = localStorage.getItem("login-token");
            const result = await fetch(url, {
                mode: "cors",
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({name: formData})
            })
            
            if (result.status >= 400) {
                if (result.status === 400) {
                    const response = await result.json();
                    setFormData(response.name);
                    const errorMessage = response.error;
                    throw new Error(errorMessage);
                }
                throw new Error(`Error with status: ${result.status}`);
            }
           
            setLoading(false);
            setFormData("");
            navigate("/posts/manageCategories");

        } catch (error) {
            console.log(error);
            setLoading(false);
            setError(error as Error);
        }
    }

    return (
        <section className="flex flex-col gap-4 text-lg">
            {!loading &&
                <form className="flex flex-col items-start gap-1" onSubmit={handleFormSubmit}>
                    <label className="text-xl" htmlFor="category">
                        Add a new Category
                    </label>
                    <CustomInput inputType="text" name="category" required={true} value={formData} handleInputChange={handleInputChange} />
                    <button type="submit" className="px-3 py-1 mt-2 bg-blue-200 text-slate-800 font-semibold rounded"> Submit </button>
                                    
                    { error &&
                        <p className="flex gap-2 items-center">
                            {error.message}
                            <button className="px-4 py-1 my-auto bg-blue-200 rounded text-slate-800" onClick={()=>setError(null)}> OK </button>
                        </p>
                    }
                
                </form>

                || loading &&
                <p> Processing request...</p>
            }
            <hr />
            <ul className="flex flex-col gap-2">
                {
                    categories.map((cat: ICategory) => {
                        return (<CategoryCard category={cat} /> )
                    })
                }
            </ul>
        </section>
    )    
}