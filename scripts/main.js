$(document).ready(function() {
  const bitcoinStartPriceUSD = 0.08;

  updateMeasure(238855);

  /*-- Button events --*/
  $('.measure-number').click(function(event) {
    $(this).addClass('active'); // add active effect on click
    $('.measure-number').not(this).removeClass('active'); // remove active effect on other options

    if ($(this).attr('type') != 'text') { // don't call updateMeasure on #measure-custom
      updateMeasure($(this).data('measure'));
    }
    else {
      showSpinner(true);
    }
  });

  /*-- Custom measure event --*/
  // So that the page doesn't fire a HTTP request
  // after every keystroke, we wait for 1 seconds
  // after no typing has been detected before
  // sending anything. https://stackoverflow.com/a/5926782.
  var typingTimer;

  $('#measure-custom').keyup(function(event) {
    clearTimeout(typingTimer);

    if ($(this).val()) {
      typingTimer = setTimeout(customMeasureUpdate, 1000);
    }
  });

  // Is called after 2 seconds of no typing in
  // the custom measure input.
  function customMeasureUpdate() {
    // Extracts numbers, works with comma-seperated digits
    // and decimals.
    var numbers = $('#measure-custom').val().replace(',', '').match(/[-]{0,1}[\d.]*[\d]+/g);
    updateMeasure(numbers[0]);
  }

  function updateMeasure(measure) {
    showSpinner(true);

    getPriceUSD(function(price) {
      $('#price').html('(1Ƀ = $' + price + ')');

      var percentRounded = ((price/measure) * 100).toFixed(2);
      $('#percentage > .number').html(percentRounded + '%');

      showSpinner(false);
    });
  }

  function showSpinner(toggle) {
    $('#price').toggle(!toggle);
    $('.spinner').toggle(toggle);
  }

  // gets current USD price of 1 bitcoin from CoinDesk
  function getPriceUSD(callback) {
    $.ajax({
      url: 'https://blockchain.info/ticker?&cors=true',
      type: 'GET',
      crossDomain: true,
      success: function(response) {
        callback(response['USD']['last']);
      },
      error: function(xhr, status) {
        callback('error!');
      }
    });
  }
});
