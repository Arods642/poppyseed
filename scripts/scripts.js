$(function() {
    let TAX_RATE = 0;
    let TOTAL = 0;

    $( document ).ready(function() {
        fetchLocationBasedData()
            .then(() => fetchCartData());
    })

    // CREATE/POST
    $('#get-button').on('click', postProcessOrder);

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

    function postProcessOrder(e) {
        e.preventDefault();

        const data = {
            amount: TOTAL
        }

        debugger;

        return $.ajax({
            url: `${API_URL}/process`,
            type: 'POST',
            data: "{'amount': 202}",
            // data: JSON.stringify(data),
            headers: HEADERS,
            dataType: 'json',
            success: handleOnSuccessPostProcessOrder,
            error: handleOnErrorPostProcessOrder
        });
    }

    function handleOnSuccessPostProcessOrder(res) {
        // Wrote if statement to handle both the "success" & "failure" paths
        // to show that there is probably going to be separate handling.  It is just this situation
        // where they happen to do the same thing
        let msg;
        
        if (res.success) {
            msg = `${res.status} - ${res.message}`;
        } else {
            msg = `${res.status} - ${res.message}`;
        }
        
        genericErrorHandler(msg);
    }

    function handleOnErrorPostProcessOrder(err) {
        const msg = err.message || 'Something went wrong in the request';
        genericErrorHandler(msg);
    }


    function fetchLocationBasedData() {
        return $.ajax({
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
        return $.ajax({
            url: `${API_URL}/cart`,
            type: 'GET',
            headers: HEADERS,
            dataType: 'json',
            success: handleOnSuccessFetchCartData,
            error: handleOnErrorfetchCartData
        })
    }

    // Post items to DOM
    // Calculate: Subtotal, SalesTax, and Total figures
    function handleOnSuccessFetchCartData(res) {
        // setting up the ul list to be written to by setting it to ullist variable. 
        const ullist = $('#cart-items');

        ullist.html('');

        let subtotal = 0;
        let totalTax = 0;

        // Normally we would separate all the calculations into their own call
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
        $('#subtotalAmount').text(formatCurrency(subtotal, 0, 'USD'));
        $('#taxAmount').text(formatCurrency(totalTax, 0, 'USD'));
        TOTAL = formatCurrency(subtotal + totalTax, 0, 'USD');
        $('#totalAmount').text(TOTAL);

    }

    function handleOnErrorfetchCartData(err) {
        const msg = 'There was an error fetching cart items!';
        genericErrorHandler(msg);
    }

    genericErrorHandler = errorMsg => {
        console.log(errorMsg);
        openModal(errorMsg);
    }

    /**Financial calculations
     * Rounding is only applied when we finally post to DOM for accuracy
     */

    const calculateLineTotal = (product) => {
        return product.price * product.quantity;
    }

    const calculateLineTax = (product) => {
        return calculateLineTotal(product) * TAX_RATE;
    }
    
    // Applies rounding and decimal conversions
    // currencyFormat (string) [USD, Yen]
    const formatCurrency = (amount, decimalPlaces = 0, currencyFormat = 'USD')  => {
        let x = Math.ceil(amount);
        return Math.ceil(amount);
    }

    /**Modal for user messages
     * https://www.w3schools.com/howto/howto_css_modals.asp
     */

    const $modal = document.getElementById("myModal");
    // Get the <span> element that closes the modal
    const $closeModal = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    const openModal = (msg) => {
        $("#modalText").text(msg);
        $modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    $closeModal.onclick = function() {
        $modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == $modal) {
            $modal.style.display = "none";
        }
    }

});
