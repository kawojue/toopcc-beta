"use client"
import { usePhoto } from '@/utils/store'
import { handleFile } from '@/utils/file'

const PhotoUpload: React.FC = () => {
    const {
        photo1, setPhoto1,
        photo2, setPhoto2,
        photo3, setPhoto3,
    }: PhotoState = usePhoto()

    return (
        <section>
            <article>
                <div>
                    <label htmlFor='pic1'>pic1</label>
                    <input type="file" id='pic1' className="hidden"
                        onChange={(e) => handleFile(e, setPhoto1)} />
                </div>
                {/* <div className="pic-box"></div> */}
            </article>
            <article>
                <div>
                    <label htmlFor='pic2'>pic2</label>
                    <input type="file" id='pic2' className="hidden"
                        onChange={(e) => handleFile(e, setPhoto2)} />
                </div>
            </article>
            <article>
                <div>
                    <label htmlFor='pic3'>pic3</label>
                    <input type="file" id='pic3' className="hidden"
                        onChange={(e) => handleFile(e, setPhoto3)} />
                </div>
            </article>
        </section>
    )
}

export default PhotoUpload