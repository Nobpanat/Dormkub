import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests ที่ขึ้นต้นด้วย /auth ไปที่ backend บนพอร์ต 5000
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true, // เปลี่ยน origin ของ request ให้ตรงกับ target
        secure: false, // ถ้า target ใช้ HTTPS ให้ตั้งเป็น true
      },
      // Proxy อื่นๆ ที่คุณต้องการสามารถเพิ่มได้ที่นี่
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
