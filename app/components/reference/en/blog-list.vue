<template>
  <div>
    <section class="page-heading">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <nuxt-link to="/">Home</nuxt-link>
          <svg
            class="icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m9 5 7 7-7 7"></path>
          </svg>
          <span aria-current="page">Journal</span>
        </nav>
        <h1>Journal</h1>
        <p>A straightforward reading list for a broader perspective.</p>
      </div>
      <span class="heading-watermark" aria-hidden="true">
        <svg class="brand-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <path
            d="M24 5v35M14 41h20M9 14h30M24 5l-4 5m4-5 4 5M13 14 5 29h16l-8-15Zm22 0-8 15h16l-8-15Z"
            stroke="currentColor"
            stroke-width="1.6"
          ></path>
          <path
            d="M5 29c1 8 15 8 16 0m6 0c1 8 15 8 16 0"
            stroke="currentColor"
            stroke-width="1.6"
          ></path>
        </svg>
      </span>
    </section>
    <section class="section">
      <div class="container" data-live-filters="">
        <div class="blog-toolbar">
          <form class="search-form" action="/search" method="get" role="search">
            <label class="sr-only" for="search-field">Search articles</label>
            <input
              id="search-field"
              name="q"
              type="search"
              placeholder="Search a topic, term or article…"
              maxlength="120"
            />
            <button type="submit" aria-label="Search the journal">
              <svg
                class="icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <circle cx="10.5" cy="10.5" r="6.5"></circle>
                <path d="m16 16 5 5"></path>
              </svg>
            </button>
          </form>
          <div class="view-switch">
            <nuxt-link to="/blog">Grid</nuxt-link>
            <nuxt-link to="/blog-list">List</nuxt-link>
          </div>
        </div>

        <p class="filter-status sr-only" aria-live="polite" aria-atomic="true"></p>
        <h2 class="sr-only">View all articles</h2>
        <div class="article-list" data-filter-grid="">
          <article
            class="article-card"
            data-category="Corporate Law"
            data-title="What should you consider before signing a contract?"
          >
            <nuxt-link class="article-image" tabindex="-1" aria-hidden="true" to="/blog/sozlesme">
              <picture>
                <source srcset="/assets/images/article.webp" type="image/webp" />
                <img
                  class=""
                  src="/assets/images/article.png"
                  alt=""
                  width="1536"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </nuxt-link>
            <div class="article-meta">
              <nuxt-link to="/blog-category?category=Corporate%20Law">Corporate Law</nuxt-link>
              <span>6 min read</span>
            </div>
            <h3>
              <nuxt-link to="/blog/sozlesme"
                >What should you consider before signing a contract?</nuxt-link
              >
            </h3>
            <p>
              A closer look at responsibilities, scope and the importance of clear contractual
              language.
            </p>
            <div class="article-byline">
              <span>Daniel Arden</span>
              <time datetime="2026-10-16">16 October 2026</time>
            </div>
          </article>
          <article
            class="article-card"
            data-category="Real Estate Law"
            data-title="Why clarity matters in a tenancy agreement"
          >
            <nuxt-link class="article-image" tabindex="-1" aria-hidden="true" to="/blog/kira">
              <picture>
                <source srcset="/assets/images/hero.webp" type="image/webp" />
                <img
                  class=""
                  src="/assets/images/hero.png"
                  alt=""
                  width="1536"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </nuxt-link>
            <div class="article-meta">
              <nuxt-link to="/blog-category?category=Real%20Estate%20Law"
                >Real Estate Law</nuxt-link
              >
              <span>5 min read</span>
            </div>
            <h3>
              <nuxt-link to="/blog/kira">Why clarity matters in a tenancy agreement</nuxt-link>
            </h3>
            <p>
              Why keeping records and setting out clear terms matters in a tenancy relationship.
            </p>
            <div class="article-byline">
              <span>Ethan Reed</span>
              <time datetime="2026-10-12">12 October 2026</time>
            </div>
          </article>
          <article
            class="article-card"
            data-category="Family Law"
            data-title="Preparing for your first family law consultation"
          >
            <nuxt-link class="article-image" tabindex="-1" aria-hidden="true" to="/blog/aile">
              <picture>
                <source srcset="/assets/images/office.webp" type="image/webp" />
                <img
                  class=""
                  src="/assets/images/office.png"
                  alt=""
                  width="1536"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </nuxt-link>
            <div class="article-meta">
              <nuxt-link to="/blog-category?category=Family%20Law">Family Law</nuxt-link>
              <span>4 min read</span>
            </div>
            <h3>
              <nuxt-link to="/blog/aile"
                >Preparing for your first family law consultation</nuxt-link
              >
            </h3>
            <p>
              A practical approach to organising your documents and questions before a first
              conversation.
            </p>
            <div class="article-byline">
              <span>Sophie Laurent</span>
              <time datetime="2026-10-08">8 October 2026</time>
            </div>
          </article>
          <article
            class="article-card"
            data-category="Employment Law"
            data-title="The value of keeping clear workplace records"
          >
            <nuxt-link class="article-image" tabindex="-1" aria-hidden="true" to="/blog/is">
              <picture>
                <source srcset="/assets/images/article.webp" type="image/webp" />
                <img
                  class=""
                  src="/assets/images/article.png"
                  alt=""
                  width="1536"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </nuxt-link>
            <div class="article-meta">
              <nuxt-link to="/blog-category?category=Employment%20Law">Employment Law</nuxt-link>
              <span>5 min read</span>
            </div>
            <h3>
              <nuxt-link to="/blog/is">The value of keeping clear workplace records</nuxt-link>
            </h3>
            <p>
              An introduction to organising and retaining the documents that support a working
              relationship.
            </p>
            <div class="article-byline">
              <span>Ethan Reed</span>
              <time datetime="2026-10-05">5 October 2026</time>
            </div>
          </article>
          <article
            class="article-card"
            data-category="Inheritance Law"
            data-title="Starting the conversation about estate planning"
          >
            <nuxt-link class="article-image" tabindex="-1" aria-hidden="true" to="/blog/miras">
              <picture>
                <source srcset="/assets/images/hero.webp" type="image/webp" />
                <img
                  class=""
                  src="/assets/images/hero.png"
                  alt=""
                  width="1536"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </nuxt-link>
            <div class="article-meta">
              <nuxt-link to="/blog-category?category=Inheritance%20Hukuku"
                >Inheritance Law</nuxt-link
              >
              <span>7 min read</span>
            </div>
            <h3>
              <nuxt-link to="/blog/miras"
                >Starting the conversation about estate planning</nuxt-link
              >
            </h3>
            <p>
              Considering personal circumstances and existing documents as part of estate planning.
            </p>
            <div class="article-byline">
              <span>Daniel Arden</span>
              <time datetime="2026-10-01">1 October 2026</time>
            </div>
          </article>
          <article
            class="article-card"
            data-category="Criminal Law"
            data-title="Finding reliable information during a legal process"
          >
            <nuxt-link class="article-image" tabindex="-1" aria-hidden="true" to="/blog/ceza">
              <picture>
                <source srcset="/assets/images/office.webp" type="image/webp" />
                <img
                  class=""
                  src="/assets/images/office.png"
                  alt=""
                  width="1536"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </nuxt-link>
            <div class="article-meta">
              <nuxt-link to="/blog-category?category=Criminal%20Law">Criminal Law</nuxt-link>
              <span>4 min read</span>
            </div>
            <h3>
              <nuxt-link to="/blog/ceza"
                >Finding reliable information during a legal process</nuxt-link
              >
            </h3>
            <p>
              How to consider whether a source is trustworthy, current and relevant to your
              situation.
            </p>
            <div class="article-byline">
              <span>Sophie Laurent</span>
              <time datetime="2026-09-25">25 September 2026</time>
            </div>
          </article>
          <article
            class="article-card"
            data-category="Legal Resources"
            data-title="Preparing for mediation: questions and documents"
          >
            <nuxt-link
              class="article-image"
              tabindex="-1"
              aria-hidden="true"
              to="/blog/arabuluculuk"
            >
              <picture>
                <source srcset="/assets/images/article.webp" type="image/webp" />
                <img
                  class=""
                  src="/assets/images/article.png"
                  alt=""
                  width="1536"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </nuxt-link>
            <div class="article-meta">
              <nuxt-link to="/blog-category?category=Legal%20Resources">Legal Resources</nuxt-link>
              <span>6 min read</span>
            </div>
            <h3>
              <nuxt-link to="/blog/arabuluculuk"
                >Preparing for mediation: questions and documents</nuxt-link
              >
            </h3>
            <p>
              How to prepare your expectations and available documents before a mediation meeting.
            </p>
            <div class="article-byline">
              <span>Sophie Laurent</span>
              <time datetime="2026-09-21">21 September 2026</time>
            </div>
          </article>
          <article
            class="article-card"
            data-category="Corporate Law"
            data-title="A practical starting point for organising digital records"
          >
            <nuxt-link class="article-image" tabindex="-1" aria-hidden="true" to="/blog/dijital">
              <picture>
                <source srcset="/assets/images/hero.webp" type="image/webp" />
                <img
                  class=""
                  src="/assets/images/hero.png"
                  alt=""
                  width="1536"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </nuxt-link>
            <div class="article-meta">
              <nuxt-link to="/blog-category?category=Corporate%20Law">Corporate Law</nuxt-link>
              <span>3 min read</span>
            </div>
            <h3>
              <nuxt-link to="/blog/dijital"
                >A practical starting point for organising digital records</nuxt-link
              >
            </h3>
            <p>A practical approach to organising files by date, subject and source.</p>
            <div class="article-byline">
              <span>Daniel Arden</span>
              <time datetime="2026-09-15">15 September 2026</time>
            </div>
          </article>
        </div>
        <p class="empty-state" hidden="">No articles in this category yet.</p>
      </div>
    </section>
  </div>
</template>
