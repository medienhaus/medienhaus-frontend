<img src="public/favicon.svg" width="70" />

### medienhaus/

Berlin University of the Arts’ free and open-source environment for digital learning, teaching, and collaboration.

[Concept Paper](https://medienhaus.dev/) | [Twitter](https://twitter.com/medienhaus_)

<br>

# medienhaus-frontend

This repository contains the code for the **medienhaus/** landing hub, which is designed to intuitively introduce all participants to the paradigm of federated communication through the modern technology our platform is built around.

Our landing hub itself is written in JavaScript, we're using the React framework. This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Also make sure to check out the [medienhaus-backend](https://github.com/medienhaus/medienhaus-backend) repository, which is required for certain functionalities like handling form submissions by users to request support or the creation of rooms and accounts.


## Development

### Installation

#### `npm install`

Installs all of the application's dependencies.

### Configuration

Configuration happens via environment variables. To start developing locally just copy the supplied `.env.local.example` file to `.env.local` and adjust the values of the variables to your liking. Check the `.env` file for more available variables, which you can also then modify in your `.env.local` file.

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the hub in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

#### `npm run build`

Builds the hub for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started). To learn React, check out the [React documentation](https://reactjs.org/).
