import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  socket: any;
  readonly url: string = 'ws://localhost:3000';

  constructor() {
    this.socket = io(this.url)
  }

  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      })
    });
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  broadcast(eventName: string, data: any) {
    this.socket.broadcast.emit(eventName, data);
  }
}
