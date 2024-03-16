# AWS Serverless Node.Js Typescript Sample Project

This is a sample project using part of the stack I have used to work in my career. In this case, it expose a Cloud Native Rest API using AWS Services and focused on Serverless services. In order to archive it, you can notice it's build on the top of Serverless Framework which is a good tooling to make it easy to design, implement and maintain the infrastructure on the cloud side (AWS in this case).

### Stack

<table align=center border=1 width=100%>
  <tr>
    <td align=center valign=bottom><img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" alt="Node.Js" width="150" height="auto" /><br/>Node.Js</td>
    <td align=center valign=bottom><img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" alt="Typescript" width="150" height="auto" /><br/>Typescript</td>
    <td align=center valign=bottom><img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="Amazon Web Services" width="150" height="auto" /><br/>Amazon Web Services</td>
    <td align=center valign=bottom><img src="https://user-images.githubusercontent.com/2752551/30405069-a7751fee-989e-11e7-9a58-f93f8e820bd1.png" alt="Serverless" width="150" height="auto" /><br/>Serverless Framework</td>
  </tr>
  <tr>
    <td align=center valign=bottom><img src="https://cdn.worldvectorlogo.com/logos/aws-api-gateway.svg" alt="AWS API Gateway" width="150" height="auto" /><br/>AWS API Gateway</td>
    <td align=center valign=bottom><img src="https://cdn.worldvectorlogo.com/logos/aws-lambda.svg" alt="AWS Lambda" width="150" height="auto" /><br/>AWS Lambda</td>
    <td align=center valign=bottom><img src="https://cdn.worldvectorlogo.com/logos/aws-dynamodb.svg" alt="AWS DynamoDB" width="150" height="auto" /><br/>AWS DynamoDB</td>
    <td align=center valign=bottom><img src="https://cdn.worldvectorlogo.com/logos/aws-cloudformation.svg" alt="AWS Cloud Formation" width="150" height="auto" /><br/>AWS Cloud Formation</td>    
  </tr>
</table>

### Architecture

The architecture consists in a serverless Rest API using Serverless Framework within the AWS as Cloud Provider. Through an `API Gateway`, `Lambdas` receive a request, process it and return a message to the `API Gateway` which responds to clients using the `HTTP` protocol. All the data is persisted into a `AWS DynamoDB` table which is defined on the serverless yml file. In the future, there will be a `Flight` notification via `SQS Queue` for each `Passenger` when it is open to _Check-in_ action.

<p align=center>
<img src="docs/diagram.svg" />
</p>
