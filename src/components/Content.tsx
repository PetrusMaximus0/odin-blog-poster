import { Outlet, useLoaderData } from "react-router-dom";
import { Link } from "react-router-dom";
import { FormEvent, useState } from "react";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";
import CustomInput from "./CustomInput";
import { useNavigate } from "react-router-dom";
import { ICategory, IInputChange, IArchive } from "../interfaces";

export default function Content() {
    
    // Take the user name passed from react router.
    const { categories, username, archives } = useLoaderData() as {categories: ICategory[], username: string, archives: IArchive[]};

    // Log out the user and refresh the page.
    const handleLogout = () => {
        localStorage.removeItem("login-token");
        window.location.reload();
    }

    //
    const [query, setQuery] = useState<string>("");

    //
    const navigate = useNavigate();

    // Handle the search form submission
    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate(`search/${e.currentTarget.query.value.replace(/\W+/g, ' ')}/page/1`);
        setQuery("");
    }

    // Handle the search form input change
    const handleInputChange = (e: IInputChange ) => {
        setQuery(e.currentTarget.value);
    }

    return (
        <div className="px-2 md:px-8">
            <header className="flex flex-col gap-4 my-8 pb-8 w-full items-center mx-auto">
                <div className="text-blue-100 w-full flex gap-4 flex-col items-center justify-center sm:flex-row sm:justify-between">
                    <h1 className="text-3xl">Welcome back {username}!</h1>
                    <button className="text-xl hover:text-blue-600 flex justify-between items-center gap-1 px-3 py-1 rounded" onClick={handleLogout} type="button">Log Out</button>
                </div>               
                <div className="flex flex-col gap-4 w-full items-center justify-center lg:flex-row lg:justify-between flex-wrap">
                    <nav className="">
                        <ul className="flex flex-col sm:flex-row items-center justify-between gap-4 text-lg font-semibold">
                            <li>
                                <Link to="/posts/new" className="bg-blue-200 text-slate-700 active:bg-slate-900 active:text-slate-200 hover:bg-slate-200 hover:text-slate-900 flex justify-between items-center gap-1 px-3 py-1 rounded">
                                    New Post
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className="bg-blue-200 text-slate-700 active:bg-slate-900 active:text-slate-200 hover:bg-slate-200 hover:text-slate-900 flex justify-between items-center gap-1 px-3 py-1 rounded">
                                    All Posts
                                </Link>
                            </li>
                            <li className="relative">
                                <span className="showMenu cursor-pointer bg-blue-200 text-slate-700 active:bg-slate-900 active:text-slate-200 hover:bg-slate-200 hover:text-slate-900 flex justify-between items-center gap-1 px-3 py-1 rounded">
                                    Categories
                                </span>
                                <ul className="z-50 hide hover:flex flex flex-col gap-4 absolute w-fit rounded-md p-6 text-nowrap bg-blue-200 dropDownMenu">
                                    {
                                        categories.map((category) => {
                                            return (
                                                <li key={category._id} className=" bg-blue-200 text-slate-700 active:bg-slate-900 active:text-slate-200 hover:bg-slate-200 hover:text-slate-900">
                                                    <Link to={`/posts/categories/${category._id}/${category.name}/page/1`} className="w-full py-1 px-2">
                                                        {category.name} ({category.posts.length})
                                                    </Link>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </li>
                            
                            <li>
                                <Link to= "/posts/manageCategories" className="bg-blue-200 text-slate-700 active:bg-slate-900 active:text-slate-200 hover:bg-slate-200 hover:text-slate-900 flex justify-between items-center gap-1 rounded w-full py-1 px-2"> Manage Categories </Link>
                            </li>

                            <li className="relative">
                                <span className="showMenu cursor-pointer bg-blue-200 text-slate-700 active:bg-slate-900 active:text-slate-200 hover:bg-slate-200 hover:text-slate-900 flex justify-between items-center gap-1 px-3 py-1 rounded">
                                    Archive
                                </span>
                                <ul className="z-50 hide hover:flex flex flex-col gap-4 absolute w-fit rounded-md p-6 text-nowrap bg-blue-200">
                                    {archives.map((element) => (
                                        <li
                                            key={element.date}
                                            className="bg-blue-200 text-slate-700 active:bg-slate-900 active:text-slate-200 hover:bg-slate-200 hover:text-slate-900"
                                        >
                                            <Link
                                                to={`date/${element.date}/page/1/`}
                                            >
                                                {`${element.date} (${element.number})`}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                    </nav>
                    <form className="gap-4 flex items-center justify-center sm:justify-start" onSubmit={handleFormSubmit}>
                        <CustomInput required={true} value={query} name="query" inputType="search" handleInputChange={handleInputChange} />
                        <button
                            type="submit"
                            className="bg-blue-200 text-slate-700 active:bg-slate-900 active:text-slate-200 hover:bg-slate-200 hover:text-slate-900 flex justify-between items-center gap-1 px-3 py-1 rounded"
                        >
                            <span className="text-lg">Search</span>
                            <Icon className="" path={mdiMagnify} size={1} />
                        </button>
                    </form>
                </div>
            </header>
            <main className="mx-auto">
                <Outlet/>
            </main>
            <footer className="mx-auto my-12 text-center text-xl">
                <button onClick={() => window.scrollTo(0, 0)}>Back to Top </button>
            </footer>
        </div>
    )
}