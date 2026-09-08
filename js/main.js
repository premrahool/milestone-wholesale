/* Milestone Trading Co. — landing page interactions (jQuery) */
jQuery(function ($) {
  'use strict';

  /* ---------- category filter ---------- */
  var $items = $('.product-item');

  function countFor(cat) {
    return cat === 'all' ? $items.length : $items.filter('[data-category="' + cat + '"]').length;
  }

  $('#filterBar .filter-btn').each(function () {
    $(this).find('.count').text('(' + countFor($(this).data('filter')) + ')');
  });

  function applyFilter(cat) {
    var $btn = $('#filterBar .filter-btn[data-filter="' + cat + '"]');
    if (!$btn.length) { return; }
    $('#filterBar .filter-btn').removeClass('active');
    $btn.addClass('active');

    var shown = 0;
    $items.each(function () {
      var match = cat === 'all' || $(this).data('category') === cat;
      $(this).toggleClass('is-hidden', !match);
      if (match) { shown++; }
    });
    $('#emptyNote').toggleClass('d-none', shown > 0);
  }

  $('#filterBar').on('click', '.filter-btn', function () {
    applyFilter($(this).data('filter'));
  });

  /* footer category links jump + filter */
  $('[data-jump]').on('click', function () {
    applyFilter($(this).data('jump'));
  });

  /* ---------- sticky nav shadow ---------- */
  var $nav = $('.site-nav');
  $(window).on('scroll', function () {
    $nav.toggleClass('is-stuck', $(window).scrollTop() > 20);
  }).trigger('scroll');

  /* ---------- smooth scroll + mobile menu close ---------- */
  $('a[href^="#"]').on('click', function (e) {
    var id = $(this).attr('href');
    if (id === '#' || !$(id).length) { return; }
    e.preventDefault();
    $('html, body').animate({ scrollTop: $(id).offset().top - 78 }, 450);
    var $collapse = $('#mainNav');
    if ($collapse.hasClass('show')) {
      $collapse.collapse('hide');
    }
  });

  /* ---------- animated hero counters ---------- */
  var counted = false;
  function runCounters() {
    if (counted) { return; }
    counted = true;
    $('[data-count]').each(function () {
      var $el = $(this), target = parseInt($el.data('count'), 10);
      $({ n: 0 }).animate({ n: target }, {
        duration: 1200,
        easing: 'swing',
        step: function () { $el.text(Math.floor(this.n)); },
        complete: function () { $el.text(target); }
      });
    });
  }
  runCounters();

  /* ---------- prefill modal from the clicked card ---------- */
  $('#inquiryModal').on('show.bs.modal', function (e) {
    var trigger = e.relatedTarget;
    if (!trigger) { return; }
    var $t = $(trigger);
    var explicit = $t.data('product');
    var $select = $('#fProduct');

    if (explicit) {
      if ($select.find('option').filter(function () { return $(this).text() === explicit; }).length === 0) {
        $select.append($('<option>').text(explicit));
      }
      $select.val(explicit);
    } else {
      var cat = $t.closest('.product-item').data('category');
      var map = {
        mosquito: 'Mosquito Repellents',
        agarbatti: 'Agarbatti',
        match: 'Matchboxes & Lighters',
        makhana: 'Makhana / Fox Nuts',
        soap: 'Soaps & Personal Care'
      };
      var name = $t.closest('.p-card').find('h3').text().trim();
      if (map[cat]) { $select.val(map[cat]); }
      if (name) { $('#fMsg').val('Enquiry for: ' + name + '\n'); }
    }
  });

  $('#inquiryModal').on('hidden.bs.modal', function () {
    $('#inquiryForm').removeClass('was-validated')[0].reset();
    $('#formSuccess').addClass('d-none');
    $('#inquiryForm').removeClass('d-none');
  });

  /* ---------- inquiry form validation (front-end demo) ---------- */
  $('#inquiryForm').on('submit', function (e) {
    e.preventDefault();
    var form = this;
    if (!form.checkValidity()) {
      $(form).addClass('was-validated');
      return;
    }
    /* Wire this payload to your mailer / CRM endpoint. */
    var payload = $(form).serializeArray().reduce(function (acc, f) {
      acc[f.name] = f.value; return acc;
    }, {});
    console.log('Wholesale inquiry:', payload);

    $(form).addClass('d-none');
    $('#formSuccess').removeClass('d-none');
    setTimeout(function () {
      $('#inquiryModal').modal('hide');
    }, 2600);
  });

  /* ---------- image fallback for remote placeholders ---------- */
  $('img').on('error', function () {
    var $img = $(this);
    if ($img.data('fallbackApplied')) { return; }
    $img.data('fallbackApplied', true);
    $img.attr('src',
      'data:image/svg+xml;utf8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">' +
        '<rect width="800" height="600" fill="#fbf5e7"/>' +
        '<rect x="1" y="1" width="798" height="598" fill="none" stroke="#e7e0cf" stroke-width="2"/>' +
        '<text x="400" y="300" text-anchor="middle" font-family="Georgia,serif" font-size="34" fill="#c08a12">' +
        'Product photo on request</text></svg>'
      )
    );
  });

  /* ---------- footer year ---------- */
  $('#year').text(new Date().getFullYear());

  /* ---------- active nav link on scroll ---------- */
  var sections = $('section[id], header[id]');
  $(window).on('scroll', function () {
    var pos = $(window).scrollTop() + 120, current = '';
    sections.each(function () {
      if ($(this).offset().top <= pos) { current = this.id; }
    });
    $('.site-nav .nav-link').removeClass('active')
      .filter('[href="#' + current + '"]').addClass('active');
  });
});
