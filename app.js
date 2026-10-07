'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const links = { linkedin: 'https://www.linkedin.com/in/ryanjeremymorla/', github: 'https://github.com/rm0602', email: 'ryanjeremy.morla@gmail.com' };
const projects = {
  pathpal: {
    title: 'PathPal', category: 'FAMILY SAFETY / CIVIC TECHNOLOGY',
    lead: 'Connecting family journeys with better community awareness.',
    tags: ['Google Maps API', '511 API', 'Structured extraction', 'Image recognition', 'Replit', 'Xcode', 'TypeScript', 'React.JS', 'AI CV'],
    metrics: [['2', 'Family roles: parent & child'], ['3', 'Focus areas: routes, tracking & reports'], ['Prototype', 'Family safety and civic reporting']],
    note: 'Feature counts describe the prototype scope. The route illustration is conceptual, and no deployment or safety outcome is claimed.',
    problem: 'Families need a clearer view of disruptions along everyday routes, while community reports need enough structure to be useful to the people reviewing them.',
    solution: 'A family-oriented app concept with parent approval for child accounts, journey progression and checkpoint tracking, route planning using Google Maps and 511 information, and community reporting supported by AI extraction and image recognition.',
    results: 'The prototype brings family account management, route awareness, and civic reporting into one experience. Its intended impact is easier coordination and more organized reports; real-world safety improvements have not been measured here.',
    learning: 'Clear authorization, understandable alerts, and careful treatment of uncertain AI output are central to making a family-focused product useful.',
    url: null
  },
  aqualeaf: {
    title: 'AquaLeaf', category: 'COMPUTER VISION / ENVIRONMENTAL HEALTH',
    lead: 'Using visual information to surface environmental risks.',
    tags: ['TensorFlow', 'OpenCV', 'Python', 'Computer vision'],
    metrics: [['2', 'Detection areas: fires & plant diseases'], ['AI4SG', 'Competition-winning project'], ['Vision', 'Image-based environmental analysis']],
    note: 'Recognition and project purpose are supplied by Ryan. Detection accuracy, field deployment, and response-time improvement are not reported.',
    problem: 'Fires and plant diseases can threaten communities and ecosystems. Visual analysis offers a way to flag concerning signs and make environmental information easier to interpret.',
    solution: 'An AI computer vision model built with TensorFlow and OpenCV to detect fires and selected plant diseases. Created with the aim of supporting California Palisades fire-related needs and broader environmental health.',
    results: 'AquaLeaf won an AI4SG competition through its focus on sustainability and environmental health. A demonstration repository is available; the portfolio does not claim that the model was operationally deployed during the fires.',
    learning: 'A useful environmental tool needs careful validation across real-world conditions. Computer vision findings should support informed review, with performance measured on representative data.',
    url: 'https://github.com/rm0602/AquaLeaf-demo'
  },
  strange: {
    title: 'Dr. Strange', category: 'CONTROL RISK / QUANTUM SIMULATION',
    lead: 'Making control relationships and risk scenarios easier to explore.',
    tags: ['Excel', 'AI explanations', 'Quantum Amplitude Estimation', 'Qiskit', 'Python', 'PowerBI'],
    metrics: [['Excel', 'Dashboard and rule calculations'], ['AI', 'Plain-language explanations'], ['QAE', 'Quantum probability estimation']],
    note: 'The sliders on this portfolio use exact classical probability with synthetic inputs. They do not run a quantum model or show live business risk.',
    problem: 'Access and control reviews can involve many relationships, exceptions, and scenario assumptions. Reviewers need to understand what a flagged record means and which facts require verification.',
    solution: 'An Excel dashboard for control and owner analysis, AI-assisted explanations of calculated review checks, and Quantum Amplitude Estimation simulations to explore the probability of defined control failure scenarios.',
    results: 'The work combines dashboard analysis with a quantum simulation experiment. Probability estimates can be compared against an exact benchmark. An exposure comparison score is distinct from a scenario probability, and synthetic assumptions need validation before business use.',
    learning: 'Small examples are useful for checking the model against an exact result. A quantum simulation demonstrates the method; it does not establish a practical speed advantage or verified time savings.',
    url: null
  }
};
function updateThemeLabel() {
  const dark = document.documentElement.dataset.theme === 'dark';
  $('#theme-toggle').setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
  $('#theme-toggle').title = `Switch to ${dark ? 'light' : 'dark'} mode`;
  $('meta[name="theme-color"]').content = dark ? '#15161a' : '#f7f7f2';
}
updateThemeLabel();
$('#theme-toggle').addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('ryan-theme', next); } catch (_) { /* Theme still works when storage is unavailable. */ }
  updateThemeLabel();
});
$('#menu-toggle').addEventListener('click', () => {
  const open = $('#mobile-nav').hidden;
  $('#mobile-nav').hidden = !open;
  $('#menu-toggle').setAttribute('aria-expanded', String(open));
});
$$('#mobile-nav a').forEach(link => link.addEventListener('click', () => {
  $('#mobile-nav').hidden = true;
  $('#menu-toggle').setAttribute('aria-expanded', 'false');
}));
$$('.filter').forEach(button => button.addEventListener('click', () => {
  $$('.filter').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
  $$('.project-card').forEach(card => { card.hidden = button.dataset.filter !== 'all' && !card.dataset.categories.split(' ').includes(button.dataset.filter); });
}));
// Project HTML below comes only from this file's curated content, never from visitor input.
const dialog = $('#project-dialog');
let projectTrigger = null;
function openProject(key, trigger) {
  const p = projects[key]; if (!p) return;
  projectTrigger = trigger;
  $('#dialog-content').innerHTML = `<p class="eyebrow">${p.category}</p><h2 id="dialog-title">${p.title}</h2><p class="dialog-lead">${p.lead}</p><div class="tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div><div class="case-metrics">${p.metrics.map(([number, label]) => `<div><strong>${number}</strong><span>${label}</span></div>`).join('')}</div><p class="case-note">${p.note}</p>${[['The problem', p.problem], ['The solution', p.solution], ['Results & current scope', p.results], ['What I learned', p.learning]].map(([title, text]) => `<section class="case-block"><h3>${title}</h3><p>${text}</p></section>`).join('')}<div class="case-actions">${p.url ? `<a class="button primary" href="${p.url}" target="_blank" rel="noopener noreferrer">View on GitHub <span>↗</span></a>` : '<span class="link-pending">Project link will be added when available.</span>'}<a class="button secondary" href="mailto:${links.email}">Ask about this project <span>↗</span></a></div>`;
  dialog.showModal(); document.body.classList.add('modal-open'); dialog.scrollTop = 0; $('#dialog-close').focus();
}
$$('[data-project]').forEach(button => button.addEventListener('click', () => openProject(button.dataset.project, button)));
$('#dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); projectTrigger?.focus(); });
function scenarioProbability(a, b, c) { return a * b * (1 - c) + a * c * (1 - b) + b * c * (1 - a) + a * b * c; }
function updateRisk() {
  const values = ['a', 'b', 'c'].map(key => {
    const value = Number($(`#control-${key}`).value); $(`#value-${key}`).textContent = `${value}%`; return value / 100;
  });
  const probability = scenarioProbability(...values);
  $('#risk-value').innerHTML = `${(probability * 100).toFixed(2)}<span>%</span>`;
  $('#gauge-value').style.strokeDashoffset = String(2 * Math.PI * 49 * (1 - probability));
  $('.risk-gauge').setAttribute('aria-label', `At least two controls fail: ${(probability * 100).toFixed(2)} percent`);
}
$$('.risk-controls input').forEach(input => input.addEventListener('input', updateRisk));
$('#reset-risk').addEventListener('click', () => { [10, 20, 15].forEach((value, index) => { $$('.risk-controls input')[index].value = value; }); updateRisk(); });
updateRisk();
function animateNumber(element) {
  const target = Number(element.dataset.count), prefix = element.dataset.prefix || '', suffix = element.dataset.suffix || '';
  if (reducedMotion) { element.textContent = prefix + target.toLocaleString('en-US') + suffix; return; }
  const start = performance.now();
  function step(now) { const progress = Math.min((now - start) / 1000, 1); const amount = Math.round(target * (1 - (1 - progress) ** 3)); element.textContent = prefix + amount.toLocaleString('en-US') + suffix; if (progress < 1) requestAnimationFrame(step); }
  requestAnimationFrame(step);
}
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { animateNumber(entry.target); observer.unobserve(entry.target); } }); }, { threshold: 0.4 });
  $$('[data-count]').forEach(element => observer.observe(element));
}
const responses = {
  experience: 'Ryan has experience at Deloitte & Touche in technology controls advisory (June–August 2026), Plug and Play in IT infrastructure and automation (February–May 2026), and PwC in digital assurance (June–August 2025). His work covers access reviews, governance, enterprise systems, and automation.',
  deloitte: 'At Deloitte, Ryan worked as a Technology Controls Advisory Intern for TMT and AI clients. His work included OpenAI, PowerQuery, and Qiskit analysis of core pipelines, mitigating $80M+ in GDPR violations, access reviews for 5,000 users, SoD and GRC analysis, and AI agents and skills to streamline production pipelines. He is a full-time offer recipient.',
  pwc: 'At PwC, Ryan worked in Digital Assurance & Transparency with AI, cloud, and network clients. He executed ITGC reviews within fintech and SAP S/4HANA, analyzed 75+ Jira workflows, assessed NIST and SOC1/2 frameworks through walkthroughs and risk analysis, and examined SAP, Salesforce, and cloud interfaces in testing and production environments. He is a full-time offer recipient.',
  venture: 'At Plug and Play, Ryan worked in IT infrastructure and automation for venture capital, enterprise, and unicorn clients. He resolved 90+ weekly Jira tickets, implemented AWS security and Linux control reviews, engineered Intune policies across 800 endpoints, and automated audits for 1,000+ hardware assets. He also automated access privileges using TypeScript, REST APIs, and Google Enterprise environments, improving efficiency by 80%.',
  projects: 'The featured projects are PathPal (family safety and civic reporting), AquaLeaf (TensorFlow and OpenCV for fire and plant disease detection), and Dr. Strange (Excel, AI explanations, and quantum risk simulation). Open a project card for its case study.',
  aqualeaf: 'AquaLeaf is a computer vision project for detecting fires and selected plant diseases using TensorFlow and OpenCV. Ryan describes it as an AI4SG competition-winning sustainability project. The demo is at github.com/rm0602/AquaLeaf-demo. Published accuracy or field-deployment results are not supplied here.',
  pathpal: 'PathPal is a family safety and civic reporting prototype. It connects parent approval of child accounts, journey and checkpoint tracking, route information, and AI-assisted report organization. A live project link has not yet been provided.',
  strange: 'Dr. Strange combines an Excel risk dashboard, AI-assisted review explanations, and Quantum Amplitude Estimation simulations. The sliders on this website calculate an exact classical probability with synthetic inputs; they do not execute quantum code or measure live business risk.',
  skills: 'Ryan’s tools include Replit, Xcode, TypeScript, React.JS, AI computer vision, Python, SQL, Bash, PowerShell, Git, Excel, Power Query, Tableau, Alteryx, OpenAI, Gemini, quantum simulations, TensorFlow, and OpenCV. His experience also includes NetSuite, Jira, Google Enterprise, Copilot, AWS, Azure, SAP S/4HANA, Salesforce, identity and access management, IT controls, and risk frameworks.',
  sustainability: 'Ryan wants to use strategy, analytics, and technology to contribute to environmental health and positive human impact. AquaLeaf focuses on fires and plant disease detection; PathPal explores family coordination and community awareness.',
  education: 'Ryan is a first-generation college student studying Business Administration and Management Information Systems at San José State University’s Lucas College and Graduate School of Business. His recognition includes Dean’s Scholar and a Student-Professional Award.',
  awards: 'Ryan’s resume lists two AI4SG hackathon wins, a Student-Professional Award, and Dean’s Scholar recognition. It also lists Oracle Cloud Infrastructure Associate, PwC Digital Assurance & Transparency, and Tableau certifications. CISA is in progress, not completed.',
  contact: 'Reach Ryan at ryanjeremy.morla@gmail.com, on LinkedIn at linkedin.com/in/ryanjeremymorla/, or on GitHub at github.com/rm0602. The portfolio includes a downloadable resume.',
  availability: 'Ryan’s current availability and preferred opportunities are not specified in this portfolio. Email ryanjeremy.morla@gmail.com to ask directly.',
  about: 'Ryan Morla is a Business and Technology Professional based in the San Francisco Bay Area. His portfolio connects strategy and analytics with AI, sustainability, and software projects.',
  ai: 'This Q&A uses prepared answers and topic matching from Ryan’s published portfolio. It does not call a live AI model, send your messages to an AI provider, or incur API fees.'
};
const topicPatterns = [
  ['aqualeaf', /aqua\s?leaf|plant|fire|tensorflow|opencv/], ['pathpal', /path\s?pal|orivis|family|route|civic/], ['strange', /strange|quantum|qiskit|risk dashboard|probability/],
  ['deloitte', /deloitte/], ['pwc', /pwc|pricewaterhouse/], ['venture', /plug|venture|\bvc\b/], ['availability', /available|availability|hiring|opportunit|salary/],
  ['contact', /contact|email|linkedin|github|resume|reach/], ['education', /education|school|university|degree|college|sjsu|first.gen/], ['awards', /award|certif|hackathon|ai4sg|cisa|scholar/],
  ['sustainability', /sustainab|impact|environment|mission|passion/], ['skills', /skills?|tools?|python|sql|excel|cloud|programming/], ['projects', /projects?|built|portfolio work/],
  ['experience', /experience|work|intern|career|background/], ['ai', /\bai\b|chatbot|model|live|api/], ['about', /about|who|ryan|yourself/]
];
const qaPanel = $('#qa-panel'), qaLauncher = $('#qa-launcher');
function setQA(open) { qaPanel.hidden = !open; qaLauncher.setAttribute('aria-expanded', String(open)); if (open) $('#qa-input').focus(); else qaLauncher.focus(); }
qaLauncher.addEventListener('click', () => setQA(qaPanel.hidden));
$('#qa-close').addEventListener('click', () => setQA(false));
function ask(question, explicitTopic) {
  const clean = question.trim().slice(0, 350); if (!clean) return;
  const log = $('#qa-messages'), message = document.createElement('div'); message.className = 'qa-question'; message.textContent = clean; log.appendChild(message);
  const topic = explicitTopic || topicPatterns.find(([, regex]) => regex.test(clean.toLowerCase()))?.[0];
  const reply = document.createElement('div'); reply.className = 'qa-answer'; reply.textContent = responses[topic] || 'That detail is not in my prepared portfolio answers. Try experience, projects, skills, education, or sustainability. For a specific question, email Ryan at ryanjeremy.morla@gmail.com.'; log.appendChild(reply);
  // Keep the local conversation bounded. It is not saved or transmitted.
  while (log.children.length > 31) log.removeChild(log.firstElementChild);
  log.scrollTop = log.scrollHeight;
}
$$('[data-topic]').forEach(button => button.addEventListener('click', () => ask(`Tell me about ${button.dataset.topic === 'sustainability' ? 'sustainability and impact' : button.dataset.topic}.`, button.dataset.topic)));
$('#qa-form').addEventListener('submit', event => { event.preventDefault(); ask($('#qa-input').value); $('#qa-input').value = ''; $('#qa-input').focus(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') { if (!qaPanel.hidden) setQA(false); $('#mobile-nav').hidden = true; $('#menu-toggle').setAttribute('aria-expanded', 'false'); } });
let toastTimer;
function toast(text) { $('#toast').textContent = text; $('#toast').classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 2600); }
$('#copy-email').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(links.email); toast('Email copied'); }
  catch (_) { toast(`Email: ${links.email}`); }
});
$('#year').textContent = String(new Date().getFullYear());
