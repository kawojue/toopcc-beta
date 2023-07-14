"use client"
import { SpinnerOne } from "./Spinner"
import { useAuthStore } from "@/utils/store"

const SubmitBtn: React.FC<ISubmitBtn> = ({ loading, texts, styles, handler }) => {
    const { loading: load } = useAuthStore()

    return (
        <button type="submit" onClick={async () => await handler()}
            className={`${styles || "submit-btn hover:bg-clr-6 hover: text-clr-5"}`}>
            {(load || loading) ? <SpinnerOne /> : <span>{texts}</span>}
        </button>
    )
}

export default SubmitBtn