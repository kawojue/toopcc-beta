"use client"
import { handleFile } from '@/utils/file'
import usePatient from '@/hooks/usePatient'

const PicsUpload: React.FC = () => {
    const {
        pic1, setPic1,
        pic2, setPic2,
        pic3, setPic3
    } = usePatient()

    return (
        <section>
            <button>
                <label></label>
                <input type="file" onChange={(e) => handleFile(e, setPic1)} />
            </button>
            <button>
                <label></label>
                <input type="file" onChange={(e) => handleFile(e, setPic2)} />
            </button>
            <button>
                <label></label>
                <input type="file" onChange={(e) => handleFile(e, setPic3)} />
            </button>
        </section>
    )
}

export default PicsUpload