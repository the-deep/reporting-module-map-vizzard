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
    options: {
        fastRefresh: false,
    },
  },
  webpackFinal: async (config) => {
    const eslintConfigPath = path.join(process.cwd(), '.eslintrc-lenient.json');
    const parentNodeModules = path.join(process.cwd(), '../node_modules');
    const reportingModuleDeps = path.join(parentNodeModules, '@the-deep/reporting-module');
    // NOTE: get old eslint
    const oldEslint = config?.plugins?.find(
        (p) => typeof p !== 'function' && p && p.key === 'ESLintWebpackPlugin'
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

    /*
    const oneOfRules = config.module?.rules?.find((rules) => rules && (typeof rules === 'object') && 'oneOf' in rules);
    if (oneOfRules && typeof oneOfRules === 'object') {
        const jsRule = oneOfRules.oneOf?.find((rule) => rule && typeof rule === 'object' && rule.test && rule.test.toString() === /\.(js|mjs)$/.toString());
        jsRule?.include?.push(reportingModuleDeps);
        const tsRule= oneOfRules.oneOf?.find((rule) => rule && typeof rule === 'object' && rule.test && rule.test.toString() === /.(js|mjs|jsx|ts|tsx)$/.toString());
        tsRule?.include?.push(reportingModuleDeps);
        const cssRule= oneOfRules.oneOf?.find((rule) => rule && typeof rule === 'object' && rule.test && rule.test.toString() === /\.css$/.toString());
        cssRule?.include?.push(reportingModuleDeps);
        const moduleCssRule= oneOfRules.oneOf?.find((rule) => rule && typeof rule === 'object' && rule.test && rule.test.toString() === /\.module\.css$/.toString());
        moduleCssRule?.include?.push(reportingModuleDeps);
    }
    */

    // TODO: we also can add eslint-plugin-storybook
    return config;
  },
  docs: {
    autodocs: "tag",
  },
  staticDirs: ["../public"],
};
export default config;
