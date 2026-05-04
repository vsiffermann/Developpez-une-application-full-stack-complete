import { Component, inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { PostsActions } from '../../../store/posts/posts.actions';
import { TopicsActions } from '../../../store/topics/topics.actions';
import { selectPostsLoading, selectPostsError } from '../../../store/posts/posts.selectors';
import { selectTopics } from '../../../store/topics/topics.selectors';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    NavbarComponent,
  ],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss',
})
export class CreatePostComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly location = inject(Location);

  readonly topics$ = this.store.select(selectTopics);
  readonly loading$ = this.store.select(selectPostsLoading);
  readonly error$ = this.store.select(selectPostsError);

  readonly form = new FormGroup({
    topicId: new FormControl<number | null>(null, [Validators.required]),
    title: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.store.dispatch(TopicsActions.loadTopics());
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const { topicId, title, content } = this.form.value;
    this.store.dispatch(PostsActions.createPost({
      topicId: topicId!,
      title: title!,
      content: content!,
    }));
  }
}
