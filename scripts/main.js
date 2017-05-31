$(document).ready(function() {
  const bitcoinStartPriceUSD = 0.08;

  updateMeasure(238855);

  // Button events
  $('.measure-number').click(function(event) {
    $(this).addClass('active'); // add active effect on click
    $('.measure-number').not(this).removeClass('active'); // remove active effect on other options
    updateMeasure($(this).data('measure'));
  });

  function updateMeasure(measure) {
    $('#price').hide();
    $('.spinner').show();

    getPriceUSD(function(price) {
      $('#price').html('(1Ƀ = $' + price + ')');

      var percentRounded = ((price/measure) * 100).toFixed(2);
      $('#percentage > .number').html(percentRounded + '%');

      $('#price').show();
      $('.spinner').hide();
    });
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
