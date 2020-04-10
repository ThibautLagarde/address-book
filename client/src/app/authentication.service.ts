import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface UserDetails {
  _id: string;
  name: string;
  age: string;
  family: string;
  diet: string;
  _friends: Array<string>;
  exp: number;
  iat: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  name?: string;
  password?: string;
  age?: string;
  family?: string;
  diet?: string;
  _friends?: Array<string>;
}

@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  private token: string;

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string): void {
    localStorage.setItem("mean-token", token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem("mean-token");
    }
    return this.token;
  }

  private request(
    method: "post" | "get" | "put",
    type: "login" | "register" | "profile" | "profile/update" | "users" | "addFriend" | "removeFriend",
    user?: TokenPayload
  ): Observable<any> {
    let base$;
  
    if (method === "post") {
      base$ = this.http.post(`/api/${type}`, user);

    } else if (method === "put") {
      base$ = this.http.put(`/api/${type}`, user, {
        headers: { Authorization: `Bearer ${this.getToken()}` }
      });

    } else {
      base$ = this.http.get(`/api/${type}`, {
        headers: { Authorization: `Bearer ${this.getToken()}` }
      });
    }
  
    const request = base$.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );
  
    return request;
  }  

  public logout(): void {
    this.token = "";
    window.localStorage.removeItem("mean-token");
    this.router.navigateByUrl("/");
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split(".")[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  public register(user: TokenPayload): Observable<any> {
    return this.request("post", "register", user);
  }
  
  public login(user: TokenPayload): Observable<any> {
    return this.request("post", "login", user);
  }
  
  public profile(): Observable<any> {
    return this.request("get", "profile");
  }

  public profileUpdate(user: TokenPayload): Observable<any> {
    return this.request("put", "profile/update", user);
  }

  public getAllUsers(): Observable<any> {
    return this.request("get", "users");
  }
  
  public addFriend(user: TokenPayload): Observable<any> {
    return this.request("put", "addFriend", user);
  }

  public removeFriend(user: TokenPayload): Observable<any> {
    return this.request("put", "removeFriend", user);
  }
  
}