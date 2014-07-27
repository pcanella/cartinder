
      window.fbAsyncInit = function() {
        FB.init({
          appId      : '676992922389202',
          xfbml      : true,
          version    : 'v2.0',
          frictionlessRequests: true,
          status: true,
          cookie: true
        });

$('.fb-login').on('click', function(e){
    window.open('https://www.facebook.com/dialog/oauth?client_id=676992922389202&scope=public_profile,email&redirect_uri=http://LM-SJC-00872307.local:8000/login', '_self');
});

$('.fblogout').on('click', function(e){
    FB.logout(function(response) {
    });
});

FB.getLoginStatus(function(response) {
    $('.fblogin').hide();
    console.log(response);
    $('body').append(response.status);
  if (response.status === 'connected') {
        $('body').append(response.authResponse.userID);

      }else{
            $('.fblogout').hide();
      }
     
  });

};

      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));

