import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { User } from './user.model';
import { Hobby } from './hobby.model';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  selectedUser: User = {
    name: '',
    email: '',
    password: ''
  };
  constructor(private http: HttpClient, private router: Router) { }

  CreateUser(name: string, email: string, password: string){
    const user: User = {name:name, email: email, password: password}
    this.http.post("http://localhost:3000/api/register", user)
    .subscribe(response =>{
      console.log(response);
      this.router.navigate(['/login']);
    })
  }

  AuthenticateUser(name: string, email: string, password: string) {
    const user: User = {name:name, email: email, password: password}
    this.http.post("http://localhost:3000/api/login", {user})
    .subscribe(response =>{
      console.log(response)
      var token = [JSON.stringify(response)][0].slice(18, [JSON.stringify(response)][0].length - 3)
      console.log(token)
      localStorage.setItem('token', token)
      // this.router.navigate(['/main']);
    })
  }

  AddHobby(name: string) {
    const hobby: Hobby = {name:name}
    this.http.post("http://localhost:3000/api/hobby", {hobby})
    .subscribe(response =>{
      console.log(response);
      this.router.navigate(['/main']);
    })
  }
}
