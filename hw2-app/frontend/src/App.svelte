<script lang="ts">
  import { onMount } from 'svelte';
  import svelteLogo from './assets/svelte.svg';
  import viteLogo from '/vite.svg';
  import Counter from './lib/Counter.svelte';

  let apiKey: string = '';
  let articles: any[] = [];

  onMount(async () => {
    try {
      const res = await fetch('/api/key');
      const data = await res.json();
      apiKey = data.apiKey;
      const nytURL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=Davis%20OR%20Sacramento&api-key=${apiKey}`;
      const nytRes = await fetch(nytURL);
      const nytData = await nytRes.json();
      const docs = nytData?.response?.docs;
      if (Array.isArray(docs)) {
        articles = docs;
      }
    } catch (error) {
      console.error('Failed to fetch API key:', error);
    }
  });
</script>

<main>
  <header>
		<div class="logo">
            <img src="/images/logo.png" alt="logo" >
        </div>
        <p class="date"></p>
		<p class="paper">Today's Paper</p>
    </header>
    <div class="grid-container">
      {#each articles as article}
  <section class="article-card">
    {#if article.multimedia && article.multimedia.length}
        <img
          src={imgObj
                 ? `https://www.nytimes.com/${imgObj.url}`
                 : '/images/placeholder.png'
               }
          alt={article.headline.main}
          class="responsive-img"
        >
    {:else}
      <img
        src="/images/placeholder.png"
        alt="No image available"
        class="responsive-img"
      >
    {/if}

    <h2>{article.headline.main}</h2>
    {#if article.abstract}
      <p>{article.abstract}</p>
    {:else}
      <p>{article.snippet}</p>
    {/if}
    <a href={article.web_url} target="_blank" rel="noopener">Read more</a>
  </section>
{/each}
    </div>
  <footer>
    <p></p>
</footer>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
