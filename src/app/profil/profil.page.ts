import { Component, OnInit } from '@angular/core';
import { UserService, UserProfile } from '../services/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profil',
  templateUrl: 'profil.page.html',
  styleUrls: ['profil.page.scss'],
  standalone: false,
})
export class ProfilPage implements OnInit {
  me?: UserProfile;

  constructor(
    private readonly usersApi: UserService,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.usersApi.getMe().subscribe((u) => (this.me = u));
  }

  onBuyCoins(): void {
    console.log('Acheter des pièces');
    // TODO: Implémenter l'achat de pièces
  }

  openSettings(): void {
    console.log('Ouvrir les paramètres');
    // TODO: Implémenter l'ouverture des paramètres
  }

  openNotifications(): void {
    console.log('Ouvrir les notifications');
    // TODO: Implémenter l'ouverture des notifications
  }

  openHelp(): void {
    console.log('Ouvrir l\'aide');
    // TODO: Implémenter l'ouverture de l'aide
  }

  async logout(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Déconnexion',
      message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Déconnexion',
          handler: () => {
            console.log('Déconnexion confirmée');
            // TODO: Implémenter la déconnexion
          }
        }
      ]
    });

    await alert.present();
  }
}


