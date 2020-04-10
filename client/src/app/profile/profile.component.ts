import { Component, OnInit } from "@angular/core";
import { AuthenticationService, UserDetails, TokenPayload } from "../authentication.service";
import { Router } from "@angular/router";

@Component({
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  existingUsers: {};
  details: UserDetails;
  credentials: TokenPayload = {
  };

  constructor(private auth: AuthenticationService, private router: Router) {}

  ngOnInit() {
    this.auth.profile().subscribe(
      user => {
        this.details = user;
      },
      err => {
        console.error(err);
      }
    );

    this.auth.getAllUsers().subscribe(
      users => {
        this.existingUsers = users;
      },
      err => {
        console.error(err);
      }
    );
  }

  update() {
    this.auth.profileUpdate(this.credentials).subscribe(
      () => {
        this.ngOnInit();
      },
      err => {
        console.error(err);
      }
    );
  }

  addFriend() {
    this.auth.addFriend(this.credentials).subscribe(
      () => {
        this.ngOnInit();
      },
      err => {
        console.error(err);
      }
    );
  }

  removeFriend() {
    this.auth.removeFriend(this.credentials).subscribe(
      () => {
        this.ngOnInit();
      },
      err => {
        console.error(err);
      }
    );
  }

}