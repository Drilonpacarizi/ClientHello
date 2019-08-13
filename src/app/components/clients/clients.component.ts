import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Client } from '../../models/Client';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  clients: Client[];
  totalOwed: number;
  totalClients: number;
  
  searchterm: string;
  startAt = new Subject();
  endAt = new Subject();

  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();


  firstName;

  constructor(
    private clientService: ClientService,
    private db: AngularFirestore
    
    ) { }

  ngOnInit() {
    this.clientService.getClients().subscribe(clients =>{
      this.clients = clients;
      this.getTotalOwed();
      this.getNumberOfClients();
    });
    // Observable.combineLatest(this.startobs, this.endobs).subscribe((value) => {
    //   this.firequery(value[0], value[1]).subscribe((firstName) =>{
    //     this.firstName = firstName;
    //   });
    // })
  }

  getTotalOwed() {
    this.totalOwed= this.clients.reduce((total, client) => {
      return total + parseFloat(client.balance.toString());
    }, 0);
  }
  search($event) {
    let q = $event.target.value;
    this.startAt.next(q);
    this.endAt.next(q + '\uf8ff');
  }
  firequery(start, end){
    return this.db.collection('users', ref => ref.limit(4).orderBy('firstName').startAt(start).endAt(end)).valueChanges()
    console.log(this.db.collection('users', ref => ref.limit(4).orderBy('firstName').startAt(start).endAt(end)).valueChanges())
  }
  getNumberOfClients() {
    this.totalClients = this.clients.length
    return this.totalClients;
  }
  // getFilterByName() {

  // }

}
