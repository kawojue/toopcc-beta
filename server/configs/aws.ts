const bucketRegion = process.env.BUCKET_REGION
const awsSecretKey = process.env.AWS_SECRET_KEY
const awsAccessKey = process.env.AWS_ACCESS_KEY

const awsCredentials = {
    credentials: {
        accessKeyId: awsAccessKey!,
        secretAccessKey: awsSecretKey!
    },
    region: bucketRegion!
}

export default awsCredentials