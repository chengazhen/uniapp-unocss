import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
import Components from '@uni-helper/vite-plugin-uni-components'
import  { resolve } from "path"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, '../packages/main.ts'),
      name: 'MyLib',
      // the proper extensions will be added
      fileName: 'my-lib',
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', '@dcloudio/uni-app'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    UnoCSS(),
    AutoImport({
      imports: ['vue'],
      dts: './typing/auto-imports.d.ts'
    }),
    Components({
      dirs: ['src/components/'],
      dts: './typing/components.d.ts',
    }),
    uni(),
  ],
});
