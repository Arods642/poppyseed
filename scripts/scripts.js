$(function() {
    let TAX_RATE = 0;

    $( document ).ready(function() {
        fetchLocationBasedData();
        debugger;
        fetchCartData();
        debugger;
    })

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

    /**API Calls
     * Had to use a proxy to access endpoints ()
     * https://cors-anywhere.herokuapp.com/
     */
    const API_URL = 'https://cors-anywhere.herokuapp.com/https://poppyseed.yokepayments.com';
    const HEADERS = {
        "CLIENT-TYPE": "POPPYSEED",
        "CLIENT-VERSION": "1.0.0",
        "ACCEPT": "application/json"
    };

    function fetchLocationBasedData() {
        $.ajax({
            url: `${API_URL}/location`,
            type: 'GET',
            headers: HEADERS,
            dataType: 'json',
            success: handleOnSuccessFetchLocationBasedData,
            error: handleOnErrorFetchLocationBasedData
        });
    }

    function handleOnSuccessFetchLocationBasedData(res) {
        // setting up the div tag to be appended.
        const div = document.getElementById('location');

        TAX_RATE = res.tax_rate;

        // setting the div tag to be written to on the other page..
        div.innerHTML +='\
            <div class="col-md-6 mb-3">\
                <label for="locationName">Location Name</label>]\
                <input type="text" class="form-control" id="locationName" placeholder="" value="' + res.location_name + '" required>\
            </div>\
            <div class="col-md-3 mb-3">\
                <label for="taxRate">Tax Rate</label>\
                <input type="text" class="form-control" id="taxRate" value="' + TAX_RATE + '" required>\
                <div class="invalid-feedback">\
                    Zip code required.\
                </div>\
            </div>\
            <div class="col-md-6 mb-3">\
                <label for="address">Address</label>\
                <input type="text" class="form-control" id="address" value="' + res.address + '" required>\
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

    function handleOnErrorFetchLocationBasedData(err) {
        const msg = 'There was an error fetching locations!';
        genericErrorHandler(msg);
    }

    function fetchCartData() {
        $.ajax({
            url: `${API_URL}/cart`,
            type: 'GET',
            headers: HEADERS,
            dataType: 'json',
            success: handleOnSuccessFetchCartData,
            error: handleOnErrorfetchCartData
        });
    }

    // Post items to DOM
    // Calculate: Subtotal, SalesTax, and Total figures
    function handleOnSuccessFetchCartData(res) {
        // setting up the ul list to be written to by setting it to ullist variable. 
        const ullist = $('#cart-items');

        ullist.html('');

        let subtotal = 0;
        let totalTax = 0;

        // Normally we would separate all the calculations into its own call
        // but we would be traversing the array several times
        res.forEach(function(product) {
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

            subtotal = subtotal + calculateLineTotal(product);
            
            totalTax = totalTax + calculateLineTax(product);

        });

        // Post calculations to DOM
        console.log('subtotal ', subtotal);
        console.log('totalTax', totalTax);
    }

    function handleOnErrorfetchCartData(err) {
        const msg = 'There was an error fetching cart items!';
        genericErrorHandler(msg);
    }

    genericErrorHandler = errorMsg => console.log(errorMsg);

    /**Financial calculations
     * Rounding is only applied when we finally post to DOM for accuracy
     */

    const calculateLineTotal = (product) => {
        return product.price * product.quantity;
    }

    const calculateLineTax = (product) => {
        return calculateLineTotal(product) * TAX_RATE;
    }
    
});
