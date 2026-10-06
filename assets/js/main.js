$(function () {
  var $w = $(window), RM = matchMedia('(prefers-reduced-motion: reduce)').matches, FINE = matchMedia('(pointer:fine)').matches;
  $('html').addClass('js');
  window.dataLayer = window.dataLayer || [];
  function track(e, p) { dataLayer.push($.extend({ event: e }, p)); }

  // Sticky navbar: transparent -> solid/blurred
  function nav() { $('.eh-nav').toggleClass('scrolled', $w.scrollTop() > 40); }
  nav(); $w.on('scroll', nav);
  $('.eh-nav .nav-link').each(function () {
    var h = $(this).attr('href'), p = location.pathname.replace(/\/$/, '') || '/';
    if (h === p || (h !== '/' && p.indexOf(h) === 0)) $(this).addClass('active').attr('aria-current', 'page');
  });

  // Scroll reveal + counters
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var $t = $(e.target); $t.addClass('in'); io.unobserve(e.target);
      if ($t.is('[data-count]')) {
        var to = +$t.data('count'), suf = $t.data('suf') || '';
        if (RM) return $t.text(to + suf);
        $({ n: 0 }).animate({ n: to }, { duration: 1600, step: function (n) { $t.text(Math.round(n) + suf); } });
      }
    });
  }, { threshold: .2 });
  $('.rv,[data-count]').each(function () { io.observe(this); });

  // Hero: mouse interaction + parallax (desktop only)
  if (!RM && FINE) {
    $('.hero').on('mousemove', function (e) {
      var x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      $('.float').each(function () { var d = +$(this).data('depth'); $(this).css('transform', 'translate(' + x * d + 'px,' + y * d + 'px)'); });
    });
    $w.on('scroll', function () { var s = $w.scrollTop(); if (s < 900) $('.hero-line,.grid-bg').css('transform', 'translateY(' + s * .18 + 'px)'); });
    // Magnetic buttons
    $('.magnetic').on('mousemove', function (e) {
      var r = this.getBoundingClientRect();
      $(this).css('transform', 'translate(' + (e.clientX - r.left - r.width / 2) * .25 + 'px,' + (e.clientY - r.top - r.height / 2) * .35 + 'px)');
    }).on('mouseleave', function () { $(this).css('transform', ''); });
  }

  // Signature interaction: scroll-linked green line + changing visual
  var $p = $('.proc');
  if ($p.length) {
    var H = { 0: [20, 22, 18, 24, 20, 22], 1: [18, 30, 44, 38, 62, 70], 2: [24, 40, 85, 45, 40, 36], 3: [30, 48, 62, 76, 88, 94], 4: [40, 58, 72, 86, 100, 112] };
    var $li = $('.steps li'), $bars = $('.viz i'), cur = -1;
    function proc() {
      if (innerWidth < 992) return;
      var r = $p[0].getBoundingClientRect(), pr = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
      $('.steps-fill').css('height', pr * 100 + '%');
      var i = Math.min(4, Math.floor(pr * 5));
      if (i === cur) return; cur = i;
      $li.removeClass('on').eq(i).addClass('on');
      $bars.each(function (k) { $(this).css('height', H[i][k] / 1.2 + '%').toggleClass('hl', k === (i === 2 ? 2 : 5)); });
      $('#vn').text('0' + (i + 1)); $('#vt').text($li.eq(i).data('t')); $('#vp').text($li.eq(i).data('p'));
    }
    proc(); $w.on('scroll resize', proc);
  }

  // Service tabs
  $('.svc-tab').on('click', function () {
    var id = $(this).data('t'); $('.svc-tab').removeClass('on').attr('aria-selected', 'false'); $(this).addClass('on').attr('aria-selected', 'true');
    $('.svc-pane').removeClass('on').filter('#' + id).addClass('on'); track('service_tab', { service: id });
  });

  // Client / case / insight filter (no reload)
  $('.filter-btn').on('click', function () {
    var f = $(this).data('f'); $(this).addClass('on').siblings().removeClass('on');
    var $a = $('.fi').addClass('fade');
    setTimeout(function () { $a.each(function () { $(this).toggleClass('hide', f !== 'all' && (' ' + $(this).attr('data-f') + ' ').indexOf(' ' + f + ' ') < 0); }); setTimeout(function () { $('.fi').removeClass('fade'); }, 30); }, RM ? 0 : 300);
  });
  $('#q').on('input', function () { var q = this.value.toLowerCase(); $('.fi').each(function () { $(this).toggleClass('hide', $(this).text().toLowerCase().indexOf(q) < 0); }); });

  // Logo marquee: duplicate track, pause when tab inactive
  $('.marq-t').each(function () { $(this).append($(this).children().clone().attr('aria-hidden', 'true')); });
  document.addEventListener('visibilitychange', function () { $('.marq').toggleClass('paused', document.hidden); });

  // Contact form validation (Laravel will add server validation + CSRF)
  $('#cf').on('submit', function (e) {
    e.preventDefault(); var ok = true, f = this;
    $(f).find('[required]').each(function () {
      var bad = !this.value.trim() || (this.type === 'email' && !/^\S+@\S+\.\S+$/.test(this.value));
      $(this).toggleClass('is-invalid', bad); if (bad) ok = false;
    });
    if (f.website.value) return; // honeypot
    if (!ok) return $(f).find('.is-invalid').first().focus();
    track('generate_lead', { service: f.service.value }); location.href = '/thank-you';
  });

  // GA4 event tracking
  $(document).on('click', '[data-track]', function () { track('cta_click', { cta: $(this).data('track') }); });
  $(document).on('click', 'a[href^="tel:"]', function () { track('phone_click'); })
    .on('click', 'a[href^="mailto:"]', function () { track('email_click'); })
    .on('click', 'a[href*="wa.me"]', function () { track('whatsapp_click'); });
});
