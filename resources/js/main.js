
/**
 * Horrible Javascript, you have been warn !
 */

$(window).ready(function () {
  google.load('visualization', '1.0', {'packages':['corechart'], callback:APP.init});
});

var APP = {

  init : function() {
    $('#submit_form').click(function(){
      VIEW.save();
      APP.loadMonthlyBalance();
      return false;
    });
  },

  loadMonthlyBalance: function() {
    var login = $('#login').val();
    var pass  = $('#password').val()
    VIEW.showLoader();
    $.post("/data", { login: login, mdp: pass })
      .done(function(data) {
        data = JSON.parse(data);
        if (data.error != undefined) {
          VIEW.restore(data.error);
        } else {
          APP.drawMonthlyBalance(data);
        }
      }
    );
  },

  drawMonthlyBalance: function(data) {

    var gdata = new google.visualization.DataTable();   
    gdata.addColumn('string', 'Date');
    gdata.addColumn('number', 'Euro');
    
    data = data.reverse();
    $.each(data, function(index, value) {
      gdata.addRow([value.date, parseInt(value.out)])
    });
    
    var options = { 'width':1000, 'height':400 };
    VIEW.clear();
    
    newdiv = document.createElement('div');
    $('body').append(newdiv); 
    var chart = new google.visualization.AreaChart(newdiv); 
    chart.draw(gdata, options);

  }
}

var VIEW = {

    clear: function() {
      document.body.innerHTML = '';
    },

    save : function() {
      VIEW.body = document.body.innerHTML;
    },

    restore : function() {
      document.body.innerHTML = VIEW.body;
      APP.init();
    },

    showLoader : function() {
      VIEW.clear();
      var img = new Image();
      img.src = '/images/loader.gif';
      img.style.marginLeft = '30%';
      document.body.appendChild(img);
    },

}