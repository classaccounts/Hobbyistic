import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  providers: [UserService]
})
export class SignUpComponent implements OnInit {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(public userService: UserService) { }

  onSignup(form: NgForm){
    if(form.invalid){
      return;
    }
    this.userService.CreateUser(form.value.name, form.value.email, form.value.password);
  }

  ngOnInit(): void {
  }

}
