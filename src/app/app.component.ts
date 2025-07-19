import { Component, OnInit } from '@angular/core';
import { DoorService } from '../services/door.service';
import { Door } from './models/door';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  public doors: Door[] | undefined;

  constructor(private doorService: DoorService) { }

  public getDoors(): void {
    this.doorService.getDoors().subscribe(
      (response: Door[]) => {
        this.doors = response;
        console.log(this.doors);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  ngOnInit() {
    this.getDoors();
  }

  title = 'doorcenter';
}
