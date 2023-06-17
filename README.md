# GuardDuty Alerting in Slack - Mini Project

## Table of Contents

- [Project Overview](#project-overview)
- [Task1](#Task1)
- [Task2](#Task2)


## Project Overview


## Task1

 - First, in order to establish a communication. I created the `gd-notify` topic so that i can receive simulated findings triggered from the GuardDuty in the specified channel.
 - Second, I create a Cloudwatch rule to monitor GuardDuty findings and route them to the subscribed SNS topic.
 - Then, I created the Lambda function using Node js runtime to fetch and process the findings received from CloudWatch and send them to the Slack group `group-us-west-1` using the Webhook URL.
 - The notification will showcase the title and the description with an associated color reflecting the degree of severity as is it more meaningful to the `Security Team`. Here is an example :

![IMAGE ALT TEXT HERE](Capture.png)

### My lambda function `gd-notify-rayane`
- First, the handler functions is exported as the entry point of the code to be fired. Obviously it would be asynchronous as it handles many HTTP requests.
- We Check if the event contains any records, if so we process each SNS record by parsing its content.
- We encapsulate the title, description and the severity color of the finding into one message.
- We stringify the `message` so that all the properties and values within the object are converted to their JSON string representation. This ensures that the payload sent in the HTTP request body is in the correct format expected by the recipient, in this case, the Slack webhook.
- Then, we configure the request by setting up the options that will define the receiver and the method type with some headers. Adding to that a callback function which will handle the received response from the Slack webhook.
- Finally, we  write the payload data to the request body and just send it.
