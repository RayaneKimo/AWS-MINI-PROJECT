//Importing the integrated https module from Node.js and avoid any other extra dependencies
import https from "https";

export const handler = async (event) => {
  //import the webhook path from ENV
  let webhook_path = process.env.SLACK_WEBHOOK_PATH;

  const affect_color = (severity) => {
    return parseInt(severity) < 4
      ? "#0CD2CA"
      : parseInt(severity) < 7
      ? "#f3f742"
      : "#f01c1c";
  };

  try {
    // Check if the event contains any records
    if (event.Records && event.Records.length > 0) {
      // Process each SNS record and affect a severnity color
      for (const record of event.Records) {
        // Extract the SNS message from the record
        const snsMessage = record.Sns.Message;

        // The message is transmitted as a string throw the web so we have to parse it into an object
        const guardDutyFinding = JSON.parse(snsMessage);

        const Finding_detail = guardDutyFinding.detail;

        let color = affect_color(Finding_detail.severity);

        // Prepare the message to send it to Slack
        const message = {
          text: "GuardDuty Finding Detected !",
          attachments: [
            {
              color: color,
              title: "GuardDuty Finding Details",
              fields: [
                {
                  title: "Title",
                  value: Finding_detail.title,
                },
                {
                  title: "Description",
                  value: Finding_detail.description,
                },
              ],
            },
          ],
        };

        // Convert the message to JSON payload
        const payload = JSON.stringify(message);

        //Configuring the request options for the Slack webhook
        const options = {
          method: "POST",
          hostname: "hooks.slack.com",
          path: webhook_path,
          headers: {
            "Content-Type": "application/Cloud&SecurityProject",
            "Content-Length": payload.length,
          },
        };

        // Define the request
        const req = https.request(options, (res) => {
          //we add the request options that define the destination and the type. Adding to that a callback wich will be fired as a response is received
          let body = "";

          res.setEncoding("utf8");
          res.on("data", (chunk) => {
            // 'data' event called to gather the message chunks into one msg
            body += chunk;
          });
          res.on("end", () => {
            // 'end' event called when the message is sended to slack
            console.log("Message sent to Slack!");
          });
        });

        req.write(payload); // now as we define our request we send it with an incorporated payload (findings)
        req.end(); // signal the end of the request
      }
    }
  } catch (error) {
    // catch the error occured during the try

    console.error("Error processing SNS event:", error);
    throw error;
  }
};
