
jQuery(function ($) {
  var $ws = $('.workspace');
  if (!$ws.length) return;

  var $navs   = $ws.find('.ws-nav');
  var $screens = $ws.find('.screen');
  var $caps   = $('.ws-caps');
  var $url    = $ws.find('.ws-url');
  var canHover = window.matchMedia('(hover: hover)').matches;

  /* ---------- hitung posisi tooltip agar tidak terpotong ---------- */
  function placeTips(screen) {
    var $screen = $(screen);
    var box = screen.getBoundingClientRect();

    $screen.find('.pin').each(function () {
      var $pin = $(this);
      var $tip = $pin.find('.tip');
      if (!$tip.length) return;

      $pin.css('--shift', '0px').removeClass('tip-down');

      var pr = this.getBoundingClientRect();
      var tw = $tip.outerWidth() || 240;
      var pad = 14;
      var centerX = pr.left + pr.width / 2 - box.left;

      var shift = 0;
      var min = tw / 2 + pad;
      var max = box.width - tw / 2 - pad;
      if (centerX < min) shift = min - centerX;
      else if (centerX > max) shift = max - centerX;
      $pin.css('--shift', shift.toFixed(1) + 'px');

      if (pr.top - box.top < 175) $pin.addClass('tip-down');
    });
  }

  /* ---------- ganti halaman ---------- */
  function activate(id) {
    $navs.each(function () {
      var $b = $(this);
      var on = $b.attr('data-screen') === id;
      $b.toggleClass('on', on).attr('aria-current', on ? 'true' : 'false');
      if (on && $b.attr('data-url')) $url.text($b.attr('data-url'));
    });

    $screens.each(function () {
      var $s = $(this);
      var on = $s.attr('data-screen') === id;
      $s.toggleClass('on', on).prop('hidden', !on);
    });

    $caps.each(function () {
      var $c = $(this);
      $c.toggleClass('on', $c.attr('data-screen') === id);
    });

    var $cur = $screens.filter('[data-screen="' + id + '"]').first();
    if ($cur.length) {
      window.requestAnimationFrame(function () { placeTips($cur[0]); });
    }
  }

  /* ---------- klik sidebar modul ---------- */
  $ws.on('click', '.ws-nav', function () {
    activate($(this).attr('data-screen'));
  });

  /* ---------- pin: hover di desktop, sorot keterangan di sentuh ---------- */
  $ws.on('click', '.pin', function (e) {
    e.stopPropagation();

    var $pin = $(this);
    var $screen = $pin.closest('.screen');
    var id = $screen.attr('data-screen');

    if (!canHover) {
      var $list = $caps.filter('[data-screen="' + id + '"]').first();
      if (!$list.length) return;

      var idx = $screen.find('.pin').index($pin);
      var $item = $list.children('li').eq(idx);
      if (!$item.length) return;

      $list.find('li.hl').removeClass('hl');
      $item.addClass('hl');

      var el = $item[0];
      if (el.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    var isOpen = $pin.hasClass('open');
    $ws.find('.pin.open').removeClass('open');
    if (!isOpen) $pin.addClass('open');
  });

  /* ---------- tutup tooltip: klik di luar / Escape ---------- */
  $(document).on('click', function () {
    $ws.find('.pin.open').removeClass('open');
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') $ws.find('.pin.open').removeClass('open');
  });

  /* ---------- hitung ulang saat ukuran berubah ---------- */
  var resizeTimer;
  $(window).on('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var $cur = $screens.filter('.on').first();
      if ($cur.length) placeTips($cur[0]);
    }, 150);
  });

  /* ---------- mulai ---------- */
  if ($navs.length) activate($navs.first().attr('data-screen'));
});
jQuery(function ($) {
  var initRail = window.initRail || function () {};

  $(document).on('click', '.svc-tab', function () {
    var $tab   = $(this);
    var $group = $tab.closest('.svc-tabs');
    var $tabs  = $group.find('.svc-tab');

    $tabs.each(function () {
      var on = this === $tab[0];
      $(this).toggleClass('on', on).attr('aria-selected', on ? 'true' : 'false');
    });

    $tabs.each(function () {
      var $pane = $('#' + $(this).attr('aria-controls'));
      if (!$pane.length) return;

      var on = this === $tab[0];
      $pane.toggleClass('on', on).prop('hidden', !on);

      /* rail di panel baru perlu disinkronkan ulang */
      if (on && typeof window.initRail === 'function') {
        $pane.find('.rail').each(function () { window.initRail(this); });
      }
    });
  });
});
jQuery(function ($) {

  window.initRail = function (rail) {
    var $rail  = $(rail);
    var $wrap  = $rail.closest('.rail-wrap');
    if (!$wrap.length) return;

    var el     = rail;
    var $shots = $rail.find('.shot');
    var $dots  = $wrap.find('.rail-dots');
    var $prev  = $wrap.find('[data-rail="prev"]');
    var $next  = $wrap.find('[data-rail="next"]');

    function goTo(i) {
      i = Math.max(0, Math.min($shots.length - 1, i));
      var target = $shots.eq(i)[0];
      if (!target) return;
      el.scrollTo({ left: target.offsetLeft - el.offsetLeft, behavior: 'smooth' });
    }

    function activeIndex() {
      var best = 0, min = Infinity;
      $shots.each(function (i) {
        var d = Math.abs(this.offsetLeft - el.offsetLeft - el.scrollLeft);
        if (d < min) { min = d; best = i; }
      });
      return best;
    }

    function paint() {
      var i = activeIndex();
      if ($dots.length) {
        $dots.children().each(function (k) {
          $(this)
            .toggleClass('on', k === i)
            .attr('aria-current', k === i ? 'true' : 'false');
        });
      }
      if ($prev.length) $prev.prop('disabled', i === 0);
      if ($next.length) $next.prop('disabled', i === $shots.length - 1);
    }

    /* bangun titik sekali saja */
    if ($dots.length && !$dots.children().length && $shots.length) {
      $shots.each(function (i) {
        $('<button>', {
          type: 'button',
          'aria-label': 'Ke screenshot ' + (i + 1),
          click: function () { goTo(i); }
        }).appendTo($dots);
      });
    }

    /* panah */
    $prev.off('click.rail').on('click.rail', function () { goTo(activeIndex() - 1); });
    $next.off('click.rail').on('click.rail', function () { goTo(activeIndex() + 1); });

    /* keyboard */
    $rail.off('keydown.rail').on('keydown.rail', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(activeIndex() + 1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(activeIndex() - 1); }
    });

    /* scroll → perbarui indikator */
    var scrollTimer;
    $rail.off('scroll.rail').on('scroll.rail', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(paint, 80);
    });

    paint();
  };
});
/* ---------- tautkan pin <-> daftar keterangan ---------- */
(function ($) {
  var $ws = $('.workspace');
  var $caps = $('.ws-caps');
  if (!$ws.length || !$caps.length) return;

  var canHover = window.matchMedia('(hover: hover)').matches;

  function screenOf(id) { return $ws.find('.screen[data-screen="' + id + '"]').first(); }
  function capsOf(id) { return $caps.filter('[data-screen="' + id + '"]').first(); }

  function clearAll() {
    $caps.find('li.hl').removeClass('hl');
    $ws.find('.pin.open').removeClass('open');
  }

  /* --- hover pin → item keterangan menyala --- */
  $ws.on('mouseenter', '.pin', function () {
    if (!canHover) return;
    var $pin = $(this);
    var $screen = $pin.closest('.screen');
    var idx = $screen.find('.pin').index($pin);

    $caps.find('li.hl').removeClass('hl');
    capsOf($screen.attr('data-screen')).find('li').eq(idx).addClass('hl');
  });

  $ws.on('mouseleave', '.pin', function () {
    if (!canHover) return;
    $caps.find('li.hl').removeClass('hl');
  });

  /* --- hover item keterangan → tooltip pin terbuka + item menyala --- */
  $caps.on('mouseenter', 'li', function () {
    if (!canHover) return;
    var $li = $(this);
    var id = $li.closest('.ws-caps').attr('data-screen');
    var idx = $li.index();
    var $pin = screenOf(id).find('.pin').eq(idx);
    if (!$pin.length) return;

    $ws.find('.pin.open').removeClass('open');
    $pin.addClass('open');
    $caps.find('li.hl').removeClass('hl');
    $li.addClass('hl');
  });

  $caps.on('mouseleave', 'li', function () {
    if (!canHover) return;
    $ws.find('.pin.open').removeClass('open');
    $caps.find('li.hl').removeClass('hl');
  });

  /* --- klik item keterangan --- */
  $caps.on('click', 'li', function (e) {
    e.stopPropagation();
    var $li = $(this);
    var id = $li.closest('.ws-caps').attr('data-screen');
    var idx = $li.index();
    var $pin = screenOf(id).find('.pin').eq(idx);

    if (!canHover) {
      /* sentuh: gulir kembali ke jendela agar pin terlihat */
      clearAll();
      $li.addClass('hl');
      var el = $ws[0];
      if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    var isOpen = $pin.hasClass('open');
    clearAll();
    if (!isOpen) {
      $pin.addClass('open');
      $li.addClass('hl');
    }
  });

  /* --- bersihkan saat berganti modul --- */
  $ws.on('click', '.ws-nav', function () { clearAll(); });
})(jQuery);