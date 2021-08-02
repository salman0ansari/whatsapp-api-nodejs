# API Docs

## Route Chat

Sending Messages 
``POST : /chat/sendmessage/<phone_number>``
> Request Body
> - message - message to be sent


Sending Locations
``POST : /chat/sendlocation/<phone_number>``
> Request Body
> - latitude - string of latitude
> - longitude - string of longitude


Get Chat By Phone Number
``GET : /chat/getchatbyid/<phone_number>``
>Returns a Chat

Get All Chats
``GET : /chat/getchats``
>Returns an Array of all Chats


Sending Images POST :
``/chat/sendimage/<phone_number>``
> Request Body
> - image - contains the base64 encoded / URL of image to be sent
> - caption - (optional) - contains caption for the message

## Contact

Get Profile Pic
``GET : /contact/getprofilepic/<phone_number>``
> Returns URL of the User's Profile Picture if Privacy Settings isn't Private

### Example Usage
```javascript
import axios from "axios";

const options = {
  method: 'POST',
  url: 'http://localhost:5000/chat/sendmessage/919999999999',
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  data: {message: 'this is a test'}
};

axios.request(options).then((response) => {
  console.log(response.data);
}).catch((error) => {
  console.error(error);
});
```
