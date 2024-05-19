import { render, screen, act } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import LoginForm from "../../src/components/LoginForm";

describe("Login", () => {
    const route = [
        {
            path: "/",
            element: <LoginForm/>
        }
    ]
    const router = createMemoryRouter(route, { initialEntries: ["/"] });

    describe("On form submission", () => {

        global.fetch = vi.fn();

        it("does not submit the form if the required fields are not filled", async () => {
            // Render the login form by accessing the route.
            render(<RouterProvider router={router} />);
            
            // Check if the form is rendered with the correct inputs
            const form = screen.queryByRole("form", { name: "login-form" }) as HTMLFormElement;
            const username = screen.getByLabelText(/username/i) as HTMLInputElement;
            const password = screen.getByLabelText(/password/i) as HTMLInputElement;
            //
            expect(form).toBeInTheDocument();
            // Form should be invalid because both inputs are required
            expect(form).toBeInvalid();
            expect(username).toBeInvalid();
            expect(password).toBeInvalid();
            
            // Get and check the button
            const button = screen.getByRole("button");
            expect(button).toBeInTheDocument();

            // Set up the User Click
            const user = userEvent.setup();
            await user.click(button);
            
            // Fetch should not be called because the form is invalid
            expect(fetch).not.toHaveBeenCalled();
            screen.debug();            
        })

        it("submits the form when the fields are filled correctly", async () => {       
            // Render the login form by accessing the route.
            render(<RouterProvider router={router} />);
            
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
            username.value = usernameValue;
            password.value = passwordValue;
            
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
                body: {
                    username: usernameValue,
                    password: passwordValue,
                }
                
            });
            screen.debug(); 
            
        });
    })


    test.todo("links to the correct page on clicking 'Create Account'")
})
