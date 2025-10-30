import { Injectable } from "@angular/core";

import * as Stomp from "sockjs-client";
import * as SockJS from "sockjs-client";
import { AuthService } from "@auth0/auth0-angular";

import AbstractXHRObject from "sockjs-client/lib/transport/browser/abstract-xhr";
import { environment } from "environments/environment";

const _start = AbstractXHRObject.prototype._start;

AbstractXHRObject.prototype._start = function (method, url, payload, opts) {
  if (!opts) {
    opts = { noCredentials: true };
  }
  return _start.call(this, method, url, payload, opts);
};

// MAPS: https://blog.bitsrc.io/google-maps-in-angular-6f9e038182ee
@Injectable({
  providedIn: "root"
})
export class WebSocketService {
  webSocketEndPoint: string = environment.apiUrl + "/ws";
  topic: string = "";
  publish: string = "";
  stompClient: any;
  handleMessage: any;
  token: any;

  constructor(public auth: AuthService) {
    this.auth.idTokenClaims$.subscribe(claims => {
      this.token = claims.__raw;
    });
  }

  init(handleMessage: any, publish: string, topic: string) {
    this.handleMessage = handleMessage;
    this.publish = publish;
    this.topic = topic;
  }

  connect() {
    console.log("Initialize WebSocket Connection", this.token);

    let ws = new SockJS(
      this.webSocketEndPoint + "?Authorization=" + this.token
    );
    this.stompClient = Stomp.over(ws);
    // const _this = this;
    this.stompClient.connect(
      { Authorization: this.token },
      frame => {
        this.stompClient.subscribe(this.topic, sdkEvent => {
          this.onMessageReceived(sdkEvent);
        });
        //_this.stompClient.reconnect_delay = 2000;
      },
      this.errorCallBack
    );
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error) {
    console.log("errorCallBack -> " + error);
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  /**
   * Send message to sever via web socket
   * @param {*} message
   */
  send(message) {
    this.stompClient.send(
      "/app/" + this.publish,
      { Authorization: this.token },
      JSON.stringify(message)
    );
  }

  onMessageReceived(message) {
    console.log("Message Received from Server :: " + message);
    this.handleMessage(JSON.parse(message.body));
  }
}
