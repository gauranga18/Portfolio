// ── All portfolio data ────────────────────────────────────

// ── Navigation ───────────────────────────────────────────
export const NAV_ITEMS = [
  { label: 'About',      href: '#about'      },
  { label: 'Skills',     href: '#skills'     },
  { label: 'Projects',   href: '#projects'   },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact',    href: '#contact'    },
]

// ── Personal Info ─────────────────────────────────────────
export const PERSONAL = {
  name:        'Saurav Jyoti',
  tagline:     'Systems Programmer from Assam',
  location:    'Assam, India',
  github:      'https://github.com/gauranga18',
  linkedin:    'https://linkedin.com/in/saurav-jyoti',
  instagram:   'https://instagram.com/saurav_.30__',
  email:       'sauravjyoti@proton.me',
  roles:       ['C Developer', 'DevOps Learner', 'Systems Architect', 'Infrastructure Builder'],
}

// ── Skills ────────────────────────────────────────────────
export const SKILLS = [
  { name: 'C',       icon: 'SiC',          level: 90, tag: 'Primary',   color: '#39ff14' },
  { name: 'Java',    icon: 'FaJava',       level: 65, tag: 'Secondary', color: '#39ff14' },
  { name: 'Linux',   icon: 'FaLinux',      level: 85, tag: 'OS',        color: '#39ff14' },
  { name: 'Git',     icon: 'FaGitAlt',     level: 85, tag: 'VCS',       color: '#39ff14' },
  { name: 'Docker',  icon: 'FaDocker',     level: 70, tag: 'DevOps',    color: '#39ff14' },
  { name: 'Make',    icon: 'SiMake',        level: 75, tag: 'Build',     color: '#39ff14' },
  { name: 'YAML',    icon: 'SiYaml',       level: 75, tag: 'Config',    color: '#39ff14' },
  { name: 'Bash',    icon: 'SiGnubash',    level: 78, tag: 'Scripting', color: '#39ff14' },
  { name: 'DevOps',  icon: 'SiAnsible',    level: 55, tag: 'Learning',  color: '#39ff14' },
  { name: 'Valgrind',icon: 'FaBug',        level: 70, tag: 'Debugging', color: '#39ff14' },
  { name: 'GDB',     icon: 'SiGdb',        level: 72, tag: 'Debugging', color: '#39ff14' },
  { name: 'Python',  icon: 'FaPython',     level: 60, tag: 'Scripting', color: '#39ff14' },
]

// ── Projects ──────────────────────────────────────────────
export const PROJECTS = [
  {
    id:          '01',
    title:       'Developer Infrastructure Tool',
    description: 'A lightweight, modular developer toolchain for building and managing C-based infrastructure. Features automated build pipelines, dependency tracking, memory-safe module linking, and Docker integration for reproducible environments.',
    tech:        ['C', 'Makefiles', 'Docker', 'Linux', 'Bash'],
    github:      'https://github.com/gauranga18',
    demo:        null,
    status:      'WIP',
    featured:    true,
  },
  {
    id:          '02',
    title:       'C Memory Allocator',
    description: 'A custom heap memory allocator written in C, implementing both first-fit and best-fit algorithms with coalescing and splitting strategies. Includes a debug mode with detailed allocation tracking.',
    tech:        ['C', 'GDB', 'Valgrind'],
    github:      'https://github.com/gauranga18',
    demo:        null,
    status:      'Complete',
    featured:    false,
  },
  {
    id:          '03',
    title:       'Linux System Monitor',
    description: 'A terminal-based system monitoring tool that reads from /proc to display real-time CPU, memory, disk I/O, and network statistics with ncurses-style rendering.',
    tech:        ['C', 'Linux', 'Bash', 'YAML'],
    github:      'https://github.com/gauranga18',
    demo:        null,
    status:      'Complete',
    featured:    false,
  },
]

// ── Experience / Timeline ─────────────────────────────────
export const EXPERIENCE = [
  {
    year:         '2024 – Present',
    title:        'Developer Infrastructure Tool',
    type:         'Personal Project',
    tech:         'C, Docker, Makefiles, Linux',
    description:  'Architecting a modular developer toolchain focused on low-level C infrastructure automation. Building reproducible build pipelines and memory-safe module systems.',
  },
  {
    year:         '2023',
    title:        'Systems Programming Deep Dive',
    type:         'Self-Study',
    tech:         'C, Linux Kernel, GDB, Valgrind',
    description:  'Explored OS internals — memory management, process scheduling, file systems. Built custom allocators, shell parsers, and TCP servers from scratch.',
  },
  {
    year:         '2022',
    title:        'CS Fundamentals',
    type:         'Education',
    tech:         'Java, Algorithms, Data Structures',
    description:  'Solid grounding in computer science fundamentals: algorithms, data structures, OOP principles, and introduction to systems programming via Java.',
  },
]

// ── Stats ─────────────────────────────────────────────────
export const STATS = [
  { label: 'Years of Experience', value: '2+' },
  { label: 'Projects Shipped',    value: '10+' },
  { label: 'Lines of C',          value: '∞'   },
]
