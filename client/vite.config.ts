import vue from '@vitejs/plugin-vue';
import vueTypeImports from 'vite-plugin-vue-type-imports';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    plugins: [
      vue({
        script: {
          defineModel: true,
          propsDestructure: true,
        },
      }),
      vueTypeImports(),
    ],
    server: {
      host: true,
      proxy: {
        '/api': env.VITE_PROXY,
        '/upload': env.VITE_PROXY,
      },
      port: +env.VITE_PORT,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@icons': path.resolve(__dirname, './src/components/common/action/icon'),
        '@action': path.resolve(__dirname, './src/components/common/action'),
        '@static': path.resolve(__dirname, './src/components/common/static'),
        '@page': path.resolve(__dirname, './src/components/common/page'),
      },
    },
    build: {
      outDir: path.resolve(__dirname, '../server/dist/public'),
    },
  });
};
