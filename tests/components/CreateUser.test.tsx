import CreateUser from "../../src/components/CreateUser"
import { screen, render, waitFor, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createMemoryRouter, RouterProvider } from "react-router-dom"
import { server } from "../mocks/server"
import { http, HttpResponse } from "msw";
import { apiBaseUrl } from "../../src/config"

describe("CreateUser", () => {
    const route = [        
        {
            path: "/",
            element: <p>homepage</p>
        },
        {
            path: "/newuser",
            element: <CreateUser/>
        },
        {
            path: "/login",
            element: <p>login</p>   
        }
    ]

    it("redirects the page to home when the form submission receives an ok response", async () => {
        // Set up a router for this test
        const router = createMemoryRouter(route, { initialEntries: ["/login", "/newuser"], initialIndex: 1 });

        // Render the element.     
        render(<RouterProvider router={router} />);

        // Verify the form components are present
        const username = screen.getByLabelText("username-input") as HTMLInputElement;
        const password = screen.getByLabelText("password-input") as HTMLInputElement;
        const confirmPassword = screen.getByLabelText("confirmPassword-input") as HTMLInputElement;
        const form = screen.getByRole("form", { name: "new-user-form" }) as HTMLFormElement;
        
        // Verify the form inputs are invalid when they are not filled
        expect(form).toBeInvalid();
        expect(username).toBeInvalid();
        expect(password).toBeInvalid();
        expect(confirmPassword).toBeInvalid();

        // Fill in the form
        const usernameValue = "james";
        const passwordValue = "123456";
        const confirmPasswordValue = "123456";
        fireEvent.change(username, { target: { value: usernameValue } });
        fireEvent.change(password, { target: { value: passwordValue} });
        fireEvent.change(confirmPassword, { target: { value: confirmPasswordValue} });

        // Submit the form
        const button = screen.getByRole("button", { name: /create account/i });
        const user = userEvent.setup();        
        await user.click(button);

        // Assert 
        await waitFor(() => {
            expect(screen.queryByText(/login/i)).toBeInTheDocument();
        })
    })

    describe("render submission errors when...", () => {
        it("the form attempts to submit with not matching passwords", async () => {
            // Set up a router for this test
            const router = createMemoryRouter(route, { initialEntries: ["/", "/newuser"], initialIndex: 1 });

            //
            render(<RouterProvider router={router} />)

            // Verify the form components are present
            const username = screen.getByLabelText("username-input") as HTMLInputElement;
            const password = screen.getByLabelText("password-input") as HTMLInputElement;
            const confirmPassword = screen.getByLabelText("confirmPassword-input") as HTMLInputElement;
            const form = screen.getByRole("form", { name: "new-user-form" }) as HTMLFormElement;
            
            // Verify the form inputs are invalid when they are not filled
            expect(form).toBeInvalid();
            
            // Fill in the form
            const usernameValue = "james";
            const passwordValue = "123456";
            const confirmPasswordValue = "12345";
            fireEvent.change(username, { target: { value: usernameValue } });
            fireEvent.change(password, { target: { value: passwordValue} });
            fireEvent.change(confirmPassword, { target: { value: confirmPasswordValue } });

            // Attempt to submit the form
            const button = screen.getByRole("button", { name: "Create Account" });
            const user = userEvent.setup();
            await user.click(button);
            
            // Assert
            await waitFor(() => {
                expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
            })

        })

        it("the form request response is not OK", async () => {
            // Set up a router for the test
            const router = createMemoryRouter(route, { initialEntries: ["/", "/newuser"], initialIndex: 1 });  
            
            // Set up the fetch mock
            server.use(
                    http.post(`${apiBaseUrl}/users/new`, async () => {

                    // Read the intercepted request body as JSON
                    const response = HttpResponse.json({error: "not ok"},{status: 403})
                        
                    // Respond with created resource
                    return response;
                }),
            )
            
            render(<RouterProvider router = {router}/>)

            // Verify the form components are present
            const username = screen.getByLabelText("username-input") as HTMLInputElement;
            const password = screen.getByLabelText("password-input") as HTMLInputElement;
            const confirmPassword = screen.getByLabelText("confirmPassword-input") as HTMLInputElement;
            screen.getByRole("form", { name: "new-user-form" }) as HTMLFormElement;
            
            // Fill in the form
            const usernameValue = "james";
            const passwordValue = "123456";
            const confirmPasswordValue = "123456";
            fireEvent.change(username, { target: { value: usernameValue } });
            fireEvent.change(password, { target: { value: passwordValue} });
            fireEvent.change(confirmPassword, { target: { value: confirmPasswordValue} });

            // Submit the form
            const button = screen.getByRole("button", { name: /create account/i });
            const user = userEvent.setup();        
            await user.click(button);

            //
            await waitFor(() => {
                expect(screen.getByText(/not ok/i)).toBeInTheDocument();
            })
        })

        it("fetch returns an error", async () => {
            server.use(http.post(`${apiBaseUrl}/users/new`, () => {
                return HttpResponse.error();
            }))

            const router = createMemoryRouter(route, { initialEntries: ["/newuser"] });
            render(<RouterProvider router={router} />);

            // Verify the form components are present
            const username = screen.getByLabelText("username-input") as HTMLInputElement;
            const password = screen.getByLabelText("password-input") as HTMLInputElement;
            const confirmPassword = screen.getByLabelText("confirmPassword-input") as HTMLInputElement;
            screen.getByRole("form", { name: "new-user-form" }) as HTMLFormElement;
            
            // Fill in the form
            const usernameValue = "james";
            const passwordValue = "123456";
            const confirmPasswordValue = "123456";
            fireEvent.change(username, { target: { value: usernameValue } });
            fireEvent.change(password, { target: { value: passwordValue} });
            fireEvent.change(confirmPassword, { target: { value: confirmPasswordValue} });

            // Submit the form
            const button = screen.getByRole("button", { name: /create account/i });
            const user = userEvent.setup();        
            await user.click(button);

            // Assert
            expect(screen.getByText(/failed/i)).toBeInTheDocument();


        })
    })
})