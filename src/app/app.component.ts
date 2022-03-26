import { ApiClientService } from 'src/app/services/api-client.service';
import { AuthService } from './services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'bubbler';
  constructor(
    public AuthService: AuthService,
    private ApiClientService: ApiClientService
  ) {
    const token: string | null = AuthService.getToken();
    if (token) {
      this.ApiClientService.getUser().subscribe((res) => {
        AuthService.isLoggedIn = true;
      });
    }
  }

}
