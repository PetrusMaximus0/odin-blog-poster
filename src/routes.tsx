import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./components/LoginForm";
import CreateUser from "./components/CreateUser";
import Catalog from "./components/Catalog";
import Content from "./components/Content";
import { Navigate, redirect } from "react-router-dom";
import BlogPostForm from "./components/BlogPostForm";
import QueryCatalog from "./components/QueryCatalog";
import { CategoryForm } from "./components/CategoryForm";

const rootLoader = async () => {
    try {

        const token = localStorage.getItem("login-token");
        if (!token) {
            redirect("/");
            return;
        }
        //
        const result = await fetch("http://localhost:3000/posts/admin/shortlist", {
            method: "GET",
            mode: "cors",
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        })

        //
        if (result.status >= 400) {
            if (result.status === 401 || result.status === 404) {
                redirect("/login");
            } else {
                throw new Error(`Server error with status, ${result.status}`);
            }
        }

        const { posts, categories } = await result.json();
        const username = localStorage.getItem("login-username");

        return { username: username, posts: posts, categories: categories };
        
        
    } catch (error) {
        console.error(error);
        redirect("/login");
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
		params.itemNumber = 3;
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

const manageCategoriesLoader = async () => {    
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
                        path: "/posts/:id",
                        element: <p>Loading blogpost</p>
                    },
                    {
                        loader: editPostLoader,
                        path: "/posts/:id/edit",
                        element: <BlogPostForm/>
                    },
                    {
                        loader: rootLoader,
                        path: "/posts/new",
                        element: <BlogPostForm/>
                    },
                    {
                        loader: contentLoader,
                        path: '/posts/:queryType/:query/:name/page/:pageNumber/',            
                        element: <QueryCatalog />,
                    },
                    {
                        loader: contentLoader,
                        path: '/posts/:queryType/:query/page/:pageNumber/',
                        element: <QueryCatalog />,
                    },
                    {
                        loader: manageCategoriesLoader,
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