import dotenv from 'dotenv'

dotenv.config()

const bucketRegion = process.env.BUCKET_REGION
const awsSecretKey = process.env.AWS_SECRET_KEY
const awsAccessKey = process.env.AWS_ACCESS_KEY

const awsCredentials = {
    credentials: {
        accessKeyId: awsAccessKey as string,
        secretAccessKey: awsSecretKey as string
    },
    region: bucketRegion as string
}

export default awsCredentials