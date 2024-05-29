import { Link, useLoaderData, useNavigation } from 'react-router-dom';
import BlogCard from './BlogCard';
import Icon from '@mdi/react';
import { mdiArrowLeft, mdiArrowRight } from '@mdi/js';
import { useEffect} from 'react';
import { IPost } from '../interfaces';

export default function Catalog({fromQuery=false}) {
    const { state } = useNavigation();
    const { posts, page, lastPage } = useLoaderData() as {posts: IPost[], page: string, lastPage: boolean};

    const handlePostAction = (id: string, action: string) => {
        if (action === "edit") {
            console.log("Tried to edit post with id: ", id);

        } else if (action === "delete") {
            console.log("Tried to delete post with id: ", id);
            
        } else if (action === "publish") {
            console.log("Tried to publish post with id: ", id);
            
        } else if (action === "hide") {
            console.log("Tried to hide post with id: ", id);

        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [posts]);
    
    console.log(posts);

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
        )) || <p className="text-center text-xl"> No results found.</p>
            
    )

}