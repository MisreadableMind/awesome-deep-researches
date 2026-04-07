/**
 * generate-html.mjs
 * Converts a research README.md + its diagrams/*.mmd into a self-contained index.html
 * using the _template/index.html shell, marked for MD→HTML, and Mermaid.js CDN for diagrams.
 *
 * Usage: node scripts/generate-html.mjs <research-folder-path>
 * Example: node scripts/generate-html.mjs payment-systems/swift-and-sepa
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { marked } from 'marked';

const ROOT = new URL('..', import.meta.url).pathname;

// --- Args ---
const folder = process.argv[2];
if (!folder) {
  console.error('Usage: node scripts/generate-html.mjs <research-folder-path>');
  process.exit(1);
}

const researchDir = join(ROOT, folder);
const mdPath = join(researchDir, 'README.md');
const diagramDir = join(researchDir, 'diagrams');
const templatePath = join(ROOT, '_template', 'index.html');
const outPath = join(researchDir, 'index.html');

if (!existsSync(mdPath)) {
  console.error(`README.md not found at: ${mdPath}`);
  process.exit(1);
}

// --- Read inputs ---
const mdContent = readFileSync(mdPath, 'utf8');
const template = readFileSync(templatePath, 'utf8');

// --- Gather Mermaid diagrams ---
const diagrams = {};
if (existsSync(diagramDir)) {
  for (const f of readdirSync(diagramDir)) {
    if (f.endsWith('.mmd')) {
      const name = basename(f, '.mmd');
      diagrams[name] = readFileSync(join(diagramDir, f), 'utf8');
    }
  }
}

// --- Extract title from first H1 ---
const titleMatch = mdContent.match(/^#\s+(.+)$/m);
const title = titleMatch ? titleMatch[1].trim() : 'Deep Research';

// --- Configure marked ---
const renderer = new marked.Renderer();

// Override code blocks: render mermaid fences as mermaid divs
const originalCode = renderer.code.bind(renderer);
renderer.code = function({ text, lang }) {
  if (lang === 'mermaid') {
    return `<div class="mermaid">${text}</div>`;
  }
  // For ASCII diagrams in code blocks, render as pre with monospace
  return `<pre><code>${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
};

marked.setOptions({
  renderer,
  gfm: true,
  breaks: false,
});

// --- Convert markdown to HTML ---
let htmlContent = marked.parse(mdContent);

// --- Build diagram section ---
// Insert all diagrams as a clickable gallery at the end, before Key Takeaways
let diagramsHtml = '';
if (Object.keys(diagrams).length > 0) {
  diagramsHtml = '\n<h2 id="diagrams-gallery">Interactive Diagrams</h2>\n';
  diagramsHtml += '<p>Click any diagram to zoom. All diagrams are rendered live from Mermaid source files.</p>\n';
  for (const [name, mmdSrc] of Object.entries(diagrams).sort()) {
    const prettyName = name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    diagramsHtml += `
<div class="diagram-container" onclick="toggleZoom(this)">
  <span class="diagram-zoom-hint">Click to zoom</span>
  <div class="mermaid">
${mmdSrc}
  </div>
  <p class="diagram-caption">${prettyName}</p>
</div>
`;
  }
}

// Insert diagrams before Key Takeaways section (if it exists)
const takeawaysIdx = htmlContent.indexOf('<h1 id="key-takeaways">');
const takeawaysIdx2 = htmlContent.indexOf('<h1>KEY TAKEAWAYS</h1>');
const takeawaysIdx3 = htmlContent.lastIndexOf('<h2');
if (takeawaysIdx !== -1) {
  htmlContent = htmlContent.slice(0, takeawaysIdx) + diagramsHtml + htmlContent.slice(takeawaysIdx);
} else if (takeawaysIdx2 !== -1) {
  htmlContent = htmlContent.slice(0, takeawaysIdx2) + diagramsHtml + htmlContent.slice(takeawaysIdx2);
} else {
  // Just append
  htmlContent += diagramsHtml;
}

// --- Build final HTML ---
// Replace the template placeholder content
let finalHtml = template;

// Replace title
finalHtml = finalHtml.replace(/\{\{TITLE\}\}/g, title);

// Replace the content placeholder section
const contentStartMarker = '<!-- CONTENT GOES HERE -->';
const contentEndMarker = '</div>\n  </div>';
const contentStart = finalHtml.indexOf(contentStartMarker);

if (contentStart === -1) {
  console.error('Template marker not found');
  process.exit(1);
}

// Replace from the H1 in template through the content marker with our generated HTML
const beforeContent = finalHtml.slice(0, finalHtml.indexOf('<h1>'));
const afterContent = finalHtml.slice(finalHtml.indexOf(contentStartMarker) + contentStartMarker.length);

finalHtml = beforeContent + htmlContent + afterContent;

// --- Add Mermaid.js CDN before closing </body> ---
const mermaidScript = `
  <!-- Mermaid.js for diagram rendering -->
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

    // Detect theme and configure mermaid accordingly
    function getMermaidTheme() {
      return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'default';
    }

    mermaid.initialize({
      startOnLoad: true,
      theme: getMermaidTheme(),
      securityLevel: 'loose',
      flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
      sequence: { useMaxWidth: true, wrap: true },
    });

    // Re-render mermaid when theme changes
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'data-theme') {
          // Re-initialize mermaid with new theme
          mermaid.initialize({ theme: getMermaidTheme() });
          // Re-render all diagrams
          document.querySelectorAll('.mermaid[data-processed]').forEach(el => {
            el.removeAttribute('data-processed');
            el.innerHTML = el.getAttribute('data-original') || el.innerHTML;
          });
          mermaid.run();
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });

    // Store original mermaid source for re-rendering
    document.querySelectorAll('.mermaid').forEach(el => {
      el.setAttribute('data-original', el.innerHTML);
    });
  </script>
`;

finalHtml = finalHtml.replace('</body>', mermaidScript + '\n</body>');

// --- Embed raw markdown source for "Copy as Markdown" ---
const escapedMd = mdContent.replace(/</g, '&lt;').replace(/>/g, '&gt;');
const mdSourceTag = `\n  <script type="text/markdown" id="markdownSource">\n${escapedMd}\n  </script>\n`;
finalHtml = finalHtml.replace('</body>', mdSourceTag + '</body>');

// --- Write output ---
writeFileSync(outPath, finalHtml, 'utf8');

const diagramCount = Object.keys(diagrams).length;
console.log(`Generated: ${outPath}`);
console.log(`  Title: ${title}`);
console.log(`  Diagrams embedded: ${diagramCount}`);
console.log(`  HTML size: ${(finalHtml.length / 1024).toFixed(0)} KB`);
