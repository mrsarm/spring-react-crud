React.js and Spring Data REST - CRUD
====================================

CRUD application with security enabled: a PoC with
ReactJS in the frontend and Spring Data REST in the backend.

> ⚠️ **_NOTE:_**  Work in Progress, there is nothing useful yet.

Based in the source code here: https://github.com/spring-guides/tut-react-and-spring-data-rest ,
but not yet implemented basic modules.

Guide: https://spring.io/guides/tutorials/react-and-spring-data-rest

The **goal** is to learn better how to use React, and complete the guide but
improving the original code with the following changes and features:

- [ ] Make it more appealing, using Bootstrap / HTML5, using React components
      from a 3ty party library, maybe [reactstrap](https://reactstrap.github.io/).
- [ ] The original application makes a lot of unnecessary requests to only show
      the paginated results (2 initial requests + 1 request * number of items
      in the page), that should be narrowed to just one request.
- [X] Replace the depreacted library [rest.js](https://github.com/cujojs/rest) that
      also does not support standard promises by a modern HTTP client:
      [Axios](https://github.com/axios/axios)
- [X] Add a REST browser for development purpose: HAL Browser
- [ ] Add more features, specially to handle users ...


Usage
-----

Launch the application with:

    $ mvn spring-boot:run

Or use `./mvnw` instead of `mvn` (`mvnw.cmd` for Window platforms).

Then access the application with http://localhost:8080/, or access
to the API with http://localhost:8080/api/

To edit Javascript or CSS resources and see the changes in the
browser without the need to re-launch the appliation, execute within
a command line:

    $ target/node/npm run watch

And leave it running.

About
-----

**Source code**: https://github.com/mrsarm/spring-react-crud

**Authors**:
* Mariano Ruiz <mrsarm@gmail.com>

**Original Authors**:
* Greg Turnquist (Pivotal)
* Pivotal committers and other contributors

2015-2019  |  Apache-2.0

