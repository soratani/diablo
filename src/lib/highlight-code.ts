/* eslint-disable no-unused-vars */
/* eslint-disable import/no-anonymous-default-export */
import rangeParser from 'parse-numeric-range';
import { visit } from 'unist-util-visit';
import { Node, toString } from 'hast-util-to-string';
import { refractor } from 'refractor';
import highlightLine from './highlight-line';
import highlightWord from './highlight-word';

export default function (options = {}) {
  return (tree: any) => {
    visit(tree, 'element', visitor);
  };

  function visitor(node: any, index: any, parent: { tagName: string; }) {
    if (
      !parent ||
      parent.tagName !== 'pre' ||
      node.tagName !== 'code' ||
      !node.properties.className
    ) {
      return;
    }

    const [_, lang] = node.properties.className[0].split('-');

    if (lang === 'hero') {
      return;
    }

    const codeString = toString(node);

    let result = refractor.highlight(codeString, lang);

    const linesToHighlight = rangeParser(node.properties.line || '0');
    result = highlightLine(result, linesToHighlight) as any;

    result = highlightWord(result) as any;

    node.children = result;
  }
};