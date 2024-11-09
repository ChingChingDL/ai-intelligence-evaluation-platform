import {defineConfig} from "vite";

export default defineConfig({
  requestLibPath: "import request from '@/utils/httpInstance'",
  schemaPath: 'http://localhost:8101/api/v2/api-docs',
  serversPath: './src',
})
