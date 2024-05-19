import { render, screen, act } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routes from "../src/routes";
import { IUser } from "../src/interfaces";
import { Mock } from "vitest";

describe("ProtectedRoute", () => {
    it("renders a loading page while the fetch request in ongoing", async () => {
        global.fetch = vi.fn(() => new Promise(() => {})) as Mock;
        const router = createMemoryRouter(routes, { initialEntries: ["/"] });
        localStorage.setItem("login-token", JSON.stringify("anytoken"));
        await act(async () => { 
            render(<RouterProvider router={router} />);
        });
     
        expect(fetch).toHaveBeenCalled();
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
        
        screen.debug();
        localStorage.clear();
    })

    describe("No token provided in the request", () => {
        it("renders login form, skips fetching user", async () => {
        global.fetch = vi.fn();
            const router = createMemoryRouter(routes, { initialEntries: ["/"] });        
            await act(async () => {  
                render(<RouterProvider router={router} />)
            })
            expect(fetch).not.toHaveBeenCalled();
            expect(screen.queryByRole("form", { name: "login-form" })).toBeInTheDocument();
            screen.debug();
        })
    })
        
    describe("Request provided a token", () => {
        it("does not render the login form if the token is valid", async () => {
            const user: IUser = {
                "posts": [],
                "_id": "userid",
                "username": "dudington",
                "password": "hashedPW",
                "isAdmin": true,
                "__v": 0,
            }
            
            //
            global.fetch = vi.fn(() => {
                return Promise.resolve({
                    json: () => Promise.resolve({user: user})
                })
            }) as Mock;

            //
            const router = createMemoryRouter(routes, { initialEntries: ["/"] });
            const validToken = "validtoken"
            localStorage.setItem("login-token", JSON.stringify(validToken));

            //
            await act(async () => {
                render(<RouterProvider router={router} />)
            })            
            expect(fetch).toHaveBeenCalled();
            expect(screen.queryByRole("form", { name: "login-form" })).not.toBeInTheDocument();
            screen.debug();
            
            localStorage.clear();
        })
       
        it("redirects to the login page when the token is invalid or expired", async () => {            
            global.fetch = vi.fn(() => {
                return Promise.resolve({
                    json: () => Promise.resolve({})
                })
            }) as Mock;
            //
            const invalidToken = "adsasd.asdasd.asdasda23123";
            localStorage.setItem("login-token", JSON.stringify(invalidToken));
            
            //
            const router = createMemoryRouter(routes, { initialEntries: ["/"] });
            await act(async () => {
                render(<RouterProvider router={router} />)
            }) 
            screen.debug();
            expect(fetch).toHaveBeenCalled();
            expect(screen.queryByRole("form", { name: "login-form" })).toBeInTheDocument();
            localStorage.clear();
        })
    })

})