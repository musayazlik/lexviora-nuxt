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
          <span aria-current="page">Every conversation starts somewhere.</span>
        </nav>
        <h1>Every conversation starts somewhere.</h1>
        <p>Tell us a little about your enquiry and let’s discuss the next step.</p>
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
      <div class="container contact-page-grid">
        <div>
          <h2>Get in touch.</h2>
          <p>
            A general outline is enough for your first enquiry. Please wait until a secure
            communication method is agreed before sharing sensitive information or documents.
          </p>
          <div class="contact-info-list">
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
              <span>
                <strong>Office</strong>City of London<br />
                London, United Kingdom</span
              >
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
                <path
                  d="m8 3 3 5-3 3c1.5 3 3.5 5 6.5 6.5l3-3 4.5 3c0 3-2 4-4 3.5C9 19 5 15 3 7 2.5 5 4 3 8 3Z"
                ></path>
              </svg>
              <span>
                <strong>Telephone</strong>
                <span>+44 (0)20 0000 0000</span>
                <small>Example number — not in service</small>
              </span>
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
              <span>
                <strong>Email</strong>
                <a href="mailto:hello@lexviora.example">hello@lexviora.example</a>
                <small>Example address — not monitored</small>
              </span>
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
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M12 7v5l3 2"></path>
              </svg>
              <span> <strong>Office hours</strong>Monday–Friday, 9 am–6 pm</span>
            </div>
          </div>
        </div>
        <form class="contact-form" id="contact-form" novalidate="" data-contact-form="">
          <h2>Request a conversation</h2>
          <p>Send your enquiry and we will get in touch to arrange a conversation.</p>
          <div class="form-errors" role="alert" tabindex="-1" hidden=""></div>
          <div class="form-row">
            <div>
              <label for="name">Full name</label>
              <input id="name" name="name" autocomplete="name" required="" maxlength="100" />
              <span class="field-error" id="name-error"> </span>
            </div>
            <div>
              <label for="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required=""
                maxlength="200"
              />
              <span class="field-error" id="email-error"> </span>
            </div>
          </div>
          <label for="subject">Area of interest</label>
          <select id="subject" name="subject">
            <option value="General enquiry">Choose a subject</option>
            General enquiry
            <option>Family Law</option>
            <option>Corporate Law</option>
            <option>Employment Law</option>
            <option>Criminal Law</option>
            <option>Inheritance Law</option>
            <option>Real Estate Law</option>
          </select>
          <label for="message">A brief outline</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            required=""
            minlength="10"
            maxlength="2000"
            aria-describedby="message-hint message-error"
          ></textarea>
          <small id="message-hint"
            >At least 10 characters. Please do not include sensitive information or
            documents.</small
          >
          <span class="field-error" id="message-error"> </span>
          <label class="checkbox-label">
            <input id="consent" type="checkbox" required="" />
            <span
              >I have read the <a href="/privacy">privacy notice</a> and agree to be
              contacted.</span
            >
          </label>
          <span class="field-error" id="consent-error"> </span>
          <button class="button" type="submit">Send message</button>
          <p class="form-status" role="status" aria-atomic="true"></p>
        </form>
      </div>
    </section>
    <section class="map-section map-fullwidth" aria-label="City of London location map">
      <iframe
        class="location-map"
        title="City of London on Google Maps"
        src="https://maps.google.com/maps?q=City%20of%20London&amp;z=14&amp;output=embed"
        width="1920"
        height="540"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen=""
      >
      </iframe>
      <div class="map-location-card">
        <span class="map-card-icon">
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
        </span>
        <div>
          <span class="map-card-label">Find us in the city</span>
          <h2>City of London</h2>
          <p>London, United Kingdom<br />Illustrative office location</p>
          <a
            href="https://www.google.com/maps/search/?api=1&amp;query=City+of+London"
            target="_blank"
            rel="noopener noreferrer"
            >Open in Google Maps
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
      <div class="map-region-note">Area shown for illustration; not an actual office address.</div>
    </section>
  </div>
</template>
