(function () {
  var config = window.SITE_CONFIG || {};
  var services = window.SITE_SERVICES || [];

  var icons = {
    bug: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3 3 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a6 6 0 0 1 12 0v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.6-3.8 3.53-4"/><path d="M17.47 9C19.4 8.8 21 7.1 21 5"/><path d="M18 13h4"/><path d="M21 21c0-2.1-1.6-3.8-3.53-4"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.83 16.17a1 1 0 0 0 1.06.23l2.56-1.02a1 1 0 0 1 1.17.34l1.26 1.73a1 1 0 0 1-.1 1.3C18.76 19.77 17.18 21 15 21 8.37 21 3 15.63 3 9c0-2.18 1.23-3.76 2.25-4.78a1 1 0 0 1 1.3-.1l1.73 1.26a1 1 0 0 1 .34 1.17L7.6 9.11a1 1 0 0 0 .23 1.06z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="7"/></svg>',
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

  function hydrateConfig() {
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
        socials.innerHTML = '<a href="./services.html" aria-label="Search services">' + icons.search + '</a>';
        navRow.appendChild(socials);
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
}());
