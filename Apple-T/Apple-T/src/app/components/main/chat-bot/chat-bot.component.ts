import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent implements OnInit{
  @ViewChild('chatbotWrapper') chatbotWrapper!: ElementRef;
  @ViewChild('messageBox') messageBox!: ElementRef;
  

  userTypedMessage: string = '';
  API_URL: string = "https://api.openai.com/v1/chat/completions";
  API_KEY: string = "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";

  public role:string = "";
  public n : string = "none";
  public m : string = "block";

  constructor(
    private http: HttpClient,
    private api:ApiService,
    private userStore:UserStoreService,

  ) {}
  ngOnInit(): void {
    this.userStore.getRoleFromStore().subscribe(res => {
      let roleFromToken = this.api.getRoleFromToken();
      this.role = res || roleFromToken;

      if(this.role != undefined){
        this.m = "none";
        this.n = "block";
      }
    })
  }

  scrollToBottom() {
    try {
      this.messageBox.nativeElement.scrollTop = this.messageBox.nativeElement.scrollHeight;
    } catch(err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  openChatbot() {
    const chatbotWrapper = document.querySelector('.chatbot-wrapper') as HTMLElement;
    if (chatbotWrapper) {
      chatbotWrapper.style.display = 'block';
    }
  }
  
  closeChatbot() {
    const chatbotWrapper = document.querySelector('.chatbot-wrapper') as HTMLElement;
    if (chatbotWrapper) {
      chatbotWrapper.style.display = 'none';
    }
  }

  sendMessage() {
    if (this.userTypedMessage.length > 0) {
      let message =
        `<div class="chat message" style= "justify-content: flex-end; text-align: right; padding: 10px;">
          <span 
          style="background-color: rgb(67 0 86); 
          color: #fff;
          padding: 5px 10px;
          border-radius: 10px;
          display: inline-block; ">${this.userTypedMessage}</span>
        </div>`;

      let response =
        `<div class="chat response" 
        style = "justify-content: flex-start;
        text-align: left;
        padding: 10px; display: flex;">
          <img src="assets/img/helpuser.png">
          <span style = "background-color: #dadee1; 
          color: #000000;
          padding: 5px 10px;
          border-radius: 10px;
          display: inline-block;" 
          class="new">...</span>
        </div>`;

      this.messageBox.nativeElement.insertAdjacentHTML("beforeend", message);
      let userMessage : string = '';
      userMessage = this.userTypedMessage;
      this.userTypedMessage = '';
      setTimeout(() => {
        this.scrollToBottom();
        this.messageBox.nativeElement.insertAdjacentHTML("beforeend", response);
        const requestOptions = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.API_KEY}`
          })
        };
        this.http.post<any>(this.API_URL, {
          "model": "gpt-3.5-turbo",
          "messages": [{ "role": "user", "content": userMessage,}],        
        }, requestOptions)
          .subscribe(data => {
            this.userTypedMessage = '';
            const chatBotResponse = document.querySelector(".response .new")!;
            chatBotResponse.innerHTML = data.choices[0].message.content;
            chatBotResponse.classList.remove("new");
            this.scrollToBottom();
          }, error => {
            console.error('Error:', error);
            const chatBotResponse = document.querySelector(".response .new")!;
            chatBotResponse.innerHTML = "Oops! An error occurred. Please try again.";
          });
      }, 100);
    }
  }
}
