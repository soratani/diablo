/* eslint-disable import/no-anonymous-default-export */
import { toHtml } from 'hast-util-to-html';
import { unified } from 'unified';
import parse from 'rehype-parse';

const CALLOUT = /__(.*?)__/g;

export default function (code: any) {
  const html = toHtml(code);
  const result = html.replace(CALLOUT, (_: any, text: any) => `<span class="highlight-word">${text}</span>`);
  const hast = unified().use(parse, { emitParseErrors: true, fragment: true }).parse(result);
  return hast.children;
};