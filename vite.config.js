import vitePluginString from 'vite-plugin-string'

export default {
    plugins: [
        vitePluginString(),
    ],
    build: {
        chunkSizeWarningLimit: 1500
    }
}