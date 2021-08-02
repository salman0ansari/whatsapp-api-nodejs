# API Docs
## Auth

> All endpoints requires API-Key
	> - Pass API-Key in to Headers
	 ```If not passed, returns "Unauthorised" message.```
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


Sending Images
``POST : /chat/sendimage/<phone_number>``
> Request Body
> - image - contains the base64 encoded / URL of image to be sent
> - caption - (optional) - contains caption for the message

## Contact

Get Profile Pic
``GET : /contact/getprofilepic/<phone_number>``
> Returns URL of the User's Profile Picture if Privacy Settings isn't Private


###  Example Usage

> In Node.js axios

```javascript
const axios = require('axios');
axios.post('http://localhost:5000/chat/sendmessage/919999999991', message="this is a test",{
headers : {"API-Key":  "xf4pBcl2hYfbccjnaYvKLyDAndr8p1LP",
"Content-Type":  "application/x-www-form-urlencoded; charset=utf-8"}
}).then(response =>  {
console.log(response);
}).catch(error =>  {
console.log(error);
})
```

> In Python

```python
import requests

url = 'http://localhost:5000/chat/sendmessage/919999999991'
headers = {
  'API-Key': 'xf4pBcl2hYfbccjnaYvKLyDAndr8p1LP',
  'Content-Type': 'application/x-www-form-urlencoded'
}
data = [('message', 'this is a test')]
response = requests.request(
  'POST',
  'http://localhost:5000/chat/sendmessage/919999999991',
  data=data,
  headers=headers,
)
print(response)
```
