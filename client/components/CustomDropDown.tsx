import 'react-dropdown/style.css'
import Dropdown from 'react-dropdown'

const CustomDropDown: React.FC<IComponent> = ({ get, set, options }) => {
    const handleChange = (e: any) => {
        set(e)
    }

    return (
        <Dropdown options={options as string[]} value={get} onChange={handleChange} placeholder="Select role" />
    )
}

export default CustomDropDown