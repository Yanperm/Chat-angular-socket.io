import {
  Component,
  OnInit
} from '@angular/core';
import {
  WebSocketService
} from './web-socket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  public online: number = 0;
  public client: object;
  public clientname: string;
  public message: string = '';
  public clients: Array<object> = [];
  public messages: Array<object> = [];

  public btnChangeClient: boolean = true;

  /**
   * constructor
   * @param webSocketService
   */
  constructor(
    private webSocketService: WebSocketService
  ) {
    //
    Swal.fire({
      title: 'Enter Name!',
      input: 'text',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!'
        }
      },
      inputPlaceholder: 'Enter Name',
      showConfirmButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Enter',
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        this.client = {
          id: this.makeid(5),
          name: result.value
        };
        this.clients.push(this.client);
        this.online++;
        this.webSocketService.emit('joinClient', this.client);
        console.log('ID: ' + this.client['id'] + '\tClient Name: ' + this.client['name']);
      }
    });
  }

  ngOnInit() {
    // Event "responseMessage"
    this.webSocketService.listen('responseMessage')
      .subscribe((message: any): void => {
        console.log('Response Message: ' + message);
        this.messages.push(message);
      });
    // Event "newClient"
    this.webSocketService.listen('newClient')
      .subscribe((client: any): void => {
        console.log('New Client: ' + client.name);
        this.clients.push(client);
      });
    // Event "clientOnline"
    this.webSocketService.listen('clientOnline')
      .subscribe((client_log: any): void => {
        console.log('Client Online: ' + client_log.name);
        this.clients = client_log;
      });
  }

  /**
   * function "changeClientName"
   */
  changeClientName(): void {
    this.client['name'] = this.clientname;
    console.log(`Change Name: ${this.client['name']} => ${this.clientname}`);
    this.webSocketService.emit('changeName', this.client);
  }

  toggleDisplay() {
    this.btnChangeClient = !this.btnChangeClient;
  }

  /**
   * function "sendMessage"
   */
  sendMessage(): void {
    console.log('Send Message: ' + this.message);
    let msg = {
      id: this.client['id'],
      message: this.message,
      name: this.client['name']
    }
    this.webSocketService.emit('sendMessage', msg);
    this.messages.push(msg);
    this.message = '';
  }

  /**
   * function "makeid"
   * @param length
   */
  private makeid(length: number): string {
    let result: string = '';
    let characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength: number = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /**
   * function "searchIndex"
   * @param array
   * @param search
   */
  private searchIndex(array: Array<string>, search: string): number {
    let isLargeNumber = (element) => element.id == search;
    return array.findIndex(isLargeNumber);
  }
}
