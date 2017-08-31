<?php session_start();

if(!$_POST) exit;

	if (!defined("PHP_EOL")) define("PHP_EOL", "\r\n");

///////////////////////////////////////////////////////////////////////////

	// Simple Configuration Options
	
	// Enter the email address that you want to emails to be sent to.
	// Example $address = "joe.doe@yourdomain.com";
		 
    $address = "services@dairien.com";

	// Twitter Direct Message notification control.
		// Set $twitter_active to 0 to disable Twitter Notification
		$twitter_active		= 0;
		
		// Get your consumer key and consumer secret from http://dev.twitter.com/apps/new
			// Notes:
				// Application Name: Jigowatt Contact Form
				// Description: Jigowatt Contact Form Direct Messaging Funcionality
				// Application Website: (your website address)
				// Application Type: Browser
				// Callback URL: (Blank)
				// Default Access type: Read and Write
		$twitter_user		= ""; // Your user name
		$consumer_key		= "";
		$consumer_secret	= "";
		
		// Access Token and Access Token Secret is under "My Access Token" (right menu).
		$token				= "";
		$secret				= "";
	
	// END OF Simple Configuration Options

///////////////////////////////////////////////////////////////////////////

// Only edit below this line if either instructed to do so by the author or have extensive PHP knowledge.
// Please Note, we cannot support this file package if modifications have been made below this line.
 
	$name     = $_POST['name'];
    $email    = $_POST['email'];
    $message = $_POST['message'];
			
	$error = '';

		if(trim($name) == '' || $name == 'Your Name') {
        	$error .= 'Your name is required.';
		}
        
		else if(trim($email) == '' || $email == 'Email Address') {
        	$error .= 'Your e-mail is required.';
	    } elseif(!isEmail($email)) {
        	$error .= 'Invalid e-mail address.';
        }
		
		else if(trim($message) == '' || $message == 'Message') {
        	$error .= 'Enter a message to send.';
        }
				
		if($error != '') { 
			echo $error;
		
		} else {
        
		if(get_magic_quotes_gpc()) { $message = stripslashes($message); }

         // Advanced Configuration Option.
         // i.e. The standard subject will appear as, "You've been contacted by John Doe."
		 
         $e_subject = 'You\'ve been contacted by ' . $name . '.';

         // Advanced Configuration Option.
		 // You can change this if you feel that you need to.
		 // Developers, you may wish to add more fields to the form, in which case you must be sure to add them here.
					
		 $msg  = "You have been contacted by $name ($email), their message is as follows." . PHP_EOL . PHP_EOL;
		 $msg .= $message . PHP_EOL . PHP_EOL . PHP_EOL;
		 $msg .= "-------------------------------------------------------------------------------------------" . PHP_EOL;
		 $myUser = $_SERVER['HTTP_USER_AGENT'];
		 $userIp = $_SERVER['REMOTE_ADDR'];
		 $currentTime = date("F j, Y, g:i a T");
		 $msg .= "This message was sent to you from: $name - $myUser - $userIp - $currentTime";
							 		
		if($twitter_active == 1) { 
		
			$twitter_msg = $name . " - " . $message . ". You can contact " . $name . " via email ats " . $email . ".";
			twittermessage($twitter_user, $twitter_msg, $consumer_key, $consumer_secret, $token, $secret);
		
		}
		
		$msg = wordwrap( $msg, 70 );
         
        $headers = "From: $email" . PHP_EOL;
		$headers .= "Reply-To: $email" . PHP_EOL;
		$headers .= "MIME-Version: 1.0" . PHP_EOL;
		$headers .= "Content-type: text/plain; charset=utf-8" . PHP_EOL;
		$headers .= "Content-Transfer-Encoding: quoted-printable" . PHP_EOL;

        if(mail($address, $e_subject, $msg, $headers)) {
		
		 echo "Success! Message sent.";
		 		 
		 } else {
		 
		 echo 'ERROR!'; // Dont Edit.
		 
		 }
                      
	}
	
function twittermessage($user, $message, $consumer_key, $consumer_secret, $token, $secret) { // Twitter Direct Message function, do not edit.
	
	require_once('twitter/EpiCurl.php');
    require_once('twitter/EpiOAuth.php');
    require_once('twitter/EpiTwitter.php');

	$Twitter = new EpiTwitter($consumer_key, $consumer_secret);
    $Twitter->setToken($token, $secret);

    $direct_message = $Twitter->post_direct_messagesNew( array('user' => $user, 'text' => $message) );
    $tweet_info = $direct_message->responseText;
    
}

function isEmail($email) { // Email address verification, do not edit.

return(preg_match("/^[-_.[:alnum:]]+@((([[:alnum:]]|[[:alnum:]][[:alnum:]-]*[[:alnum:]])\.)+(ad|ae|aero|af|ag|ai|al|am|an|ao|aq|ar|arpa|as|at|au|aw|az|ba|bb|bd|be|bf|bg|bh|bi|biz|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|com|coop|cr|cs|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|edu|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gh|gi|gl|gm|gn|gov|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|in|info|int|io|iq|ir|is|it|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|mg|mh|mil|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|museum|mv|mw|mx|my|mz|na|name|nc|ne|net|nf|ng|ni|nl|no|np|nr|nt|nu|nz|om|org|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|pro|ps|pt|pw|py|qa|re|ro|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)$|(([0-9][0-9]?|[0-1][0-9][0-9]|[2][0-4][0-9]|[2][5][0-5])\.){3}([0-9][0-9]?|[0-1][0-9][0-9]|[2][0-4][0-9]|[2][5][0-5]))$/i",$email));
		
}
?>