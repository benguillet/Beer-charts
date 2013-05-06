$(window).ready(function () {
  google.load('visualization', '1.0', {'packages':['corechart'], callback:APP.init});
});

var APP = {

  cookie : null,
  data   : null,

  init : function() {
    APP.loadMonthlyBalance();
  },

  loadMonthlyBalance: function() {
    $.post("/get/montly", { cookie: APP.cookie })
      .done(function(data) {
        data = JSON.parse(data);
        VIEW.drawMonthlyBalance(data);
      }
    );
  },

}

var VIEW = {

  drawMonthlyBalance: function(data) {
    var gdata = new google.visualization.DataTable();   
    gdata.addColumn('string', 'Date');
    gdata.addColumn('number', 'Euro');
    data = data.reverse();
    $.each(data, function(index, value) {
      gdata.addRow([value.date, parseInt(value.out)])
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