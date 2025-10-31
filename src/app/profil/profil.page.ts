import { Component, OnInit } from '@angular/core';
import { UserService, UserProfile } from '../services/user.service';

@Component({
  selector: 'app-profil',
  templateUrl: 'profil.page.html',
  styleUrls: ['profil.page.scss'],
  standalone: false,
})
export class ProfilPage implements OnInit {
  me?: UserProfile;

  constructor(private readonly usersApi: UserService) {}

  ngOnInit(): void {
    this.usersApi.getMe().subscribe((u) => (this.me = u));
  }
}


