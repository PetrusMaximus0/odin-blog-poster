import { useNavigate } from "react-router-dom";
import { ICategory, IInputChange } from "../interfaces"
import { FormEvent, useState } from "react";

export default function CategoryCard({category} :{category: ICategory}) {
    const [deleteCat, setDeleteCat] = useState(false);
    const [editCat, setEditCat] = useState(false);
    const [error, setError] = useState<Error | null>(null)
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<string>("");
    const navigate = useNavigate();

    //
    const handleDeleteSubmit = () => {
        setLoading(true);
        alert("Deleted the category!")
        setDeleteCat(false);
        setLoading(false);
    }

    //
    const handleEditSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const url = `http://localhost:3000/categories/${category._id}`;
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
            setLoading(false);
            setEditCat(false);
            navigate("/posts/manageCategories");
            
        } catch (error) {
            setError(error as Error);
            setLoading(false);
            setEditCat(false); 
        }
    }

    // 
    const handleInputChange = (e: IInputChange) => {
        setFormData(e.currentTarget.value);
    }

    return (
        <li className="flex flex-col sm:flex-row gap-4">
            <span className="font-bold">Name:</span>
            {category.name}            
                
            <div className="flex flex-col sm:flex-row gap-4 font-bold sm:ml-auto">
                {!deleteCat && !editCat && !loading && !error &&
                    <>
                        <button onClick={()=>{setEditCat(true)}} className="px-3 py-1 bg-blue-200 text-slate-800 rounded hover:bg-blue-100 " type = "button"> Edit </button>
                        <button onClick={()=>{setDeleteCat(true)}} className="px-3 py-1 bg-red-200 text-slate-800 rounded hover:bg-red-400 " type = "button"> Delete </button>
                    </> ||
                    deleteCat &&
                    <>
                        <p className="capitalize text-center">Delete this category ?</p>
                        <button className="px-3 py-1 bg-red-200 text-slate-800 rounded hover:bg-red-400 " onClick={handleDeleteSubmit}> Confirm </button>
                        <button className="px-3 py-1 bg-blue-200 text-slate-800 rounded hover:bg-blue-100 " onClick={() => setDeleteCat(false)}> Cancel </button>
                    </> ||
                    editCat &&
                <>
                    <form onSubmit={handleEditSubmit} className="flex flex-col sm:flex-row gap-4 sm:items-center" action="">
                        <label htmlFor="name">New name:
                            <input className="bg-slate-700" type="text" name="name" id="name" value={formData} onChange={handleInputChange} />
                        </label>
                        <button type="submit" className="px-3 py-1 bg-blue-200 text-slate-800 rounded hover:bg-blue-100 "> Confirm </button>
                        <button onClick={()=>{setEditCat(false)}} type="button" className="px-3 py-1 bg-blue-200 text-slate-800 rounded hover:bg-blue-100 "> Cancel </button>
                    </form>
                </>
                    ||
                    loading &&
                <>
                    <p>Processing your request...</p>                
                </>
                    ||
                    error!==null &&
                <>
                    <p className="my-auto">{error.message}</p>
                    <button className="px-4 py-1 my-auto bg-blue-200 rounded text-slate-800" onClick={()=>setError(null)}> OK </button>
                </>
                    
                }    
            </div>       
            
        </li>
    )
}