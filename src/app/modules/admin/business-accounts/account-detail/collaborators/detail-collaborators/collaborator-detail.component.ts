import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatDrawer } from "@angular/material/sidenav";
import { FuseNavigationItem } from "@fuse/components/navigation";

@Component({
  selector: "collaborator-detail",
  templateUrl: "./collaborator-detail.component.html",
  styles:[]
})
export class CollaboratorDetailComponent implements OnInit {
  @ViewChild("matDrawer", { static: true }) matDrawer: MatDrawer;
  screenWidth:number=window.innerWidth;
  drawerOpened: boolean = true;
  menuData: FuseNavigationItem[];

  constructor(public dialog: MatDialog) {
    this.menuData = [
      {
        id: "collaborator",
        title: "Users",
        type: "group",
        children: [
          {
            id: "collaborator.detail",
            title: "Basic Details",
            type: "basic",
            link: "basic",
          },
          {
            id: "collaborator.roles",
            title: "Roles",
            type: "basic",
            link: "roles",
          },
        ],
      },
    ];
  }

  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;

  ngOnInit() {

  }
}
