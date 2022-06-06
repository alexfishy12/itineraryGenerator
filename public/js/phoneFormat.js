var phoneFieldA = document.getElementById('add-phone');
    phoneFieldA.addEventListener('keyup', function(){
      var phoneValue = phoneFieldA.value;
      var output;
      phoneValue = phoneValue.replace(/[^0-9]/g, '');
        var area = phoneValue.substr(0, 3);
        var pre = phoneValue.substr(3, 3);
        var tel = phoneValue.substr(6, 4);
        if (area.length < 3) {
            output = "(" + area;
        } else if (area.length == 3 && pre.length < 3) {
            output = "(" + area + ")" + " " + pre;
        } else if (area.length == 3 && pre.length == 3) {
            output = "(" + area + ")" + " " + pre + "-" + tel;
        }
      phoneFieldA.value = output;
      
    });