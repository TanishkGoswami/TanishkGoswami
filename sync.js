const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const ASSETS_DIR = path.join(__dirname, 'assets');
const README_PATH = path.join(__dirname, 'README.md');
const PREVIEW_PATH = path.join(__dirname, 'preview.html');

// Helper: Parse CSS variables from style.css
function parseCSSVariables(cssContent) {
  const vars = {};
  const regex = /--([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;
  let match;
  while ((match = regex.exec(cssContent)) !== null) {
    vars[match[1].trim()] = match[2].trim();
  }
  return vars;
}

// Generate dark/light banner SVGs
function generateBanners(data, cssVars) {
  const p = data.profile;

  const darkSvg = `<svg width="${cssVars['banner-width'] || 1200}" height="${cssVars['banner-height'] || 260}" viewBox="0 0 1200 260" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="accentDark" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${cssVars['dark-accent-start'] || '#4F46E5'}"/>
      <stop offset="100%" stop-color="${cssVars['dark-accent-end'] || '#818CF8'}"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="260" fill="${cssVars['dark-bg'] || '#0D1117'}"/>

  <rect x="64" y="72" width="44" height="4" fill="url(#accentDark)"/>

  <text x="64" y="132" font-family="${cssVars['banner-font-family'] || 'Helvetica, Arial, sans-serif'}" font-size="46" font-weight="700" fill="${cssVars['dark-title'] || '#E6EDF3'}">
    ${p.name}
  </text>

  <text x="64" y="166" font-family="${cssVars['banner-font-family'] || 'Helvetica, Arial, sans-serif'}" font-size="18" font-weight="400" fill="${cssVars['dark-subtitle'] || '#8B949E'}">
    ${p.tagline}
  </text>

  <text x="1136" y="100" text-anchor="end" font-family="${cssVars['banner-font-family'] || 'Helvetica, Arial, sans-serif'}" font-size="14" font-weight="500" fill="${cssVars['dark-subtitle'] || '#8B949E'}" letter-spacing="1">
    ${p.location}
  </text>

  <text x="1136" y="126" text-anchor="end" font-family="${cssVars['banner-font-family'] || 'Helvetica, Arial, sans-serif'}" font-size="14" font-weight="500" fill="${cssVars['dark-status'] || '#4F46E5'}" letter-spacing="1">
    ${p.statusText}
  </text>

  <line x1="64" y1="210" x2="1136" y2="210" stroke="${cssVars['dark-border'] || '#21262D'}" stroke-width="1"/>

  <text x="64" y="238" font-family="${cssVars['banner-font-family'] || 'Helvetica, Arial, sans-serif'}" font-size="13" fill="${cssVars['dark-skills'] || '#6E7681'}">
    ${p.skillsSummary}
  </text>
</svg>
`;

  const lightSvg = `<svg width="${cssVars['banner-width'] || 1200}" height="${cssVars['banner-height'] || 260}" viewBox="0 0 1200 260" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="accentLight" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${cssVars['light-accent-start'] || '#4338CA'}"/>
      <stop offset="100%" stop-color="${cssVars['light-accent-end'] || '#6366F1'}"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="260" fill="${cssVars['light-bg'] || '#FFFFFF'}"/>

  <rect x="64" y="72" width="44" height="4" fill="url(#accentLight)"/>

  <text x="64" y="132" font-family="${cssVars['banner-font-family'] || 'Helvetica, Arial, sans-serif'}" font-size="46" font-weight="700" fill="${cssVars['light-title'] || '#1F2328'}">
    ${p.name}
  </text>

  <text x="64" y="166" font-family="${cssVars['banner-font-family'] || 'Helvetica, Arial, sans-serif'}" font-size="18" font-weight="400" fill="${cssVars['light-subtitle'] || '#656D76'}">
    ${p.tagline}
  </text>

  <text x="1136" y="100" text-anchor="end" font-family="${cssVars['banner-font-family'] || 'Helvetica, Arial, sans-serif'}" font-size="14" font-weight="500" fill="${cssVars['light-subtitle'] || '#656D76'}" letter-spacing="1">
    ${p.location}
  </text>

  <text x="1136" y="126" text-anchor="end" font-family="${cssVars['banner-font-family'] || 'Helvetica, Arial, sans-serif'}" font-size="14" font-weight="500" fill="${cssVars['light-status'] || '#4338CA'}" letter-spacing="1">
    ${p.statusText}
  </text>

  <line x1="64" y1="210" x2="1136" y2="210" stroke="${cssVars['light-border'] || '#D0D7DE'}" stroke-width="1"/>

  <text x="64" y="238" font-family="${cssVars['banner-font-family'] || 'Helvetica, Arial, sans-serif'}" font-size="13" fill="${cssVars['light-skills'] || '#656D76'}">
    ${p.skillsSummary}
  </text>
</svg>
`;

  if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });
  fs.writeFileSync(path.join(ASSETS_DIR, 'banner-dark.svg'), darkSvg, 'utf8');
  fs.writeFileSync(path.join(ASSETS_DIR, 'banner-light.svg'), lightSvg, 'utf8');
}

