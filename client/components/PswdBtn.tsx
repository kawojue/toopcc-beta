import { AiFillEyeInvisible, AiFillEye } from '@/public/icons/ico'

const PswdButton: React.FC<IPswdButton> = ({ get, set }) => {
    return (
        <button className="eye" type="button" onClick={() => set(!get)}>
            {get ? <AiFillEye /> : <AiFillEyeInvisible />}
        </button>
    )
}

export default PswdButton