import { useState } from "react"
import { format } from 'date-fns'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const PickDate: React.FC<IComponent> = ({ get, set }) => {  
    const [isOpen, setIsOpen] = useState(false)

    const handleChange = (e: any) => {
        setIsOpen(!isOpen)
        set(e)
    }

    const handleClick = (e: any) => {
        e.preventDefault()
        setIsOpen(!isOpen)
    }

    return (
        <article className="date-picker flex flex-col items-center gap-2">
            <button onClick={handleClick} className="bg-clr-1 px-3 py-1.5 rounded text-clr-0 font-medium tracking-wider">
                {format(get || new Date() as any, "dd-MM-yyyy")}
            </button>
            {isOpen && (
                <DatePicker selected={get as any} onChange={handleChange} inline />
            )}
        </article>
    )
}

export default PickDate