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

// Generate Tech Stack Table Rows (Full-Width 2-Column Balanced Grid)
function generateTechStackRows(techStack = []) {
  let html = '';
  for (let i = 0; i < techStack.length; i += 2) {
    const left = techStack[i];
    const right = techStack[i + 1];

    if (right) {
      html += `<tr>\n<td width="50%" valign="top">\n\n**${left.category}**<br/><br/><img src="https://skillicons.dev/icons?i=${left.icons}&theme=dark" height="38"/>\n\n</td>\n<td width="50%" valign="top">\n\n**${right.category}**<br/><br/><img src="https://skillicons.dev/icons?i=${right.icons}&theme=dark" height="38"/>\n\n</td>\n</tr>\n`;
    } else {
      html += `<tr>\n<td colspan="2" width="100%" valign="top">\n\n**${left.category}**<br/><br/><img src="https://skillicons.dev/icons?i=${left.icons}&theme=dark" height="38"/>\n\n</td>\n</tr>\n`;
    }
  }
  return html.trimEnd();
}

// Helper: Create Sleek Glassmorphism SVG Pill Buttons
function createSleekPillSvg(s) {
  let iconPath = '';
  if (s.name.toLowerCase() === 'portfolio') {
    iconPath = `<polygon points="12,4 2,20 22,20" fill="#FFFFFF"/>`;
  } else if (s.name.toLowerCase() === 'linkedin') {
    iconPath = `<path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2v-8.37H6.46M7.83 6.18a1.66 1.66 0 0 0-1.67 1.67 1.66 1.66 0 0 0 1.67 1.67 1.66 1.66 0 0 0 1.67-1.67 1.66 1.66 0 0 0-1.67-1.67z" fill="#0A66C2"/>`;
  } else if (s.name.toLowerCase() === 'email') {
    iconPath = `<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#EA4335"/>`;
  } else {
    iconPath = `<circle cx="12" cy="12" r="8" fill="#6366F1"/>`;
  }

  const width = 148;
  const height = 42;

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad_${s.name}" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#161B22" stop-opacity="0.98"/>
      <stop offset="100%" stop-color="#0D1117" stop-opacity="0.98"/>
    </linearGradient>
    <linearGradient id="borderGrad_${s.name}" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#6366F1" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#30363D" stop-opacity="0.5"/>
    </linearGradient>
  </defs>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="20" fill="url(#bgGrad_${s.name})" stroke="url(#borderGrad_${s.name})" stroke-width="1.5"/>
  <g transform="translate(16, 9)">
    ${iconPath}
  </g>
  <text x="48" y="26" font-family="'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif" font-size="14" font-weight="600" fill="#F0F6FC" letter-spacing="0.3">${s.name}</text>
  <path d="M120 18h6m0 0l-3-3m3 3l-3 3" stroke="#8B949E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

// Generate Social Badges (Custom SVG Pills)
function generateSocialBadges(socials = []) {
  return socials.map(s => {
    const filename = `badge-${s.name.toLowerCase()}.svg`;
    const filepath = path.join(ASSETS_DIR, filename);
    const svgContent = createSleekPillSvg(s);
    fs.writeFileSync(filepath, svgContent, 'utf8');
    return `<a href="${s.url}" target="_blank"><img src="assets/${filename}" height="42" alt="${s.name}"/></a>`;
  }).join(' &nbsp;&nbsp; ');
}

// Generate Connect Links
function generateConnectLinks(socials = []) {
  return socials.map(s => `<a href="${s.url}" target="_blank"><strong>${s.name}</strong></a>`).join(' &nbsp;·&nbsp; ');
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

// Dynamic GitHub API Project Fetcher Engine
async function fetchDynamicProjects(data) {
  const cfg = data.dynamicConfig;
  if (!cfg || !cfg.enabled) return data.projects;

  console.log(`\x1b[36m[i] Fetching live repositories for @${data.githubUsername} from GitHub API...\x1b[0m`);
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'TanishkGoswami-README-Sync-Bot'
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(`https://api.github.com/users/${data.githubUsername}/repos?per_page=100&sort=updated`, { headers });
    const repos = res.ok ? await res.json() : [];
    const publicRepos = Array.isArray(repos) ? repos.filter(r => !r.private && !r.fork && r.name !== data.githubUsername) : [];

    // Helper to convert markdown links inside description to HTML anchor tags
    const formatLinks = (desc) => {
      return desc.replace(/\[\*\*([^\]]+)\*\*\]\(([^)]+)\)/g, '<a href="$2" target="_blank"><strong>$1</strong></a>')
                 .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank"><strong>$1</strong></a>');
    };

    const dynamicProjects = [];
    const matchedRepoNames = new Set();

    // 1. Process all static flagship projects from data.projects first to guarantee they stay featured
    for (const p of data.projects) {
      let cleanTitle = p.title.split(' ⭐')[0];
      let desc = formatLinks(p.description);

      // Try to find matching public repo on GitHub to attach live star count or GitHub URL
      const matchingRepo = publicRepos.find(r => 
        r.name.toLowerCase() === cleanTitle.toLowerCase() ||
        cleanTitle.toLowerCase().includes(r.name.toLowerCase()) ||
        (r.name.toLowerCase() === 'gap_whatsapp' && cleanTitle.toLowerCase().includes('gap')) ||
        (r.name.toLowerCase() === 'broadcastpilot' && cleanTitle.toLowerCase().includes('broadcast'))
      );

      let starBadge = '';
      if (matchingRepo) {
        matchedRepoNames.add(matchingRepo.name.toLowerCase());
        if (matchingRepo.stargazers_count > 0) {
          starBadge = ` ⭐ ${matchingRepo.stargazers_count}`;
        }
        // If static description doesn't already have links, add them
        if (!desc.includes('<a href=')) {
          let linksHtml = `<a href="${matchingRepo.html_url}" target="_blank"><strong>GitHub Repo</strong></a>`;
          if (matchingRepo.homepage && matchingRepo.homepage.startsWith('http')) {
            linksHtml = `<a href="${matchingRepo.homepage}" target="_blank"><strong>Live Demo</strong></a> &nbsp;·&nbsp; ` + linksHtml;
          }
          desc = `${desc}<br/><br/>${linksHtml}`;
        }
      }

      dynamicProjects.push({
        title: `${cleanTitle}${starBadge}`,
        description: desc
      });
    }

    // 2. Add any remaining public repos that have stars or are tagged 'featured' (up to maxProjects or more)
    const extraRepos = publicRepos.filter(r => !matchedRepoNames.has(r.name.toLowerCase()) && (r.stargazers_count > 0 || (r.topics && r.topics.includes('featured'))));
    extraRepos.sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at));

    for (const r of extraRepos) {
      if (dynamicProjects.length >= (cfg.maxProjects || 6)) break;
      let desc = r.description || "Production system repository.";
      
      // Try fetching first paragraph of README
      try {
        const readmeRes = await fetch(`https://raw.githubusercontent.com/${data.githubUsername}/${r.name}/${r.default_branch || 'main'}/README.md`);
        if (readmeRes.ok) {
          const rawReadme = await readmeRes.text();
          const lines = rawReadme.split('\n').filter(l => l.trim() && !l.trim().startsWith('#') && !l.trim().startsWith('![') && !l.trim().startsWith('<') && !l.trim().startsWith('['));
          if (lines.length > 0 && lines[0].length > 30) {
            desc = lines[0].substring(0, 160).trim() + (lines[0].length > 160 ? '...' : '');
          }
        }
      } catch (e) {
        // ignore
      }

      const starBadge = r.stargazers_count > 0 ? ` ⭐ ${r.stargazers_count}` : '';
      let linksHtml = `<a href="${r.html_url}" target="_blank"><strong>GitHub Repo</strong></a>`;
      if (r.homepage && r.homepage.startsWith('http')) {
        linksHtml = `<a href="${r.homepage}" target="_blank"><strong>Live Demo</strong></a> &nbsp;·&nbsp; ` + linksHtml;
      }

      dynamicProjects.push({
        title: `${r.name}${starBadge}`,
        description: `${desc}<br/><br/>${linksHtml}`
      });
    }

    return dynamicProjects;
  } catch (err) {
    console.error(`\x1b[31m[!] Error in fetchDynamicProjects:\x1b[0m`, err.message);
    return data.projects;
  }
}

// Main Build Function
async function build() {
  const startTime = Date.now();
  const isDynamic = process.argv.includes('--dynamic');
  try {
    delete require.cache[require.resolve(path.join(SRC_DIR, 'data.js'))];
    const data = require(path.join(SRC_DIR, 'data.js'));
    const cssContent = fs.readFileSync(path.join(SRC_DIR, 'style.css'), 'utf8');
    const templateContent = fs.readFileSync(path.join(SRC_DIR, 'readme-template.html'), 'utf8');

    const cssVars = parseCSSVariables(cssContent);

    // 1. Generate SVG Banners
    generateBanners(data, cssVars);

    // If --dynamic flag is passed, fetch live repo stats from GitHub API
    if (isDynamic) {
      const dynamicProjects = await fetchDynamicProjects(data);
      if (dynamicProjects && dynamicProjects.length > 0) {
        data.projects = dynamicProjects;
      }
    }

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
