/* eslint-disable no-unused-vars */
import { visit } from 'unist-util-visit';

const re = /\b([-\w]+)(?:=(?:"([^"]*)"|'([^']*)'|([^"'\s]+)))?/g;

export default function metaAttribute(options: any) {
  return (tree: any) => {
    visit(tree, 'element', onelement);
  };

  function onelement(node: { tagName: string; data: { meta: string; }; properties: { [x: string]: string; }; }) {
    var match;

    if (node.tagName === 'code' && node.data && node.data.meta) {
      re.lastIndex = 0; // Reset regex.

      while ((match = re.exec(node.data.meta))) {
        node.properties[match[1]] = match[2] || match[3] || match[4] || '';
      }
    }
  }
};