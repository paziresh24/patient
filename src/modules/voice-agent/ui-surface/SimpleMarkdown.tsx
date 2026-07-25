import classNames from '@/common/utils/classNames';
import { Fragment, type ReactNode } from 'react';

/**
 * Tiny safe markdown subset — no HTML passthrough.
 * Supports: # ## ###, **bold**, *italic*, `code`, - lists, paragraphs.
 */
export function SimpleMarkdown({ source, className }: { source: string; className?: string }) {
  const blocks = splitBlocks(source.trim());
  return (
    <div className={classNames('space-y-2 text-[15px] leading-7 text-slate-800', className)} dir="auto">
      {blocks.map((block, i) => (
        <Fragment key={i}>{renderBlock(block)}</Fragment>
      ))}
    </div>
  );
}

type Block =
  | { kind: 'h1' | 'h2' | 'h3' | 'p'; text: string }
  | { kind: 'ul'; items: string[] };

function splitBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const out: Block[] = [];
  let para: string[] = [];
  let list: string[] = [];

  const flushPara = () => {
    if (!para.length) return;
    out.push({ kind: 'p', text: para.join(' ').trim() });
    para = [];
  };
  const flushList = () => {
    if (!list.length) return;
    out.push({ kind: 'ul', items: [...list] });
    list = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushPara();
      flushList();
      continue;
    }
    const heading = /^(#{1,3})\s+(.+)$/.exec(trimmed);
    if (heading) {
      flushPara();
      flushList();
      const level = heading[1].length;
      out.push({
        kind: level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3',
        text: heading[2],
      });
      continue;
    }
    const bullet = /^[-*]\s+(.+)$/.exec(trimmed);
    if (bullet) {
      flushPara();
      list.push(bullet[1]);
      continue;
    }
    flushList();
    para.push(trimmed);
  }
  flushPara();
  flushList();
  return out;
}

function renderBlock(block: Block): ReactNode {
  if (block.kind === 'ul') {
    return (
      <ul className="list-disc space-y-1 pr-5">
        {block.items.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </ul>
    );
  }
  if (block.kind === 'h1') {
    return <h2 className="text-[18px] font-bold text-slate-900">{renderInline(block.text)}</h2>;
  }
  if (block.kind === 'h2') {
    return <h3 className="text-[16px] font-semibold text-slate-900">{renderInline(block.text)}</h3>;
  }
  if (block.kind === 'h3') {
    return <h4 className="text-[15px] font-semibold text-slate-800">{renderInline(block.text)}</h4>;
  }
  return <p>{renderInline(block.text)}</p>;
}

function renderInline(text: string): ReactNode {
  // Split by **bold**, *italic*, `code` — order matters.
  const parts: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith('**')) {
      parts.push(
        <strong key={key++} className="font-semibold text-slate-900">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith('*')) {
      parts.push(
        <em key={key++} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    } else if (token.startsWith('`')) {
      parts.push(
        <code key={key++} className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[13px] text-slate-700">
          {token.slice(1, -1)}
        </code>,
      );
    }
    last = m.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
