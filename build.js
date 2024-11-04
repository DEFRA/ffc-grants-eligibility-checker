import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';

const govukPath = 'node_modules/govuk-frontend/dist/govuk/assets';
const publicPath = 'public/assets';

fs.ensureDirSync(publicPath);
fs.copySync(path.join(govukPath, 'fonts'), path.join(publicPath, 'fonts'), { overwrite: true });
fs.copySync(path.join(govukPath, 'images'), path.join(publicPath, 'images'), { overwrite: true });

exec(
  'sass --quiet-deps -I node_modules src/main.scss public/stylesheets/main.css',
  { stdio: 'inherit' },
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log('Build completed successfully');
  }
);
