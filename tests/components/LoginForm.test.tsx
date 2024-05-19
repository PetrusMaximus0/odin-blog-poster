import { render, screen, fireEvent } from "@testing-library/react";
import { RouterProvider, createMemoryRouter} from "react-router-dom";
import userEvent from "@testing-library/user-event";
import LoginForm from "../../src/components/LoginForm";
import { Mock } from "vitest";
import { act } from "react";

describe("Login", () => {
    const route = [
        {
            path: "/",
            element: <LoginForm/>
        }
    ]
    const router = createMemoryRouter(route, { initialEntries: ["/"] });

    describe("On form submission", () => {
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
            const username = screen.getByLabelText(/username/i) as HTMLInputElement;
            const password = screen.getByLabelText(/password/i) as HTMLInputElement;
            expect(form).toBeInTheDocument();
            
            // Form should be invalid because both inputs are required
            expect(form).toBeInvalid();
            expect(username).toBeInvalid();
            expect(password).toBeInvalid();
            
            // Get and check the button
            const button = screen.getByRole("button");

            // Set up the User Click
            const user = userEvent.setup();
            await user.click(button);
            
            // Fetch should not be called because the form is invalid
            expect(fetch).not.toHaveBeenCalled();
          
        })

        it("submits the form when the fields are filled correctly", async () => { 
            global.fetch = vi.fn(() => {
                return Promise.resolve({
                    ok: true,
                    status: 200,
                    json: () => Promise.resolve({ token: "success token" })
                })
            }) as Mock;

            await act(async() => {
              // Render the login form by accessing the route.
                render(<RouterProvider router={router} />);
            })
                
            // Check if the form is rendered with the correct inputs
            const form = screen.queryByRole("form", { name: "login-form" }) as HTMLFormElement;
            const username = screen.getByLabelText(/username/i) as HTMLInputElement;
            const password = screen.getByLabelText(/password/i) as HTMLInputElement;
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
            const button = screen.getByRole("button");
            const user = userEvent.setup();
            await user.click(button);
            
            // Fetch should be called with the correct options.
            expect(fetch).toHaveBeenCalledWith("http://localhost:3000/users/login", {
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
    
        it("renders an error message if the fetch promise is rejected",async () => {
            global.fetch = vi.fn().mockImplementation(() => {
                return Promise.reject(new Error("Fetch failed, Network Error"));
            })

            // Render our form
            render(<RouterProvider router={router} />);

            // Set up form fill
            const username = screen.getByLabelText(/username/i) as HTMLInputElement;
            const password = screen.getByLabelText(/password/i) as HTMLInputElement;
            const usernameValue = "james";
            const passwordValue = "123456";
            fireEvent.change(username, { target: { value: usernameValue } });
            fireEvent.change(password, { target: { value: passwordValue} });
           
            // Submit the form
            const button = screen.getByRole("button");
            const user = userEvent.setup();
            await user.click(button);

            // Check if the error message was updated
            expect(screen.getByText(/network error/i)).toBeInTheDocument();

        })

        it("renders an error message with status when fetch response not OK", async () => {
            global.fetch = vi.fn().mockImplementation(() => {
                return Promise.resolve({
                   ok: false,
                   status: 404,
                   json: () => {
                       return Promise.resolve({});                    
                    }
                });
            })

            // Render our form
            render(<RouterProvider router={router} />);

            // Set up form fill
            const username = screen.getByLabelText(/username/i) as HTMLInputElement;
            const password = screen.getByLabelText(/password/i) as HTMLInputElement;
            const usernameValue = "james";
            const passwordValue = "123456";
            fireEvent.change(username, { target: { value: usernameValue } });
            fireEvent.change(password, { target: { value: passwordValue} });
           
            // Submit the form
            const button = screen.getByRole("button");
            const user = userEvent.setup();
            await user.click(button);
            expect(screen.getByText(/error with status/i)).toBeInTheDocument();
            screen.debug();
        })
        
        it.todo("on successful log in, saves the token sent by the API on the local storage and redirects the page")
    })

        it.todo("renders or redirects to \"create a user form\" when the user clicks the CreateUser button")


})
