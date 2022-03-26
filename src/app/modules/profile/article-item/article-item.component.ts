import { AuthService } from './../../../services/auth.service';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Article } from './../../../Models';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ApiClientService } from 'src/app/services/api-client.service';

@Component({
  selector: 'app-article-item',
  templateUrl: './article-item.component.html',
  styleUrls: ['./article-item.component.scss'],
})
export class ArticleItemComponent implements OnInit, OnDestroy {
  @Input() article!: Article;
  public isLiked: boolean = false;
  private subject = new Subject<boolean>();
  constructor(private apiClient: ApiClientService, private router: Router, public authService: AuthService) {}

  ngOnInit() {
    if (this.article) {
      this.isLiked = this.article.favorited;
    }

    this.subject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((isLiked) => {
          console.log(isLiked)
          if (isLiked)
            return this.apiClient.favoriteArticle(this.article.slug);
          else return this.apiClient.unfavoriteArticle(this.article.slug);
        })
      )
      .subscribe((res) => {
        // console.log(res);
      });
  }

  public handleActionLike() {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/auth']);
      return;
    }
    this.isLiked = !this.isLiked;
    this.subject.next(this.isLiked);
  }

  public handleRoute(username: string) {
    return `/profile/@${username}`;
  }

  ngOnDestroy(): void {
    this.subject.unsubscribe();
  }
}