// Generate HTML grid for projects
function generateProjectsGrid(projects = []) {
  let html = '';
  for (let i = 0; i < projects.length; i += 2) {
    const p1 = projects[i];
    const p2 = projects[i + 1];
    html += '<tr>\n';
    html += `<td width="50%" valign="top">\n\n**${p1.title}**\n${p1.description}\n\n</td>\n`;
    if (p2) {
      html += `<td width="50%" valign="top">\n\n**${p2.title}**\n${p2.description}\n\n</td>\n`;
    } else {
      html += `<td width="50%" valign="top">\n\n</td>\n`;
    }
    html += '</tr>\n';
  }
  return html.trimEnd();
}

// Generate Tech Stack Table Rows
function generateTechStackRows(techStack = []) {
  return techStack.map(item => `<tr>
<td valign="top" width="25%"><strong>${item.category}</strong></td>
<td valign="top">
<img src="https://skillicons.dev/icons?i=${item.icons}&theme=dark" height="32"/>
</td>
</tr>`).join('\n');
}

// Generate Social Badges
function generateSocialBadges(socials = []) {
  return socials.map(s => `[![${s.name}](https://img.shields.io/badge/${s.name}-${s.color}?style=flat-square&logo=${s.logo}&logoColor=white)](${s.url})`).join('\n');
}

// Generate Connect Links
function generateConnectLinks(socials = []) {
  return socials.map(s => `[**${s.name}**](${s.url})`).join(' &nbsp;·&nbsp; ');
}

