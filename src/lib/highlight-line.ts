/* eslint-disable import/no-anonymous-default-export */
import { toHtml } from 'hast-util-to-html';
import { unified } from 'unified';
import parse from 'rehype-parse';

const MULTILINE_TOKEN_SPAN = /<span class="token ([^"]+)">[^<]*\n[^<]*<\/span>/g;

const lineNumberify = function lineNumberify(ast: any[], lineNum = 1) {
  let lineNumber = lineNum;
  return ast.reduce(
    (result: { nodes: { type: string; value: any; lineNumber: number; }[]; lineNumber: number; }, node: { type: string; value: string; lineNumber: number; children: any; }) => {
      if (node.type === 'text') {
        if (node.value.indexOf('\n') === -1) {
          node.lineNumber = lineNumber;
          result.nodes.push(node);
          return result;
        }

        const lines = node.value.split('\n');
        for (let i = 0; i < lines.length; i++) {
          if (i !== 0) ++lineNumber;
          if (i === lines.length - 1 && lines[i].length === 0) continue;
          result.nodes.push({
            type: 'text',
            value: i === lines.length - 1 ? lines[i] : `${lines[i]}\n`,
            lineNumber: lineNumber,
          });
        }

        result.lineNumber = lineNumber;
        return result;
      }

      if (node.children) {
        node.lineNumber = lineNumber;
        const processed = lineNumberify(node.children, lineNumber);
        node.children = processed.nodes;
        result.lineNumber = processed.lineNumber;
        result.nodes.push(node);
        return result;
      }

      result.nodes.push(node);
      return result;
    },
    { nodes: [], lineNumber: lineNumber }
  );
};

const wrapLines = function wrapLines(ast: any[], linesToHighlight: string | any[]) {
  const highlightAll = linesToHighlight.length === 1 && linesToHighlight[0] === 0;
  const allLines = Array.from(new Set(ast.map((x: { lineNumber: any; }) => x.lineNumber)));
  let i = 0;
  const wrapped = allLines.reduce((nodes: any[], marker: any) => {
    const line = marker;
    const children = [];
    for (; i < ast.length; i++) {
      if (ast[i].lineNumber < line) {
        nodes.push(ast[i]);
        continue;
      }

      if (ast[i].lineNumber === line) {
        children.push(ast[i]);
        continue;
      }

      if (ast[i].lineNumber > line) {
        break;
      }
    }

    nodes.push({
      type: 'element',
      tagName: 'div',
      properties: {
        dataLine: line,
        className: 'highlight-line',
        dataHighlighted: linesToHighlight.includes(line) || highlightAll ? 'true' : 'false',
      },
      children: children,
      lineNumber: line,
    });

    return nodes;
  }, []);

  return wrapped;
};

const applyMultilineFix = function (ast: any) {
  // AST to HTML
  let html = toHtml(ast);

  // Fix JSX issue
  html = html.replace(MULTILINE_TOKEN_SPAN, (match, token) =>
    match.replace(/\n/g, `</span>\n<span class="token ${token}">`)
  );

  // HTML to AST
  const hast = unified().use(parse, { emitParseErrors: true, fragment: true }).parse(html);

  return hast.children;
};

export default function (ast: any, lines: string | any[]) {
  const formattedAst = applyMultilineFix(ast);
  const numbered = lineNumberify(formattedAst).nodes;

  return wrapLines(numbered, lines);
}