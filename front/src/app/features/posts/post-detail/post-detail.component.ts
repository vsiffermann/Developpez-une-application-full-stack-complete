import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, DatePipe, Location } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { PostsActions } from '../../../store/posts/posts.actions';
import { selectCurrentPost, selectPostsLoading } from '../../../store/posts/posts.selectors';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    NavbarComponent,
  ],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
})
export class PostDetailComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);

  readonly post$ = this.store.select(selectCurrentPost);
  readonly loading$ = this.store.select(selectPostsLoading);

  readonly commentControl = new FormControl('', [Validators.required]);

  private postId!: number;

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));
    this.store.dispatch(PostsActions.loadPost({ id: this.postId }));
  }

  goBack(): void {
    this.location.back();
  }

  submitComment(): void {
    if (this.commentControl.invalid) return;
    this.store.dispatch(PostsActions.addComment({
      postId: this.postId,
      content: this.commentControl.value!,
    }));
    this.commentControl.reset();
  }
}
