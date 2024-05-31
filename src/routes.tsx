import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./components/LoginForm";
import CreateUser from "./components/CreateUser";
import Catalog from "./components/Catalog";
import Content from "./components/Content";
import { Navigate, redirect } from "react-router-dom";
import BlogPostForm from "./components/BlogPostForm";
import QueryCatalog from "./components/QueryCatalog";
import CategoryForm from "./components/CategoryForm";
import BlogPost from "./components/BlogPost";
import { IPost, IArchive } from "./interfaces";

const rootLoader = async () => {
    try {
        //
        const result = await fetch("http://localhost:3000/posts/admin/shortlist", {
            method: "GET",
            mode: "cors",
            headers: {
                "content-type": "application/json",
            }
        })

        //
        if (result.status >= 400) {
            throw new Error(`Server error with status, ${result.status}`);            
        }

        const { categories, posts } = await result.json();
        const username = localStorage.getItem("login-username");

        const archives: IArchive[] = [];
        
        posts.forEach((post: IPost) => {
            //
            const index = archives.findIndex((element) => element.date === new Date(post.date!).getFullYear());
            
            //
            if (index === -1) {
                archives.push({ date: new Date(post.date!).getFullYear(), number: 1 });
            } else {
                archives[index] = {...archives[index], number: archives[index].number + 1}
            }
            archives.sort((a:IArchive, b:IArchive) =>  b.date - a.date);
        })

        return { username: username, categories: categories, archives: archives };
                
    } catch (error) {
        console.error(error);
    }
}

interface IContentLoader {
    itemNumber?: number,
    pageNumber?: number,
    queryType?: string,
    query?: string,
    name?: string,
}

const contentLoader = async ({params} :{ params: IContentLoader}) => {
    //
	if (!params.itemNumber) {
		params.itemNumber = 10;
	}

	//
	if (!params.pageNumber || isNaN(params.pageNumber)) {
		params.pageNumber = 1;
	}

	const baseUrl = `http://localhost:3000/posts/admin/all?page=${params.pageNumber}&items=${params.itemNumber}`;
	let url = baseUrl;

	//
	if (params.queryType) {
        url += `&queryType=${params.queryType}&query=${params.query}`;
	}

    //    
    const token = localStorage.getItem("login-token");
    if (!token) {
        redirect("/login");
    }

	const posts = await fetch(url, {
		mode: 'cors',
		method: 'GET',
		headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
	})
		.then((res) => {
            if (res.status >= 400) {
                if (res.status === 401 || res.status === 404) {
                    redirect("/login");
                } else {
                    console.log("Throwing error!");
                    redirect("/login");
                    throw new Error(`Server error with status, ${res.status}`);
                }
			}
			return res.json();
		})
		.then((res) => {
			return res;
		})
		.catch((error) => console.error(error));

    const username = localStorage.getItem("login-username");

    return {
        username: username,
        categories: posts.categories,
		posts: posts.allPosts,
		page: params.pageNumber,
		lastPage: posts.lastPage,
        queryName: params.name ? params.name : '', 
	};
}

const editPostLoader = async ({ params }: { params: { id: string } }) => {
    try {
        const token = localStorage.getItem("login-token");
        if (!token) {
            redirect("/");
        }

        const result = await fetch(`http://localhost:3000/posts/${params.id}/edit`, {
            mode: "cors",
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        })

        //
        if (result.status >= 400) {
            if (result.status === 401) {
                throw new Error(`${result.status}`);
            }
            throw new Error("Access error "+`${result.status}`);
        }
        //
        const response = await result.json();
        return { post: response.blogpost, categories: response.categories }
        
    //
    } catch (error) {
        console.error(error);
        redirect("/");
    }
}

const categoriesLoader = async () => {    
    try {
        const url = "http://localhost:3000/categories";
        const result = await fetch(url, {
            mode: "cors",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }

        })
        if (result.status >= 400) {
            throw new Error(`${result.status}`);
        }

        const response = await result.json();
        return({categories: response.categories})

    } catch (error) {
        redirect("/");
    }
}

const blogpostLoader = async ({ params }:{params: {id: string } }) => {
    const token = localStorage.getItem("login-token");
    if (!token) {
        redirect("/");
    }
    
    return fetch(`http://localhost:3000/posts/${params.id}/admin`, {
		method: 'GET',
		mode: 'cors',
		headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
		},
	})
		.then((res) => {
			if (res.status >= 400) {
				throw new Error(`Server error with status: ${res.status}`);
			}
			return res.json();
		})
		.then((res) => res)
		.catch((error) => {
			console.error(error);
		});
};

const routes = [
    {
        path: "/",
        element:
            <ProtectedRoute />,
        errorElement: <div>Woops, there seems to be an error</div>,
        children: [            
            {
                path: "/",
                element: <Navigate to="/posts/page/1" />,
            },
            {    
                loader: rootLoader,
                path: "/posts",
                element: <Content />,
                children: [
                    {      
                        loader: contentLoader,
                        path: "/posts/page/:pageNumber",
                        element: <Catalog/>
                    },
                    {           
                        loader: blogpostLoader,
                        path: "/posts/:id",
                        element: <BlogPost/>
                    },
                    {
                        loader: editPostLoader,
                        path: "/posts/:id/edit",
                        element: <BlogPostForm/>
                    },
                    {
                        loader: categoriesLoader,
                        path: "/posts/new",
                        element: <BlogPostForm/>
                    },
                    {
                        loader: contentLoader,
                        path: '/posts/:queryType/:query/page/:pageNumber/',
                        element: <QueryCatalog />,
                    },
                    {
                        loader: contentLoader,
                        path: '/posts/:queryType/:query/:name/page/:pageNumber/',            
                        element: <QueryCatalog />,
                    },
                    {
                        loader: categoriesLoader,
                        path: "/posts/manageCategories",
                        element: <CategoryForm />
                    },
                    {
                        path: "/posts/*",
                        element: <Navigate to="/posts/page/1" />,
                    },
                ]
            },
        ]        
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/newuser",
        element: <CreateUser/>
    },
    {
        path: "*",
        element: <div> Nothing to see here... 404! </div>
    }
]

export default routes;