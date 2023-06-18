"use client"
import useAuth from "@/hooks/useAuth"
import { SpinnerOne } from "./Spinner"

const SubmitBtn: React.FC<ISubmitBtn> = ({ loading, texts, styles, handler }) => {
    const { loading: load } = useAuth()

    return (
        <button type="submit" onClick={async () => await handler()}
        className={`${styles || "submit-btn hover:bg-clr-6 hover: text-clr-5"}`}>
            {(load || loading) ? <SpinnerOne /> : <span>{texts}</span>}
        </button>
    )
}

export default SubmitBtn