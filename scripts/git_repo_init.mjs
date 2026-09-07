import fs from 'fs';
import path from 'path';
import git from '../server/node_modules/isomorphic-git/index.js';

const ROOT_DIR = 'c:/Users/HP/Desktop/KHUMBCARE STAY AND HEALTH';

async function initCleanGitRepo() {
  console.log('=== CLEAN GIT REPOSITORY INITIALIZATION ===\n');
  console.log('Project Root:', ROOT_DIR);

  // 1. Check existing .git
  const gitDir = path.join(ROOT_DIR, '.git');
  if (fs.existsSync(gitDir)) {
    console.log('Old Git status: Existing .git directory detected. Removing old Git metadata...');
    fs.rmSync(gitDir, { recursive: true, force: true });
    console.log('✓ Old .git metadata safely removed.');
  }

  // 2. Remove temporary init_git.mjs from server if present
  const serverInit = path.join(ROOT_DIR, 'server', 'init_git.mjs');
  if (fs.existsSync(serverInit)) {
    fs.unlinkSync(serverInit);
  }

  // 3. Initialize fresh git repo with defaultBranch 'main'
  console.log('Initializing fresh Git repository with branch main...');
  await git.init({ fs, dir: ROOT_DIR, defaultBranch: 'main' });

  // 4. Configure author
  await git.setConfig({
    fs,
    dir: ROOT_DIR,
    path: 'user.name',
    value: 'KumbhStay Developer'
  });
  await git.setConfig({
    fs,
    dir: ROOT_DIR,
    path: 'user.email',
    value: 'dev@kumbhstay.local'
  });

  // 5. Scan and stage files according to .gitignore
  console.log('Scanning project files...');
  const matrix = await git.statusMatrix({
    fs,
    dir: ROOT_DIR,
    filter: (f) => !f.startsWith('.git')
  });

  let stagedCount = 0;
  const stagedFiles = [];
  const excludedFiles = [];

  for (const [filepath, head, workdir, stage] of matrix) {
    if (workdir !== 0) {
      const isIgnored = await git.isIgnored({
        fs,
        dir: ROOT_DIR,
        filepath
      });

      if (isIgnored) {
        excludedFiles.push(filepath);
      } else {
        await git.add({ fs, dir: ROOT_DIR, filepath });
        stagedFiles.push(filepath);
        stagedCount++;
      }
    }
  }

  console.log(`\nStaged files count: ${stagedCount}`);
  console.log(`Ignored files count: ${excludedFiles.length}`);

  // 6. Strict Security audit of staged files
  const sensitivePatterns = [
    /\.env($|\..*)/i,
    /node_modules/i,
    /\.bson$/i,
    /uploads/i
  ];

  const violations = stagedFiles.filter((f) => {
    if (f.endsWith('.env.example')) return false;
    return sensitivePatterns.some((p) => p.test(f));
  });

  if (violations.length > 0) {
    console.error('CRITICAL SECURITY VIOLATION: Sensitive files found in staging:', violations);
    process.exit(1);
  } else {
    console.log('✓ Security Check PASSED: No .env, node_modules, .bson database dumps, or private secrets staged.');
  }

  // 7. Initial commit
  const commitSha = await git.commit({
    fs,
    dir: ROOT_DIR,
    message: 'Initial commit: KumbhStay Nashik',
    author: {
      name: 'KumbhStay Developer',
      email: 'dev@kumbhstay.local'
    }
  });

  console.log(`\n✓ Initial commit created: ${commitSha}`);

  // 8. Verify branch
  const currentBranch = await git.currentBranch({ fs, dir: ROOT_DIR, fullname: false });
  console.log(`✓ Current active branch: ${currentBranch}`);

  // 9. Commit log verification
  const log = await git.log({ fs, dir: ROOT_DIR, depth: 5 });
  console.log('\nGit Log:');
  log.forEach((c) => {
    console.log(` - ${c.oid} : ${c.commit.message.trim()} (by ${c.commit.author.name})`);
  });

  // 10. File breakdown
  const categories = {};
  stagedFiles.forEach((f) => {
    const ext = path.extname(f) || 'no-ext';
    categories[ext] = (categories[ext] || 0) + 1;
  });
  console.log('\nCommitted files breakdown by extension:', categories);
}

initCleanGitRepo().catch(console.error);
