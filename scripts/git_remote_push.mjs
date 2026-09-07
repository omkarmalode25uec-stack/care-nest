import fs from 'fs';
import git from '../server/node_modules/isomorphic-git/index.js';
import http from '../server/node_modules/isomorphic-git/http/node/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

async function setupRemoteAndPush(remoteUrl, token) {
  if (!remoteUrl) {
    console.error('Usage: node git_remote_push.mjs <GITHUB_REPOSITORY_URL> [PERSONAL_ACCESS_TOKEN]');
    process.exit(1);
  }

  console.log(`Setting remote 'origin' to: ${remoteUrl}`);
  
  // Add or update remote
  try {
    await git.deleteRemote({ fs, dir: ROOT_DIR, remote: 'origin' });
  } catch (e) {
    // Ignore if didn't exist
  }

  await git.addRemote({
    fs,
    dir: ROOT_DIR,
    remote: 'origin',
    url: remoteUrl
  });

  console.log('✓ Remote origin configured.');

  // Push to remote if token provided
  if (token) {
    console.log('Pushing main branch to origin...');
    await git.push({
      fs,
      http,
      dir: ROOT_DIR,
      remote: 'origin',
      ref: 'main',
      onAuth: () => ({ username: token })
    });
    console.log('✓ Successfully pushed main branch to remote repository!');
  } else {
    console.log('\nTo push with Git CLI:');
    console.log(`  git remote add origin ${remoteUrl}`);
    console.log('  git branch -M main');
    console.log('  git push -u origin main');
  }
}

const remoteUrl = process.argv[2];
const token = process.argv[3];
setupRemoteAndPush(remoteUrl, token).catch(console.error);
