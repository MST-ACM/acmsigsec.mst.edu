// Set your Stripe publishable API key here
Stripe.setPublishableKey('pk_test_51Hfm7wJCIpvTNXndqyN2ZsYxepcYkEsWrWTSmLoZidAZXAhheQdkRCuQKA7ylETVP8H4Rl42gEFgyGOMvpPgIpFx00yy6dHKbX');

$(function() {
    var $form = $('#payment-form');
    $form.submit(function(event) {
        // Clear any errors
        $form.find('.has-error').removeClass('has-error')

        // Validate the form isn't empty before requesting a token
        invalidForm = false;
        $('#payment-form input').each(function() {
            if ($(this).val() == '') {
                $('#'+this.id).parent('.form-group').addClass('has-error');
                invalidForm = true;
            }
        });
        if (invalidForm){
            return false;
        }

        // Disable the submit button to prevent repeated clicks:
        $form.find('.submit').prop('disabled', true).html("<i class='fa fa-spinner fa-spin'></i> Making payment...");

        // Request a token from Stripe:
        Stripe.card.createToken($form, stripeResponseHandler);

        // Prevent the form from being submitted:
        return false;
    });

    // Formatting
    $('#number').payment('formatCardNumber');
    $('#cc_exp').payment('formatCardExpiry');

    // Determine & display the card brand
    $('#number').keyup(function() {
        card_type = $.payment.cardType($('#number').val());
        card_type ? $('#card_type').html("<i class='text-success fa fa-cc-"+card_type+"'></i>") : $('#card_type').html("");
    });
});

function stripeResponseHandler(status, response) {
    var $form = $('#payment-form');

    if (response.error) {
        // Show the errors on the form
        $form.find('.payment-errors').text(response.error.message).addClass('alert alert-danger');
        $form.find('#' + response.error.param).parent('.form-group').addClass('has-error');
        $form.find('button').prop('disabled', false).text('Pay $20'); // Re-enable submission
    }
    else { // Token was created!
        $form.find('.submit').html("<i class='fa fa-check'></i> Payment accepted");
        // Get the token ID:
        var token = response.id;

        // Insert the token and name into the form so it gets submitted to the server:
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));

        // TODO append user information to form

        // Submit the form:
        $form.get(0).submit();
    }
}

// TODO: Make get requests to autogenerate form
// TODO: Create success/failure alert for clients