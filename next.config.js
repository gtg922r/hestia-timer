/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    basePath: process.env.NODE_ENV === 'production' ? '/hestia-timer' : '',
    assetPrefix: process.env.NODE_ENV === 'production' ? '/hestia-timer/' : '',
    webpack: (config) => {
        config.module.rules.push({
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
            generator: {
                filename: 'static/fonts/[name][ext]',
            },
        });
        return config;
    },
}

module.exports = nextConfig 