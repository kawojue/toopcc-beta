import awsCredentials from './aws'
import {
    ListObjectsCommand, ListObjectsCommandInput,
    DeleteObjectCommand, DeleteObjectCommandInput,
    S3Client, PutObjectCommand, PutObjectCommandInput,
} from '@aws-sdk/client-s3'

const s3 = new S3Client(awsCredentials)

export default s3
export {
    PutObjectCommand, PutObjectCommandInput,
    ListObjectsCommand, ListObjectsCommandInput,
    DeleteObjectCommand, DeleteObjectCommandInput
}