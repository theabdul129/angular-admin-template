import { Route, Routes } from "@angular/router";
import { ChatComponent } from "./chat.component";
import { ConversationComponent } from "./conversation/conversation.component";

export const ROUTES: Route[] = [
  {
    path: "",
    component: ChatComponent,
    children: [
      {
        path: "",
        component: ConversationComponent,
      },
    ],
  },
] as Routes;
