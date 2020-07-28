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

  public online: number;
  public nickname: string;
  public members: object[] = [];
  public message: string;
  public messages: object[] = [];


  /**
   *
   * @param webSocketService
   */
  constructor(
    private webSocketService: WebSocketService
  ) {
    Swal.fire({
      title: 'Enter Nickname?',
      icon: 'info',
      input: 'text',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!'
        }
      },
      showConfirmButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Enter',
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        this.addNickname(result.value);
      }
    });
  }

  ngOnInit() {
    /**
     * Event listMessage
     */
    this.webSocketService.listen('listMessage')
      .subscribe((message: any) => {
        console.log('List Message: ' + message);
        this.messages.push(message);
      });
    console.log(this.messages);

    /**
     * Event newMember
     */
    this.webSocketService.listen('newMember')
      .subscribe((member: any) => {
        console.log('New Nickname: ' + member);
        this.members.push(member);
      });
    console.log(this.members);

    /**
     * Event userOnline
     */
    this.webSocketService.listen('userOnline')
      .subscribe((online: any) => {
        console.log('Member Online: ' + online);
        this.online = online;
      });
  }

  /**
   * function addNickname
   * @param nickname
   */
  public addNickname(nickname: any): void {
    console.log('New Nickname: ' + nickname);
    let member = {
      id: this.makeid(5),
      name: nickname
    }
    this.nickname = nickname;
    this.members.push(member);
    this.webSocketService.emit('addNickname', member);
  }

  /**
   * function changeNickname
   * @param nickname
   */
  public changeNickname(nickname: any): void {
    console.log('Change Nickname: ' + nickname);
  }

  /**
   * function sendMessage
   */
  public sendMessage(): void {
    console.log('Send Message: ' + this.message);
    let msg = {
      id: this.makeid(5),
      name: this.nickname,
      message: this.message
    }
    this.messages.push(msg);
    this.webSocketService.emit('sendMessage', msg);
    this.message = '';
  }

  /**
   * function makeid
   * @param length
   */
  private makeid(length): string {
    let result: string = '';
    let characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength: number = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  private delmember() {

  }
}
