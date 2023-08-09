/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/kawojue/image/upload/**',
            },
            {
                protocol: 'https',
                hostname: 'd3ux2wcrkowxaw.cloudfront.net',
                port: '',
                pathname: '/**',
            },
        ],
    },
}

module.exports = nextConfig
