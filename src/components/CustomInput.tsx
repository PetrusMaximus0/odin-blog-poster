import Icon from "@mdi/react"
import { mdiEye, mdiEyeOff } from "@mdi/js"
import { useState } from "react"
import {IInputProps} from "../interfaces"

export default function CustomInput({handleInputChange, value, name, required, inputType}:IInputProps) {
    const [hideInput, setHideInput] = useState<boolean>(true);
    const handleVisibilityChange = () => {
        setHideInput(!hideInput);
    }

    return (
        <div className="flex relative">
            {   inputType==="password" &&         
                <button className="absolute right-1 -translate-y-1/2 top-1/2" aria-label="reveal-password" type="button" onClick={handleVisibilityChange}>
                    {
                        hideInput && <Icon path={mdiEye} size={0.8} /> || <Icon path={mdiEyeOff} size={0.8} />
                    }
                </button>
            }
            {
                inputType === "textarea" && ( required && <textarea className="w-full pr-7 pl-2 bg-slate-700 white" aria-label={`${name}-input`} required onChange={handleInputChange} name={name} id={name} value={value} />
                    || <textarea className="w-full pr-7 pl-2 bg-slate-700 white" aria-label={`${name}-input`} onChange={handleInputChange} name={name} id={name} value={value} />
                )
                || (required && <input aria-label={`${name}-input`} required onChange={handleInputChange} value={value} className="w-full pr-7 pl-2 bg-slate-700" type={hideInput ? inputType : "text"} name={name} id={name} />
            || <input aria-label={`${name}-input`} onChange={handleInputChange} value={value} className="w-full pr-7 pl-2 bg-slate-700" type={hideInput ? inputType : "text"} name={name} id={name} />)
            }
        </div>

    )
}