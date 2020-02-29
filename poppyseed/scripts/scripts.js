$(function() {
    // GET/READ
    $( document ).ready(function() {
        
        let tax_rate;
        $.ajax({
            url: 'location.json',
            dataType: 'json',
            success: function(response) {
                const div = document.getElementById('location');
                let tax_rate = response.tax_rate;
                // print the object out to the screen.
                console.log(response)
                div.innerHTML +='\
                <div class="col-md-6 mb-3">\
                <label for="locationName">Location Name</label>]\
                <input type="text" class="form-control" id="locationName" placeholder="" value="' + response.location_name + '" required>\
            </div>\
            <div class="col-md-3 mb-3">\
                  <label for="taxRate">Tax Rate</label>\
                  <input type="text" class="form-control" id="taxRate" value="' + tax_rate + '" required>\
                  <div class="invalid-feedback">\
                    Zip code required.\
                  </div>\
            </div>\
            <div class="col-md-6 mb-3">\
                <label for="address">Address</label>\
                <input type="text" class="form-control" id="address" value="' + response.address + '" required>\
                <div class="invalid-feedback">\
                  Please enter your shipping address.\
                </div>\
            </div>\
            \
            <div class="row">\
                <div class="col-md-4 mb-3">\
                <label for="country">Country</label>\
                <select class="custom-select d-block w-100" id="country" required>\
                    <option value="">Choose...</option>\
                    <option selected>United States</option>\
                </select>\
                <div class="invalid-feedback">\
                    Please select a valid country.\
                </div>\
            </div>\
            <div class="col-md-4 mb-3">\
                <label for="state">State</label>\
                <select class="custom-select d-block w-100" id="state" required>\
                    <option value="">Choose...</option>\
                    <option selected>California</option>\
                </select>\
                <div class="invalid-feedback">\
                    Please provide a valid state.\
                </div>\
            </div>\
           <div class="col-md-4 mb-3">\
                <label for="zip">Zip</label>\
                <input type="text" class="form-control" id="zip" placeholder="" required>\
                <div class="invalid-feedback">\
                    Zip code required.\
                </div>\
            </div>\
            </div>\
            <hr class="mb-4">\
            <div class="custom-control custom-checkbox">\
                <input type="checkbox" class="custom-control-input" id="same-address">\
                <label class="custom-control-label" for="same-address">Shipping address is the same as my billing address</label>\
            </div>\
            <div class="custom-control custom-checkbox">\
                <input type="checkbox" class="custom-control-input" id="save-info">\
                <label class="custom-control-label" for="save-info">Save this information for next time</label>\
            </div>\
                     '; 
            }
        });
       console.log(tax_rate);
        $.ajax({
            url: 'products.json',
            dataType: 'json',
            success: function(response) {
                const ullist = $('ul');
                let taxrate = tax_rate;
                ullist.html('');
                // print the object out to the screen.
                console.log(response)
                response.forEach(function(product) {
          
                    // print the total of product price   
                    
                    ullist.append('\
                    <li class="list-group-item d-flex justify-content-between lh-condensed">\
                        <div>\
                          <h6 class="my-0">' + product.name + '</h6>\
                          <span class="text-dark">Quantity</span>\
                          <span class="text-dark">( ' + product.quantity + ' )</span>\
                        </div>\
                        <span class="text-muted">' + parseFloat(product.price) + '</span>\
                      </li>\
                     ');

            });
            let total = 0;
            for (let i in response){
               total += parseFloat(response[i].price);
               taxrate = 0.0075;
               totaltaxrate = total * taxrate;
          };
         console.log(totaltaxrate);
            }
        });

    });

    // CREATE/POST
    $('#get-button').on('click', function(event) {
        
        event.preventDefault();

        

        $.ajax({
            url: 'process.json',
            dataType: 'json',
            success: function(response) {
                console.log(response);
                if(response.status === 'FAILED') {
                    console.log('FAILED');
                } else if (response.status === 'PASSED'){
                    console.log('PASSED');
                }
               
            }
        });
    });



});
