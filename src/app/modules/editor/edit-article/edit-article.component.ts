import { DialogService } from './../../../services/dialog.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiClientService } from 'src/app/services/api-client.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss'],
})
export class EditArticleComponent implements OnInit {
  public newArticle!: FormGroup;
  public listArticles!: any;
  public errorTitle!: string;

  constructor(
    public fb: FormBuilder,
    public apiService: ApiClientService,
    public route: Router,
    public userService: UserService,
    public dialogService: DialogService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.checkLogin();
    this.newArticle = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      body: ['', Validators.required],
      tag: '',
    });
  }

  checkLogin(): boolean {
    const token: string | null = this.authService.getToken();
    if (token) return true;
    else {
      const url = this.route.url;
      this.authService.redirectUrl = url;
      this.route.navigate(['/auth']);
      return false;
    }
  }

  createArticle() {
    if (!this.checkLogin()) return;
    let tagString = this.newArticle.controls['tag'].value;
    let tagArr: string[] = tagString.split('#');
    tagArr = tagArr.filter((item) => item !== '');

    let body = {
      article: {
        title: this.newArticle.controls['title'].value,
        description: this.newArticle.controls['description'].value,
        body: this.newArticle.controls['body'].value,
        tagList: tagArr,
      },
    };
    this.apiService.createArticle(body).subscribe({
      next: (res) => {
        this.route.navigate(['/editor/article', res.article.slug]);
      },
      error: (error) => {
        // console.log(error.error.errors.title[0]);
        this.errorTitle = error.error.errors.title[0];
      },
    });
  }
}
