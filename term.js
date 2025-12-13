/* term.js - The Animation Engine */
import { termData } from './term_data.js';

const TYPING_SPEED = 50;   // ms per character
const OUTPUT_DELAY = 400;  // ms wait before showing output
const NEXT_CMD_DELAY = 3000; // ms wait after output before clearing

const dom = {
    title: document.getElementById('termTitle'),
    desc: document.getElementById('termDesc'),
    body: document.getElementById('termBody')
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const typeText = async (text) => {
    // Create line container
    const line = document.createElement('div');
    line.innerHTML = '<span class="term-prompt">$</span> ';
    const cmdSpan = document.createElement('span');
    cmdSpan.className = 'term-cmd';
    line.appendChild(cmdSpan);
    
    // Move cursor
    const cursor = document.querySelector('.term-cursor');
    dom.body.insertBefore(line, cursor);
    cursor.classList.add('typing'); // Stop blinking while typing

    for (let char of text) {
        cmdSpan.textContent += char;
        await wait(Math.random() * 30 + TYPING_SPEED); // Random variation for realism
    }
    
    cursor.classList.remove('typing'); // Resume blinking
};

const showOutput = async (html) => {
    await wait(OUTPUT_DELAY);
    const div = document.createElement('div');
    div.innerHTML = html;
    div.style.marginBottom = '1.5rem'; // Spacing
    
    const cursor = document.querySelector('.term-cursor');
    dom.body.insertBefore(div, cursor);
};

const clearTerminal = () => {
    // Keep the cursor, remove everything else
    const cursor = document.querySelector('.term-cursor');
    dom.body.innerHTML = ''; 
    dom.body.appendChild(cursor);
};

const updateHeader = (index) => {
    const scenario = termData[index];
    
    // Simple fade effect
    const headerContainer = document.querySelector('.term-dynamic-header');
    headerContainer.style.opacity = '0';
    
    setTimeout(() => {
        dom.title.textContent = scenario.title;
        dom.desc.textContent = scenario.desc;
        headerContainer.style.opacity = '1';
    }, 500);
};

const runAnimation = async () => {
    let i = 0;
    
    while (true) { // Infinite Loop
        const scenario = termData[i];
        
        updateHeader(i);
        await wait(600); // Wait for header fade
        
        await typeText(scenario.command);
        await showOutput(scenario.output);
        await wait(NEXT_CMD_DELAY);
        
        clearTerminal();
        
        i = (i + 1) % termData.length; // Cycle index
    }
};

// Start when loaded
document.addEventListener('DOMContentLoaded', () => {
    if(dom.body) runAnimation();
});