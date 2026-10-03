"use strict";
const input=document.getElementById('input');
const hasSegments=typeof Intl.Segmenter==='function';
const wordSegmenter=hasSegments?new Intl.Segmenter('en',{granularity:'word'}):null;
const charSegmenter=hasSegments?new Intl.Segmenter('en',{granularity:'grapheme'}):null;
function countText(text){
 const visible=s=>charSegmenter?Array.from(charSegmenter.segment(s)).length:Array.from(s).length;
 return {words:wordSegmenter?Array.from(wordSegmenter.segment(text)).filter(s=>s.isWordLike).length:(text.trim()?text.trim().split(/\s+/u).length:0),chars:visible(text),nospace:visible(text.replace(/\s/gu,'')),lines:text?text.split(/\r\n|\r|\n/).length:0};
}
function update(){const totals=countText(input.value);for(const key of Object.keys(totals)){document.getElementById(key).textContent=totals[key].toLocaleString('en-US');}document.getElementById('status').textContent='';}
input.addEventListener('input',update);
document.getElementById('clear').addEventListener('click',()=>{input.value='';update();input.focus();});
document.getElementById('example').addEventListener('click',()=>{input.value='Hello world!\nA clearer draft starts here.';update();});
document.getElementById('copy').addEventListener('click',async()=>{const n=countText(input.value);const summary=`Words: ${n.words}; visible characters: ${n.chars}; without whitespace: ${n.nospace}; lines: ${n.lines}`;try{await navigator.clipboard.writeText(summary);document.getElementById('status').textContent='Counts copied.';}catch{document.getElementById('status').textContent='Clipboard unavailable. Select the displayed counts to copy them manually.';}});
document.getElementById('engine').textContent=hasSegments?'Counting engine: Intl.Segmenter (English locale; grapheme characters).':'Counting engine: whitespace tokens and Unicode code-point fallback.';
update();
