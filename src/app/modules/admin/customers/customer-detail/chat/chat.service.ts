import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Chat, Contact, Profile } from "./chat.types";
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from "rxjs";
import { environment } from "environments/environment";

@Injectable({ providedIn: "root" })
export class ChatService {
  public _chat: BehaviorSubject<Chat> = new BehaviorSubject(null);
  private _chats: BehaviorSubject<Chat[]> = new BehaviorSubject(null);
  private _contact: BehaviorSubject<Contact> = new BehaviorSubject(null);
  private _contacts: BehaviorSubject<Contact[]> = new BehaviorSubject(null);
  private _profile: BehaviorSubject<Profile> = new BehaviorSubject(null);

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for chat
   */
  get chat$(): Observable<Chat> {
    return of({});
  }

  /**
   * Getter for chats
   */
  get chats$(): Observable<Chat[]> {
    return of([]);
  }

  /**
   * Getter for contact
   */
  get contact$(): Observable<Contact> {
    return this._contact.asObservable();
  }

  /**
   * Getter for contacts
   */
  get contacts$(): Observable<Contact[]> {
    return this._contacts.asObservable();
  }

  /**
   * Getter for profile
   */
  get profile$(): Observable<Profile> {
    return this._profile.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get chats
   */
  getChats(): Observable<any> {
    return of({});
  }

  /**
   * Get chat
   *
   * @param id
   */
  getChatById(id: Number): Observable<any> {
    return this._httpClient.get(environment.analyticsUrl + "/customer_insights/" + id + "/history/").pipe(
      map((history: any) => {
        // Update the chat
        var charts = [];
        if (!history || !history.length) {
          var start = {
            id: "0",
            chatId: id.toString(),
            contactId: id.toString(),
            isMine: false,
            value: "How can I help?",
            createdAt: new Date(),
          };

          charts.push(start);
        }

        history.forEach((element) => {
          var q = {
            id: "0",
            chatId: id.toString(),
            contactId: id.toString(),
            isMine: true,
            value: element.question,
            createdAt: new Date(element.datetime),
          };

          charts.push(q);

          var a = {
            id: "0",
            chatId: id.toString(),
            contactId: id.toString(),
            isMine: false,
            value: element.answer,
            createdAt: new Date(element.datetime),
          };

          charts.push(a);
        });

        const chat = {
          id: id,
          contactId: id.toString(),
          contact: {},
          unreadCount: 0,
          muted: false,
          lastMessage: "",
          lastMessageAt: new Date(),
          messages: charts,
        };

        //return of(chat);

        // Return the chat
        return chat;
      }),
      switchMap((chat) => {
        if (!chat) {
          return throwError("Could not found chat with id of " + id + "!");
        }

        return of(chat);
      })
    );
  }

  /**
   * Update chat
   *
   * @param id
   * @param chat
   */
  sendMessage(query: String, id: Number): Observable<any> {
    return this._httpClient.post(environment.analyticsUrl + "/customer_insights/", {
      id: id,
      query: query,
    });
  }

  /**
   * Reset the selected chat
   */
  resetChat(): void {
    this._chat.next(null);
  }
}
