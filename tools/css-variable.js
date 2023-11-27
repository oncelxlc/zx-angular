const fs = require('fs');
const {presetPalettes} = require('@ant-design/colors');

const keys = Object.keys(presetPalettes);
let context = `  // @common-color\n`;
for (const key of keys){
  presetPalettes[key].forEach((item, index) => {
    context += `  --base-${key}-${index}: ${item.toUpperCase()};\n`;
  });
}

context += `  // @common-color-end\n`;

const scssFilePath = '../components/styles/core/_base-variable-css.scss';
const scssContent = fs.readFileSync(scssFilePath, 'utf8');
const rootContent = scssContent.match(/:root\s*{[\S\s]*(\S{0}})/)[0]
const scssContents = rootContent.split('}');
scssContents[scssContents.length - 2] = scssContents[scssContents.length - 2].replace(/\n\s*\/\/ @common-color([\s\S]*?)\/\/ @common-color-end/g, '') + '\n' + context;
const newScssContent = scssContents.join('}');
const newContent = scssContent.replace(rootContent, newScssContent);
fs.writeFileSync(scssFilePath, newContent, 'utf8');
