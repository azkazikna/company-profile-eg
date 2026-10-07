jQuery(function ($) {
  var $ledger = $('.ledger');
  if (!$ledger.length) return;

  /* buka/tutup satu baris */
  $ledger.on('click', '.lg-h', function () {
    var $btn = $(this);
    var $item = $btn.closest('.lg-i');
    var open = $item.hasClass('on');

    $item.toggleClass('on', !open);
    $btn.attr('aria-expanded', open ? 'false' : 'true');
  });

  /* keyboard: panah naik/turun antar baris */
  $ledger.on('keydown', '.lg-h', function (e) {
    var $heads = $ledger.find('.lg-h');
    var i = $heads.index(this);
    var next = null;

    if (e.key === 'ArrowDown') next = $heads.eq(Math.min(i + 1, $heads.length - 1));
    if (e.key === 'ArrowUp')   next = $heads.eq(Math.max(i - 1, 0));
    if (e.key === 'Home')      next = $heads.first();
    if (e.key === 'End')       next = $heads.last();

    if (next && next.length) {
      e.preventDefault();
      next.trigger('focus');
    }
  });

  /* opsional: tutup semua dengan Escape */
  $ledger.on('keydown', '.lg-h', function (e) {
    if (e.key !== 'Escape') return;
    var $btn = $(this);
    $btn.closest('.lg-i').removeClass('on');
    $btn.attr('aria-expanded', 'false');
  });
});