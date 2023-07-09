declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production'
        EMAIL: string
        DB_URI: string
        EMAIL_PSWD: string
        JWT_SECRET: string
        CLOUD_NAME: string
        CLOUD_API_KEY: string
        CLOUD_API_SECRET: string
    }
}