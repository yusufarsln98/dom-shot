import type { NextConfig } from 'next'
import path from 'node:path'
import { readFileSync, existsSync } from 'node:fs'

// Keep the site's version badge in lock-step with the published library.
let appVersion = '0.1.0'
const libPkgPath = path.resolve(__dirname, '../../packages/dom-shot/package.json')
if (existsSync(libPkgPath)) {
  try {
    appVersion = JSON.parse(readFileSync(libPkgPath, 'utf-8')).version
  } catch {
    // ignore
  }
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  transpilePackages: ['dom-shot'],
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
      'dom-shot$': path.resolve(__dirname, '../../packages/dom-shot/src/index.ts'),
      'dom-shot/react': path.resolve(__dirname, '../../packages/dom-shot/src/react.ts'),
    }
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js'],
      '.jsx': ['.tsx', '.jsx'],
    }
    return config
  },
}

export default nextConfig
