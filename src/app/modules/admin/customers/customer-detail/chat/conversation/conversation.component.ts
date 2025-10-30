import { TextFieldModule } from "@angular/cdk/text-field";
import { DatePipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule } from "@angular/material/sidenav";
import { Router, RouterLink } from "@angular/router";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { ChatService } from "../chat.service";
import { Chat } from "../chat.types";
import { ContactInfoComponent } from "../contact-info/contact-info.component";
import { Subject, buffer, takeUntil } from "rxjs";
import { IconsModule } from "app/core/icons/icons.module";
import { ActivatedRoute } from "@angular/router";
import { SWALMIXIN } from "app/core/services/mixin.service";
import { CustomerDetailComponent } from "../../customer-detail.component";

@Component({
  selector: "chat-conversation",
  templateUrl: "./conversation.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, MatSidenavModule, ContactInfoComponent, MatButtonModule, RouterLink, MatIconModule, MatMenuModule, NgFor, NgClass, NgTemplateOutlet, MatFormFieldModule, MatInputModule, TextFieldModule, DatePipe, IconsModule],
})
export class ConversationComponent implements OnInit, OnDestroy {
  @ViewChild("messageInput") messageInput: ElementRef;
  chat: Chat;
  drawerMode: "over" | "side" = "side";
  drawerOpened: boolean = false;
  id: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  isGettingResponse:boolean=true;

  /**
   * Constructor
   */
  constructor(private _changeDetectorRef: ChangeDetectorRef, private route: Router, private activatedRoute: ActivatedRoute, private _chatService: ChatService, private _fuseMediaWatcherService: FuseMediaWatcherService, private _ngZone: NgZone,) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Decorated methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Resize on 'input' and 'ngModelChange' events
   *
   * @private
   */
  @HostListener("input")
  @HostListener("ngModelChange")
  private _resizeMessageInput(): void {
    // This doesn't need to trigger Angular's change detection by itself
    this._ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        // Set the height to 'auto' so we can correctly read the scrollHeight
        this.messageInput.nativeElement.style.height = "auto";

        // Detect the changes so the height is applied
        this._changeDetectorRef.detectChanges();

        // Get the scrollHeight and subtract the vertical padding
        this.messageInput.nativeElement.style.height = `${this.messageInput.nativeElement.scrollHeight}px`;

        // Detect the changes one more time to apply the final height
        this._changeDetectorRef.detectChanges();
      });
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Chat
    this.getUserChat();
    const id = this.route.url.split(["/"][0]);
    this.id = id[3];

    if (this.id) {
      this.loadChat();
    }
    /* this._chatService.chat$.pipe(takeUntil(this._unsubscribeAll)).subscribe((chat: Chat) => {
      this.chat = chat;
      this._changeDetectorRef.markForCheck();
    });*/

    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$.pipe(takeUntil(this._unsubscribeAll)).subscribe(({ matchingAliases }) => {
      // Set the drawerMode if the given breakpoint is active
      if (matchingAliases.includes("lg")) {
        this.drawerMode = "side";
      } else {
        this.drawerMode = "over";
      }

      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
  }

  getUserChat() {
    this._chatService._chat.subscribe({
      next: (resp) => {
        this.chat = resp;
        this._changeDetectorRef.detectChanges();
      },
    });
  }

  loadChat() {
    this._chatService
      .getChatById(this.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((chat: Chat) => {
        this.chat = chat;
        this._changeDetectorRef.markForCheck();
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Open the contact info
   */
  openContactInfo(): void {
    // Open the drawer
    this.drawerOpened = true;

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Reset the chat
   */
  resetChat(): void {
    this._chatService.resetChat();

    // Close the contact info in case it's opened
    this.drawerOpened = false;

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  sendMessage(): void {
    const query = this.messageInput.nativeElement.value.trim();

    if (!query.length) {
      return;
    }

    this.messageInput.nativeElement.value = "";

    this.chat.messages.push({
      id: new Date().getTime().toString(),
      chatId: this.id.toString(),
      contactId: this.id.toString(),
      isMine: true,
      value: query,
      createdAt: new Date(),
    });

    this.chat.messages.push({
      id: new Date().getTime().toString(),
      chatId: this.id.toString(),
      contactId: this.id.toString(),
      isMine: false,
      value: "Loading.........",
      createdAt: new Date(),
      isLoading:true
    });

    this._chatService.sendMessage(query, this.id).subscribe({
      next: (resp) => {
        this.chat.messages = this.chat.messages.filter(message => !message.isLoading);
        this.chat.messages.push({
          id: new Date().getTime().toString(),
          chatId: this.id.toString(),
          contactId: this.id.toString(),
          isMine: false,
          value: resp,
          createdAt: new Date(),
        });

        this._chatService._chat.next(this.chat);
      },
      error: (err) => {
        this.chat.messages = this.chat.messages.filter(message => !message.isLoading);
        this._chatService._chat.next(this.chat);
        SWALMIXIN.fire({
          icon: "error",
          title: err.error.message || err.message,
        });
      },
    });
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
