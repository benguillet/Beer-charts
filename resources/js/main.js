$(window).ready(function () {
  if (data != undefined) {
    APP.init(); 
  }
});

var APP = {

  init : function() {
    google.load('visualization', '1.0', {'packages':['corechart'], callback:function() {
      APP.drawMonthlyBalance();
    }});
  },

  drawMonthlyBalance: function() {
    var gdata = new google.visualization.DataTable();   
    gdata.addColumn('string', 'Date');
    gdata.addColumn('number', 'Euro');
    
    data = data.reverse();
    $.each(data, function(index, value) {
      gdata.addRow([value.date, parseInt(value.out)])
    });
      
    var options = { 'width':1000, 'height':400 };
    newdiv = document.createElement('div');
    $('body').append(newdiv); 
    var chart = new google.visualization.AreaChart(newdiv); 
    chart.draw(gdata, options);
  }
}
