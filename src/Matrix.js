import matrixcs, { MemoryStore } from "matrix-js-sdk";
import config from './config.json';

class Matrix {
  constructor() {
    const myUserId = localStorage.getItem("mx_user_id");
    const myAccessToken = localStorage.getItem("mx_access_token");

    this.matrixClient = new matrixcs.createClient({
      baseUrl: config.baseUrl,
      accessToken: myAccessToken,
      userId: myUserId,
      useAuthorizationHeader: true,
      timelineSupport: true,
      unstableClientRelationAggregation: true,
      store: new MemoryStore({ localStorage }),
    });
  }

  // @TODO Replace all calls of this with custom Matrix.function() wrapper functions for all calls that we make use of
  getMatrixClient() {
    return this.matrixClient;
  }

  login(user, password) {
    return this.matrixClient.login('m.login.password', {
      "type": "m.login.password",
      "user": user,
      "password": password
    }).then((response) => {
      localStorage.setItem('mx_access_token', response.access_token);
      localStorage.setItem('mx_home_server', response.home_server);
      localStorage.setItem('mx_hs_url', response['well_known']['m.homeserver']['base_url']);
      localStorage.setItem('mx_user_id', response.user_id);
      localStorage.setItem('mx_device_id', response.device_id);
    }).catch((error) => {
      throw error;
    });
  }
}

export default new Matrix();