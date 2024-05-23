import Icon from "@mdi/react"
import { mdiEye, mdiEyeOff } from "@mdi/js"
import { useState, FormEvent } from "react"

interface IInputProps{
    handleInputChange: (e: FormEvent<HTMLInputElement>) => void,
    value: string,
    name: string,
    required: boolean,
    inputType: string,
}

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
                required && <input aria-label={name} required onChange={(e)=>handleInputChange(e)} value={value} className="pr-7 pl-2 bg-slate-700 white " type={hideInput ? inputType : "text"} name={name} id={name} />
            || <input aria-label={name} onChange={(e)=>handleInputChange(e)} value={value} className="pr-7 pl-2 bg-slate-700 white " type={hideInput ? inputType : "text"} name={name} id={name} />
            }
        </div>

    )
}