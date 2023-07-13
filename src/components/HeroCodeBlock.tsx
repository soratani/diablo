import * as React from 'react';
import { Box, Flex, Button } from '@modulz/design-system';
import * as Tabs from '@radix-ui/react-tabs';
import * as Collapsible from '@radix-ui/react-collapsible';
import { getParameters } from 'codesandbox/lib/api/define';
import { isValidCssLib, useCssLibPreference } from './CssLibPreference';
import { FrontmatterContext } from './MDXComponents';
import { Pre } from './Pre';
import { CopyCodeButton } from './CopyCodeButton';
import { CSS_LIB_NAMES, DEFAULT_CSS_LIB } from '@lib/constants';
import { Select } from '@components/Select';
import { ScrollArea } from '@components/ScrollArea';
import type { CssLib } from '@lib/constants';

export const HeroCodeBlock = ({
  children,
  cssLib: cssLibProp,
}: {
  children?: React.ReactNode;
  cssLib: CssLib;
}) => {
  const frontmatter = React.useContext(FrontmatterContext);
  const [preferredCssLib, setPreferredCssLib] = useCssLibPreference();
  const cssLibCandidate = cssLibProp ?? preferredCssLib;
  const [isCodeExpanded, setIsCodeExpanded] = React.useState(false);

  const snippets = React.Children.toArray(children).map((pre) => {
    if (pre && typeof pre === 'object' && 'props' in pre) {
      return {
        id: pre.props.title,
        title: pre.props.title,
        cssLib: pre.props.cssLib,
        children: React.Children.only(pre.props.children).props?.children,
        source: pre.props.source,
      };
    }
  });

  const availableCssLibs = snippets.map(({ cssLib }) => cssLib).filter(onlyUnique);
  const usedCssLib = availableCssLibs.includes(cssLibCandidate) ? cssLibCandidate : DEFAULT_CSS_LIB;
  const currentTabs = snippets.filter(({ cssLib }) => cssLib === usedCssLib);
  const sources = currentTabs.reduce((sources, tab) => {
    return { ...sources, [tab.title]: tab.source };
  }, {});

  const [currentTabValue, setCurrentTabValue] = React.useState(() => currentTabs[0]?.id);

  React.useEffect(() => {
    // Reset tab if the current one isn't available
    const tabExists = currentTabs.find((tab) => tab.id === currentTabValue);
    if (!tabExists) setCurrentTabValue(currentTabs[0]?.id);
  }, [currentTabValue, currentTabs]);

  return (
    <Box
      data-algolia-exclude
      css={{ position: 'relative', '@bp3': { mx: '-$7' }, '@bp4': { mx: '-$8' } }}
    >
      <Collapsible.Root open={isCodeExpanded} onOpenChange={setIsCodeExpanded}>
        <Box
          css={{
            position: 'absolute',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '$1',
            top: '-$6',
            right: '$2',
          }}
        >
          <Box
            as="form"
            css={{
              display: 'none',
              color: '$whiteA12',
              '@bp1': { display: 'inline-block' },
            }}
            action="https://codesandbox.io/api/v1/sandboxes/define"
            method="POST"
            target="_blank"
          >
            <input type="hidden" name="query" value="file=/App.jsx" />
            <input type="hidden" name="environment" value="server" />
            <input type="hidden" name="hidedevtools" value="1" />
            <input
              type="hidden"
              name="parameters"
              value={makeCodeSandboxParams(frontmatter.name, sources, usedCssLib)}
            />
          </Box>
        </Box>

        <Collapsible.Content asChild forceMount>
          <Box css={{ position: 'relative' }}>
            <Tabs.Root
              value={currentTabValue}
              onValueChange={(value) => {
                setCurrentTabValue(value);
                setIsCodeExpanded(true);
              }}
            >
              <Flex
                align="center"
                justify="between"
                css={{
                  height: 40,
                  boxShadow: 'inset 0 -1px 0 0 $colors$violet5',
                  backgroundColor: '$violet2',
                  paddingRight: '$2',
                }}
              >
                <Tabs.List
                  style={{
                    height: '100%',
                  }}
                >
                  {currentTabs.map((tab) => (
                    <Tabs.Trigger key={tab.id} value={tab.id} asChild>
                      <Box
                        as="button"
                        css={{
                          all: 'unset',
                          appearance: 'none',
                          backgroundColor: 'transparent',
                          border: 'none',
                          lineHeight: '1',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                          flexShrink: 0,
                          position: 'relative',
                          userSelect: 'none',
                          paddingLeft: '$2',
                          paddingRight: '$2',
                          gap: '$2',
                          fontSize: '$2',
                          height: '100%',
                          outline: 'none',
                          '&[data-state="active"]': {
                            fontWeight: 500,
                            letterSpacing: '-.025em',
                            '&::before': {
                              boxSizing: 'border-box',
                              content: '""',
                              height: '2px',
                              position: 'absolute',
                              bottom: '0',
                              left: '0',
                              right: '0',
                              backgroundColor: '$violet9',
                            },
                          },
                        }}
                      >
                        <Flex
                          as="span"
                          align="center"
                          css={{
                            height: '$5',
                            paddingLeft: '$1',
                            paddingRight: '$1',
                            borderRadius: '$1',
                            'button:hover &': {
                              backgroundColor: '$blackA3',
                            },
                            'button:focus-visible &': {
                              boxShadow: '0 0 0 2px $colors$violet7',
                            },
                          }}
                        >
                          {tab.title}
                        </Flex>
                      </Box>
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>

                {cssLibProp === undefined && availableCssLibs.length > 1 ? (
                  <Box>
                    <Select
                      aria-label="Choose a styling solution"
                      value={preferredCssLib}
                      onChange={(event) => {
                        const lib = event.target.value;
                        if (isValidCssLib(lib)) setPreferredCssLib(lib);
                      }}
                    >
                      {availableCssLibs.map((lib) => (
                        <option key={lib} value={lib} style={{ color: '#11181c' }}>
                          {CSS_LIB_NAMES[lib]}
                        </option>
                      ))}
                    </Select>
                  </Box>
                ) : null}
              </Flex>

              {currentTabs.map((tab) => (
                <Tabs.Content key={tab.id} value={tab.id} asChild>
                  <Box
                    css={{
                      position: 'relative',
                      borderBottomLeftRadius: '$3',
                      borderBottomRightRadius: '$3',
                      '&:focus': {
                        outline: 'none',
                        boxShadow: '0 0 0 2px $colors$violetA7',
                      },
                    }}
                  >
                    <ScrollArea
                      disabled={!isCodeExpanded}
                      css={{
                        borderBottomLeftRadius: '$3',
                        borderBottomRightRadius: '$3',
                        maxHeight: isCodeExpanded ? '80vh' : 150,
                      }}
                    >
                      <Pre
                        variant="violet"
                        css={{
                          borderTopLeftRadius: 0,
                          borderTopRightRadius: 0,
                          paddingBottom: isCodeExpanded ? '$9' : undefined,
                        }}
                      >
                        <code>{tab.children}</code>
                      </Pre>
                    </ScrollArea>
                    <CopyCodeButton code={sources[tab.id]} css={{ zIndex: 1 }} />
                  </Box>
                </Tabs.Content>
              ))}
            </Tabs.Root>

            <Flex
              align="end"
              css={{
                position: 'absolute',
                bottom: 0,
                height: '$9',
                width: '100%',
                padding: '$3',
                overflow: 'hidden',
                borderRadius: '0 0 $3 $3',
                '&::before': {
                  content: '',
                  pointerEvents: 'none',
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  background: 'linear-gradient(180deg, transparent, $colors$violet2 70%)',
                  opacity: 0.9,
                },
              }}
              justify="center"
            >
              <Collapsible.Trigger asChild>
                <Button css={{ zIndex: 0 }}>{isCodeExpanded ? 'Collapse' : 'Expand'} code</Button>
              </Collapsible.Trigger>
            </Flex>
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
};

const onlyUnique = <T,>(value: T, index: number, self: T[]) => self.indexOf(value) === index;

const makeCodeSandboxParams = (
  componentName: string,
  sources: Record<string, string>,
  cssLib: CssLib
) => {
  let files = {};

  switch (cssLib) {
    case 'css':
      files = makeCssConfig(componentName, sources);
      break;
    case 'stitches':
      files = makeStitchesConfig(componentName, sources);
      break;
    case 'tailwind':
      files = makeTailwindConfig(componentName, sources);
  }

  return getParameters({ files, template: 'node' });
};

const makeCssConfig = (componentName: string, sources: Record<string, string>) => {
  const dependencies = {
    react: 'latest',
    'react-dom': 'latest',
    '@radix-ui/colors': 'latest',
    '@radix-ui/react-icons': 'latest',
    [`@radix-ui/react-${componentName}`]: 'latest',
    classnames: 'latest',
  };

  const devDependencies = {
    vite: 'latest',
    '@vitejs/plugin-react': 'latest',
  };

  const files = {
    'package.json': {
      content: {
        scripts: { start: 'vite' },
        dependencies,
        devDependencies,
      },
      isBinary: false,
    },
    ...viteConfig,
    'App.jsx': {
      content: sources['index.jsx'],
      isBinary: false,
    },
    'index.jsx': {
      content: `import { createRoot } from 'react-dom/client';
import App from './App';
import './global.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);`,
      isBinary: false,
    },
    'global.css': {
      content: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui;
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(330deg, hsl(272, 53%, 50%) 0%, hsl(226, 68%, 56%) 100%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-top: 120px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

svg {
  display: block;
}
`,
      isBinary: false,
    },
    'styles.css': {
      content: sources['styles.css'],
      isBinary: false,
    },
  };

  return files;
};

const makeStitchesConfig = (componentName: string, sources: Record<string, string>) => {
  const dependencies = {
    react: 'latest',
    'react-dom': 'latest',
    '@radix-ui/colors': 'latest',
    '@radix-ui/react-icons': 'latest',
    [`@radix-ui/react-${componentName}`]: 'latest',
    '@stitches/react': 'latest',
  };

  const devDependencies = {
    vite: 'latest',
    '@vitejs/plugin-react': 'latest',
  };

  const files = {
    'package.json': {
      content: {
        scripts: { start: 'vite' },
        dependencies,
        devDependencies,
      },
      isBinary: false,
    },
    ...viteConfig,
    'App.jsx': {
      content: sources['index.jsx'],
      isBinary: false,
    },
    'index.jsx': {
      content: `import { createRoot } from 'react-dom/client';
import App from './App';
import './global.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);`,
      isBinary: false,
    },
    'global.css': {
      content: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui;
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(330deg, hsl(272, 53%, 50%) 0%, hsl(226, 68%, 56%) 100%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-top: 120px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

svg {
  display: block;
}
`,
      isBinary: false,
    },
  };

  return files;
};

const makeTailwindConfig = (componentName: string, sources: Record<string, string>) => {
  const dependencies = {
    react: 'latest',
    'react-dom': 'latest',
    '@radix-ui/colors': 'latest',
    '@radix-ui/react-icons': 'latest',
    [`@radix-ui/react-${componentName}`]: 'latest',
    classnames: 'latest',
  };

  const devDependencies = {
    vite: 'latest',
    '@vitejs/plugin-react': 'latest',
    tailwindcss: 'latest',
    postcss: 'latest',
    autoprefixer: 'latest',
  };

  const files = {
    'package.json': {
      content: {
        scripts: { start: 'vite' },
        dependencies,
        devDependencies,
      },
      isBinary: false,
    },
    ...viteConfig,
    'tailwind.config.js': {
      content: sources['tailwind.config.js'],
      isBinary: false,
    },
    'postcss.config.js': {
      content: `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}`,
      isBinary: false,
    },
    'index.jsx': {
      content: `import { createRoot } from 'react-dom/client';
import App from './App';
import './global.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);`,
      isBinary: false,
    },
    'App.jsx': {
      isBinary: false,
      content: sources['index.jsx'],
    },
    'global.css': {
      content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: system-ui;
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(330deg, hsl(272, 53%, 50%) 0%, hsl(226, 68%, 56%) 100%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-top: 120px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`,
      isBinary: false,
    },
  };

  return files;
};

const viteConfig = {
  'vite.config.js': {
    content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`,
    isBinary: false,
  },
  'index.html': {
    content: `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite App</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/index.jsx"></script>
      </body>
    </html>`,
    isBinary: false,
  },
};
