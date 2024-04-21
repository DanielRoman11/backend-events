# Event API | Documentation
## Introduction
<p>EventAPI is a versatile and user-friendly API designed to facilitate event management. It provides endpoints for creating, attending, and filtering events, as well as retrieving upcoming events based on the current date.</p>

### Features
<ul>
  <li>Event Creation: Easily create new events with detailed information such as title, description, date, location, and more.</li>
  <li>Attendee Management: Allow users to RSVP to events, indicating whether they will attend, might attend, or decline.</li>
  <li>Event Filtering: Filter events based on various criteria such as date, location, category, and more, to find events tailored to specific preferences.</li>
  <li>Upcoming Events: Retrieve a list of upcoming events based on the current date, providing users with a glimpse of what's happening soon.</li>
</ul>

## Getting Started
To get started with the project, you have two options. The first option is to have run NodeJs locally in a version equal to or higher than version 20 and set up a MySql database, everything in this option is on you. This project uses Docker so it is recommended that it is installed on your machine either locally or via WSL.

### Setup
<ol>
  <li>
    <p>Clone the repository on your local machine</p>
    
    $ git clone https://github.com/DanielRoman11/backend-events.git
  </li>
  <li>
    <p>Navigate to the project folder</p>
    
     $ cd <project-directory>
  </li>
</ol>
   
### Docker Project Installation
There is already a default configuration that works perfectly for you Dockerfiles, but you can always experiment with the options offered by the Docker. Personally I prefer to use `pnpm` and you may prefer `bun` or `npm` itself, so this is up to you.

> [!IMPORTANT]
> It may seem obvious and redundant, but you must have Docker installed.

#### Docker Compose
You just have to run the following commands.

> [!WARNING]
> I highly recommend install it using `npm i -g pnpm`. If you don't have this dependencie install, you might experiment some problems.

<ol>
  <li>Install the project via docker compose</li>

    # First Time
    $ docker compose -f docker-compose.dev.yml up --build
  <li><strong>Only if you have everything setup</strong>. This point is just for running the project withouth building everything again</li>

    $ docker compose -f docker-compose.dev.yml up
</ol>

### Usage
<p>EventAPI offers a simple yet powerful interface, allowing developers to integrate event management functionality seamlessly into their applications. Use the provided endpoints to perform various actions related to event management.</p>

> [!TIP]
> All endpoints are documented on `/api`.

#### Running the app
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

#### Test
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

Once the project is up and running, you can access it at `http://localhost:3000` in your web browser.

## Support
Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License
Nest is [MIT licensed](LICENSE).

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest