declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production'
        EMAIL: string
        EMAIL_PSWD: string
        JWT_SECRET: string
        BUCKET_NAME: string
        DATABASE_URL: string
        BUCKET_REGION: string
        AWS_ACCESS_KEY: string
        AWS_SECRET_KEY: string
    }
}