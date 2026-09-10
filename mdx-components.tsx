import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="mb-4 mt-16 text-3xl font-semibold tracking-tight text-foreground first:mt-0 sm:text-4xl">
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="mb-3 mt-12 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="mb-2 mt-8 text-lg font-semibold text-foreground sm:text-xl"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4
      className="mb-2 mt-6 text-base font-semibold text-foreground"
      {...props}
    >
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="mb-4 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-7">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 space-y-2 pl-4 text-sm leading-7 text-muted-foreground marker:text-border sm:text-base">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 space-y-2 pl-4 text-sm leading-7 text-muted-foreground marker:text-border sm:text-base">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-1">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-foreground">{children}</em>
  ),
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      className="text-accent underline decoration-border underline-offset-2 transition-colors hover:text-accent-hover"
      {...props}
    >
      {children}
    </a>
  ),
  code: ({ children, className }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs text-accent">
          {children}
        </code>
      );
    }
    return (
      <code className={className}>{children}</code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-4 overflow-x-auto rounded-lg border border-border-subtle bg-code-background p-4 font-mono text-sm leading-6">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-4 border-l-2 border-accent pl-4 text-sm italic text-muted-foreground sm:text-base">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm text-muted-foreground">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-border">{children}</thead>
  ),
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr className="border-b border-border-subtle">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-foreground">{children}</td>
  ),
  hr: () => <hr className="my-8 border-border-subtle" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
