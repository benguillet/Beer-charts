$(window).ready(function () {
  google.load('visualization', '1.0', {'packages':['corechart'], callback:APP.init});
});

var APP = {

  cookie : null,
  data   : [],

  init : function() {
    APP.initlistener();
    APP.loadMonthlyBalance(function() {
      APP.loadMonth(APP.data['monthly']);
    });
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

  loadMonthlyBalance: function(callback) {
    $.post("/get/montly", { cookie: APP.cookie })
      .done(function(data) {
        APP.data['monthly'] = JSON.parse(data).reverse();
        VIEW.drawMonthlyBalance('depenses');
        callback();
      }
    );
  },

  loadMonth: function(data) {
    $.post("/get/all", { cookie: APP.cookie, data: data})
      .done(function(data) {
        APP.data['all'] = JSON.parse(data);
        VIEW.drawAllMonth();
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

  },

  drawAllMonth: function () {
    VIEW.drawDepenseHorraire();
    VIEW.drawTopConsommation();
    VIEW.drawTopBarman();
  },

  drawTopBarman: function() {
    var conso = {}
    data = APP.data['all'];
    $.each(data, function(index, value) {
      if (conso[value.vendeur] == undefined) {
        conso[value.vendeur] = 0;
      }
      conso[value.vendeur] += 1;
    }); 

    var sortable = [];
    for (var con in conso)
      sortable.push([con, conso[con]])
    sortable.sort(function(a, b) {return b[1] - a[1]})

    $('#top_barman').empty();
    $('#top_barman').append('<h4>Top 10 barman</h4><br/>')
    $.each(sortable, function(index, value) {
      $('#top_barman').append('<h5>('+value[1]+') '+value[0]+'</h5>')
      return index < 9;
    }); 
  },

  drawTopConsommation: function() {

    var conso = {}
    data = APP.data['all'];
    $.each(data, function(index, value) {
      if (conso[value.name] == undefined) {
        conso[value.name] = 0;
      }
      conso[value.name] += parseInt(value.qte);
    }); 

    var sortable = [];
    for (var con in conso)
      sortable.push([con, conso[con]])
    sortable.sort(function(a, b) {return b[1] - a[1]})

    $('#top_conso').empty();
    $('#top_conso').append('<h4>Top 10</h4><br/>')
    $.each(sortable, function(index, value) {
      $('#top_conso').append('<h5>('+value[1]+') '+value[0]+'</h5>')
      return index < 9;
    });

  },

  drawDepenseHorraire: function() {

    var gdata = new google.visualization.DataTable();   
    gdata.addColumn('string', 'Date');
    gdata.addColumn('number', 'Euro');

    var times = {
      "01" : 0, '02' : 0, '03' : 0, '04' : 0, '05' : 0, '06' : 0,
      '07' : 0, '08' : 0, '09' : 0, '10' : 0, '11' : 0, '12' : 0,
      '13' : 0, '14' : 0, '15' : 0, '16' : 0, '17' : 0, '18' : 0,
      '19' : 0, '20' : 0, '21' : 0, '22' : 0, '23' : 0, '00' : 0,
    };

    data = APP.data['all']
    $.each(data, function(index, value) {
      time = value.time.split(' ');
      time = time[1].split(':');
      hour = time[0];
      times[hour] += value.qte * value.prix;
    });

    $.each(wtfJavascript(times).sort(), function(index, value) {
      gdata.addRow([value[0]+"h", Math.floor(value[1])])
    });

    var options = { 
                    'width'           : '100%', 
                    'height'          : '500', 
                    'backgroundColor' : { fill:'transparent' } 
                  };

    var chart = new google.visualization.AreaChart($('#depense_horraire')[0]); 
    chart.draw(gdata, options);

  }

}

function wtfJavascript(obj) {
    var keys = [];
    for(var key in obj)
    {
        if(obj.hasOwnProperty(key))
        {
            keys.push([key, obj[key]]);
        }
    }
    return keys;
}