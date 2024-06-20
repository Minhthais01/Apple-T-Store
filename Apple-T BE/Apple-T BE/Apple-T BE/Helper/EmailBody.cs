namespace Apple_T_BE.Helper
{
    public class EmailBody
    {
        public static string EmailStringBody(string email, string emailToken)
        {
            return $@"<html>
  <head></head>
  <body style=""margin:0; padding: 0;font-family: Arial, Helvetica, sans-serif;"">
    <div style=""height:auto;background: linear-gradient(to top, #c9c9ff 50%, #6e6ef6 90%) no-repeat;width: 400px;padding: 30px;"">
      <div>
        <div>
          <h1>Reset Password Confirm</h1>
          <hr>
          <p>Notification: password reset confirmation from Apple-T Store.</p>
          <p>Please click the button below to Reset Password.</p>
          <a href=""http://localhost:4200/Reset-Password?email={email}&code={emailToken}"" target="""" _blank"" style=""background:#0d6efd;padding:10px;border:none;
            color:white;border-radius:4px;display:block;margin:0 auto;width:50%;text-align:center;text-decoration:none"">Reset Password</a><br>
            
            <p><br><br>
            Apple - T Store</P>
        </div>
      </div>
    </div>

  </body>
</html>";
        }


        public static string NewOrderEmail(int id)
        {
            return $@"<html>
  <head></head>
  <body style=""margin:0; padding: 0;font-family: Arial, Helvetica, sans-serif;"">
    <div style=""height:auto;background: linear-gradient(to top, #c9c9ff 50%, #6e6ef6 90%) no-repeat;width: 400px;padding: 30px;"">
      <div>
        <div>
          <h1>New Order Notification</h1>
          <p>There is a new order, please check the order ID is: {id}</P>   
            <p><br><br>
            Apple - T Store</P>
        </div>
      </div>
    </div>

  </body>
</html>";
        }


        public static string AdminCancelEmail(int id)
        {
            return $@"<html>
  <head></head>
  <body style=""margin:0; padding: 0;font-family: Arial, Helvetica, sans-serif;"">
    <div style=""height:auto;background: linear-gradient(to top, #c9c9ff 50%, #6e6ef6 90%) no-repeat;width: 400px;padding: 30px;"">
      <div>
        <div>
          <h1>Order Notification</h1>
          <p>Your order has been canceled, please check the order ID is: {id}</P>
            <p>Sorry for the inconvenience></P>
            <p><br><br>
            Apple - T Store</P>
        </div>
      </div>
    </div>

  </body>
</html>";
        }

        public static string AdminConfirmEmail(int id)
        {
            return $@"<html>
  <head></head>
  <body style=""margin:0; padding: 0;font-family: Arial, Helvetica, sans-serif;"">
    <div style=""height:auto;background: linear-gradient(to top, #c9c9ff 50%, #6e6ef6 90%) no-repeat;width: 400px;padding: 30px;"">
      <div>
        <div>
          <h1>Order Notification</h1>
          <hr>
          <p>Your order has been confirmed, please check the order ID is: {id}</P>
          <p>Thank you for your trust and purchase at the Apple-T Store.</P>
            <p><br><br>
            Apple - T Store</P>
        </div>
      </div>
    </div>

  </body>
</html>";
        }


        public static string CusCancelEmail(int id)
        {
            return $@"<html>
  <head></head>
  <body style=""margin:0; padding: 0;font-family: Arial, Helvetica, sans-serif;"">
    <div style=""height:auto;background: linear-gradient(to top, #c9c9ff 50%, #6e6ef6 90%) no-repeat;width: 400px;padding: 30px;"">
      <div>
        <div>
          <h1>Order Notification</h1>
          <p>The customer canceled the order, please check the order ID is: {id}</P>
            
            <p><br><br>
            Apple - T Store</P>
        </div>
      </div>
    </div>

  </body>
</html>";
        }
    }
}

