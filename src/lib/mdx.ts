import fs from 'fs';
import path from 'path';
import glob from 'glob';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import compareVersions from 'compare-versions';
import { bundleMDX } from 'mdx-bundler';
import remarkSlug from 'remark-slug';
import rehypeHeroCodeBlock from '@lib/code-block';
import rehypeMetaAttribute from '@lib/meta-attribute';
import rehypeHighlightCode from '@lib/highlight-code';

const ROOT_PATH = process.cwd();
export const DATA_PATH = path.join(ROOT_PATH, 'data');

// the front matter and content of all mdx files based on `docsPaths`
export const getAllFrontmatter = (fromPath: string) => {
  const PATH = path.join(DATA_PATH, fromPath);
  const paths = glob.sync(`${PATH}/**/*.mdx`);

  return paths
    .map((filePath) => {
      const source = fs.readFileSync(path.join(filePath), 'utf8');
      const { data, content } = matter(source);

      return {
        ...data,
        slug: filePath.replace(`${DATA_PATH}/`, '').replace('.mdx', ''),
        readingTime: readingTime(content),
      };
    })
    .sort((a: any, b: any) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt)));
};

export const getMdxBySlug = async (basePath: string, slug: any) => {
  const source = fs.readFileSync(path.join(DATA_PATH, basePath, `${slug}.mdx`), 'utf8');
  const { frontmatter, code } = await bundleMDX(source, {
    xdmOptions(input, options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkSlug] as any[];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeHeroCodeBlock,
        rehypeMetaAttribute,
        rehypeHighlightCode,
      ] as any[];

      return options;
    },
  });

  return {
    frontmatter: {
      ...frontmatter,
      slug,
      readingTime: readingTime(code),
    },
    code,
  };
};

export function getAllVersionsFromPath(fromPath: string) {
  const PATH = path.join(DATA_PATH, fromPath);
  if (!fs.existsSync(PATH)) return [];
  return fs
    .readdirSync(PATH)
    .map((fileName) => fileName.replace('.mdx', ''))
    .sort(compareVersions as any)
    .reverse();
}
