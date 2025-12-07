const fs = require('fs');
const path = require('path');

const IGNORED_DIRS = ['node_modules', '.git', '.next', 'out', 'dist', 'build', '.idea', '.vscode', 'coverage'];
const TARGET_EXTS = ['.css', '.scss', '.sass'];

const GOOGLE_FONTS_IMPORT_REGEX = /@import\s+url\(\s*['"]https?:\/\/fonts\.googleapis\.com.*?['"]\s*\)/i;

function walk(dir) {
  try {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      let stat;
      try {
        stat = fs.statSync(filePath);
      } catch (e) {
        continue;
      }

      if (stat.isDirectory()) {
        if (!IGNORED_DIRS.includes(file)) {
          walk(filePath);
        }
      } else {
        const ext = path.extname(file).toLowerCase();
        if (TARGET_EXTS.includes(ext)) {
          checkAndClean(filePath);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error.message);
  }
}

function checkAndClean(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let hasChanges = false;

    const newLines = lines.filter(line => {
      if (GOOGLE_FONTS_IMPORT_REGEX.test(line)) {
        console.log(`⚠️  Cleaning Google Fonts from: ${filePath}`);
        hasChanges = true;
        return false;
      }
      return true;
    });

    let finalContent = content;
    if (hasChanges) {
      finalContent = newLines.join('\n');
      fs.writeFileSync(filePath, finalContent, 'utf8');
    }

    if (finalContent.includes('fonts.googleapis.com')) {
      console.warn(
        `❗ Warning: 'fonts.googleapis.com' still found in ${filePath} (possibly in comments or complex syntax). Please check manually.`,
      );
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
  }
}

console.log('🔍 Starting Google Fonts cleanup...');
walk(process.cwd());
console.log('✅ Cleanup completed.');
