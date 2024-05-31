import { useNavigate } from "react-router-dom";
import { ICategory, IInputChange } from "../interfaces"
import { FormEvent, useState } from "react";
import { apiBaseUrl } from "../config";

export default function CategoryCard({category} :{category: ICategory}) {
    const [currentState, setCurrentState] = useState<"idle"|"loading"|"edit"|"delete"|"error">("idle");
    const [error, setError] = useState<Error | null>(null)
    const [formData, setFormData] = useState<string>("");
    const navigate = useNavigate();

    //
    const handleDeleteSubmit = async () => {
        setCurrentState("loading");
        const token = localStorage.getItem("login-token");
        if (!token) {
            navigate("/login");
        }
        try {
            const url = `${apiBaseUrl}/categories/${category._id}`;
            const result = await fetch(url, {
                mode: "cors",
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })
            if (result.status >= 400) {
                throw new Error(`${result.status}`);
            }

            setCurrentState("idle");
            navigate("/posts/manageCategories");
            
        } catch (error) {
            setError(error as Error);            
            setCurrentState("error");
        }

    }

    //
    const handleEditSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setCurrentState("loading");

        const url = `${apiBaseUrl}/categories/${category._id}`;
        const token = localStorage.getItem("login-token");
        if (!token) {
            navigate("/login");
        }
        try {
            const result = await fetch(url, {
                mode: "cors",
                method: "PUT",
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: formData })
            })
            if (result.status >= 400) {
                throw new Error(`${result.status} Error`);
            }

            setCurrentState("idle");
            navigate("/posts/manageCategories");
            
        } catch (error) {
            setError(error as Error);
            setCurrentState("error");
        }
    }

    // 
    const handleInputChange = (e: IInputChange) => {
        setFormData(e.currentTarget.value);
    }

    return (
        <li className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div>
                <span className="font-bold">Name: </span>
                {category.name}
            </div>

                
            <div className="flex flex-col sm:flex-row gap-4 font-bold sm:ml-auto  sm:items-center ">
                <div>
                    Number of Posts:
                    <span className="font-normal"> {category.posts.length} </span>
                </div>
                
                {currentState==="idle" &&
                    <>
                        <button onClick={()=>{setCurrentState("edit")}} className="px-3 py-1 bg-blue-200 text-slate-800 rounded hover:bg-blue-100 " type = "button"> Edit </button>
                        <button onClick={()=>{setCurrentState("delete")}} className="px-3 py-1 bg-red-200 text-slate-800 rounded hover:bg-red-400 " type = "button"> Delete </button>
                    </> ||
                   currentState==="delete" &&
                    <>
                        <p className="capitalize text-center">Delete this category ?</p>
                        <button className="px-3 py-1 bg-red-200 text-slate-800 rounded hover:bg-red-400 " onClick={handleDeleteSubmit}> Confirm </button>
                        <button className="px-3 py-1 bg-blue-200 text-slate-800 rounded hover:bg-blue-100 " onClick={() => setCurrentState("idle")}> Cancel </button>
                    </> ||
                   currentState==="edit" &&
                <>
                    <form onSubmit={handleEditSubmit} className="flex flex-col sm:flex-row gap-4 sm:items-center" action="">
                        <label htmlFor="name">New name:
                            <input className="bg-slate-700" type="text" name="name" id="name" value={formData} onChange={handleInputChange} />
                        </label>
                        <button type="submit" className="px-3 py-1 bg-blue-200 text-slate-800 rounded hover:bg-blue-100 "> Confirm </button>
                        <button onClick={()=>{setCurrentState("idle")}} type="button" className="px-3 py-1 bg-blue-200 text-slate-800 rounded hover:bg-blue-100 "> Cancel </button>
                    </form>
                </>
                    ||
                   currentState === "loading" &&
                <>
                    <p>Processing your request...</p>                
                </>
                    ||
                    error!==null &&
                <>
                    <p className="my-auto">{error.message}</p>
                    <button className="px-4 py-1 my-auto bg-blue-200 rounded text-slate-800" onClick={() => { setCurrentState("idle"); setError(null); }}> OK </button>
                </>
                    
                }    
            </div>       
            
        </li>
    )
}