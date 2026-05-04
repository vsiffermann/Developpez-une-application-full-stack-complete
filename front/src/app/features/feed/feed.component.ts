import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AsyncPipe, DatePipe, SlicePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { PostsActions } from '../../store/posts/posts.actions';
import { selectFeed, selectPostsLoading, selectSortOrder } from '../../store/posts/posts.selectors';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe,
    DatePipe,
    SlicePipe,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    NavbarComponent,
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent implements OnInit {
  private readonly store = inject(Store);

  readonly posts$ = this.store.select(selectFeed);
  readonly loading$ = this.store.select(selectPostsLoading);
  readonly sortOrder = toSignal(this.store.select(selectSortOrder), { initialValue: 'desc' as const });

  ngOnInit(): void {
    this.store.dispatch(PostsActions.loadFeed({ sort: 'desc' }));
  }

  toggleSort(current: 'asc' | 'desc'): void {
    const next = current === 'desc' ? 'asc' : 'desc';
    this.store.dispatch(PostsActions.setSortOrder({ sort: next }));
  }
}
