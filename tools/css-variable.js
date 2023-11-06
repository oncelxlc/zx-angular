const fs = require('fs');
const {presetPalettes} = require('@ant-design/colors');

const keys = Object.keys(presetPalettes);
let context = `:root {`;
for (const key of keys){
  presetPalettes[key].forEach((item, index) => {
    context += `--base-${key}-${index}: ${item};`;
  });
}
context += '}';

fs.writeFileSync('../components/styles/variables.scss', context);
