import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    workspace: [
      {
        extends: true,
        test: {
          name: 'E2E',
          environment: 'prisma',
          include: ['src/http/controllers/**/*.{test,spec}.{js,ts}'],
        },
      },
      {
        extends: true,
        test: {
          name: 'UNIT',
          environment: 'node',
          include: [
            'src/**/*.{test,spec}.{js,ts}',
            '!src/http/controllers/**/*',
          ],
        },
      },
    ],
  },
})
