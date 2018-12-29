IsAdult
=======
IsAdult is a script that detects whether or not an image is an adult image based on a given image element.

Based on ml5, which is a machine learning framework written in JavaScript with TensorFlow, isAdult aim is to be as
accurate as possible in its detection.

IsAdult is very easy to use, just add the isAdult.js or isAdult.min.js file into your project and you're done!

IsAdult has only one function for now, which is called ```checkAdultImage```. This function should receive one parameter,
this parameter is the ```image``` HTML element where the image is shown. <br> This function will return a promise
so its response should be treated as such using ```then```/```catch``` or ```async```/```await```. <br>
When the promise is resolved, the response object will contain a ```status``` and a ```msg``` properties.<br>
The ```status``` may contain 3 different statuses with a type of integer:
* ```1``` - Image is clear and there is  no risk of adult content shown
* ```2``` - Low risk of adult content in this image
* ```3``` - High risk of adult image showing. With this status the image most likely contains an adult content

The ```msg``` property is the verbal explanation of the status.

In case of an error an object with the following format will be returned:
* ```err``` - Will always have a boolean value of ```true``` (not present in a successful call)
* ```msg``` - Will have a string value of the error message

A few notes before you start:
* It is recommended that the ```<image>``` tag will contain a ```crossorigin="anonymous"``` attribute, especially
if you are dealing with external image sources. Unfortunately, ml5 can not process images from sources that are blocking
cross-origin access.
* the ```<script src="isAdult.js"></script>``` should be placed at the bottom of the body tag and not in the header.
Since this scripts also injects the ml5 script in the HTML, by adding this script to the body it will reserve the
correct hierarchy of the scripts.

Example can be shown in the ```example.html``` file attached to this repository.
<BR>
A live example is also available [here](https://peaceful-badlands-65319.herokuapp.com/)

-----

Created by Shay Kintzlinger :)