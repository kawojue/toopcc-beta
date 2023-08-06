import awsCredentials from '../configs/aws'
import {
    ListObjectsCommand, ListObjectsCommandInput,
    DeleteObjectCommand, DeleteObjectCommandInput,
    S3Client, PutObjectCommand, PutObjectCommandInput,
} from '@aws-sdk/client-s3'

const s3 = new S3Client(awsCredentials)

const uploadS3 = async (buffer: Buffer, path: string, type?: string) => {
    const params: PutObjectCommandInput = {
        Bucket: process.env.BUCKET_NAME!,
        Key: path,
        Body: buffer,
        ContentType: type
    }
    const command: PutObjectCommand = new PutObjectCommand(params)
    await s3.send(command)
}

const deleteS3 = async (path: string) => {
    const params: DeleteObjectCommandInput = {
        Key: path,
        Bucket: process.env.BUCKET_NAME!,
    }
    const command: DeleteObjectCommand = new DeleteObjectCommand(params)
    await s3.send(command)
}

const getS3 = async () => {

}

export default s3
export {
    uploadS3, deleteS3, getS3,
    PutObjectCommand, PutObjectCommandInput,
    ListObjectsCommand, ListObjectsCommandInput,
    DeleteObjectCommand, DeleteObjectCommandInput
}