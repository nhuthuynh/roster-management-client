const dev = {
    s3: {
      BUCKET: ""
    },
    apiGateway: {
      URL: "http://localhost:8080"
    }
  };
  
  const prod = {
    s3: {
      BUCKET: "cems-client"
    },
    apiGateway: {
      URL: "http://cems.ap-southeast-2.elasticbeanstalk.com"
    }
  };
  
  const config = process.env.REACT_APP_STAGE === 'production'
    ? prod
    : dev;
  
  export default {
    // Add common config values here
    MAX_ATTACHMENT_SIZE: 5000000,
    ...config
  };