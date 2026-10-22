import type { NextConfig } from 'next'
import path from 'node:path'
import { readFileSync, existsSync } from 'node:fs'

// Keep the site's version badge in lock-step with the published library.
let appVersion = '0.1.1'
const libPkgPath = path.resolve(__dirname, '../../packages/html-shutter/package.json')
if (existsSync(libPkgPath)) {
  try {
    appVersion = JSON.parse(readFileSync(libPkgPath, 'utf-8')).version
  } catch {
    // ignore
  }
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  transpilePackages: ['html-shutter'],
  turbopack: {
    root: path.resolve(__dirname, '../../'),
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: appVersion,
  },
  webpack(config) {
    // Resolve the workspace package straight to its TypeScript source so the
    // homepage always runs the code that ships, with no intermediate build.
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...config.resolve.alias,
      'html-shutter$': path.resolve(__dirname, '../../packages/html-shutter/src/index.ts'),
      'html-shutter/react': path.resolve(__dirname, '../../packages/html-shutter/src/react.ts'),
    }
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js'],
      '.jsx': ['.tsx', '.jsx'],
    }
    return config
  },
}

export default nextConfig
