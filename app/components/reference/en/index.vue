<template>
  <div>
    <section class="hero">
      <div class="hero-visual">
        <picture>
          <source srcset="/assets/images/hero.webp" type="image/webp" />
          <img
            class=""
            src="/assets/images/hero.png"
            alt="Illustrative sunlit architecture with limestone columns"
            width="1536"
            height="1024"
            fetchpriority="high"
            decoding="async"
          />
        </picture>
      </div>
      <div class="hero-shade"></div>
      <div class="container hero-inner">
        <div class="hero-copy">
          <div class="hero-intro"><span> </span> Lexviora Legal &amp; Advisory</div>
          <h1>
            Clarity in law.<br />
            Confidence ahead.
          </h1>
          <p>
            Behind every legal matter is a human story.<br />
            Understand your rights. Explore your options.<br />
            Move forward with clarity and confidence.
          </p>
          <div class="hero-actions">
            <nuxt-link class="button" to="/practice-areas"
              >Our practice areas<svg
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
                <path d="M6 18 18 6M6 6h12v12"></path>
              </svg>
            </nuxt-link>
            <nuxt-link class="button button-outline" to="/blog"
              >Explore the journal<svg
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
                <path d="M6 18 18 6M6 6h12v12"></path>
              </svg>
            </nuxt-link>
          </div>
          <div class="hero-location">
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
              <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"></path>
              <circle cx="12" cy="10" r="2"></circle>
            </svg>
            A European perspective. A personal approach.
          </div>
        </div>
        <nuxt-link class="hero-seal" aria-label="Discover the Lexviora approach" to="/about">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <defs>
              <path id="sealPath" d="M60 12a48 48 0 1 1-.1 0"></path>
            </defs>
            <text>
              <textPath href="#sealPath" textLength="293">
                Considered counsel · Personal approach ·
              </textPath>
            </text>
          </svg>
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
            <path d="M12 3v18M5 21h14M3 7h18M6 7 2 15h8L6 7Zm12 0-4 8h8l-4-8Z"></path>
          </svg>
        </nuxt-link>
      </div>
      <div class="hero-bottom">
        <span>Clear advice. Thoughtful relationships.</span>
        <a href="#faaliyetler">Explore <span>↓</span> </a>
      </div>
    </section>
    <div class="principles">
      <div class="container principles-inner">
        <div>
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
            <rect x="5" y="10" width="14" height="11" rx="1"></rect>
            <path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v2"></path>
          </svg>
          <span>Respect for privacy<small>Your information, handled with care.</small> </span>
        </div>
        <div>
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
            <path d="M21 11a8 8 0 0 1-8 8H8l-5 3V7a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v4Z"></path>
            <path d="M7 8h10M7 12h7"></path>
          </svg>
          <span>Clear communication<small>Making the law easier to understand.</small> </span>
        </div>
        <div>
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
            <path d="M12 3v18M5 21h14M3 7h18M6 7 2 15h8L6 7Zm12 0-4 8h8l-4-8Z"></path>
          </svg>
          <span>Independent thinking<small>Every matter considered carefully.</small> </span>
        </div>
      </div>
    </div>
    <section class="section practice-section" id="faaliyetler">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="section-kicker">Our practice areas</span>
            <h2>
              For every chapter of life,<br />
              counsel you can count on.
            </h2>
          </div>
          <div>
            <p>
              Legal support for individuals and businesses,<br />
              shaped around the details that make your matter unique.
            </p>
            <nuxt-link class="text-link" to="/practice-areas"
              >Explore all practice areas<svg
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
                <path d="M5 12h14m-6-6 6 6-6 6"></path>
              </svg>
            </nuxt-link>
          </div>
        </div>
        <public-practices></public-practices>
      </div>
    </section>
    <section class="about-section section" id="hakkimizda">
      <div class="container about-grid">
        <div class="about-image">
          <picture>
            <source srcset="/assets/images/office.webp" type="image/webp" />
            <img
              class=""
              src="/assets/images/office.png"
              alt="A lawyer and client in a bright professional office"
              width="1536"
              height="1024"
              loading="lazy"
              decoding="async"
            />
          </picture>
          <div class="image-caption">Thoughtful conversations. Considered next steps.</div>
          <span class="image-line" aria-hidden="true"> </span>
        </div>
        <div class="about-copy">
          <span class="section-kicker">Get to know us</span>
          <h2>
            First, we listen.<br />
            Then we move<br />
            forward together.
          </h2>
          <p>
            At Lexviora, the law is more than a set of rules. It is a responsibility that touches
            people’s lives.
          </p>
          <p>
            We bring care to every matter and clarity to every conversation. Understanding your
            needs, discussing your options and keeping you informed are central to the way we work.
          </p>
          <div class="about-values">
            <span>
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
                <path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Z"></path>
                <path d="m8 12 3 3 5-6"></path>
              </svg>
              Professional care</span
            >
            <span>
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
                <path d="M21 11a8 8 0 0 1-8 8H8l-5 3V7a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v4Z"></path>
                <path d="M7 8h10M7 12h7"></path>
              </svg>
              Accessible advice</span
            >
          </div>
          <nuxt-link class="text-link" to="/about"
            >Discover our approach<svg
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
              <path d="M5 12h14m-6-6 6 6-6 6"></path>
            </svg>
          </nuxt-link>
        </div>
      </div>
    </section>
    <section class="section featured-section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="section-kicker">Featured perspectives</span>
            <h2>
              Understanding is<br />
              a good beginning.
            </h2>
          </div>
          <nuxt-link class="text-link" to="/blog"
            >View all articles<svg
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
              <path d="M5 12h14m-6-6 6 6-6 6"></path>
            </svg>
          </nuxt-link>
        </div>
        <public-featured-journal></public-featured-journal>
      </div>
    </section>
    <section class="section insights-section">
      <div class="container" data-live-filters="">
        <div class="section-head">
          <div>
            <span class="section-kicker">From the journal</span>
            <h2>A considered view of the law.</h2>
          </div>
          <nuxt-link class="text-link" to="/home-editorial"
            >The legal journal<svg
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
              <path d="M5 12h14m-6-6 6 6-6 6"></path>
            </svg>
          </nuxt-link>
        </div>

        <p class="filter-status sr-only" aria-live="polite" aria-atomic="true"></p>
        <public-journal :limit="3" :filterable="true"></public-journal>
        <p class="empty-state" hidden="">
          There are no featured articles in this category.
          <nuxt-link to="/blog">Browse the full journal.</nuxt-link>
        </p>
      </div>
    </section>
    <section class="section team-section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="section-kicker">Our Lawyers</span>
            <h2>
              Shared principles.<br />
              Individual perspectives.
            </h2>
          </div>
          <div>
            <p>
              Knowledge, care and responsibility,<br />
              brought together in a collaborative practice.
            </p>
            <nuxt-link class="text-link" to="/attorneys"
              >Meet our people<svg
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
                <path d="M5 12h14m-6-6 6 6-6 6"></path>
              </svg>
            </nuxt-link>
          </div>
        </div>
        <public-team></public-team>
      </div>
    </section>
    <section class="section approach-section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="section-kicker">How we work</span>
            <h2>Know what to expect, at every step.</h2>
          </div>
          <p>
            From your first conversation onwards,<br />
            a clear and considered process.
          </p>
        </div>
        <div class="steps">
          <div class="step">
            <span class="step-number">01</span>
            <h3>The first conversation</h3>
            <p>
              We listen to your concerns, discuss the scope of your enquiry and identify the
              information we may need.
            </p>
          </div>
          <div class="step">
            <span class="step-number">02</span>
            <h3>A careful assessment</h3>
            <p>
              We review the documents and circumstances, then explain the options in clear,
              practical language.
            </p>
          </div>
          <div class="step">
            <span class="step-number">03</span>
            <h3>Keeping you informed</h3>
            <p>
              Within the agreed scope of our work, we keep you updated and make time for your
              questions.
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="resources section">
      <div class="container resources-inner">
        <div>
          <span class="section-kicker">Knowledge, made accessible</span>
          <h2>
            Making the law<br />
            more approachable.
          </h2>
          <p>
            Plain-language definitions, practical guides and trusted sources.<br />
            A clearer starting point for the questions that matter.
          </p>
          <nuxt-link class="button button-outline" to="/legal-guides"
            >Explore legal resources<svg
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
              <path d="M6 18 18 6M6 6h12v12"></path>
            </svg>
          </nuxt-link>
        </div>
        <div class="resource-links">
          <nuxt-link to="/legal-guides">
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
              <path
                d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1m0-15c3-2 6-2 10-1v15c-4-1-7-1-10 1V5Z"
              ></path>
            </svg>
            <span
              >Practical guides<small>A starting point for understanding legal processes</small>
            </span>
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
              <path d="M6 18 18 6M6 6h12v12"></path>
            </svg>
          </nuxt-link>
          <nuxt-link to="/glossary">
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
              <path d="M14 2H5v20h14V7l-5-5Zm0 0v6h5M8 12h8M8 16h8"></path>
            </svg>
            <span>Legal glossary<small>Legal terminology, simply explained</small> </span>
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
              <path d="M6 18 18 6M6 6h12v12"></path>
            </svg>
          </nuxt-link>
          <nuxt-link to="/legal-guides#kaynaklar">
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
              <path d="M12 3v18M5 21h14M3 7h18M6 7 2 15h8L6 7Zm12 0-4 8h8l-4-8Z"></path>
            </svg>
            <span>Official sources<small>Links to primary legal information</small> </span>
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
              <path d="M6 18 18 6M6 6h12v12"></path>
            </svg>
          </nuxt-link>
        </div>
      </div>
    </section>
    <section class="section faq-section">
      <div class="container faq-grid">
        <div>
          <span class="section-kicker">Frequently asked questions</span>
          <h2>
            Answers to<br />
            your questions.
          </h2>
          <p>
            What you may want to know<br />
            before taking the first step.
          </p>
          <nuxt-link class="text-link" to="/faq"
            >View all questions<svg
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
              <path d="M5 12h14m-6-6 6 6-6 6"></path>
            </svg>
          </nuxt-link>
        </div>
        <public-faqs></public-faqs>
      </div>
    </section>
    <section class="contact-section section" id="iletisim">
      <div class="container contact-inner">
        <div>
          <span class="section-kicker">Contact</span>
          <h2>
            Let’s talk<br />
            things through.
          </h2>
          <p>
            Tell us you would like to meet.<br />
            We are here to understand your situation.
          </p>
          <nuxt-link class="button" to="/contact"
            >Get in touch<svg
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
              <path d="M6 18 18 6M6 6h12v12"></path>
            </svg>
          </nuxt-link>
        </div>
        <div class="contact-details">
          <div>
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
              <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"></path>
              <circle cx="12" cy="10" r="2"></circle>
            </svg>
            <div>
              <h3>Our office</h3>
              <p>
                City of London<br />
                London, United Kingdom
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&amp;query=City+of+London"
                target="_blank"
                rel="noopener noreferrer"
                >Explore the area
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
                  <path d="M6 18 18 6M6 6h12v12"></path>
                </svg>
              </a>
            </div>
          </div>
          <div>
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
              <rect x="3" y="5" width="18" height="14" rx="1"></rect>
              <path d="m3 6 9 7 9-7"></path>
            </svg>
            <div>
              <h3>Write to us</h3>
              <a href="mailto:hello@lexviora.example">hello@lexviora.example</a>
              <p>Monday–Friday, 9 am–6 pm</p>
            </div>
          </div>
          <p class="demo-note">Contact details are for demonstration purposes.</p>
        </div>
      </div>
    </section>
  </div>
</template>
