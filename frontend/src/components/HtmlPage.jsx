import { useMemo } from 'react';

function extractBody(html) {
  const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return match ? match[1] : html;
}

function extractBodyClass(html) {
  const match = html.match(/<body[^>]*class=["']([^"']*)["'][^>]*>/i);
  return match ? match[1] : '';
}

export default function HtmlPage({ html, pageClass = '' }) {
  const bodyHtml = useMemo(() => extractBody(html), [html]);
  const bodyClass = useMemo(() => extractBodyClass(html), [html]);
  const classes = `${pageClass} ${bodyClass}`.trim();

  return <div className={classes} dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}
