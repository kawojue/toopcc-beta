"use client"
import useAuth from "@/hooks/useAuth"
import { SpinnerOne } from "./Spinner"

interface ISubmitBtn {
    texts: string
    styles?: string
    func: () => Promise<void>
}

const SubmitBtn: React.FC<ISubmitBtn> = ({ texts, styles, func }) => {
    const { loading } = useAuth()

    return (
        <button type="submit" onClick={async () => await func()}
        className={`${styles || "submit-btn hover:bg-clr-6 hover: text-clr-5"}`}>
            {loading ? <SpinnerOne /> : <span>{texts}</span>}
        </button>
    )
}

export default SubmitBtn