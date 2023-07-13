import * as React from 'react';
import NextLink from 'next/link';
import * as DS from '@modulz/design-system';
import { Link2Icon } from '@radix-ui/react-icons';
import { PropsTable } from './PropsTable';
import { KeyboardTable } from './KeyboardTable';
import { Highlights } from './Highlights';
import { HeroCodeBlock } from './HeroCodeBlock';
import { CodeBlock } from './CodeBlock';
import { PackageRelease, PRLink } from './releaseHelpers';
import { HeroContainer } from './HeroContainer';
import { HeroQuote } from './HeroQuote';
import { Frontmatter } from 'types/frontmatter';
import { ColorScale, ColorScaleGroup } from './Scale';
import * as Demos from './demos';
import { CssVariablesTable } from './CssVariablesTable';
import { DataAttributesTable } from './DataAttributesTable';
import { PreWithCopyButton } from './PreWithCopyButton';

export const components = {
  ColorScale,
  ColorScaleGroup,
  ...DS,
  Tabs: (props: any) => (
    <DS.Tabs
      {...props}
      css={{ mb: '$2', '[role="separator"]': { display: 'none' }, ...props.css }}
    />
  ),
  TabsList: (props: any) => (
    <DS.TabsList
      {...props}
      css={{
        ...props.css,
        button: {
          fontFamily: '$untitled',
          fontSize: '$2',
          background: 'none',
          border: 'none',
          marginTop: 0,
          marginBottom: '$2',
          marginLeft: 0,
          marginRight: '$1',
          height: '$5',
          br: 999,
        },
        'button[data-state="active"]': {
          bc: '$violet3',
          color: '$violet12',
          boxShadow: '0 0 0 1px $colors$violet5',
        },
      }}
    />
  ),
  CodeBlock,
  HeroCodeBlock,
  h1: (props: any) => (
    <DS.Text
      {...props}
      as="h1"
      size="8"
      css={{ scrollMarginTop: '$9', fontWeight: 500, mb: '$2', lineHeight: '40px' }}
    />
  ),
  Description: ({ children, ...props }: any) => {
    // takes the text even if it's wrapped in `<p>`
    // https://github.com/wooorm/xdm/issues/47
    const childText = typeof children === 'string' ? children : children.props.children;
    return (
      <DS.Paragraph size="2" {...props} as="p" css={{ mt: '$2', mb: '$7' }} children={childText} />
    );
  },
  h2: ({ children, id, ...props }: any) => (
    <LinkHeading id={id} css={{ mt: '$7', mb: '$2' }}>
      <DS.Heading
        size="2"
        {...props}
        id={id}
        as={'h2' as any}
        css={{ scrollMarginTop: '$9' }}
        data-heading
      >
        {children}
      </DS.Heading>
    </LinkHeading>
  ),
  h3: ({ children, id, ...props }: any) => (
    <LinkHeading id={id} css={{ mt: '$7', mb: '$1' }}>
      <DS.Heading {...props} id={id} as={'h3' as any} css={{ scrollMarginTop: '$9' }} data-heading>
        {children}
      </DS.Heading>
    </LinkHeading>
  ),
  h4: (props: any) => (
    <DS.Text
      as="h4"
      {...props}
      size="4"
      css={{ scrollMarginTop: '$9', mb: '$3', lineHeight: '27px', fontWeight: 500 }}
    />
  ),
  p: (props: any) => <DS.Paragraph {...props} css={{ mb: '$3' }} as="p" />,
  a: ({ href = '', ...props }) => {
    if (href.startsWith('http')) {
      return (
        <DS.Link
          {...props}
          variant="blue"
          href={href}
          css={{ fontSize: 'inherit' }}
          target="_blank"
          rel="noopener"
        />
      );
    }
    return (
      <NextLink href={href} passHref>
        <DS.Link {...props} css={{ color: 'inherit', fontSize: 'inherit' }} />
      </NextLink>
    );
  },
  hr: (props: any) => <DS.Separator size="2" {...props} css={{ my: '$6', mx: 'auto' }} />,
  ul: (props: any) => (
    <DS.Box
      {...props}
      css={{ color: '$hiContrast', pl: '1.15em', mb: '$3', listStyleType: 'circle' }}
      as="ul"
    />
  ),
  ol: (props: any) => <DS.Box {...props} css={{ color: '$hiContrast', mb: '$3' }} as="ol" />,
  li: (props: any) => (
    <li>
      <DS.Paragraph {...props} />
    </li>
  ),
  strong: (props: any) => (
    <DS.Text {...props} css={{ display: 'inline', fontSize: 'inherit', fontWeight: 500 }} />
  ),
  img: ({ ...props }) => (
    <DS.Box css={{ my: '$6' }}>
      <DS.Box
        as="img"
        {...props}
        css={{ maxWidth: '100%', verticalAlign: 'middle', ...props.css }}
      />
    </DS.Box>
  ),
  blockquote: (props: any) => (
    <DS.Box
      css={{
        mt: '$6',
        mb: '$5',
        pl: '$4',
        borderLeft: `1px solid $gray4`,
        color: 'orange',
        '& p': {
          fontSize: '$3',
          color: '$gray11',
          lineHeight: '25px',
        },
      }}
      {...props}
    />
  ),
  pre: PreWithCopyButton,
  code: ({ className, line, ...props }: any) => {
    // if it's a codeblock (``` block in markdown), it'll have a className from prism
    console.log(className, '<<<<<<<<<<<<<');
    const isInlineCode = !className;
    return isInlineCode ? (
      <DS.Code className={className} {...props} css={{ whiteSpace: 'break-spaces' }} />
    ) : (
      <code className={className} {...props} data-invert-line-highlight={line !== undefined} />
    );
  },
  Note: (props: any) => (
    <DS.Box
      as="aside"
      css={{
        mt: '$5',
        mb: '$5',
        borderRadius: '$3',
        '&, & p': {
          fontSize: '$3',
          color: '$slate11',
          lineHeight: '23px',
          margin: 0,
        },
      }}
      {...props}
    />
  ),
  Alert: (props: any) => (
    <DS.Box
      as="aside"
      css={{
        display: 'block',
        my: '$6',
        py: '$2',
        px: '$5',
        borderRadius: '$3',
        bc: '$yellow2',
        boxShadow: '0 0 0 1px $colors$yellow5',
        '&, & p': {
          fontSize: '$3',
          color: '$yellow11',
          lineHeight: '23px',
        },
        '& p': { margin: 0 },
      }}
      {...props}
    />
  ),
  Highlights,
  Kbd: DS.Kbd,
  Code: DS.Code,
  CssVariablesTable: (props: any) => (
    <DS.Box css={{ mt: '$2' }}>
      <CssVariablesTable {...props} />
    </DS.Box>
  ),
  DataAttributesTable: (props: any) => <DataAttributesTable {...props} />,
  PropsTable: (props: any) => (
    <DS.Box css={{ mb: '$2' }}>
      <PropsTable {...props} />
    </DS.Box>
  ),
  KeyboardTable: (props: any) => (
    <DS.Box css={{ mb: '$5' }}>
      <KeyboardTable {...props} />
    </DS.Box>
  ),
  PackageRelease,
  PRLink,
  HeroContainer,
  HeroQuote,
  ...Demos,
};

const LinkHeading = ({
  id,
  children,
  css,
}: {
  id: string;
  children: React.ReactNode;
  css?: any;
}) => (
  <DS.Box css={{ ...css }}>
    <DS.Box
      as="a"
      href={`#${id}`}
      // data-id={id}
      css={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'inline-flex',
        alignItems: 'center',

        svg: {
          opacity: 0,
        },
        '&:hover svg': {
          opacity: 1,
        },
      }}
    >
      {children}
      <DS.Box as="span" css={{ ml: '$2', color: '$slate10' }}>
        <Link2Icon aria-hidden />
      </DS.Box>
    </DS.Box>
  </DS.Box>
);

export const FrontmatterContext = React.createContext<Frontmatter>({} as any);

// Custom provider for next-mdx-remote
// https://github.com/hashicorp/next-mdx-remote#using-providers
export function MDXProvider(props: any) {
  const { frontmatter, children } = props;
  return <FrontmatterContext.Provider value={frontmatter}>{children}</FrontmatterContext.Provider>;
}
