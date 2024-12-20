import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RouterProvider, createMemoryRouter} from "react-router-dom";
import userEvent from "@testing-library/user-event";
import LoginForm from "../../src/components/LoginForm";
import { Mock } from "vitest";
import { act } from "react";
import { apiBaseUrl } from "../../src/config";

describe("Login", () => {
    const route = [        
        {
            path: "/",
            element: <p>homepage</p>
        },
        {
            path: "/login",
            element: <LoginForm/>
        },
    ]
    const router = createMemoryRouter(route, { initialEntries: ["/", "/login"], initialIndex: 1 });

    describe("On form submission", () => {
        //
        it("does not submit the form if the required fields are not filled", async () => {
            global.fetch = vi.fn(() => {
                return Promise.resolve({
                    json: () => Promise.resolve({ message: "success" })
                })
            }) as Mock;
            // Render the login form by accessing the route.
            render(<RouterProvider router={router} />);
            
            // Check if the form is rendered with the correct inputs
            const form = screen.queryByRole("form", { name: /login-form/i }) as HTMLFormElement;
            const username = screen.getByLabelText(/username-input/i) as HTMLInputElement;
            const password = screen.getByLabelText(/password-input/i) as HTMLInputElement;
            expect(form).toBeInTheDocument();
            
            // Form should be invalid because both inputs are required
            expect(form).toBeInvalid();
            expect(username).toBeInvalid();
            expect(password).toBeInvalid();
            
            // Get and check the button
            const button = screen.getByRole("button", {name: /log in/i});

            // Set up the User Click
            const user = userEvent.setup();
            await user.click(button);
            
            // Fetch should not be called because the form is invalid
            expect(fetch).not.toHaveBeenCalled();
            screen.debug();
          
        })

        //
        it("submits the form when the fields are filled correctly", async () => { 
            global.fetch = vi.fn(() => {
                return Promise.resolve({
                    ok: true,
                    status: 200,
                    json: () => Promise.resolve({})
                })
            }) as Mock;

            await act(async() => {
              // Render the login form by accessing the route.
                render(<RouterProvider router={router} />);
            })
                
            // Check if the form is rendered with the correct inputs
            const form = screen.queryByRole("form", { name: "login-form" }) as HTMLFormElement;
            const username = screen.getByLabelText(/username-input/i) as HTMLInputElement;
            const password = screen.getByLabelText(/password-input/i) as HTMLInputElement;
            expect(form).toBeInTheDocument();
            
            // Form should be invalid because both inputs are required
            expect(form).toBeInvalid();
            expect(username).toBeInvalid();
            expect(password).toBeInvalid();
            
            // Fill in the form
            const usernameValue = "james";
            const passwordValue = "123456";
            fireEvent.change(username, { target: { value: usernameValue } });
            fireEvent.change(password, { target: { value: passwordValue} });
            

            // Form should now be valid
            expect(form).toBeValid();
            expect(username).toBeValid();
            expect(password).toBeValid();

            // Set up the User Click
            const button = screen.getByRole("button", {name: /log in/i});
            const user = userEvent.setup();
            await user.click(button);
            
            // Fetch should be called with the correct options.
            expect(fetch).toHaveBeenCalledWith(`${apiBaseUrl}/users/login`, {
                method: "POST",
                mode: "cors",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: usernameValue,
                    password: passwordValue,
                })
                
            });           
            
        });
        
        //    
        it("renders an error message if the fetch promise is rejected",async () => {
            global.fetch = vi.fn().mockImplementation(() => {
                return Promise.reject(new Error("Fetch failed, Network Error"));
            })

            // Render our form
            render(<RouterProvider router={router} />);

            // Set up form fill
            const username = screen.getByLabelText(/username-input/i) as HTMLInputElement;
            const password = screen.getByLabelText(/password-input/i) as HTMLInputElement;
            const usernameValue = "james";
            const passwordValue = "123456";
            fireEvent.change(username, { target: { value: usernameValue } });
            fireEvent.change(password, { target: { value: passwordValue} });
           
            // Submit the form
            const button = screen.getByRole("button", {name: /log in/i});
            const user = userEvent.setup();
            await user.click(button);

            // Check if the error message was updated
            expect(screen.getByText(/network error/i)).toBeInTheDocument();

        })

        //
        it("renders an error message with status when fetch response not OK", async () => {
            global.fetch = vi.fn().mockImplementation(() => {
                return Promise.resolve({
                   ok: false,
                   status: 401,
                   json: () => {
                       return Promise.resolve({error: "Error: The credentials Provided are incorrect!"});                    
                    }
                });
            })

            // Render our form
            render(<RouterProvider router={router} />);

            // Set up form fill
            const username = screen.getByLabelText(/username-input/i) as HTMLInputElement;
            const password = screen.getByLabelText(/password-input/i) as HTMLInputElement;
            const usernameValue = "james";
            const passwordValue = "123456";
            fireEvent.change(username, { target: { value: usernameValue } });
            fireEvent.change(password, { target: { value: passwordValue} });
           
            // Submit the form
            const button = screen.getByRole("button", {name: /log in/i});
            const user = userEvent.setup();

            //
            await user.click(button);
            expect(screen.getByText(/error/i)).toBeInTheDocument();

        })

        //
        it("successfull submission, stores the token in local storage and redirects to the home page", async () => {
            global.fetch = vi.fn(() => {
                return Promise.resolve({
                    ok: true,
                    status: 200,
                    json: () => Promise.resolve( { token: "successToken" })
                })
            }) as Mock;

            await act(async() => {
              // Render the login form by accessing the route.
                render(<RouterProvider router={router} />);
            })

            // Check if the form is rendered with the correct inputs
            const form = screen.queryByRole("form", { name: "login-form" }) as HTMLFormElement;
            const username = screen.getByLabelText(/username-input/i) as HTMLInputElement;
            const password = screen.getByLabelText(/password-input/i) as HTMLInputElement;
            expect(form).toBeInTheDocument();
                        
            // Fill in the form
            const usernameValue = "james";
            const passwordValue = "123456";
            fireEvent.change(username, { target: { value: usernameValue } });
            fireEvent.change(password, { target: { value: passwordValue} });
        
            // Set up the User Click
            const button = screen.getByRole("button", {name: /log in/i});
            const user = userEvent.setup();
            await user.click(button);
            
            expect(localStorage.getItem("login-token")).toBe("successToken");
            await waitFor(() => {
                expect(screen.queryByText(/home/i)).toBeInTheDocument();
            });

        })
    })

    it("user create button contains the correct link", async () => {
        const routerNewAcc = createMemoryRouter(route, { initialEntries: ["/", "/login"], initialIndex: 1 });
        await act(async () => {
            render(<RouterProvider router={routerNewAcc} />);
        })
        const link: HTMLAnchorElement = screen.getByRole("link", { name: /create account/i });
        expect(link.href).toContain("/newuser");
    }) 
})