// Generate HTML Live Preview for Local Browser Testing
function generateBrowserPreview(readmeContent, cssContent) {
  // Convert basic markdown elements to HTML for local preview
  let htmlPreview = readmeContent
    .replace(/<picture>\s*<source[^>]+srcset="([^"]+)"[^>]*>\s*<img[^>]+src="([^"]+)"[^>]+(?:alt="([^"]*)")?[^>]*>\s*<\/picture>/gi, (match, darkSrc, lightSrc, altText) => {
      return `<div class="picture-wrapper">
        <img src="${darkSrc}" alt="${altText || ''}" class="preview-img-dark" width="100%"/>
        <img src="${lightSrc}" alt="${altText || ''}" class="preview-img-light" width="100%"/>
      </div>`;
    })
    .replace(/## (.*?)\n/g, '<h2>$1</h2>\n')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Linked image badges: [![alt](img-url)](link-url)
    .replace(/\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/g, '<a href="$3" target="_blank" class="badge-link"><img src="$2" alt="$1"/></a>')
    // Standalone images: ![alt](img-url)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1"/>')
    // Normal links: [text](link-url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/\n\n/g, '<br/>\n');

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>README Live Preview Studio</title>
  <style>
    ${cssContent}
    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: #161b22;
      color: #fff;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .theme-btn {
      background: #238636;
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }
    .theme-btn:hover { background: #2ea043; }
    
    /* Theme-aware picture toggling */
    body.theme-dark .preview-img-light { display: none; }
    body.theme-dark .preview-img-dark { display: block; }
    body.theme-light .preview-img-dark { display: none; }
    body.theme-light .preview-img-light { display: block; }
  </style>
</head>
<body class="preview-body theme-dark">
  <div class="preview-header">
    <div><strong>⚡ README Live Studio</strong> — Synced automatically with HTML/CSS/JS</div>
    <button class="theme-btn" onclick="toggleTheme()">Toggle Dark / Light Theme</button>
  </div>
  <div class="preview-container">
    ${htmlPreview}
  </div>
  <script>
    function toggleTheme() {
      const body = document.body;
      if (body.classList.contains('theme-dark')) {
        body.classList.replace('theme-dark', 'theme-light');
      } else {
        body.classList.replace('theme-light', 'theme-dark');
      }
    }
  </script>
</body>
</html>`;
  fs.writeFileSync(PREVIEW_PATH, fullHtml, 'utf8');
}

// Main Build Function
function build() {
  const startTime = Date.now();
  try {
    // Clear require cache for data.js during live watch
    delete require.cache[require.resolve(path.join(SRC_DIR, 'data.js'))];
    const data = require(path.join(SRC_DIR, 'data.js'));
    const cssContent = fs.readFileSync(path.join(SRC_DIR, 'style.css'), 'utf8');
    const templateContent = fs.readFileSync(path.join(SRC_DIR, 'readme-template.html'), 'utf8');

    const cssVars = parseCSSVariables(cssContent);

    // 1. Generate SVG Banners
    generateBanners(data, cssVars);

    // 2. Compile Variables
    let output = templateContent;
    output = output.replace(/\{\{profile\.name\}\}/g, data.profile.name);
    output = output.replace(/\{\{profile\.tagline\}\}/g, data.profile.tagline);
    output = output.replace(/\{\{profile\.location\}\}/g, data.profile.location);
    output = output.replace(/\{\{profile\.statusText\}\}/g, data.profile.statusText);
    output = output.replace(/\{\{profile\.skillsSummary\}\}/g, data.profile.skillsSummary);
    output = output.replace(/\{\{about\.intro\}\}/g, data.about.intro);
    output = output.replace(/\{\{about\.secondary\}\}/g, data.about.secondary);
    output = output.replace(/\{\{about\.stackSummary\}\}/g, data.about.stackSummary);
    output = output.replace(/\{\{githubUsername\}\}/g, data.githubUsername);
    output = output.replace(/\{\{connectText\}\}/g, data.connectText);

    // Dynamic Sections
    output = output.replace(/\{\{social_badges\}\}/g, generateSocialBadges(data.socials));
    output = output.replace(/\{\{projects_grid\}\}/g, generateProjectsGrid(data.projects));
    output = output.replace(/\{\{tech_stack_rows\}\}/g, generateTechStackRows(data.techStack));
    output = output.replace(/\{\{connect_links\}\}/g, generateConnectLinks(data.socials));

    // 3. Write README.md
    fs.writeFileSync(README_PATH, output, 'utf8');

    // 4. Generate Browser Preview
    generateBrowserPreview(output, cssContent);

    const elapsed = Date.now() - startTime;
    console.log(`\x1b[32m[✓] README.md, SVGs, and preview.html compiled successfully in ${elapsed}ms!\x1b[0m`);
  } catch (err) {
    console.error(`\x1b[31m[!] Build failed:\x1b[0m`, err);
  }
}

// Check CLI flags
const isWatch = process.argv.includes('--watch');

build();

if (isWatch) {
  console.log(`\x1b[36m[i] Watching src/ for HTML/CSS/JS edits...\x1b[0m`);
  let debounceTimer;
  fs.watch(SRC_DIR, (eventType, filename) => {
    if (filename) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        console.log(`\n\x1b[33m[~] Change detected in ${filename}. Recompiling...\x1b[0m`);
        build();
      }, 100);
    }
  });
}
