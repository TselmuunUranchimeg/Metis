let result = require("dotenv").config();

/** @type {import('next').NextConfig} */
const nextConfig = {
    env: result.parsed
}

module.exports = nextConfig
