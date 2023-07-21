import type { StorybookConfig } from "@storybook/react-webpack5";
import process from 'process';
import path from 'path';
import ESLintPlugin from 'eslint-webpack-plugin';

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
    "@storybook/addon-interactions",
    // "@kickstartds/storybook-addon-jsonschema"
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  webpackFinal: async (config) => {
    const eslintConfigPath = path.join(process.cwd(), '.eslintrc-lenient.json');
    // NOTE: get old eslint
    const oldEslint = config?.plugins?.find(
        (p) => typeof p !== 'function' && p.key === 'ESLintWebpackPlugin'
    );
    // NOTE: removing custom eslint plugin
    config.plugins = config?.plugins?.filter((p) => p !== oldEslint);

    if (config.plugins && oldEslint && typeof oldEslint !== 'function') {
      // create new eslint
      const newEslint = new ESLintPlugin({
        ...oldEslint.options,
        // extensions: ['.js', '.ts', '.tsx', '.jsx'],
        reportUnusedDisableDirectives: 'warn',
        overrideConfigFile: eslintConfigPath,
      })
      config.plugins.push(newEslint);
    }

    // TODO: we also can add eslint-plugin-storybook
    return config;
  },
  docs: {
    autodocs: "tag",
  },
  staticDirs: ["../public"],
};
export default config;
