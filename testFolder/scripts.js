$(function() {
    // GET/READ
    $('#get-button').on('click', function() {
        $.ajax({
            url: 'products.json',
            dataType: 'json',
            success: function(response) {
                var tbodyEl = $('tbody');

                tbodyEl.html('');
                // print the object out to the screen.
                console.log(response)
                response.forEach(function(product) {
                   
                    tbodyEl.append('\
                        <tr>\
                            <td class="id">' + product.id + '</td>\
                            <td><input type="text" class="name" value="' + product.name + '"></td>\
                            <td><input type="text" class="name" value="' + product.price + '"></td>\
                            <td><input type="text" class="name" value="' + product.quantity + '"></td>\
                            <td>\
                                <button class="update-button">UPDATE/PUT</button>\
                                <button class="delete-button">DELETE</button>\
                            </td>\
                        </tr>\
                    ');
                    var total = 0;
                    for (let i in response)
                       total += response[i].price;
                       taxrate = 0.0075;
                       totaltax = total * taxrate;
                    // print the total of product price   
                    console.log(totaltax);
            });
            }
        });
    });

    // CREATE/POST
    $('#create-form').on('submit', function(event) {
        event.preventDefault();

        var createInput = $('#create-input');

        $.ajax({
            url: '/products',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ name: createInput.val() }),
            success: function(response) {
                console.log(response);
                createInput.val('');
                $('#get-button').click();
            }
        });
    });



});
