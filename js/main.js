(function () {
  var config = window.SITE_CONFIG || {};
  var services = window.SITE_SERVICES || [];

  var icons = {
    bug: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3 3 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a6 6 0 0 1 12 0v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.6-3.8 3.53-4"/><path d="M17.47 9C19.4 8.8 21 7.1 21 5"/><path d="M18 13h4"/><path d="M21 21c0-2.1-1.6-3.8-3.53-4"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.83 16.17a1 1 0 0 0 1.06.23l2.56-1.02a1 1 0 0 1 1.17.34l1.26 1.73a1 1 0 0 1-.1 1.3C18.76 19.77 17.18 21 15 21 8.37 21 3 15.63 3 9c0-2.18 1.23-3.76 2.25-4.78a1 1 0 0 1 1.3-.1l1.73 1.26a1 1 0 0 1 .34 1.17L7.6 9.11a1 1 0 0 0 .23 1.06z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="7"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>'
  };

  function text(selector, value) {
    document.querySelectorAll(selector).forEach(function (node) {
      node.textContent = value || "";
    });
  }

  function setAttrs(selector, attrs) {
    document.querySelectorAll(selector).forEach(function (node) {
      Object.keys(attrs).forEach(function (key) {
        node.setAttribute(key, attrs[key]);
      });
    });
  }

  function replaceCompanyName() {
    var defaultName = "PestLine Connect";
    if (!config.companyName || config.companyName === defaultName) return;

    function swap(value) {
      return value && value.indexOf(defaultName) > -1 ? value.split(defaultName).join(config.companyName) : value;
    }

    document.title = swap(document.title);
    document.querySelectorAll('meta[name="description"]').forEach(function (meta) {
      meta.setAttribute("content", swap(meta.getAttribute("content")));
    });
    document.querySelectorAll("[aria-label]").forEach(function (node) {
      node.setAttribute("aria-label", swap(node.getAttribute("aria-label")));
    });

    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!parent || ["SCRIPT", "STYLE", "TEXTAREA"].indexOf(parent.tagName) > -1) {
          return NodeFilter.FILTER_REJECT;
        }
        return node.nodeValue.indexOf(defaultName) > -1 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    var textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(function (node) {
      node.nodeValue = swap(node.nodeValue);
    });
  }

  function hydrateConfig() {
    replaceCompanyName();
    text("[data-company-name]", config.companyName);
    text("[data-company-id]", config.companyId);
    text("[data-company-address]", [config.addressLine1, config.addressLine2].filter(Boolean).join(" - "));
    text("[data-phone-text]", config.phoneDisplay);
    text("[data-email-text]", config.email);
    text("[data-footer-text-primary]", config.footerTextPrimary);
    text("[data-footer-text-secondary]", config.footerTextSecondary);
    text("[data-disclaimer-short]", config.disclaimerShort);
    text("[data-disclaimer-full]", config.disclaimerFull);
    text("[data-business-hours]", config.businessHours);
    text("[data-service-area]", config.serviceArea);
    text("[data-current-year]", new Date().getFullYear());
    text("[data-copyright-line]", config.copyrightLine);
    setAttrs("[data-phone-link]", { href: "tel:" + config.phone, "aria-label": config.phoneButtonLabel });
    setAttrs("[data-email-link]", { href: "mailto:" + config.email });
  }

  function buildHeaderUtilities() {
    document.querySelectorAll(".site-header").forEach(function (header) {
      if (header.querySelector(".header-top")) return;
      var top = document.createElement("div");
      top.className = "header-top";
      top.innerHTML = '<div class="container header-top-inner">' +
        '<a class="header-logo" href="./index.html" aria-label="PestLine Connect home">' +
        '<span class="logo-icon">' + icons.bug + '</span>' +
        '<span class="logo-copy"><strong data-company-name></strong><em>Provider Connection</em></span>' +
        '</a>' +
        '<div class="header-contact-cluster">' +
        '<a class="header-contact" data-phone-link><span class="contact-icon">' + icons.phone + '</span><strong data-phone-text></strong><em data-email-text></em></a>' +
        '<div class="header-contact"><span class="contact-icon">' + icons.clock + '</span><strong data-business-hours></strong><em>Provider availability may vary</em></div>' +
        '</div>' +
        '<a class="quote-button" href="./contact.html">Get a Quote</a>' +
        '</div>';
      header.insertBefore(top, header.firstChild);

      var navRow = header.querySelector(".header-inner");
      if (navRow && !navRow.querySelector(".header-socials")) {
        var socials = document.createElement("div");
        socials.className = "header-socials";
        socials.innerHTML = '<button class="header-search-trigger" type="button" data-search-open aria-label="Search site">' + icons.search + '</button>';
        navRow.appendChild(socials);
      }

      var actions = header.querySelector(".header-actions");
      if (actions && !actions.querySelector("[data-search-open]")) {
        var mobileSearch = document.createElement("button");
        mobileSearch.className = "icon-button mobile-search-trigger";
        mobileSearch.type = "button";
        mobileSearch.setAttribute("data-search-open", "");
        mobileSearch.setAttribute("aria-label", "Search site");
        mobileSearch.innerHTML = icons.search;
        actions.insertBefore(mobileSearch, actions.querySelector(".menu-toggle"));
      }

      var menuToggle = header.querySelector(".menu-toggle");
      if (menuToggle && !menuToggle.querySelector("svg")) {
        menuToggle.innerHTML = icons.menu;
      }
    });
  }

  function buildFooterServices() {
    var markup = services.map(function (service) {
      return '<li><a href="' + service.href + '">' + service.title + "</a></li>";
    }).join("");
    document.querySelectorAll("[data-footer-services]").forEach(function (footerList) {
      footerList.innerHTML = markup;
    });
  }

  function serviceLinksMarkup(includeAllServices) {
    var links = services.map(function (service) {
      return '<a href="' + service.href + '">' + service.title + "</a>";
    });
    if (includeAllServices) links.unshift('<a href="./services.html">All Services</a>');
    return links.join("");
  }

  function buildServicesNavigation() {
    var dropdownId = "services-nav-menu";
    document.querySelectorAll(".desktop-nav").forEach(function (nav) {
      var servicesLink = Array.prototype.find.call(nav.querySelectorAll('a[href="./services.html"]'), function (link) {
        return link.textContent.trim().toLowerCase() === "services";
      });
      if (!servicesLink || nav.querySelector(".services-dropdown")) return;

      var dropdown = document.createElement("div");
      dropdown.className = "services-dropdown";
      dropdown.innerHTML = '<button class="services-dropdown-toggle" type="button" aria-expanded="false" aria-controls="' + dropdownId + '">' +
        '<span>Services</span>' + icons.chevron +
        '</button>' +
        '<div class="services-dropdown-menu" id="' + dropdownId + '" aria-label="Service pages">' + serviceLinksMarkup(true) + "</div>";
      servicesLink.replaceWith(dropdown);

      var toggle = dropdown.querySelector("button");
      toggle.addEventListener("click", function () {
        var isOpen = dropdown.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });
      dropdown.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          dropdown.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.focus();
        }
      });
    });

    document.querySelectorAll(".mobile-menu nav").forEach(function (nav) {
      var servicesLink = Array.prototype.find.call(nav.querySelectorAll('a[href="./services.html"]'), function (link) {
        return link.textContent.trim().toLowerCase() === "services";
      });
      if (!servicesLink || nav.querySelector(".mobile-services-dropdown")) return;

      var dropdown = document.createElement("details");
      dropdown.className = "mobile-services-dropdown";
      dropdown.innerHTML = '<summary>Services' + icons.chevron + '</summary>' +
        '<div class="mobile-services-links">' + serviceLinksMarkup(true) + "</div>";
      servicesLink.replaceWith(dropdown);
    });

    document.addEventListener("click", function (event) {
      document.querySelectorAll(".services-dropdown.is-open").forEach(function (dropdown) {
        if (dropdown.contains(event.target)) return;
        dropdown.classList.remove("is-open");
        var toggle = dropdown.querySelector("button");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function currentPageState() {
    var current = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("a[href]").forEach(function (link) {
      var href = link.getAttribute("href").replace("./", "");
      if (href === current) link.setAttribute("aria-current", "page");
    });
    document.querySelectorAll(".services-dropdown, .mobile-services-dropdown").forEach(function (dropdown) {
      if (dropdown.querySelector('[aria-current="page"]')) dropdown.classList.add("has-active");
    });
  }

  function headerBehavior() {
    var header = document.querySelector(".site-header");
    var floating = document.querySelector(".floating-call");
    function update() {
      var active = window.scrollY > 24;
      if (header) header.classList.toggle("is-scrolled", active);
      if (floating) floating.classList.toggle("is-visible", window.scrollY > 420);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function mobileMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");
    var close = document.querySelector("[data-menu-close]");
    if (!toggle || !menu) return;
    menu.setAttribute("aria-hidden", "true");

    function openMenu() {
      menu.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      menu.setAttribute("aria-hidden", "false");
      document.body.classList.add("menu-open");
      var first = menu.querySelector("a, button");
      if (first) first.focus();
    }

    function closeMenu() {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
      document.body.classList.remove("menu-open");
      toggle.focus();
    }

    toggle.addEventListener("click", openMenu);
    if (close) close.addEventListener("click", closeMenu);
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menu.classList.contains("is-open")) closeMenu();
    });
  }

  function faqAccordions() {
    document.querySelectorAll(".faq-item button").forEach(function (button) {
      button.addEventListener("click", function () {
        var item = button.closest(".faq-item");
        var expanded = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!expanded));
        item.classList.toggle("is-open", !expanded);
      });
    });
  }

  function revealOnScroll() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window) || !items.length) {
      items.forEach(function (item) { item.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });
    items.forEach(function (item) { observer.observe(item); });
  }

  function serviceCarousel() {
    var carousel = document.querySelector("[data-service-carousel]");
    var track = carousel && carousel.querySelector(".service-carousel-track");
    var prev = document.querySelector("[data-carousel-prev]");
    var next = document.querySelector("[data-carousel-next]");
    if (!track || !prev || !next) return;

    function step(direction) {
      var card = track.querySelector(".service-card");
      var amount = card ? card.getBoundingClientRect().width + 24 : track.clientWidth * 0.8;
      track.scrollBy({ left: amount * direction, behavior: "smooth" });
    }

    prev.addEventListener("click", function () { step(-1); });
    next.addEventListener("click", function () { step(1); });
  }

  function createSearchIndex() {
    var defaultName = "PestLine Connect";
    var companyName = config.companyName || defaultName;
    var pages = [
      {
        title: "Home",
        href: "./index.html",
        type: "Overview",
        text: "Fast access to local pest control options. " + companyName + " helps homeowners connect with independent local providers for residential pest concerns, compare local options, verify licensing and insurance, and request written service terms."
      },
      {
        title: "Services",
        href: "./services.html",
        type: "Service library",
        text: "Explore pest control service categories, household insects, property risk, biting pests, outdoor pressure, inspections, preparation, documentation, follow-up terms, and local provider availability."
      },
      {
        title: "About",
        href: "./about.html",
        type: "Platform",
        text: "Learn how " + companyName + " helps homeowners begin the search for independent local pest control providers, route inquiries, ask better questions, and verify credentials before hiring."
      },
      {
        title: "Contact",
        href: "./contact.html",
        type: "Contact",
        text: "Request a pest control provider connection by phone, email, contact form, ZIP code, pest concern, provider availability, estimates, and service details."
      },
      {
        title: "Privacy Policy",
        href: "./privacy.html",
        type: "Legal",
        text: "Privacy policy, information collection, contact forms, provider connection requests, cookies, tracking technologies, data security, privacy rights, and independent providers."
      },
      {
        title: "Terms of Use",
        href: "./terms.html",
        type: "Legal",
        text: "Terms of use, independent local providers, service estimates, homeowner responsibility, provider licensing, insurance, pricing, cancellation terms, and website rules."
      },
      {
        title: "Cookie Policy",
        href: "./cookie.html",
        type: "Legal",
        text: "Cookie policy, analytics, tracking technologies, website performance, browser settings, and user choices."
      }
    ];

    services.forEach(function (service) {
      pages.push({
        title: service.title,
        href: service.href,
        type: service.group,
        text: [
          service.summary,
          service.signs && service.signs.join(" "),
          service.questions && service.questions.join(" ")
        ].filter(Boolean).join(" ")
      });
    });

    return pages.map(function (page) {
      page.searchText = [page.title, page.type, page.text].join(" ").toLowerCase();
      return page;
    });
  }

  function siteSearch() {
    var searchIndex = createSearchIndex();
    var modal = document.createElement("div");
    modal.className = "site-search";
    modal.setAttribute("data-site-search", "");
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = '<div class="site-search-backdrop" data-search-close></div>' +
      '<section class="site-search-panel" role="dialog" aria-modal="true" aria-labelledby="site-search-title">' +
      '<div class="site-search-head">' +
      '<div><p>Site search</p><h2 id="site-search-title">What are you looking for?</h2></div>' +
      '<button class="site-search-close" type="button" data-search-close aria-label="Close search">&times;</button>' +
      '</div>' +
      '<label class="site-search-field"><span>' + icons.search + '</span><input type="search" data-search-input placeholder="Search pests, services, contact info..." autocomplete="off"></label>' +
      '<div class="site-search-results" data-search-results></div>' +
      '</section>';
    document.body.appendChild(modal);

    var input = modal.querySelector("[data-search-input]");
    var results = modal.querySelector("[data-search-results]");
    var lastFocus = null;

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, function (char) {
        return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char];
      });
    }

    function tokenize(value) {
      return value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    }

    function getSnippet(page, terms) {
      var text = page.text || "";
      var lower = text.toLowerCase();
      var index = -1;
      terms.some(function (term) {
        index = lower.indexOf(term);
        return index > -1;
      });
      if (index < 0) return text.slice(0, 150);
      var start = Math.max(0, index - 55);
      var snippet = text.slice(start, start + 165);
      return (start > 0 ? "... " : "") + snippet;
    }

    function scorePage(page, terms) {
      return terms.reduce(function (score, term) {
        if (page.title.toLowerCase().indexOf(term) > -1) score += 8;
        if (page.type.toLowerCase().indexOf(term) > -1) score += 4;
        if (page.searchText.indexOf(term) > -1) score += 2;
        return score;
      }, 0);
    }

    function renderResults(query) {
      var terms = tokenize(query);
      var matches = terms.length ? searchIndex
        .map(function (page) {
          return { page: page, score: scorePage(page, terms) };
        })
        .filter(function (match) { return match.score > 0; })
        .sort(function (a, b) { return b.score - a.score || a.page.title.localeCompare(b.page.title); })
        .slice(0, 8)
        .map(function (match) { return match.page; }) : searchIndex.slice(0, 6);

      if (!matches.length) {
        results.innerHTML = '<p class="site-search-empty">No results found. Try a pest name like ants, rodents, termites, or mosquitoes.</p>';
        return;
      }

      results.innerHTML = matches.map(function (page) {
        return '<a class="site-search-result" href="' + page.href + '">' +
          '<span>' + escapeHtml(page.type) + '</span>' +
          '<strong>' + escapeHtml(page.title) + '</strong>' +
          '<em>' + escapeHtml(getSnippet(page, terms)) + '</em>' +
          '</a>';
      }).join("");
    }

    function openSearch() {
      lastFocus = document.activeElement;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("search-open");
      input.value = "";
      renderResults("");
      window.setTimeout(function () { input.focus(); }, 40);
    }

    function closeSearch() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("search-open");
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }

    document.querySelectorAll("[data-search-open]").forEach(function (button) {
      button.addEventListener("click", openSearch);
    });
    modal.querySelectorAll("[data-search-close]").forEach(function (button) {
      button.addEventListener("click", closeSearch);
    });
    input.addEventListener("input", function () { renderResults(input.value); });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.classList.contains("is-open")) closeSearch();
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }
    });
  }

  function cookieBanner() {
    var storageKey = "pestline-cookie-consent";

    function getConsent() {
      try {
        return window.localStorage.getItem(storageKey);
      } catch (error) {
        return null;
      }
    }

    function setConsent(value) {
      try {
        window.localStorage.setItem(storageKey, value);
      } catch (error) {
        document.cookie = storageKey + "=" + encodeURIComponent(value) + "; path=/; max-age=31536000; SameSite=Lax";
      }
    }

    if (getConsent()) return;

    var banner = document.createElement("section");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", "Cookie notice");
    banner.innerHTML = '<div class="cookie-banner-copy">' +
      '<strong>Cookie notice</strong>' +
      '<p>We use essential cookies to run this site and may use analytics or referral cookies to understand visits and improve provider connection workflows.</p>' +
      '<a href="./cookie.html">Cookie Policy</a>' +
      '</div>' +
      '<div class="cookie-banner-actions">' +
      '<button class="cookie-secondary" type="button" data-cookie-choice="declined">Decline</button>' +
      '<button class="cookie-primary" type="button" data-cookie-choice="accepted">Accept</button>' +
      '</div>';
    document.body.appendChild(banner);

    window.setTimeout(function () {
      banner.classList.add("is-visible");
    }, 120);

    banner.querySelectorAll("[data-cookie-choice]").forEach(function (button) {
      button.addEventListener("click", function () {
        setConsent(button.getAttribute("data-cookie-choice"));
        banner.classList.remove("is-visible");
        window.setTimeout(function () {
          banner.remove();
        }, 220);
      });
    });
  }

  function contactFormConfirmation() {
    var forms = document.querySelectorAll(".form-ui");
    if (!forms.length) return;

    var modal = document.createElement("div");
    modal.className = "form-confirmation";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = '<div class="form-confirmation-backdrop" data-form-confirmation-close></div>' +
      '<section class="form-confirmation-panel" role="dialog" aria-modal="true" aria-labelledby="form-confirmation-title">' +
      '<button class="form-confirmation-close" type="button" data-form-confirmation-close aria-label="Close confirmation">&times;</button>' +
      '<span class="form-confirmation-icon" aria-hidden="true"></span>' +
      '<h2 id="form-confirmation-title">Request received</h2>' +
      '<p>Thank you. Your inquiry details were submitted, and a provider connection request can now be reviewed. Availability and service terms may vary by local provider.</p>' +
      '<button class="cta form-confirmation-action" type="button" data-form-confirmation-close>Done</button>' +
      '</section>';
    document.body.appendChild(modal);

    var lastFocus = null;

    function openConfirmation() {
      lastFocus = document.activeElement;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("confirmation-open");
      var closeButton = modal.querySelector("[data-form-confirmation-close]");
      if (closeButton) closeButton.focus();
    }

    function closeConfirmation() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("confirmation-open");
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }

    forms.forEach(function (form) {
      form.querySelectorAll("input, select, textarea").forEach(function (field) {
        if (field.name && field.type !== "hidden") field.required = true;
      });

      form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        openConfirmation();
        form.reset();
      });
    });

    modal.querySelectorAll("[data-form-confirmation-close]").forEach(function (button) {
      button.addEventListener("click", closeConfirmation);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.classList.contains("is-open")) closeConfirmation();
    });
  }

  buildHeaderUtilities();
  hydrateConfig();
  buildServicesNavigation();
  buildFooterServices();
  currentPageState();
  headerBehavior();
  mobileMenu();
  faqAccordions();
  revealOnScroll();
  serviceCarousel();
  siteSearch();
  cookieBanner();
  contactFormConfirmation();
}());
