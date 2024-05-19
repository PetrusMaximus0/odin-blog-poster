import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./components/LoginForm";

const routes = [
    {
        path: "/",
        element:
            <ProtectedRoute />,
        errorElement: <div>Woops, there seems to be an error</div>,
        children: [            
            {
                path: "/",
                element: <App />                        
            },
            {
                path: "/1",
                element: <div>Sub Route 2</div>                        
            },
        ]        
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "*",
        element: <div> Nothing to see here... 404! </div>
    }
]

export default routes;