# AWS Serverless Node.Js Typescript Sample Project

This is an example of a project for a Flight Air company built using part of the technology stack that I use throughout my career where the main objective is to compose my portfolio and demonstrate a bit of my professional experience. Focused on a `Cloud Native` Rest API, the project leverages `AWS` Services with a strong emphasis on `Serverless` Architecture. To achieve this, the foundation is built upon the `Serverless Framework` with custom `AWS Cloud Formation` sections to complete provide infrastructure as code. Feel free to contact and check other projects in my portfolio here at [Github profile](https://github.com/felipeoriani) page.

### Stack

<table align=center border=0 width=100%>
  <tr>
    <td align=center valign=bottom><img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" alt="Node.Js" width=125 height="auto" /><br/>Node.Js</td>
    <td align=center valign=bottom><img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" alt="Typescript" width=125 height="auto" /><br/>Typescript</td>    
    <td align=center valign=bottom><img src="https://cdn.worldvectorlogo.com/logos/aws-dynamodb.svg" alt="AWS DynamoDB" width=125 height="auto" /><br/>AWS DynamoDB</td>    
  </tr>
  <tr>
    <td align=center valign=bottom><img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="Amazon Web Services" width=125 height="auto" /><br/>Amazon Web Services</td>
    <td align=center valign=bottom><img src="https://user-images.githubusercontent.com/2752551/30405068-a7733b34-989e-11e7-8f66-7badaf1373ed.png" alt="Serverless" width=125 height="auto" /><br/>Serverless Framework</td>
    <td align=center valign=bottom><img src="https://cdn.worldvectorlogo.com/logos/aws-cloudformation.svg" alt="AWS Cloud Formation" width=125 height="auto" /><br/>AWS Cloud Formation</td>
  </tr>
  <tr>
    <td align=center valign=bottom><img src="https://cdn.worldvectorlogo.com/logos/aws-api-gateway.svg" alt="AWS API Gateway" width=125 height="auto" /><br/>AWS API Gateway</td>
    <td align=center valign=bottom><img src="https://cdn.worldvectorlogo.com/logos/aws-lambda.svg" alt="AWS Lambda" width=125 height="auto" /><br/>AWS Lambda</td>    
    <td align=center valign=bottom><img src="https://cdn.worldvectorlogo.com/logos/aws-sqs.svg" alt="AWS SQS" width=125 height="auto" /><br/>AWS SQS</td>
  </tr>
</table>

### Architecture

#### Rest API

The architecture consists in a serverless Rest API using Serverless Framework within the AWS as Cloud Provider. Through an `API Gateway`, `Lambdas` receive a request, process it and return a message to the `API Gateway` which responds to clients using the `HTTP` protocol. All the data is persisted into a `AWS DynamoDB` table which is defined on the serverless yml file. In the future, there will be a `Flight` notification via `SQS Queue` for each `Passenger` when it is open to _Check-in_ action.

<p align=center>
  <img src="docs/rest-api-diagram.svg" alt="Architecture Diagram for Flight Service" />
</p>

#### Events

There is an in progress event series that for every `x` minutes in order to notify all the passengers that have a scheduled flight for the next `x` hours. Check the following diagram for the events.

<p align=center>
  <img src="docs/events-diagram.svg" alt="Event Diagram for Flight Service" />
</p>

#### Code Architecture

The code presents a [Layered Architecture](https://www.oreilly.com/library/view/software-architecture-patterns/9781491971437/ch01.html) using `Node.Js` and `Typescript` which will be transpiled to `Javascript` as the main language of the Node.Js runtime. It contains an `Domain Layer` where keep the domain of the project including Flight and Passengers and abstractions for storage and business rules. Then we have the `Infrastructure Layer` to maintain all the code related to I/O bound operations specially network calls such as cloud services implementations which includes database, queues, cloud services, external services, etc. And finally we have the `Application Layer` which is responsable to hold the business rules.

All the layers are in the low coupling to be able to future change the implementation so each component depends on abstractions instead concrete types. It also make our tests easy to simulate some behaviour we may want to test using Mocks. In the code, you can find it under the `./src/core` folder like the image bellow:

<p align=center>
<img src="docs/code-architecture.png" />
</p>

### Tests

There are a few unit tests in progress to cover the main business rules on the application layer of the project. It is implemented on the top of native `Node Test Runner` and to run it locally, you can run `yarn test` or `npm test`.

<p align=center>
<img src="docs/test-results.png" width="450" />
</p>
