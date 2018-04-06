import {Component, Input, OnInit} from '@angular/core';

import {MessageModel} from './message.component.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  constructor() { }

  @Input() model = new MessageModel();

  ngOnInit() {
  }

}
