$(window).ready(function () {
  google.load('visualization', '1.0', {'packages':['corechart'], callback:APP.init});
});

var APP = {

  cookie : null,
  data   : [],

  init : function() {
    APP.initlistener();
    APP.loadMonthlyBalance();
  },

  initlistener: function() {
    $('#rechargements-btn').click(function() {
      VIEW.drawMonthlyBalance('rechargements');
      $(this).addClass('btn-success');
      $('#depenses-btn').removeClass('btn-success');
    });

    $('#depenses-btn').click(function() {
      VIEW.drawMonthlyBalance('depenses');
      $(this).addClass('btn-success');
      $('#rechargements-btn').removeClass('btn-success');
    });
  },

  loadMonthlyBalance: function() {
    $.post("/get/montly", { cookie: APP.cookie })
      .done(function(data) {
        APP.data['monthly'] = JSON.parse(data).reverse();
        VIEW.drawMonthlyBalance('depenses');
      }
    );
  },

}

var VIEW = {

  drawMonthlyBalance: function(type) {
    var gdata = new google.visualization.DataTable();   
    gdata.addColumn('string', 'Date');
    gdata.addColumn('number', 'Euro');

    data = APP.data['monthly']
    $.each(data, function(index, value) {
      if (type == 'depenses') {
        gdata.addRow([value.date, parseInt(value.out)])
      } else {
        gdata.addRow([value.date, parseInt(value.in)])
      }
    });
    var options = { 
                    'width'           : '100%', 
                    'height'          : '500', 
                    'backgroundColor' : { fill:'transparent' } 
                  };
    var chart = new google.visualization.AreaChart($('#monthly_balance')[0]); 
    chart.draw(gdata, options);

  }

}