import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { TopicsActions } from '../../store/topics/topics.actions';
import { selectTopics, selectTopicsLoading } from '../../store/topics/topics.selectors';

@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [AsyncPipe, MatCardModule, MatButtonModule, MatProgressSpinnerModule, NavbarComponent],
  templateUrl: './topics.component.html',
  styleUrl: './topics.component.scss',
})
export class TopicsComponent implements OnInit {
  private readonly store = inject(Store);

  readonly topics$ = this.store.select(selectTopics);
  readonly loading$ = this.store.select(selectTopicsLoading);

  ngOnInit(): void {
    this.store.dispatch(TopicsActions.loadTopics());
  }

  subscribe(id: number): void {
    this.store.dispatch(TopicsActions.subscribe({ id }));
  }

  unsubscribe(id: number): void {
    this.store.dispatch(TopicsActions.unsubscribe({ id }));
  }
}
