$( document ).ready(function() {

    // SUBMIT FORM
    $("#bmi_form").submit(function(event) {
        // Prevent the form from submitting via the browser.
        event.preventDefault();
        ajaxPost();
    });


    function ajaxPost(){


        // DO POST
        $.ajax({
            type : "POST",
            contentType : "application/json",
            url : window.location + "api/users/save",
            data : JSON.stringify(formData),
            dataType : 'json',
            success : function(user) {
                $("#postResultDiv").html("<p>" +
                    "Post Successfully! <br>" +
                    "--> " + user.firstname + " " + user.lastname + "</p>");
            },
            error : function(e) {
                alert("Error!");
                console.log("ERROR: ", e);
            }
        });
    }
});