import CustomInput from "./CustomInput"
import { FormEvent, useEffect, useState } from "react";
import { IInputChange, IPost } from "../interfaces";
import { useLoaderData, useNavigate } from "react-router-dom";
import { apiBaseUrl } from "../config";

export default function BlogPostForm() {

    const { categories, post } = useLoaderData() as {categories: [{_id: string, name: string}], post: IPost};

    const navigate = useNavigate();

    const [formData, setFormData] = useState<IPost>({
        _id: "",
        author: "",
        title: "",
        text: "",
        description: "",
        timeToRead: "",
        hidden: "false",
        headerImage: "",
        categories: [],
    });

    const [loading, setLoading] = useState<boolean>(false);

    interface IValidationError{
        type: string,
        msg: string,
        path: string,
    }
    const [error, setError] = useState<string>("");
    
    const [validationErrors, setValidationErrors] = useState<IValidationError[]>([]);

    const handleInputChange = (e: IInputChange) => {
        const { name, value} = e.currentTarget
        if (name === "hidden") {
            //
            setFormData({ ...formData, hidden: value === "true" ? "false" : "true" })    
        
        } else if (name.includes("category")) {
            //
            const newCategories = formData.categories!.filter((el) => el !== value);
            if ((e.currentTarget as HTMLInputElement).checked) {
                newCategories.push(value);
            }
            setFormData({...formData, categories: newCategories})
        
        } else {
            setFormData({ ...formData, [name]: value });        
        }
    }

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        //
        e.preventDefault();
        setError("");
        setValidationErrors([]);
        setLoading(true);

        // Prepare the form data
        const payload = { ...formData };

        try {
            // Obtain the token
            const token = localStorage.getItem("login-token");
            if (!token) {
                navigate("/login");
            }


            // Fetch
            const baseUrl = `${apiBaseUrl}/posts/`;
            const detail = post ? `${post._id}/edit` : "new";

            const method = post ? "PUT" : "POST";
            
            const result = await fetch(baseUrl + detail, {
                method: method,
                mode: "cors",
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            // Handle ok status with errors
            if (result.status >= 400) {
                if (result.status === 400) {
                    const response = await result.json();
                    // Invalid request error, render the form with previous values and errors sent from the server.
                    setValidationErrors(response.errors as IValidationError[]);
                    setFormData(response.postData);
                    setLoading(false);
                    return;
                } else if (result.status === 401) {
                    navigate("/login");                    
                }
                throw new Error(`Error with status code: ${result.status}`);
            }

            setLoading(false);
            navigate(`/`, {replace: true});

        } catch (error) {           
            // Should render the error below.
            setError((error as Error).message);
            console.error(error);
        }
    }
    
    useEffect(() => {
        if (post) {
            setFormData({...post, headerImage: post.headerImage});
            // check all the categories that are present in post.
        } 
    },[post])
    
    return (
        <form className="flex flex-col gap-4 " onSubmit={handleFormSubmit} action="">
            <fieldset className=" flex flex-col gap-2 border p-4">
                <legend className="ml-4 px-2 text-lg"> Author Data </legend>
                <label htmlFor="author">Name:
                    <CustomInput inputType="text" handleInputChange={handleInputChange} name="author" required={true} value={ formData.author }/>
                </label>
            </fieldset>

            <fieldset className=" flex flex-col gap-2 border p-4">
                <legend className="ml-4 px-2 text-lg"> Post Content </legend>
                <label htmlFor="title">Title:
                    <CustomInput inputType="text" handleInputChange={handleInputChange} name="title" required={true} value={ formData.title } />
                </label>

                <label htmlFor="description">Description:
                    <CustomInput inputType="textarea" handleInputChange={handleInputChange} name="description" required={true} value={ formData.description } />
                </label>
                
                <label htmlFor="text">Text:
                    <CustomInput inputType="textarea" handleInputChange={handleInputChange} name="text" required={true} value={ formData.text } />
                </label>

            </fieldset>

            <fieldset className="border flex flex-wrap p-4 gap-5">
                <legend className="px-2 ml-4 text-lg"> Categories </legend>
                {categories.map((cat) => 
                    <label key={cat._id} className="" htmlFor={"category-"+cat.name}> {cat.name}
                        <input checked={formData.categories?.includes(cat._id)} onChange={handleInputChange} className="ml-1" type="checkbox" name={"category-"+cat.name} id={cat._id} value={cat._id} />
                    </label>                

                )}
            </fieldset>

            <fieldset className="border p-4 flex flex-col gap-2">
                <legend className="ml-4 px-2 text-lg"> Details</legend>

                <label htmlFor="headerImage">Link for header image:
                    <CustomInput inputType="text" handleInputChange={handleInputChange} name="headerImage" required={true} value={ formData.headerImage } />
                </label>

                <label htmlFor="timeToRead">Time to read (minutes):
                    <CustomInput inputType="text" handleInputChange={handleInputChange} name="timeToRead" required={true} value={ formData.timeToRead } />
                </label>

                <label className="flex gap-4 items-center" htmlFor="hidden"> Hide this post
                    <CustomInput inputType="checkbox" handleInputChange={handleInputChange} name="hidden" required={false} value={ formData.hidden } />
                    <p className="text-sm font-semibold text-blue-300"> | Marking this box will cause the post to NOT be published on submission.</p>
                </label>
               
            </fieldset>

                <button className="text-lg w-fit mx-auto px-2 py-1 font-semibold rounded bg-blue-200 text-slate-700 active:bg-slate-900 active:text-slate-200 hover:bg-slate-200 hover:text-slate-900" type="submit"> Submit Post </button>
            {
                error && <p className="text-center text-lg"> {error} </p> ||
                loading && <p className="text-center text-lg"> Submiting Post...</p> ||
                validationErrors.length > 0 && <ul className="flex flex-col items-start ml-2 mt-2 text-red-300">{validationErrors.map((err) => <li key={err.path} ><span className="font-semibold capitalize">{err.path}</span> : {err.msg}</li>)}</ul>
            }
        </form>
    )
}