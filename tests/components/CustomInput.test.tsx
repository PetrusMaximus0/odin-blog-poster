import { render, screen, waitFor } from "@testing-library/react"
import CustomInput from "../../src/components/CustomInput"
import userEvent from "@testing-library/user-event"

describe("CustomInput", () => {

    describe("input is type password", () => {        
        it("changes the input type when reveal password button is clicked", async () => {
            render(<CustomInput
                required={true}
                name="input"
                handleInputChange={() => { }}
                value="0"
                inputType="password"
            />);
            
            // Verify the input type is password
            let input = screen.getByLabelText("input") as HTMLInputElement;
            expect(input.type).toEqual("password");
            
            // Set up the user click
            const button = screen.queryByLabelText("reveal-password") as HTMLButtonElement;
            const user = userEvent.setup();
            await user.click(button);
                        
            // Verify the input type has changed to text
            input = screen.getByLabelText("input") as HTMLInputElement;
            expect(input.type).toEqual("text");

        })
    })

    describe("input type is other than password", () => {
        it("reveal password button is not rendered", () => {
            render(
                <CustomInput
                    required={true}
                    name="input"
                    handleInputChange={() => { }}
                    value="0"
                    inputType="text"
                />
            );
            
            expect(screen.queryByLabelText("reveal-password")).not.toBeInTheDocument()
        })
    })

    describe("On input change", () => {
        
        it("calls the callback for on change input", async () => {
            const handleInputChange = vi.fn();
            
            render(<CustomInput
                    required={true}
                    name="input"
                    handleInputChange={handleInputChange}
                    value="0"
                    inputType="text"
                />
            )

            //
            const inputField = screen.getByLabelText("input") as HTMLInputElement;            
            await userEvent.type(inputField, "inp");           

            //
            await waitFor(() => {
                expect(handleInputChange).toBeCalledTimes(3);
            })
            screen.debug();
        })


    })
})