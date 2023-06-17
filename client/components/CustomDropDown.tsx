const CustomDropDown: React.FC<IComponent> = ({ get, set, options }) => {

    return (
        <select value={get} onChange={(e) => set(e.target.value)}>
            <option>Select Role</option>
            {options?.map((option: string, index: number) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </select>
    )
}

export default CustomDropDown