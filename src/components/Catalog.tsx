import { Link, useLoaderData, useNavigate, useNavigation } from 'react-router-dom';
import BlogCard from './BlogCard';
import Icon from '@mdi/react';
import { mdiArrowLeft, mdiArrowRight } from '@mdi/js';
import { useEffect} from 'react';
import { IPost } from '../interfaces';

export default function Catalog({fromQuery=false}) {
    const { state } = useNavigation();
    const { posts, page, lastPage } = useLoaderData() as { posts: IPost[], page: string, lastPage: boolean };
    const navigate = useNavigate();

    // Delete a post by ID
    const deletePost = async (id: string) => {
        const token = localStorage.getItem("login-token");
        if (!token) {
            navigate("/login");
        }
        try {
            const result = await fetch(`http://localhost:3000/posts/${id}`, {
                mode: "cors",
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`, 
                },            
            })
            if (result.status >= 400) {
                throw new Error(`Request failed with code ${result.status}`);    
            }
            // force page refresh to current page
            const destination = fromQuery
                ? new URL('.', window.origin + location.pathname)
                    .href + `${parseInt(page)}`
                : `/posts/page/${parseInt(page)}`;
            navigate(destination)
            
        } catch (error) {
            console.error(error);
        }
    } 

    // Edit a post by ID
    const editPost = async (id: string) => {
        navigate(`/posts/${id}/edit`);
    }

    // Toggle post visibility
    const publishPost = async (id: string, action: "publish" | "hide") => {
        try {
            const url = `http://localhost:3000/posts/${id}/${action}`;

            const token = localStorage.getItem("login-token");

            const result = await fetch(url, {
                mode: "cors",
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })

            if (result.status >= 400) {
                if (result.status === 401) {
                    navigate("/login");
                }
                throw new Error(`${result.status}`);
            }

            // force page refresh to current page
            const destination = fromQuery
                ? new URL('.', window.origin + location.pathname)
                    .href + `${parseInt(page)}`
                : `/posts/page/${parseInt(page)}`;
            
            navigate(destination)

        } catch (error) {
            console.log(error);
        }
    }

    const handlePostAction = (id: string, action: string) => {
        if (action === "edit") {
            editPost(id);

        } else if (action === "delete") {
            deletePost(id);
            
        } else if (action === "publish") {
            publishPost(id, "publish");
            
        } else if (action === "hide") {
            publishPost(id, "hide");

        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [posts]);

    return (
        (posts.length > 0 && state !== "loading" && (
            <section>
                <ul className="flex flex-col gap-8">
                    {posts.map((blog: IPost) => {
						return (
							<li key={blog._id} className="">
								<BlogCard data={blog} handlePostAction={(action: string) => handlePostAction(blog._id, action)} />
							</li>
						);
					})}
                </ul>
                <div className="flex justify-around gap-4 mt-12">
                    <Link
                        className={
                            parseInt(page) > 1
                                ? 'flex items-center gap-1 hover:text-blue-600 text-blue-300'
                                : 'invisible'
                        }
                        to={
                            fromQuery
                                ? new URL('.', window.origin + location.pathname)
                                        .href + `${parseInt(page) - 1}`
                                : `/posts/page/${parseInt(page) - 1}`
                        }
                    >
                        <Icon path={mdiArrowLeft} size={1} />
                        Earlier Posts
                    </Link>
                    <Link
                        className={
                            lastPage
                                ? 'invisible'
                                : 'flex items-center gap-1 hover:text-blue-600 text-blue-300'
                        }
                        to={
                            fromQuery
                                ? new URL('.', window.origin + location.pathname)
                                        .href + `${parseInt(page) + 1}`
                                : `/posts/page/${parseInt(page) + 1}`
                        }
                    >
                        Older Posts <Icon path={mdiArrowRight} size={1} />
                    </Link>

                </div>
            </section>
        )) || <p className="text-center text-xl"> Loading...</p>
            
    )

}