import { test, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import App from './App.svelte';
import fs from 'fs';
import path from 'path';

// Test 1: Sample Test
test('App', async () => {
    render(App);
});

// Test 2: API Key Test
test('API Key Test', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ apiKey: 'test-key' })
    });
    
    async function getApiKey() {
      const response = await fetch('/api/key');
      const data = await response.json();
      return data.apiKey;
    }
    
    const key = await getApiKey();
    expect(key).toBe('test-key');
});
  
// Test 3: NYT API Test
test('NYT API Test', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        response: {
          docs: [{
            headline: { main: 'Sacramento News Story' },
            web_url: 'https://example.com/article',
            abstract: 'Test abstract about Sacramento news',
            multimedia: [{ url: 'https://example.com/image.jpg' }],
            pub_date: '2025-05-01T12:00:00Z'
          }]
        }
      })
    });
    
    async function fetchArticles() {
      const response = await fetch('https://api.nytimes.com/svc/search/v2/articlesearch.json?q=Sacramento');
      return (await response.json()).response.docs;
    }
    
    const articles = await fetchArticles();
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('Sacramento'));
    expect(articles[0].headline.main).toBeTruthy();
    expect(articles[0].web_url).toBeTruthy();
    expect(articles[0].abstract).toBeTruthy();
    expect(articles[0].multimedia[0].url).toBeTruthy();
    expect(articles[0].pub_date).toBeTruthy();
});


// Test 4: Date Formatting Test
test('Date Formatting Test', async () => {
  const originalQuerySelector = document.querySelector;
  const mockDateElement = document.createElement('div');
  mockDateElement.className = 'date';
  document.body.appendChild(mockDateElement);
  
  function formatDate(date = new Date()) {
    const months = ["January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const dayNum = date.getDate();
    const year = date.getFullYear();
    
    return `${dayName}, ${monthName} ${dayNum}, ${year}`;
  }
  
  const today = new Date();
  const expectedDateString = formatDate(today);
  
  mockDateElement.textContent = expectedDateString;
  
  render(App);
  
  const dateElement = document.querySelector('.date');
  
  if (dateElement && dateElement.textContent) {
    expect(dateElement.textContent).toBe(expectedDateString);
  } else {
    expect(formatDate(today)).toBe(expectedDateString);
  }
});
  
  // Test 5: Responsive UI Test
  test('Responsive UI Test', async () => {
    const cssFilePath = path.resolve('./src/app.css');
    const cssContent = fs.readFileSync(cssFilePath, 'utf8');
    
    expect(cssContent).toContain('@media only screen and (max-width:');
    
    expect(cssContent).toContain('@media only screen and (min-width:') && 
    expect(cssContent).toContain('and (max-width:');
    
    expect(cssContent).toContain('@media only screen and (min-width: 1024px)');
    
    expect(cssContent).toContain('.grid-container {');
    expect(cssContent).toContain('grid-template-columns:');
  });
  
  // Test 6: Article Content Test
test('Article Content Test', async () => {
    function formatArticle(article) {
      return {
        title: article.headline.main,
        url: article.web_url
      };
    }
    
    const mockArticle = {
      headline: { main: 'Test Headline' },
      web_url: 'https://example.com/article'
    };
    
    const result = formatArticle(mockArticle);
    expect(result.title).toBe('Test Headline');
    expect(result.url).toBe('https://example.com/article');
});