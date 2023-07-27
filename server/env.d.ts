declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production'
        EMAIL: string
        DATABASE_URL: string
        EMAIL_PSWD: string
        JWT_SECRET: string
        CLOUD_NAME: string
        CLOUD_API_KEY: string
        CLOUD_API_SECRET: string
    }
}